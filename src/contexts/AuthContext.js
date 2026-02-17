import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  fetchCurrentProfile,
  isSupabaseConfigured,
  supabase,
} from "../lib/supabaseClient";

const AuthContext = createContext(null);
const PROFILE_CACHE_KEY = "analab_profile_cache_v1";

function readCachedProfiles() {
  try {
    const raw = window.localStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
}

function readCachedProfile(userId) {
  if (!userId) return null;
  const cache = readCachedProfiles();
  return cache[userId] || null;
}

function writeCachedProfile(userId, profile) {
  if (!userId || !profile) return;
  try {
    const cache = readCachedProfiles();
    cache[userId] = profile;
    window.localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    // noop
  }
}

function evaluatePlanAccess(profile) {
  const plan = String(profile?.plan || "").toLowerCase();
  if (plan !== "free") {
    return { allowed: true, message: "" };
  }

  const trialEndsAt = profile?.trial_ends_at;
  if (!trialEndsAt) {
    return { allowed: true, message: "" };
  }

  const endsAt = new Date(trialEndsAt);
  if (Number.isNaN(endsAt.getTime())) {
    return { allowed: true, message: "" };
  }

  if (Date.now() > endsAt.getTime()) {
    return {
      allowed: false,
      message: "Seu período gratuito expirou. Atualize seu plano para continuar usando o sistema.",
    };
  }

  return { allowed: true, message: "" };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState("");

  async function syncProfileData(nextSession) {
    if (!nextSession) return null;
    const profileResult = await fetchCurrentProfile(nextSession);
    if (profileResult.profile) {
      writeCachedProfile(nextSession.user?.id, profileResult.profile);
      return profileResult.profile;
    }
    return readCachedProfile(nextSession.user?.id);
  }

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth
      .getSession()
      .then(async ({ data }) => {
        if (!mounted) return;
        const nextSession = data.session ?? null;
        if (!nextSession) {
          setSession(null);
          setProfile(null);
          return;
        }

        const profileData = await syncProfileData(nextSession);
        if (!mounted) return;
        const accessCheck = evaluatePlanAccess(profileData);
        if (!accessCheck.allowed) {
          await supabase.auth.signOut();
          setSession(null);
          setProfile(null);
          setAuthMessage(accessCheck.message);
          return;
        }

        setSession(nextSession);
        setProfile(profileData);
        setAuthMessage("");
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!mounted) {
        return;
      }

      if (!nextSession) {
        setSession(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const profileData = await syncProfileData(nextSession);
      const accessCheck = evaluatePlanAccess(profileData);
      if (!mounted) {
        return;
      }

      if (!accessCheck.allowed) {
        await supabase.auth.signOut();
        if (!mounted) {
          return;
        }
        setSession(null);
        setProfile(null);
        setAuthMessage(accessCheck.message);
        setLoading(false);
        return;
      }

      setSession(nextSession);
      setProfile(profileData);
      setAuthMessage("");
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      loading,
      session,
      user: session?.user ?? null,
      profile,
      isAdmin: String(profile?.role || "").toLowerCase() === "admin",
      authMessage,
      isConfigured: isSupabaseConfigured,
      clearAuthMessage() {
        setAuthMessage("");
      },
      async signIn(email, password) {
        if (!supabase) {
          return { error: new Error("Supabase não configurado.") };
        }

        const response = await supabase.auth.signInWithPassword({ email, password });
        if (response.error || !response.data?.session) {
          return response;
        }

        const profileResult = await fetchCurrentProfile(response.data.session);
        const profileData =
          profileResult.profile || readCachedProfile(response.data.session?.user?.id) || null;
        if (profileData) {
          writeCachedProfile(response.data.session?.user?.id, profileData);
        }
        const accessCheck = evaluatePlanAccess(profileData);
        if (!accessCheck.allowed) {
          await supabase.auth.signOut();
          setSession(null);
          setProfile(null);
          setAuthMessage(accessCheck.message);
          return { data: { user: null, session: null }, error: new Error(accessCheck.message) };
        }

        setProfile(profileData);
        setAuthMessage("");
        return response;
      },
      async signUp(email, password, fullName) {
        if (!supabase) {
          return { error: new Error("Supabase não configurado.") };
        }
        return supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/reset-password`,
            data: {
              display_name: fullName,
            },
          },
        });
      },
      async forgotPassword(email) {
        if (!supabase) {
          return { error: new Error("Supabase não configurado.") };
        }
        return supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
      },
      async updatePassword(password) {
        if (!supabase) {
          return { error: new Error("Supabase não configurado.") };
        }
        return supabase.auth.updateUser({ password });
      },
      async signOut() {
        if (!supabase) {
          return { error: new Error("Supabase não configurado.") };
        }
        const response = await supabase.auth.signOut();
        setSession(null);
        setProfile(null);
        setAuthMessage("");
        return response;
      },
    }),
    [authMessage, loading, profile, session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}

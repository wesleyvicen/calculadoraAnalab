import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchProfileActive, isSupabaseConfigured, supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState("");

  async function ensureActiveSession(nextSession) {
    if (!nextSession) {
      return { allowed: false, message: "" };
    }

    const { active, error } = await fetchProfileActive(nextSession);
    if (error) {
      return {
        allowed: false,
        message: "Não foi possível validar seu acesso. Entre em contato com o administrador do sistema.",
      };
    }

    if (!active) {
      return {
        allowed: false,
        message: "Seu acesso está inativo. Entre em contato com o administrador do sistema.",
      };
    }

    return { allowed: true, message: "" };
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
          return;
        }

        const accessCheck = await ensureActiveSession(nextSession);
        if (!mounted) return;

        if (!accessCheck.allowed) {
          await supabase.auth.signOut();
          setSession(null);
          setAuthMessage(accessCheck.message);
          return;
        }

        setSession(nextSession);
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
        setLoading(false);
        return;
      }

      setLoading(true);
      const accessCheck = await ensureActiveSession(nextSession);
      if (!mounted) {
        return;
      }

      if (!accessCheck.allowed) {
        await supabase.auth.signOut();
        if (!mounted) {
          return;
        }
        setSession(null);
        setAuthMessage(accessCheck.message);
        setLoading(false);
        return;
      }

      setSession(nextSession);
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

        const accessCheck = await ensureActiveSession(response.data.session);
        if (!accessCheck.allowed) {
          await supabase.auth.signOut();
          setSession(null);
          setAuthMessage(accessCheck.message);
          return { data: { user: null, session: null }, error: new Error(accessCheck.message) };
        }

        setAuthMessage("");
        return response;
      },
      async signUp(email, password) {
        if (!supabase) {
          return { error: new Error("Supabase não configurado.") };
        }
        return supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/reset-password`,
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
        setAuthMessage("");
        return response;
      },
    }),
    [authMessage, loading, session]
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

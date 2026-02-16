const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
const SESSION_STORAGE_KEY = "analab_supabase_session_v1";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export async function fetchProfileActive(session) {
  if (!isSupabaseConfigured || !session?.access_token || !session?.user?.id) {
    return { active: null, error: new Error("Sessão inválida para consultar perfil.") };
  }

  const userId = encodeURIComponent(session.user.id);
  const baseHeaders = {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${session.access_token}`,
  };

  async function queryBy(column) {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/profiles?select=active&${column}=eq.${userId}&limit=1`,
      { headers: baseHeaders }
    );
    const payload = await response.json().catch(() => []);
    if (!response.ok) {
      return { rows: null, error: toError(payload, "Falha ao consultar profiles.") };
    }
    return { rows: Array.isArray(payload) ? payload : [], error: null };
  }

  const byUserId = await queryBy("user_id");
  if (!byUserId.error && byUserId.rows.length > 0) {
    return { active: Boolean(byUserId.rows[0]?.active), error: null };
  }

  const byId = await queryBy("id");
  if (!byId.error && byId.rows.length > 0) {
    return { active: Boolean(byId.rows[0]?.active), error: null };
  }

  if (byUserId.error && byId.error) {
    return { active: null, error: byUserId.error };
  }

  return { active: false, error: null };
}

function toError(payload, fallbackMessage) {
  const message = payload?.msg || payload?.message || payload?.error_description || fallbackMessage;
  return new Error(message);
}

function readStoredSession() {
  try {
    const rawValue = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!rawValue) return null;
    const parsed = JSON.parse(rawValue);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch (error) {
    return null;
  }
}

function saveStoredSession(session) {
  try {
    if (!session) {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
      return;
    }
    window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    // noop
  }
}

function sessionFromAuthPayload(payload) {
  if (!payload?.access_token || !payload?.refresh_token) {
    return null;
  }

  return {
    access_token: payload.access_token,
    refresh_token: payload.refresh_token,
    token_type: payload.token_type || "bearer",
    expires_in: payload.expires_in || 3600,
    expires_at: payload.expires_at || Math.floor(Date.now() / 1000) + (payload.expires_in || 3600),
    user: payload.user || null,
  };
}

function parseHashParams() {
  const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
  const params = new URLSearchParams(hash);
  return {
    accessToken: params.get("access_token"),
    refreshToken: params.get("refresh_token"),
    expiresIn: params.get("expires_in"),
    tokenType: params.get("token_type"),
    type: params.get("type"),
  };
}

class SupabaseRestAuth {
  constructor() {
    this.listeners = new Set();
    this.currentSession = readStoredSession();
  }

  emit(event, session) {
    this.listeners.forEach((listener) => {
      listener(event, session);
    });
  }

  setSession(session, event) {
    this.currentSession = session;
    saveStoredSession(session);
    this.emit(event, session);
  }

  async request(path, options = {}) {
    const headers = {
      apikey: supabaseAnonKey,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    const response = await fetch(`${supabaseUrl}${path}`, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const payload = await response.json().catch(() => ({}));
    return { ok: response.ok, payload };
  }

  async ensureFreshSession() {
    const session = this.currentSession || readStoredSession();
    if (!session) return null;

    const now = Math.floor(Date.now() / 1000);
    if (!session.expires_at || session.expires_at > now + 20) {
      this.currentSession = session;
      return session;
    }

    const { ok, payload } = await this.request("/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      body: { refresh_token: session.refresh_token },
    });

    if (!ok) {
      this.setSession(null, "SIGNED_OUT");
      return null;
    }

    const nextSession = sessionFromAuthPayload(payload);
    this.setSession(nextSession, "TOKEN_REFRESHED");
    return nextSession;
  }

  async fetchUser(accessToken) {
    const { ok, payload } = await this.request("/auth/v1/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return ok ? payload : null;
  }

  async consumeRedirectSession() {
    const { accessToken, refreshToken, expiresIn, tokenType, type } = parseHashParams();
    if (!accessToken || !refreshToken || !type) {
      return null;
    }

    const user = await this.fetchUser(accessToken);
    const nextSession = {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: tokenType || "bearer",
      expires_in: Number(expiresIn) || 3600,
      expires_at: Math.floor(Date.now() / 1000) + (Number(expiresIn) || 3600),
      user,
    };

    this.setSession(nextSession, "SIGNED_IN");
    const cleanUrl = `${window.location.pathname}${window.location.search}`;
    window.history.replaceState({}, document.title, cleanUrl);
    return nextSession;
  }

  auth = {
    getSession: async () => {
      const redirectSession = await this.consumeRedirectSession();
      if (redirectSession) {
        return { data: { session: redirectSession }, error: null };
      }

      const session = await this.ensureFreshSession();
      return { data: { session }, error: null };
    },
    onAuthStateChange: (callback) => {
      this.listeners.add(callback);
      return {
        data: {
          subscription: {
            unsubscribe: () => this.listeners.delete(callback),
          },
        },
      };
    },
    signInWithPassword: async ({ email, password }) => {
      const { ok, payload } = await this.request("/auth/v1/token?grant_type=password", {
        method: "POST",
        body: { email, password },
      });

      if (!ok) {
        return { data: { user: null, session: null }, error: toError(payload, "Falha no login.") };
      }

      const session = sessionFromAuthPayload(payload);
      this.setSession(session, "SIGNED_IN");
      return { data: { user: session?.user ?? null, session }, error: null };
    },
    signUp: async ({ email, password, options }) => {
      const { ok, payload } = await this.request("/auth/v1/signup", {
        method: "POST",
        body: {
          email,
          password,
          ...(options?.emailRedirectTo ? { email_redirect_to: options.emailRedirectTo } : {}),
        },
      });

      if (!ok) {
        return { data: { user: null, session: null }, error: toError(payload, "Falha no cadastro.") };
      }

      const session = sessionFromAuthPayload(payload);
      if (session) {
        this.setSession(session, "SIGNED_IN");
      }
      return { data: { user: payload.user || null, session }, error: null };
    },
    resetPasswordForEmail: async (email, options) => {
      const { ok, payload } = await this.request("/auth/v1/recover", {
        method: "POST",
        body: {
          email,
          ...(options?.redirectTo ? { redirect_to: options.redirectTo } : {}),
        },
      });

      if (!ok) {
        return { data: null, error: toError(payload, "Falha ao enviar recuperação de senha.") };
      }

      return { data: { message: "ok" }, error: null };
    },
    updateUser: async ({ password }) => {
      const session = await this.ensureFreshSession();
      if (!session?.access_token) {
        return { data: null, error: new Error("Sessão inválida para alterar senha.") };
      }

      const { ok, payload } = await this.request("/auth/v1/user", {
        method: "PUT",
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: { password },
      });

      if (!ok) {
        return { data: null, error: toError(payload, "Falha ao atualizar senha.") };
      }

      const updatedSession = { ...session, user: payload?.user || session.user };
      this.setSession(updatedSession, "USER_UPDATED");
      return { data: payload, error: null };
    },
    signOut: async () => {
      const session = await this.ensureFreshSession();
      if (session?.access_token) {
        await this.request("/auth/v1/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
      }

      this.setSession(null, "SIGNED_OUT");
      return { error: null };
    },
  };
}

export const supabase = isSupabaseConfigured ? new SupabaseRestAuth() : null;

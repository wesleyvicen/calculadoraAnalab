import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import {
  AuthContainer,
  Card,
  Title,
  Subtitle,
  Field,
  Input,
  PasswordRow,
  PasswordInput,
  TogglePasswordButton,
  Button,
  Message,
  FooterLinks,
  AuthLink,
  SmallAuthLink,
  HelpText,
} from "../styles";

export default function Login() {
  const { signIn, session, authMessage, clearAuthMessage } = useAuth();
  const envUrl = process.env.REACT_APP_SUPABASE_URL || "";
  const envAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || "";
  const hasRuntimeEnv = Boolean(envUrl && envAnonKey);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (session) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    clearAuthMessage();
    const { error: authError } = await signIn(email, password);
    if (authError) {
      setError(authError.message || "Falha no login.");
    }
    setLoading(false);
  }

  return (
    <AuthContainer>
      <Card>
        <Title>Login</Title>
        <Subtitle>Acesse sua conta para usar as calculadoras.</Subtitle>
        {!hasRuntimeEnv && (
          <HelpText>
            Configure `REACT_APP_SUPABASE_URL` e `REACT_APP_SUPABASE_ANON_KEY` no `.env`.
          </HelpText>
        )}
        {!hasRuntimeEnv && (
          <HelpText>
            Debug: URL {envUrl ? "ok" : "ausente"} | ANON KEY {envAnonKey ? "ok" : "ausente"} |
            host atual {window.location.origin}
          </HelpText>
        )}
        {authMessage && <Message $error>{authMessage}</Message>}
        <form onSubmit={handleSubmit}>
          <Field>
            E-mail
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoFocus
            />
          </Field>
          <Field>
            Senha
            <PasswordRow>
              <PasswordInput
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <TogglePasswordButton
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </TogglePasswordButton>
            </PasswordRow>
          </Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        {error && <Message $error>{error}</Message>}
        <FooterLinks>
          <AuthLink to="/register">Criar conta</AuthLink>
          <SmallAuthLink to="/forgot-password">Esqueci a senha</SmallAuthLink>
        </FooterLinks>
      </Card>
    </AuthContainer>
  );
}

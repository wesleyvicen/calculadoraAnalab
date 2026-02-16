import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import {
  AuthContainer,
  Card,
  Title,
  Subtitle,
  Field,
  Input,
  Button,
  Message,
  FooterLinks,
  AuthLink,
} from "../styles";

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    const { error: authError } = await updatePassword(password);
    if (authError) {
      setError(authError.message || "Falha ao redefinir senha.");
    } else {
      setMessage("Senha redefinida com sucesso. Redirecionando...");
      window.setTimeout(() => navigate("/"), 1200);
    }
    setLoading(false);
  }

  return (
    <AuthContainer>
      <Card>
        <Title>Redefinir senha</Title>
        <Subtitle>Digite a nova senha da sua conta.</Subtitle>
        <form onSubmit={handleSubmit}>
          <Field>
            Nova senha
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              autoFocus
            />
          </Field>
          <Field>
            Confirmar senha
            <Input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
              minLength={6}
            />
          </Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar nova senha"}
          </Button>
        </form>
        {error && <Message $error>{error}</Message>}
        {message && <Message>{message}</Message>}
        <FooterLinks>
          <AuthLink to="/login">Voltar para login</AuthLink>
        </FooterLinks>
      </Card>
    </AuthContainer>
  );
}

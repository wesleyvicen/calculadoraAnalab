import React, { useState } from "react";
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

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const { error: authError } = await forgotPassword(email);
    if (authError) {
      setError(authError.message || "Falha ao enviar e-mail de recuperação.");
    } else {
      setMessage("Enviamos um link de redefinição para seu e-mail.");
    }
    setLoading(false);
  }

  return (
    <AuthContainer>
      <Card>
        <Title>Esqueci a senha</Title>
        <Subtitle>Receba um link para redefinir sua senha.</Subtitle>
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
          <Button type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Enviar link"}
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

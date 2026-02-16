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
  Button,
  Message,
  HelpText,
  FooterLinks,
  AuthLink,
} from "../styles";

export default function Register() {
  const { signUp, session } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (session) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    const { error: authError } = await signUp(email, password, fullName);
    if (authError) {
      setError(authError.message || "Falha no cadastro.");
    } else {
      setMessage("Conta criada. Verifique seu e-mail para confirmar, se solicitado.");
    }
    setLoading(false);
  }

  return (
    <AuthContainer>
      <Card>
        <Title>Cadastro</Title>
        <Subtitle>Crie seu acesso no sistema.</Subtitle>
        <HelpText>Teste gratuito por 7 dias após o cadastro.</HelpText>
        <form onSubmit={handleSubmit}>
          <Field>
            Nome completo
            <Input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              autoFocus
            />
          </Field>
          <Field>
            E-mail
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Field>
          <Field>
            Senha
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />
          </Field>
          <Button type="submit" disabled={loading}>
            {loading ? "Criando..." : "Criar conta"}
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

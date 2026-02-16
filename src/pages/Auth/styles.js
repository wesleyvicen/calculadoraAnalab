import styled from "styled-components";
import { Link } from "react-router-dom";

export const AuthContainer = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%);
`;

export const Card = styled.section`
  width: min(460px, 100%);
  border: 1px solid #d5d8de;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.12);
  padding: 22px;
`;

export const Title = styled.h1`
  margin: 0 0 6px;
  color: #0f172a;
  font-size: clamp(28px, 4vw, 36px);
`;

export const Subtitle = styled.p`
  margin: 0 0 16px;
  color: #475569;
  font-size: 14px;
`;

export const Field = styled.label`
  display: block;
  margin-bottom: 12px;
  color: #334155;
  font-size: 13px;
  font-weight: 700;
`;

export const Input = styled.input`
  width: 100%;
  margin-top: 6px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 11px 12px;
  font-size: 15px;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.16);
  }
`;

export const PasswordRow = styled.div`
  position: relative;
  margin-top: 6px;
`;

export const PasswordInput = styled(Input)`
  margin-top: 0;
  padding-right: 90px;
`;

export const TogglePasswordButton = styled.button`
  position: absolute;
  top: 50%;
  right: 6px;
  transform: translateY(-50%);
  border: none;
  border-radius: 8px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 700;
  color: #1d4ed8;
  background: #eff6ff;
  cursor: pointer;
`;

export const Button = styled.button`
  width: 100%;
  border: none;
  border-radius: 10px;
  padding: 11px 14px;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Message = styled.p`
  margin: 12px 0 0;
  font-size: 13px;
  font-weight: 700;
  color: ${({ $error }) => ($error ? "#b91c1c" : "#166534")};
`;

export const FooterLinks = styled.div`
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

export const AuthLink = styled(Link)`
  color: #1e3a8a;
  background: #f8fafc;
  border: 1px solid #dbe6f5;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  text-align: center;

  &:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
  }
`;

export const SmallAuthLink = styled(Link)`
  color: #475569;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  margin-top: -2px;

  &:hover {
    color: #1d4ed8;
    text-decoration: underline;
  }
`;

export const HelpText = styled.p`
  margin: 0 0 10px;
  color: #b45309;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 10px;
  font-size: 12px;
  font-weight: 700;
`;

import styled from "styled-components";

export const Container = styled.div`
  margin: 24px auto;
  width: min(920px, calc(100% - 24px));
  border: 1px solid #d5d8de;
  border-radius: 20px;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
  box-shadow: 0 18px 32px rgba(20, 36, 61, 0.12);
  padding: 24px;
  font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;

  @media (max-width: 760px) {
    padding: 18px;
  }
`;

export const Header = styled.h1`
  margin: 0;
  text-align: center;
  font-size: clamp(28px, 3.2vw, 44px);
  color: #111827;
`;

export const Formula = styled.p`
  margin: 8px 0 24px;
  text-align: center;
  color: #4b5563;
  font-size: clamp(14px, 1.4vw, 18px);
`;

export const InputsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

export const Field = styled.div`
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #d1d5db;
  border-radius: 14px;
  padding: 12px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-size: 14px;
  font-weight: 700;
`;

export const Input = styled.input`
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 12px;
  font-size: 17px;
  color: #0f172a;
  background: #ffffff;
  transition: border-color 180ms ease, box-shadow 180ms ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }

  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  &[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
`;

export const ResultCard = styled.div`
  margin-top: 20px;
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #bfdbfe;
  background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
  text-align: center;
`;

export const ResultLabel = styled.p`
  margin: 0 0 4px;
  color: #1e40af;
  font-size: 16px;
  font-weight: 700;
`;

export const ResultValue = styled.p`
  margin: 0;
  color: #0f172a;
  font-size: clamp(38px, 5vw, 70px);
  font-weight: 800;
  line-height: 1;
`;

export const Actions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
`;

export const ResetButton = styled.button`
  border: none;
  border-radius: 12px;
  padding: 11px 20px;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(29, 78, 216, 0.28);
  }

  &:active {
    transform: translateY(0);
  }

  &&:focus {
    outline: none;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  }
`;

import styled, { css, keyframes } from "styled-components";

const blinkA = keyframes`
  0% {
    background: rgba(255, 255, 255, 0.68);
    box-shadow: inset 0 0 0 0 rgba(37, 99, 235, 0);
  }
  40% {
    background: #dbeafe;
    box-shadow: inset 0 0 0 3px rgba(37, 99, 235, 0.45);
  }
  100% {
    background: rgba(255, 255, 255, 0.68);
    box-shadow: inset 0 0 0 0 rgba(37, 99, 235, 0);
  }
`;

const blinkB = keyframes`
  0% {
    background: rgba(255, 255, 255, 0.68);
    box-shadow: inset 0 0 0 0 rgba(59, 130, 246, 0);
  }
  40% {
    background: #bfdbfe;
    box-shadow: inset 0 0 0 3px rgba(59, 130, 246, 0.5);
  }
  100% {
    background: rgba(255, 255, 255, 0.68);
    box-shadow: inset 0 0 0 0 rgba(59, 130, 246, 0);
  }
`;

export const Container = styled.div`
  margin: 24px auto;
  width: min(1400px, calc(100% - 24px));
  border: 1px solid #d5d8de;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%);
  box-shadow: 0 20px 35px rgba(20, 36, 61, 0.12);
  font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
`;

export const Header = styled.h1`
  margin: 0;
  padding: 20px 16px;
  text-align: center;
  font-size: clamp(20px, 2.3vw, 42px);
  font-weight: 700;
  color: #1f2937;
  border-bottom: 1px solid #d5d8de;
  background: linear-gradient(90deg, #f9fafb 0%, #eef3fb 100%);
`;

export const Board = styled.div`
  display: grid;
  min-height: 420px;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  background: linear-gradient(180deg, #f6f7fb 0%, #f0f2f6 100%);

  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const CounterCard = styled.button`
  border: 0;
  border-right: 1px solid #d5d8de;
  border-bottom: 1px solid #d5d8de;
  background: rgba(255, 255, 255, 0.68);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 40px 8px;
  transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
  ${({ $blinkToken }) =>
    $blinkToken > 0
      ? css`
          animation: ${$blinkToken % 2 === 0 ? blinkA : blinkB} 320ms ease;
        `
      : css`
          animation: none;
        `}
  ${({ $isLastPressed }) =>
    $isLastPressed &&
    css`
      background: rgba(219, 234, 254, 0.75);
      box-shadow: inset 0 0 0 2px rgba(37, 99, 235, 0.6);
    `}

  &:hover {
    transform: translateY(-2px);
    background: rgba(255, 255, 255, 0.9);
    box-shadow: inset 0 0 0 1px #c9d4e7;
  }

  &:active {
    transform: translateY(0);
  }

  &&:focus {
    outline: none;
    background-color: inherit;
  }

  &:focus-visible {
    outline: 3px solid #3b82f6;
    outline-offset: -3px;
  }

  @media (max-width: 760px) {
    min-height: 190px;
    padding: 24px 8px;
  }
`;

export const CounterLabel = styled.span`
  font-size: clamp(28px, 2.2vw, 56px);
  letter-spacing: 0.04em;
  color: #111827;
`;

export const CounterValue = styled.strong`
  font-size: clamp(48px, 4.2vw, 112px);
  line-height: 1;
  color: #0f172a;
`;

export const CounterKey = styled.span`
  font-size: clamp(24px, 2vw, 48px);
  color: #111827;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
  border-top: 1px solid #d5d8de;
  padding: 20px 16px 26px;
  background: linear-gradient(90deg, #f9fafb 0%, #eef3fb 100%);
`;

export const Total = styled.p`
  margin: 0;
  font-size: clamp(42px, 4vw, 84px);
  font-weight: 800;
  color: #0f172a;
`;

export const ResetButton = styled.button`
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 16px;
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

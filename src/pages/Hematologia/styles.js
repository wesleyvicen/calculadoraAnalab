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
  ${({ $compactMode }) =>
    $compactMode &&
    css`
      margin: 8px auto;
      height: 90vh;
      display: flex;
      flex-direction: column;
    `}
`;

export const Header = styled.h1`
  margin: 0;
  padding: 16px 14px;
  text-align: center;
  font-size: clamp(18px, 1.9vw, 34px);
  font-weight: 700;
  color: #1f2937;
  border-bottom: 1px solid #d5d8de;
  background: linear-gradient(90deg, #f9fafb 0%, #eef3fb 100%);
`;

export const FinishBanner = styled.div`
  margin: 12px 14px 0;
  border: 1px solid #fcd34d;
  border-radius: 12px;
  background: linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%);
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const FinishText = styled.p`
  margin: 0;
  color: #92400e;
  font-size: 15px;
  font-weight: 700;
`;

export const FinishButton = styled.button`
  border: none;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  background: #d97706;
  cursor: pointer;

  &:hover {
    background: #b45309;
  }
`;

export const SetupCard = styled.section`
  margin: 14px;
  border: 1px solid #bfdbfe;
  border-radius: 14px;
  background: linear-gradient(135deg, #eff6ff 0%, #f8fbff 100%);
  padding: 14px;
`;

export const SetupTitle = styled.h2`
  margin: 0 0 10px;
  color: #1e3a8a;
  font-size: clamp(18px, 1.8vw, 24px);
`;

export const SetupGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const SetupField = styled.div`
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid #dbe6f5;
  border-radius: 10px;
  padding: 10px;
`;

export const SetupLabel = styled.label`
  display: block;
  margin-bottom: 6px;
  color: #334155;
  font-size: 12px;
  font-weight: 700;
`;

export const SetupInput = styled.input`
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 15px;
  color: #0f172a;

  &:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.16);
  }

  &[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  &[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield;
  }
`;

export const SetupButton = styled.button`
  margin-top: 12px;
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  cursor: pointer;
`;

export const MainArea = styled.div`
  display: flex;
  flex-direction: column;
  ${({ $compactMode }) =>
    $compactMode &&
    css`
      flex: 1 1 auto;
      min-height: 0;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 320px;

      @media (max-width: 1100px) {
        display: flex;
        flex-direction: column;
      }
    `}
`;

export const Board = styled.div`
  display: grid;
  min-height: 280px;
  grid-auto-rows: minmax(0, 1fr);
  grid-template-columns: repeat(6, minmax(0, 1fr));
  background: linear-gradient(180deg, #f6f7fb 0%, #f0f2f6 100%);
  ${({ $compactMode }) =>
    $compactMode &&
    css`
      min-height: 0;
      height: 100%;
    `}

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
  background: ${({ $isActivated }) =>
    $isActivated ? "linear-gradient(180deg, #eaf2ff 0%, #dbeafe 100%)" : "rgba(255, 255, 255, 0.68)"};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  min-height: 90px;
  padding: 4px 6px;
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

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    transform: none;
    box-shadow: none;
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
    min-height: 78px;
    padding: 4px 4px;
  }
`;

export const CounterLabel = styled.span`
  font-size: clamp(24px, 2vw, 42px);
  letter-spacing: 0.04em;
  color: ${({ $isActivated }) => ($isActivated ? "#1d4ed8" : "#111827")};
  transition: color 180ms ease;
`;

export const CounterValue = styled.strong`
  font-size: clamp(42px, 3.8vw, 84px);
  line-height: 1;
  color: #0f172a;
`;

export const CounterKey = styled.span`
  font-size: clamp(20px, 1.7vw, 34px);
  color: ${({ $isActivated }) => ($isActivated ? "#2563eb" : "#111827")};
  transition: color 180ms ease;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  border-top: 1px solid #d5d8de;
  padding: 8px 10px;
  background: linear-gradient(90deg, #f9fafb 0%, #eef3fb 100%);
  ${({ $compactMode }) =>
    $compactMode &&
    css`
      border-top: 0;
      border-left: 1px solid #d5d8de;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 8px;
      padding: 8px 10px;

      @media (max-width: 1100px) {
        border-left: 0;
        border-top: 1px solid #d5d8de;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
    `}
`;

export const Total = styled.p`
  margin: 0;
  font-size: clamp(34px, 3vw, 58px);
  font-weight: 800;
  color: #0f172a;
`;

export const Observation = styled.p`
  margin: 0;
  font-size: clamp(14px, 1.1vw, 18px);
  font-weight: 700;
  color: #334155;
`;

export const ResetButton = styled.button`
  border: none;
  border-radius: 12px;
  padding: 6px 10px;
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

export const HistoryCard = styled.section`
  width: min(100%, 520px);
  border: 1px solid #d7e4fa;
  background: rgba(255, 255, 255, 0.82);
  border-radius: 10px;
  padding: 10px;
`;

export const HistoryTitle = styled.h3`
  margin: 0 0 6px;
  font-size: 13px;
  font-weight: 800;
  color: #1e3a8a;
`;

export const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 120px;
  overflow: auto;
`;

export const HistoryItem = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.25;
  color: #1f2937;
`;

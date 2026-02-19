import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(2px);
  animation: ${fadeIn} 220ms ease;
`;

export const Card = styled.div`
  width: min(700px, 100%);
  border-radius: 18px;
  border: 1px solid rgba(148, 163, 184, 0.55);
  background: linear-gradient(160deg, #ffffff 0%, #f1f5f9 100%);
  box-shadow: 0 24px 42px rgba(15, 23, 42, 0.26);
  padding: 18px;
  animation: ${slideUp} 260ms ease;
  display: grid;
  grid-template-columns: 200px minmax(0, 1fr);
  gap: 16px;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

export const LogoPane = styled.div`
  border-radius: 14px;
  border: 1px solid #cfe0fb;
  background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
`;

export const Logo = styled.img`
  width: clamp(120px, 18vw, 180px);
  height: auto;
  display: block;
  object-fit: contain;
`;

export const Content = styled.div``;

export const Badge = styled.span`
  display: inline-block;
  margin-bottom: 8px;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  color: #1d4ed8;
  background: #dbeafe;
`;

export const Title = styled.h2`
  margin: 0;
  color: #0f172a;
  font-size: clamp(20px, 2.1vw, 28px);
  line-height: 1.2;
`;

export const Description = styled.p`
  margin: 10px 0 0;
  color: #334155;
  font-size: 14px;
  line-height: 1.4;
`;

export const BenefitList = styled.ul`
  margin: 12px 0 0;
  padding-left: 18px;
  color: #1f2937;
  font-size: 14px;
  line-height: 1.45;
`;

export const Actions = styled.div`
  margin-top: 16px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const PrimaryButton = styled.button`
  border: none;
  border-radius: 11px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  cursor: pointer;
`;

export const SecondaryButton = styled.button`
  border: 1px solid #cbd5e1;
  border-radius: 11px;
  padding: 10px 14px;
  font-size: 14px;
  font-weight: 700;
  color: #334155;
  background: #f8fafc;
  cursor: pointer;
`;

export const Hint = styled.p`
  margin: 10px 0 0;
  color: #64748b;
  font-size: 12px;
`;

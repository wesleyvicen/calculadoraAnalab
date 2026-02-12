import styled, { keyframes } from "styled-components";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Container = styled.div`
  margin: 24px auto;
  width: min(1100px, calc(100% - 24px));
  border: 1px solid #d6dbe5;
  border-radius: 22px;
  overflow: hidden;
  background:
    radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.16), transparent 42%),
    radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.16), transparent 46%),
    linear-gradient(180deg, #f8fafc 0%, #edf2f8 100%);
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.12);
  padding: 28px;

  @media (max-width: 740px) {
    padding: 18px;
  }
`;

export const Hero = styled.header`
  text-align: center;
  margin-bottom: 24px;
  animation: ${fadeInUp} 420ms ease;
`;

export const Title = styled.h1`
  margin: 0;
  color: #0f172a;
  letter-spacing: 0.08em;
  font-size: clamp(34px, 6vw, 58px);
  font-weight: 800;
`;

export const Subtitle = styled.p`
  margin: 8px 0 0;
  color: #475569;
  font-size: clamp(15px, 2vw, 19px);
`;

export const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

export const MenuCard = styled.a`
  display: block;
  text-decoration: none;
  border: 1px solid #c9d5e8;
  border-radius: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.82);
  color: inherit;
  animation: ${fadeInUp} 500ms ease both;
  transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;

  &:nth-child(2) {
    animation-delay: 70ms;
  }

  &:hover {
    transform: translateY(-3px);
    border-color: #93c5fd;
    box-shadow: 0 14px 24px rgba(15, 23, 42, 0.12);
  }

  &:focus-visible {
    outline: 3px solid #2563eb;
    outline-offset: 2px;
  }
`;

export const MenuTitle = styled.h2`
  margin: 0;
  color: #0f172a;
  font-size: clamp(22px, 3vw, 30px);
  display: flex;
  align-items: center;
  gap: 10px;

  .fa {
    font-size: 0.92em;
    color: #1d4ed8;
  }
`;

export const MenuDescription = styled.p`
  margin: 10px 0 16px;
  color: #475569;
  font-size: 15px;
  line-height: 1.5;
`;

export const Shortcut = styled.span`
  display: inline-block;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 700;
  color: #1d4ed8;
  background: #dbeafe;
  letter-spacing: 0.03em;
  text-transform: uppercase;
`;

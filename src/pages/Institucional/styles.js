import styled, { keyframes } from "styled-components";

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Page = styled.main`
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f6ff 0%, #e7f0fa 100%);
  padding: clamp(16px, 4vw, 34px);
`;

export const Content = styled.div`
  width: min(1120px, 100%);
  margin: 0 auto;
`;

export const HeroCard = styled.section`
  border: 1px solid #d0ddf0;
  border-radius: 22px;
  padding: clamp(20px, 4vw, 34px);
  background:
    radial-gradient(circle at 100% 0%, rgba(56, 189, 248, 0.18), transparent 46%),
    radial-gradient(circle at 0% 100%, rgba(34, 197, 94, 0.14), transparent 40%),
    #ffffff;
  box-shadow: 0 18px 34px rgba(15, 23, 42, 0.1);
  animation: ${fadeInUp} 420ms ease;
`;

export const HeroBadge = styled.p`
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 999px;
  background: #e0ecff;
  color: #1e3a8a;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const HeroTitle = styled.h1`
  margin: 14px 0 0;
  color: #0f172a;
  font-size: clamp(30px, 5vw, 52px);
  line-height: 1.08;
  max-width: 900px;
`;

export const HeroSubtitle = styled.p`
  margin: 10px 0 0;
  color: #334155;
  font-size: clamp(16px, 2.1vw, 20px);
  max-width: 820px;
`;

export const TrialPromo = styled.div`
  margin-top: 16px;
  border: 2px solid #f59e0b;
  border-radius: 14px;
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 10px 20px rgba(245, 158, 11, 0.18);
`;

export const TrialBadge = styled.span`
  display: inline-grid;
  place-items: center;
  min-width: 78px;
  height: 34px;
  border-radius: 999px;
  background: #ea580c;
  color: #ffffff;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.02em;
`;

export const TrialText = styled.p`
  margin: 0;
  color: #7c2d12;
  font-size: 14px;
  font-weight: 800;
`;

export const HeroHighlights = styled.div`
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const HighlightItem = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: 10px;
  border: 1px solid #d4e1f6;
  background: #f8fbff;
  color: #0f172a;
  font-size: 13px;
  font-weight: 700;
  padding: 9px 12px;

  .fa {
    color: #2563eb;
  }
`;

export const CtaRow = styled.div`
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const BaseCta = styled.button`
  border-radius: 12px;
  padding: 11px 15px;
  border: 1px solid transparent;
  text-decoration: none;
  font-size: 14px;
  font-weight: 800;
  transition: transform 180ms ease, box-shadow 180ms ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const PrimaryCta = styled(BaseCta)`
  color: #ffffff;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.25);
`;

export const SecondaryCta = styled(BaseCta)`
  color: #1e3a8a;
  border-color: #bfd1ef;
  background: #eff6ff;
`;

export const Section = styled.section`
  margin-top: 16px;
`;

export const SectionTitle = styled.h2`
  margin: 0 0 10px;
  color: #0f172a;
  font-size: clamp(20px, 2.8vw, 30px);
`;

export const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const FeatureCard = styled.article`
  border: 1px solid #d0ddf0;
  border-radius: 14px;
  padding: 12px;
  background: #ffffff;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.06);
  animation: ${fadeInUp} 520ms ease both;
`;

export const FeatureImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #dbe7f6;
  background: #f8fbff;
`;

export const FeatureTitle = styled.h3`
  margin: 10px 0 0;
  color: #0f172a;
  font-size: 19px;
`;

export const FeatureList = styled.ul`
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
`;

export const FeatureItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 7px;
  color: #334155;
  font-size: 14px;
  line-height: 1.5;

  .fa {
    color: #2563eb;
    margin-top: 2px;
    flex: 0 0 auto;
  }
`;

export const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

export const StepCard = styled.article`
  border: 1px solid #d0ddf0;
  border-radius: 14px;
  padding: 15px;
  background: #ffffff;
`;

export const StepNumber = styled.span`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 13px;
  font-weight: 800;
  color: #ffffff;
  background: #1d4ed8;
`;

export const StepTitle = styled.h3`
  margin: 10px 0 0;
  color: #0f172a;
  font-size: 18px;
`;

export const StepText = styled.p`
  margin: 6px 0 0;
  color: #334155;
  font-size: 14px;
`;

export const ValueBox = styled.section`
  margin-top: 16px;
  border: 1px solid #c9d7ee;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 12px 24px rgba(15, 23, 42, 0.08);
  padding: clamp(16px, 3vw, 24px);
`;

export const ValueTitle = styled.h2`
  margin: 0;
  color: #0f172a;
  font-size: clamp(22px, 3vw, 32px);
`;

export const ValueText = styled.p`
  margin: 8px 0 0;
  color: #334155;
  font-size: clamp(15px, 2vw, 18px);
  max-width: 860px;
`;

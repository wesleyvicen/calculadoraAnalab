import React from "react";
import { Link } from "react-router-dom";
import {
  Page,
  Content,
  HeroCard,
  HeroBadge,
  HeroTitle,
  HeroSubtitle,
  TrialPromo,
  TrialBadge,
  TrialText,
  CtaRow,
  PrimaryCta,
  SecondaryCta,
  HeroHighlights,
  HighlightItem,
  Section,
  SectionTitle,
  CardsGrid,
  FeatureCard,
  FeatureImage,
  FeatureTitle,
  FeatureList,
  FeatureItem,
  ValueBox,
  ValueTitle,
  ValueText,
} from "./styles";
import bioquimicaImg from "../../assets/institucional/bioquimica.svg";
import hematologiaImg from "../../assets/institucional/hematologia.svg";
import nefrologiaImg from "../../assets/institucional/nefrologia.svg";
import operacionalImg from "../../assets/institucional/operacional.svg";

const AREAS = [
  {
    image: bioquimicaImg,
    title: "Bioquímica / Metabolismo",
    benefits: [
      "Calculadora de Íons com preenchimento rápido.",
      "Glicemia Média Estimada em segundos.",
      "LDL e VLDL por Friedewald com validação para TG alto.",
    ],
  },
  {
    image: hematologiaImg,
    title: "Hematologia",
    benefits: [
      "Calculadora de Hematologia prática e objetiva.",
      "Saturação da Transferrina com leitura imediata.",
      "Padrão único para acelerar liberação.",
    ],
  },
  {
    image: nefrologiaImg,
    title: "Nefrologia",
    benefits: [
      "Depuração de Creatinina com foco em produtividade.",
      "Filtração Glomerular (CKD-EPI 2021) como diferencial inovador.",
      "Relação Microalbuminúria/Creatinina e Proteinúria de 24h para análise única e rápida.",
    ],
  },
  {
    image: operacionalImg,
    title: "Operacional",
    benefits: [
      "Cronômetros múltiplos no mesmo painel.",
      "Menos perda de tempo em controle manual.",
      "Rotina mais fluida do início ao fim.",
    ],
  },
];

export default function Institucional() {
  return (
    <Page>
      <Content>
        <HeroCard>
          <HeroBadge>
            <em className="fa fa-flask" aria-hidden="true" />
            Sistema para Laboratório Clínico
          </HeroBadge>
          <HeroTitle>Tudo que sua rotina laboratorial precisa em um único painel</HeroTitle>
          <HeroSubtitle>
            Aumente a produtividade do laboratório com calculadoras clínicas objetivas e
            cronômetros múltiplos no mesmo sistema.
          </HeroSubtitle>
          <TrialPromo>
            <TrialBadge>7 DIAS</TrialBadge>
            <TrialText>Teste gratuito para experimentar todos os módulos sem custo.</TrialText>
          </TrialPromo>

          <HeroHighlights>
            <HighlightItem>
              <em className="fa fa-check-circle" aria-hidden="true" />10 módulos clínicos
            </HighlightItem>
            <HighlightItem>
              <em className="fa fa-check-circle" aria-hidden="true" />4 áreas laboratoriais
            </HighlightItem>
            <HighlightItem>
              <em className="fa fa-check-circle" aria-hidden="true" />Produtividade desde o primeiro uso
            </HighlightItem>
          </HeroHighlights>

          <CtaRow>
            <PrimaryCta as={Link} to="/register">
              Criar conta
            </PrimaryCta>
            <SecondaryCta as={Link} to="/login">
              Entrar no sistema
            </SecondaryCta>
          </CtaRow>
        </HeroCard>

        <Section>
          <SectionTitle>O que o sistema entrega</SectionTitle>
          <CardsGrid>
            {AREAS.map((item) => (
              <FeatureCard key={item.title}>
                <FeatureImage src={item.image} alt={item.title} />
                <FeatureTitle>{item.title}</FeatureTitle>
                <FeatureList>
                  {item.benefits.map((benefit) => (
                    <FeatureItem key={benefit}>
                      <em className="fa fa-check-circle" aria-hidden="true" />
                      {benefit}
                    </FeatureItem>
                  ))}
                </FeatureList>
              </FeatureCard>
            ))}
          </CardsGrid>
        </Section>

        <ValueBox>
          <ValueTitle>Ganhe produtividade na rotina diária</ValueTitle>
          <ValueText>
            Um sistema pensado para reduzir atraso, acelerar processos e aumentar a entrega do seu
            laboratório com mais qualidade operacional.
          </ValueText>
          <ValueText>
            Comece com um teste gratuito de 7 dias e veja na prática o ganho de produtividade.
          </ValueText>
          <CtaRow>
            <PrimaryCta as={Link} to="/register">
              Quero testar agora
            </PrimaryCta>
            <SecondaryCta as={Link} to="/login">
              Já tenho acesso
            </SecondaryCta>
          </CtaRow>
        </ValueBox>
      </Content>
    </Page>
  );
}

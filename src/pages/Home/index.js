import React, { useMemo, useState } from "react";
import {
  Container,
  Hero,
  TopRow,
  Title,
  Subtitle,
  UserChip,
  LogoutButton,
  SearchRow,
  SearchInput,
  MenuGrid,
  MenuCard,
  MenuTitle,
  MenuDescription,
  Shortcut,
  EmptyState,
} from "./styles";

import "materialize-css/dist/css/materialize.min.css";

import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const MENU_ITEMS = [
  {
    to: "/calculadora",
    icon: "fa-flask",
    title: "Calculadora de Ions",
    description: "Calcule rapidamente o BIC usando sodio, potassio e cloro.",
  },
  {
    to: "/hematologia",
    icon: "fa-bar-chart",
    title: "Calculadora de Hematologia",
    description: "Faca contagem por teclas e acompanhe o total em tempo real.",
  },
  {
    to: "/cronometros",
    icon: "fa-clock-o",
    title: "Cronometros Multiplos",
    description: "Execute varias reacoes em paralelo com alarmes sonoros individuais ao finalizar.",
  },
  {
    to: "/glicemia-estimada",
    icon: "fa-tint",
    title: "Glicemia Media Estimada",
    description: "Informe o HbA1c e obtenha automaticamente a glicemia media em mg/dL, mmol/L e a classificacao.",
  },
  {
    to: "/depuracao-creatinina",
    icon: "fa-filter",
    title: "Depuracao de Creatinina",
    description: "Calcule depuracao, depuracao corrigida, excrecao total e por kg com interpretacao automatica.",
  },
  {
    to: "/filtracao-glomerular",
    icon: "fa-heartbeat",
    title: "Filtracao Glomerular",
    description: "Estime a TFG por CKD-EPI 2021 com estagio automatico, interpretacao e comparacao com Cockcroft-Gault.",
  },
  {
    to: "/relacao-albumina-creatinina",
    icon: "fa-tint",
    title: "Relacao Microalbuminuria/Creatinina",
    description: "Calcule a relacao microalbuminuria/creatinina (ACR) em mg/g, com categoria automatica (A1, A2, A3) e interpretacao.",
  },
  {
    to: "/saturacao-transferrina",
    icon: "fa-line-chart",
    title: "Saturacao da Transferrina (IST)",
    description: "Calcule o IST com TIBC direto ou pela transferrina, com classificacao e sugestao clinica.",
  },
];

function normalizeText(value) {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function Home() {
  const { user, signOut } = useAuth();
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const term = normalizeText(query);
    if (!term) {
      return MENU_ITEMS;
    }

    return MENU_ITEMS.filter((item) => {
      const haystack = normalizeText(`${item.title} ${item.description}`);
      return haystack.includes(term);
    });
  }, [query]);

  return (
    <Container>
      <Hero>
        <TopRow>
          <Title>LabSuite</Title>
          <div>
            {user?.email ? <UserChip>{user.email}</UserChip> : null}
            <LogoutButton type="button" onClick={signOut}>
              Sair
            </LogoutButton>
          </div>
        </TopRow>
        <Subtitle>Selecione uma ferramenta para iniciar os cálculos laboratoriais.</Subtitle>
      </Hero>

      <SearchRow>
        <SearchInput
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar ferramenta..."
          aria-label="Buscar ferramenta"
        />
      </SearchRow>

      <MenuGrid>
        {filteredItems.map((item) => (
          <MenuCard key={item.to} as={Link} to={item.to}>
            <MenuTitle>
              <em className={`fa ${item.icon}`} aria-hidden="true" /> {item.title}
            </MenuTitle>
            <MenuDescription>{item.description}</MenuDescription>
            <Shortcut>Abrir modulo</Shortcut>
          </MenuCard>
        ))}
      </MenuGrid>

      {filteredItems.length === 0 && (
        <EmptyState>Nenhum modulo encontrado para a busca informada.</EmptyState>
      )}
    </Container>
  );
}

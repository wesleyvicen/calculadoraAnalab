import React from "react";
import {
  Container,
  Hero,
  Title,
  Subtitle,
  MenuGrid,
  MenuCard,
  MenuTitle,
  MenuDescription,
  Shortcut,
} from "./styles";

import "materialize-css/dist/css/materialize.min.css";

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <Container>
      <Hero>
        <Title>ANALAB</Title>
        <Subtitle>Selecione uma ferramenta para iniciar os cálculos laboratoriais.</Subtitle>
      </Hero>

      <MenuGrid>
        <MenuCard as={Link} to="/calculadora">
          <MenuTitle>
            <em className="fa fa-flask" aria-hidden="true" /> Calculadora de Íons
          </MenuTitle>
          <MenuDescription>Calcule rapidamente o BIC usando sódio, potássio e cloro.</MenuDescription>
          <Shortcut>Abrir módulo</Shortcut>
        </MenuCard>

        <MenuCard as={Link} to="/hematologia">
          <MenuTitle>
            <em className="fa fa-bar-chart" aria-hidden="true" /> Calculadora de Hematologia
          </MenuTitle>
          <MenuDescription>Faça contagem por teclas e acompanhe o total em tempo real.</MenuDescription>
          <Shortcut>Abrir módulo</Shortcut>
        </MenuCard>
      </MenuGrid>
    </Container>
  );
}

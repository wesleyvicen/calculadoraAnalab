import React, { useMemo, useState } from "react";
import {
  Container,
  Header,
  Formula,
  InputsGrid,
  Field,
  Label,
  Input,
  ToggleRow,
  ToggleCheckbox,
  ToggleLabel,
  SupportText,
  ResultsGrid,
  ResultCard,
  ResultLabel,
  ResultValue,
  InterpretationCard,
  InterpretationText,
  Actions,
  ResetButton,
} from "./styles";

function parseNumber(value) {
  const normalized = String(value).replace(",", ".").trim();
  const parsed = parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getClassification(ist) {
  if (ist < 20) return "Baixo";
  if (ist <= 45) return "Adequado";
  return "Elevado";
}

function getClinicalSuggestion(classification) {
  switch (classification) {
    case "Baixo":
      return "Pode sugerir deficiência de ferro. Correlacionar com ferritina, hemograma e inflamação.";
    case "Adequado":
      return "Faixa compatível com saturação de transferrina habitual.";
    case "Elevado":
      return "Pode sugerir sobrecarga de ferro. Considerar investigação clínica e laboratorial.";
    default:
      return "Informe os dados para gerar a sugestão clínica.";
  }
}

export default function SaturacaoTransferrina() {
  const [ferroSerico, setFerroSerico] = useState("");
  const [tibc, setTibc] = useState("");
  const [transferrina, setTransferrina] = useState("");
  const [usarTransferrina, setUsarTransferrina] = useState(false);

  const results = useMemo(() => {
    const iron = parseNumber(ferroSerico);
    const tibcDirect = parseNumber(tibc);
    const transf = parseNumber(transferrina);
    const tibcCalculated = transf * 1.25;
    const effectiveTibc = usarTransferrina ? tibcCalculated : tibcDirect;

    if (iron <= 0 || effectiveTibc <= 0) {
      return {
        tibcDisplay: "--",
        istDisplay: "--",
        classification: "--",
        suggestion: "Informe os dados para gerar a sugestão clínica.",
      };
    }

    const ist = (iron / effectiveTibc) * 100;
    const classification = getClassification(ist);

    return {
      tibcDisplay: `${effectiveTibc.toFixed(1)} ug/dL`,
      istDisplay: `${ist.toFixed(1)} %`,
      classification,
      suggestion: getClinicalSuggestion(classification),
    };
  }, [ferroSerico, tibc, transferrina, usarTransferrina]);

  function limparCampos() {
    setFerroSerico("");
    setTibc("");
    setTransferrina("");
    setUsarTransferrina(false);
  }

  return (
    <Container>
      <Header>Cálculo: Índice de Saturação da Transferrina (IST)</Header>
      <Formula>IST (%) = Ferro sérico / TIBC x 100</Formula>

      <ToggleRow>
        <ToggleCheckbox
          id="usar-transferrina"
          type="checkbox"
          checked={usarTransferrina}
          onChange={(event) => setUsarTransferrina(event.target.checked)}
        />
        <ToggleLabel htmlFor="usar-transferrina">Usar transferrina para calcular TIBC</ToggleLabel>
      </ToggleRow>

      <InputsGrid>
        <Field>
          <Label htmlFor="ferro-serico">Ferro sérico (ug/dL)</Label>
          <Input
            id="ferro-serico"
            type="number"
            inputMode="decimal"
            value={ferroSerico}
            onChange={(event) => setFerroSerico(event.target.value)}
            placeholder="Ex: 85"
            autoFocus
          />
        </Field>

        {!usarTransferrina && (
          <Field>
            <Label htmlFor="tibc">TIBC (ug/dL)</Label>
            <Input
              id="tibc"
              type="number"
              inputMode="decimal"
              value={tibc}
              onChange={(event) => setTibc(event.target.value)}
              placeholder="Ex: 320"
            />
          </Field>
        )}

        {usarTransferrina && (
          <Field>
            <Label htmlFor="transferrina">Transferrina (mg/dL)</Label>
            <Input
              id="transferrina"
              type="number"
              inputMode="decimal"
              value={transferrina}
              onChange={(event) => setTransferrina(event.target.value)}
              placeholder="Ex: 260"
            />
            <SupportText>TIBC calculado automaticamente: {results.tibcDisplay}</SupportText>
          </Field>
        )}
      </InputsGrid>

      <ResultsGrid>
        <ResultCard>
          <ResultLabel>IST %</ResultLabel>
          <ResultValue>{results.istDisplay}</ResultValue>
        </ResultCard>
        <ResultCard>
          <ResultLabel>Classificação automática</ResultLabel>
          <ResultValue>{results.classification}</ResultValue>
        </ResultCard>
      </ResultsGrid>

      <InterpretationCard>
        <ResultLabel>Sugestão clínica básica</ResultLabel>
        <InterpretationText>{results.suggestion}</InterpretationText>
      </InterpretationCard>

      <Actions>
        <ResetButton type="button" onClick={limparCampos}>
          Limpar Campos
        </ResetButton>
      </Actions>
    </Container>
  );
}

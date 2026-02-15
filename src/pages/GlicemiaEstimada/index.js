import React, { useMemo, useState } from "react";
import {
  Container,
  Header,
  Formula,
  InputsGrid,
  Field,
  Label,
  Input,
  ResultsGrid,
  ResultCard,
  ResultLabel,
  ResultValue,
  ClassificationValue,
  Actions,
  ResetButton,
} from "./styles";

function parseHba1c(value) {
  const normalized = String(value).replace(",", ".").trim();
  const parsed = parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getClassification(hba1c) {
  if (hba1c >= 6.5) {
    return "Diabetes";
  }
  if (hba1c >= 5.7) {
    return "Pré-diabetes";
  }
  return "Normal";
}

export default function GlicemiaEstimada() {
  const [hba1c, setHba1c] = useState("");

  const result = useMemo(() => {
    const value = parseHba1c(hba1c);
    if (value <= 0) {
      return {
        mgDl: "--",
        mmolL: "--",
        classification: "--",
      };
    }

    const mgDl = 28.7 * value - 46.7;
    const mmolL = mgDl / 18;

    return {
      mgDl: `${mgDl.toFixed(1)} mg/dL`,
      mmolL: `${mmolL.toFixed(2)} mmol/L`,
      classification: getClassification(value),
    };
  }, [hba1c]);

  function limparCampos() {
    setHba1c("");
  }

  return (
    <Container>
      <Header>Cálculo da Glicemia Média Estimada</Header>
      <Formula>eAG (mg/dL) = 28.7 x HbA1c - 46.7</Formula>

      <InputsGrid>
        <Field>
          <Label htmlFor="hba1c">HbA1c (%)</Label>
          <Input
            id="hba1c"
            type="number"
            inputMode="decimal"
            autoFocus
            value={hba1c}
            onChange={(event) => setHba1c(event.target.value)}
            placeholder="Ex: 6.2"
            min="0"
            step="0.1"
          />
        </Field>
      </InputsGrid>

      <ResultsGrid>
        <ResultCard>
          <ResultLabel>Glicemia Média Estimada (mg/dL)</ResultLabel>
          <ResultValue>{result.mgDl}</ResultValue>
        </ResultCard>

        <ResultCard>
          <ResultLabel>Glicemia Média Estimada (mmol/L)</ResultLabel>
          <ResultValue>{result.mmolL}</ResultValue>
        </ResultCard>

        <ResultCard>
          <ResultLabel>Classificação</ResultLabel>
          <ClassificationValue>{result.classification}</ClassificationValue>
        </ResultCard>
      </ResultsGrid>

      <Actions>
        <ResetButton type="button" onClick={limparCampos}>
          Limpar Campos
        </ResetButton>
      </Actions>
    </Container>
  );
}

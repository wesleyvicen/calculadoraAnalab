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

function getInterpretation(clearance, correctedClearance, excretionPerKgDay) {
  if (clearance <= 0 || correctedClearance <= 0 || excretionPerKgDay <= 0) {
    return "Informe os campos para gerar a interpretação.";
  }

  const messages = [];

  if (correctedClearance < 60) {
    messages.push("Depuração corrigida reduzida (< 60 mL/min/1,73m²).");
  } else if (correctedClearance <= 120) {
    messages.push("Depuração corrigida dentro da faixa de referência (60-120 mL/min/1,73m²).");
  } else {
    messages.push("Depuração corrigida elevada (> 120 mL/min/1,73m²).");
  }

  if (excretionPerKgDay < 10) {
    messages.push("Excreção por kg baixa (< 10 mg/kg/dia), sugerindo possível coleta incompleta.");
  } else if (excretionPerKgDay <= 25) {
    messages.push("Excreção por kg compatível com faixa habitual (10-25 mg/kg/dia).");
  } else {
    messages.push("Excreção por kg elevada (> 25 mg/kg/dia).");
  }

  return messages.join(" ");
}

export default function DepuracaoCreatinina() {
  const [creatininaUrinaria, setCreatininaUrinaria] = useState("");
  const [creatininaSerica, setCreatininaSerica] = useState("");
  const [volumeUrinario, setVolumeUrinario] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [tempoColeta, setTempoColeta] = useState("");

  const results = useMemo(() => {
    const uCr = parseNumber(creatininaUrinaria);
    const sCr = parseNumber(creatininaSerica);
    const volumeMl = parseNumber(volumeUrinario);
    const weightKg = parseNumber(peso);
    const heightCm = parseNumber(altura);
    const timeMinutes = parseNumber(tempoColeta);

    if (
      uCr <= 0 ||
      sCr <= 0 ||
      volumeMl <= 0 ||
      weightKg <= 0 ||
      heightCm <= 0 ||
      timeMinutes <= 0
    ) {
      return {
        clearanceText: "--",
        correctedText: "--",
        totalExcretionText: "--",
        excretionPerKgText: "--",
        interpretation: "Informe os campos para gerar a interpretação.",
      };
    }

    const clearance = (uCr * volumeMl) / (sCr * timeMinutes);
    const bodySurfaceArea = Math.sqrt((heightCm * weightKg) / 3600);
    const correctedClearance = clearance * (1.73 / bodySurfaceArea);
    const totalExcretionMg = uCr * (volumeMl / 100);
    const excretionPerKgDay = (totalExcretionMg * (1440 / timeMinutes)) / weightKg;

    return {
      clearanceText: `${clearance.toFixed(1)} mL/min`,
      correctedText: `${correctedClearance.toFixed(1)} mL/min/1,73m²`,
      totalExcretionText: `${totalExcretionMg.toFixed(1)} mg`,
      excretionPerKgText: `${excretionPerKgDay.toFixed(1)} mg/kg/dia`,
      interpretation: getInterpretation(clearance, correctedClearance, excretionPerKgDay),
    };
  }, [creatininaUrinaria, creatininaSerica, volumeUrinario, peso, altura, tempoColeta]);

  function limparCampos() {
    setCreatininaUrinaria("");
    setCreatininaSerica("");
    setVolumeUrinario("");
    setPeso("");
    setAltura("");
    setTempoColeta("");
  }

  return (
    <Container>
      <Header>Cálculo de Depuração e Excreção da Creatinina</Header>
      <Formula>
        Depuração = (Creatinina urinária x Volume urinário) / (Creatinina sérica x Tempo de coleta)
      </Formula>

      <InputsGrid>
        <Field>
          <Label htmlFor="creatinina-urinaria">Creatinina urinária (mg/dL)</Label>
          <Input
            id="creatinina-urinaria"
            type="number"
            inputMode="decimal"
            value={creatininaUrinaria}
            onChange={(event) => setCreatininaUrinaria(event.target.value)}
            placeholder="Ex: 120"
            autoFocus
          />
        </Field>

        <Field>
          <Label htmlFor="creatinina-serica">Creatinina sérica (mg/dL)</Label>
          <Input
            id="creatinina-serica"
            type="number"
            inputMode="decimal"
            value={creatininaSerica}
            onChange={(event) => setCreatininaSerica(event.target.value)}
            placeholder="Ex: 1.1"
          />
        </Field>

        <Field>
          <Label htmlFor="volume-urinario">Volume urinário (mL)</Label>
          <Input
            id="volume-urinario"
            type="number"
            inputMode="decimal"
            value={volumeUrinario}
            onChange={(event) => setVolumeUrinario(event.target.value)}
            placeholder="Ex: 1500"
          />
        </Field>

        <Field>
          <Label htmlFor="peso">Peso (kg)</Label>
          <Input
            id="peso"
            type="number"
            inputMode="decimal"
            value={peso}
            onChange={(event) => setPeso(event.target.value)}
            placeholder="Ex: 70"
          />
        </Field>

        <Field>
          <Label htmlFor="altura">Altura (cm)</Label>
          <Input
            id="altura"
            type="number"
            inputMode="decimal"
            value={altura}
            onChange={(event) => setAltura(event.target.value)}
            placeholder="Ex: 170"
          />
        </Field>

        <Field>
          <Label htmlFor="tempo-coleta">Tempo de coleta (min)</Label>
          <Input
            id="tempo-coleta"
            type="number"
            inputMode="decimal"
            value={tempoColeta}
            onChange={(event) => setTempoColeta(event.target.value)}
            placeholder="Ex: 1440"
          />
        </Field>
      </InputsGrid>

      <ResultsGrid>
        <ResultCard>
          <ResultLabel>Depuração (mL/min)</ResultLabel>
          <ResultValue>{results.clearanceText}</ResultValue>
        </ResultCard>
        <ResultCard>
          <ResultLabel>Depuração corrigida</ResultLabel>
          <ResultValue>{results.correctedText}</ResultValue>
        </ResultCard>
        <ResultCard>
          <ResultLabel>Excreção total</ResultLabel>
          <ResultValue>{results.totalExcretionText}</ResultValue>
        </ResultCard>
        <ResultCard>
          <ResultLabel>Excreção por kg</ResultLabel>
          <ResultValue>{results.excretionPerKgText}</ResultValue>
        </ResultCard>
      </ResultsGrid>

      <InterpretationCard>
        <ResultLabel>Interpretação automática</ResultLabel>
        <InterpretationText>{results.interpretation}</InterpretationText>
      </InterpretationCard>

      <Actions>
        <ResetButton type="button" onClick={limparCampos}>
          Limpar Campos
        </ResetButton>
      </Actions>
    </Container>
  );
}

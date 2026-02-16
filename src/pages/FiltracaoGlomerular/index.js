import React, { useMemo, useState } from "react";
import {
  Container,
  Header,
  Formula,
  InputsGrid,
  Field,
  Label,
  Input,
  RadioRow,
  RadioButton,
  ResultsGrid,
  ResultCard,
  ResultLabel,
  ResultValue,
  InterpretationCard,
  InterpretationText,
  CompareSection,
  CompareButton,
  CompareGrid,
  Actions,
  ResetButton,
} from "./styles";

function parseNumber(value) {
  const normalized = String(value).replace(",", ".").trim();
  const parsed = parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
}

function calculateEgfrCkdEpi2021({ sexo, idade, creatinina }) {
  const kappa = sexo === "feminino" ? 0.7 : 0.9;
  const alpha = sexo === "feminino" ? -0.241 : -0.302;
  const ratio = creatinina / kappa;
  const minPart = Math.min(ratio, 1) ** alpha;
  const maxPart = Math.max(ratio, 1) ** -1.2;
  const sexFactor = sexo === "feminino" ? 1.012 : 1;

  return 142 * minPart * maxPart * 0.9938 ** idade * sexFactor;
}

function getStage(egfr) {
  if (egfr >= 90) return "G1";
  if (egfr >= 60) return "G2";
  if (egfr >= 45) return "G3a";
  if (egfr >= 30) return "G3b";
  if (egfr >= 15) return "G4";
  return "G5";
}

function getInterpretation(stage) {
  switch (stage) {
    case "G1":
      return "TFG normal ou aumentada. Avaliar outros marcadores de lesão renal para definir DRC.";
    case "G2":
      return "Leve redução da TFG. Correlacionar com albuminúria e contexto clínico.";
    case "G3a":
      return "Redução leve a moderada da função renal. Requer acompanhamento periódico.";
    case "G3b":
      return "Redução moderada a grave da função renal. Maior risco de progressão e complicações.";
    case "G4":
      return "Redução grave da função renal. Encaminhamento para nefrologia é recomendado.";
    case "G5":
      return "Falência renal. Necessita avaliação nefrológica urgente e planejamento terapêutico.";
    default:
      return "Informe os dados para gerar a interpretação.";
  }
}

function calculateCockcroftGault({ sexo, idade, creatinina, peso }) {
  const base = ((140 - idade) * peso) / (72 * creatinina);
  return sexo === "feminino" ? base * 0.85 : base;
}

export default function FiltracaoGlomerular() {
  const [sexo, setSexo] = useState("masculino");
  const [idade, setIdade] = useState("");
  const [creatinina, setCreatinina] = useState("");
  const [showCompare, setShowCompare] = useState(false);
  const [pesoCompare, setPesoCompare] = useState("");

  const results = useMemo(() => {
    const age = parseNumber(idade);
    const scr = parseNumber(creatinina);

    if (age <= 0 || scr <= 0) {
      return {
        egfrText: "--",
        stage: "--",
        interpretation: "Informe os dados para gerar a interpretação.",
      };
    }

    const egfr = calculateEgfrCkdEpi2021({
      sexo,
      idade: age,
      creatinina: scr,
    });
    const stage = getStage(egfr);

    return {
      egfrText: `${egfr.toFixed(1)} mL/min/1,73m²`,
      stage,
      interpretation: getInterpretation(stage),
    };
  }, [sexo, idade, creatinina]);

  const compareResult = useMemo(() => {
    if (!showCompare) {
      return "--";
    }

    const age = parseNumber(idade);
    const scr = parseNumber(creatinina);
    const weight = parseNumber(pesoCompare);
    if (age <= 0 || scr <= 0 || weight <= 0) {
      return "--";
    }

    const crcl = calculateCockcroftGault({
      sexo,
      idade: age,
      creatinina: scr,
      peso: weight,
    });

    return `${crcl.toFixed(1)} mL/min`;
  }, [showCompare, idade, creatinina, pesoCompare, sexo]);

  function limparCampos() {
    setSexo("masculino");
    setIdade("");
    setCreatinina("");
    setShowCompare(false);
    setPesoCompare("");
  }

  return (
    <Container>
      <Header>Cálculo da Filtração Glomerular</Header>
      <Formula>TFG estimada pela equação CKD-EPI 2021 (creatinina)</Formula>

      <InputsGrid>
        <Field>
          <Label>Sexo</Label>
          <RadioRow role="radiogroup" aria-label="Sexo">
            <RadioButton
              type="button"
              role="radio"
              aria-checked={sexo === "masculino"}
              $active={sexo === "masculino"}
              onClick={() => setSexo("masculino")}
            >
              Masculino
            </RadioButton>
            <RadioButton
              type="button"
              role="radio"
              aria-checked={sexo === "feminino"}
              $active={sexo === "feminino"}
              onClick={() => setSexo("feminino")}
            >
              Feminino
            </RadioButton>
          </RadioRow>
        </Field>

        <Field>
          <Label htmlFor="idade">Idade (anos)</Label>
          <Input
            id="idade"
            type="number"
            inputMode="decimal"
            value={idade}
            onChange={(event) => setIdade(event.target.value)}
            placeholder="Ex: 58"
            autoFocus
          />
        </Field>

        <Field>
          <Label htmlFor="creatinina">Creatinina sérica (mg/dL)</Label>
          <Input
            id="creatinina"
            type="number"
            inputMode="decimal"
            value={creatinina}
            onChange={(event) => setCreatinina(event.target.value)}
            placeholder="Ex: 1.2"
          />
        </Field>
      </InputsGrid>

      <ResultsGrid>
        <ResultCard>
          <ResultLabel>eGFR</ResultLabel>
          <ResultValue>{results.egfrText}</ResultValue>
        </ResultCard>
        <ResultCard>
          <ResultLabel>Estágio automático</ResultLabel>
          <ResultValue>{results.stage}</ResultValue>
        </ResultCard>
      </ResultsGrid>

      <InterpretationCard>
        <ResultLabel>Interpretação</ResultLabel>
        <InterpretationText>{results.interpretation}</InterpretationText>
      </InterpretationCard>

      <CompareSection>
        <CompareButton type="button" onClick={() => setShowCompare((prev) => !prev)}>
          Comparar com Cockcroft-Gault
        </CompareButton>

        {showCompare && (
          <CompareGrid>
            <Field>
              <Label htmlFor="peso-compare">Peso (kg) para Cockcroft-Gault</Label>
              <Input
                id="peso-compare"
                type="number"
                inputMode="decimal"
                value={pesoCompare}
                onChange={(event) => setPesoCompare(event.target.value)}
                placeholder="Ex: 70"
              />
            </Field>

            <ResultCard>
              <ResultLabel>Cockcroft-Gault (CrCl)</ResultLabel>
              <ResultValue>{compareResult}</ResultValue>
            </ResultCard>
          </CompareGrid>
        )}
      </CompareSection>

      <Actions>
        <ResetButton type="button" onClick={limparCampos}>
          Limpar Campos
        </ResetButton>
      </Actions>
    </Container>
  );
}

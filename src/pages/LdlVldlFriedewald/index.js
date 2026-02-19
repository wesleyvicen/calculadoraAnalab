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

export default function LdlVldlFriedewald() {
  const [colesterolTotal, setColesterolTotal] = useState("");
  const [hdl, setHdl] = useState("");
  const [triglicerideos, setTriglicerideos] = useState("");

  const result = useMemo(() => {
    const ct = parseNumber(colesterolTotal);
    const hdlValue = parseNumber(hdl);
    const tg = parseNumber(triglicerideos);

    if (ct <= 0 || hdlValue <= 0 || tg <= 0) {
      return {
        ldl: "--",
        vldl: "--",
        interpretation: "Informe colesterol total, HDL e triglicerídeos para calcular.",
      };
    }

    if (tg >= 400) {
      return {
        ldl: "Inválido",
        vldl: "Inválido",
        interpretation:
          "A fórmula de Friedewald não deve ser usada com triglicerídeos ≥ 400 mg/dL.",
      };
    }

    const vldlValue = tg / 5;
    const ldlValue = ct - hdlValue - vldlValue;

    return {
      ldl: `${ldlValue.toFixed(1)} mg/dL`,
      vldl: `${vldlValue.toFixed(1)} mg/dL`,
      interpretation: "Cálculo válido (TG < 400 mg/dL). Correlacione com contexto clínico.",
    };
  }, [colesterolTotal, hdl, triglicerideos]);

  function limparCampos() {
    setColesterolTotal("");
    setHdl("");
    setTriglicerideos("");
  }

  return (
    <Container>
      <Header>Cálculo de LDL e VLDL (Friedewald)</Header>
      <Formula>LDL = CT - HDL - (TG/5) | VLDL = TG/5 (mg/dL)</Formula>

      <InputsGrid>
        <Field>
          <Label htmlFor="ct">Colesterol Total (mg/dL)</Label>
          <Input
            id="ct"
            type="number"
            inputMode="decimal"
            value={colesterolTotal}
            onChange={(event) => setColesterolTotal(event.target.value)}
            placeholder="Ex: 190"
            autoFocus
          />
        </Field>

        <Field>
          <Label htmlFor="hdl">HDL-colesterol (mg/dL)</Label>
          <Input
            id="hdl"
            type="number"
            inputMode="decimal"
            value={hdl}
            onChange={(event) => setHdl(event.target.value)}
            placeholder="Ex: 45"
          />
        </Field>

        <Field>
          <Label htmlFor="tg">Triglicerídeos (mg/dL)</Label>
          <Input
            id="tg"
            type="number"
            inputMode="decimal"
            value={triglicerideos}
            onChange={(event) => setTriglicerideos(event.target.value)}
            placeholder="Ex: 150"
          />
        </Field>
      </InputsGrid>

      <ResultsGrid>
        <ResultCard>
          <ResultLabel>LDL calculado</ResultLabel>
          <ResultValue>{result.ldl}</ResultValue>
        </ResultCard>

        <ResultCard>
          <ResultLabel>VLDL estimado</ResultLabel>
          <ResultValue>{result.vldl}</ResultValue>
        </ResultCard>
      </ResultsGrid>

      <InterpretationCard>
        <ResultLabel>Interpretação</ResultLabel>
        <InterpretationText>{result.interpretation}</InterpretationText>
      </InterpretationCard>

      <Actions>
        <ResetButton type="button" onClick={limparCampos}>
          Limpar Campos
        </ResetButton>
      </Actions>
    </Container>
  );
}

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

function getInterpretation(mg24h) {
  if (mg24h < 150) {
    return "Faixa de referência: excreção proteica normal (< 150 mg/24h).";
  }
  if (mg24h < 500) {
    return "Proteinúria discreta (150 a 499 mg/24h).";
  }
  if (mg24h < 3500) {
    return "Proteinúria significativa (500 a 3499 mg/24h).";
  }
  return "Proteinúria em faixa nefrótica (≥ 3500 mg/24h).";
}

export default function Proteinuria24h() {
  const [proteinuria, setProteinuria] = useState("");
  const [volume24h, setVolume24h] = useState("");

  const result = useMemo(() => {
    const proteinValue = parseNumber(proteinuria);
    const volumeValue = parseNumber(volume24h);

    if (proteinValue <= 0 || volumeValue <= 0) {
      return {
        mg24h: "--",
        g24h: "--",
        interpretation: "Informe proteína urinária (mg/dL) e volume urinário de 24h (mL).",
      };
    }

    const mg24hValue = (proteinValue * volumeValue) / 100;
    const g24hValue = mg24hValue / 1000;

    return {
      mg24h: `${mg24hValue.toFixed(1)} mg/24h`,
      g24h: `${g24hValue.toFixed(3)} g/24h`,
      interpretation: getInterpretation(mg24hValue),
    };
  }, [proteinuria, volume24h]);

  function limparCampos() {
    setProteinuria("");
    setVolume24h("");
  }

  return (
    <Container>
      <Header>Cálculo de Proteinúria de 24 horas</Header>
      <Formula>Proteinúria 24h (mg) = Proteína urinária (mg/dL) x Volume urinário 24h (mL) / 100</Formula>

      <InputsGrid>
        <Field>
          <Label htmlFor="proteinuria">Proteína urinária (mg/dL)</Label>
          <Input
            id="proteinuria"
            type="number"
            inputMode="decimal"
            value={proteinuria}
            onChange={(event) => setProteinuria(event.target.value)}
            placeholder="Ex: 35"
            autoFocus
          />
        </Field>

        <Field>
          <Label htmlFor="volume24h">Volume urinário 24h (mL)</Label>
          <Input
            id="volume24h"
            type="number"
            inputMode="decimal"
            value={volume24h}
            onChange={(event) => setVolume24h(event.target.value)}
            placeholder="Ex: 1800"
          />
        </Field>
      </InputsGrid>

      <ResultsGrid>
        <ResultCard>
          <ResultLabel>Proteinúria de 24h (mg)</ResultLabel>
          <ResultValue>{result.mg24h}</ResultValue>
        </ResultCard>

        <ResultCard>
          <ResultLabel>Proteinúria de 24h (g)</ResultLabel>
          <ResultValue>{result.g24h}</ResultValue>
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

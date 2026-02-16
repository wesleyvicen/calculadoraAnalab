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

function getCategory(acr) {
  if (acr < 30) return "A1";
  if (acr <= 300) return "A2";
  return "A3";
}

function getInterpretation(category) {
  switch (category) {
    case "A1":
      return "Albuminúria normal a levemente aumentada (< 30 mg/g).";
    case "A2":
      return "Albuminúria moderadamente aumentada (30-300 mg/g). Requer acompanhamento.";
    case "A3":
      return "Albuminúria gravemente aumentada (> 300 mg/g). Maior risco renal e cardiovascular.";
    default:
      return "Informe os dados para gerar a interpretação.";
  }
}

export default function RelacaoAlbuminaCreatinina() {
  const [albuminaUrinaria, setAlbuminaUrinaria] = useState("");
  const [creatininaUrinaria, setCreatininaUrinaria] = useState("");

  const results = useMemo(() => {
    const albumina = parseNumber(albuminaUrinaria);
    const creatinina = parseNumber(creatininaUrinaria);

    if (albumina <= 0 || creatinina <= 0) {
      return {
        ratio: "--",
        category: "--",
        interpretation: "Informe os dados para gerar a interpretação.",
      };
    }

    const ratio = (albumina * 100) / creatinina;
    const category = getCategory(ratio);

    return {
      ratio: `${ratio.toFixed(1)} mg/g`,
      category,
      interpretation: getInterpretation(category),
    };
  }, [albuminaUrinaria, creatininaUrinaria]);

  function limparCampos() {
    setAlbuminaUrinaria("");
    setCreatininaUrinaria("");
  }

  return (
    <Container>
      <Header>Relação Microalbuminúria/Creatinina (ACR)</Header>
      <Formula>ACR (mg/g) = Microalbuminúria (mg/L) x 100 / Creatinina urinária (mg/dL)</Formula>

      <InputsGrid>
        <Field>
          <Label htmlFor="albumina-urinaria">Microalbuminúria (mg/L)</Label>
          <Input
            id="albumina-urinaria"
            type="number"
            inputMode="decimal"
            value={albuminaUrinaria}
            onChange={(event) => setAlbuminaUrinaria(event.target.value)}
            placeholder="Ex: 30"
            autoFocus
          />
        </Field>

        <Field>
          <Label htmlFor="creatinina-urinaria">Creatinina urinária (mg/dL)</Label>
          <Input
            id="creatinina-urinaria"
            type="number"
            inputMode="decimal"
            value={creatininaUrinaria}
            onChange={(event) => setCreatininaUrinaria(event.target.value)}
            placeholder="Ex: 100"
          />
        </Field>
      </InputsGrid>

      <ResultsGrid>
        <ResultCard>
          <ResultLabel>Relação mg/g</ResultLabel>
          <ResultValue>{results.ratio}</ResultValue>
        </ResultCard>

        <ResultCard>
          <ResultLabel>Categoria</ResultLabel>
          <ResultValue>{results.category}</ResultValue>
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

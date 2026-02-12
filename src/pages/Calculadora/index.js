import React, { useMemo, useState } from "react";
import {
  Container,
  Header,
  Formula,
  InputsGrid,
  Field,
  Label,
  Input,
  ResultCard,
  ResultLabel,
  ResultValue,
  Actions,
  ResetButton,
} from "./styles";

function toNumber(value) {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export default function Calculadora() {
  const [valorSodio, setValorSodio] = useState("");
  const [valorPotassio, setValorPotassio] = useState("");
  const [valorCloro, setValorCloro] = useState("");

  const valorBic = useMemo(() => {
    const sodio = toNumber(valorSodio);
    const potassio = toNumber(valorPotassio);
    const cloro = toNumber(valorCloro);

    if (sodio === 0 && potassio === 0 && cloro === 0) {
      return 0;
    }

    return sodio + potassio - cloro - 19;
  }, [valorSodio, valorPotassio, valorCloro]);

  function limparCampos() {
    setValorSodio("");
    setValorPotassio("");
    setValorCloro("");
  }

  return (
    <Container>
      <Header>Calculadora de Íons</Header>
      <Formula>BIC = (Sódio + Potássio) - Cloro - 19</Formula>

      <InputsGrid>
        <Field>
          <Label htmlFor="sodio">Valor do Sódio</Label>
          <Input
            id="sodio"
            type="number"
            inputMode="decimal"
            autoFocus
            value={valorSodio}
            onChange={(e) => setValorSodio(e.target.value)}
            placeholder="Ex: 140"
          />
        </Field>

        <Field>
          <Label htmlFor="potassio">Valor do Potássio</Label>
          <Input
            id="potassio"
            type="number"
            inputMode="decimal"
            value={valorPotassio}
            onChange={(e) => setValorPotassio(e.target.value)}
            placeholder="Ex: 4.2"
          />
        </Field>

        <Field>
          <Label htmlFor="cloro">Valor do Cloro</Label>
          <Input
            id="cloro"
            type="number"
            inputMode="decimal"
            value={valorCloro}
            onChange={(e) => setValorCloro(e.target.value)}
            placeholder="Ex: 103"
          />
        </Field>
      </InputsGrid>

      <ResultCard>
        <ResultLabel>Resultado de BIC</ResultLabel>
        <ResultValue>{valorBic}</ResultValue>
      </ResultCard>

      <Actions>
        <ResetButton type="button" onClick={limparCampos}>
          Limpar Campos
        </ResetButton>
      </Actions>
    </Container>
  );
}

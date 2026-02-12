import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Container,
  Header,
  Board,
  CounterCard,
  CounterLabel,
  CounterValue,
  CounterKey,
  Footer,
  Total,
  ResetButton,
} from "./styles";

const MAX_TOTAL = 100;
const INITIAL_COUNTS = { a: 0, s: 0, d: 0, f: 0, g: 0, h: 0 };
const COUNTERS = [
  { id: "a", label: "SEG", keyLabel: "A" },
  { id: "s", label: "LT", keyLabel: "S" },
  { id: "d", label: "EOS", keyLabel: "D" },
  { id: "f", label: "MON", keyLabel: "F" },
  { id: "g", label: "BAST", keyLabel: "G" },
  { id: "h", label: "LA", keyLabel: "H" },
];

function Hematologia() {
  const [counts, setCounts] = useState(INITIAL_COUNTS);
  const [blinkTokens, setBlinkTokens] = useState(INITIAL_COUNTS);
  const [lastPressedKey, setLastPressedKey] = useState(null);
  const hasReachedLimit = useRef(false);

  const totalCount = useMemo(
    () => Object.values(counts).reduce((sum, value) => sum + value, 0),
    [counts]
  );

  function incrementCounter(counterId) {
    setLastPressedKey(counterId);
    setBlinkTokens((prev) => ({ ...prev, [counterId]: prev[counterId] + 1 }));
    setCounts((prev) => {
      const currentTotal = Object.values(prev).reduce((sum, value) => sum + value, 0);
      if (currentTotal >= MAX_TOTAL) {
        return prev;
      }

      return { ...prev, [counterId]: prev[counterId] + 1 };
    });
  }

  function resetCounters() {
    setCounts(INITIAL_COUNTS);
    setBlinkTokens(INITIAL_COUNTS);
    setLastPressedKey(null);
    hasReachedLimit.current = false;
  }

  useEffect(() => {
    function handleKeyDown(event) {
      const pressedKey = event.key.toLowerCase();

      if (pressedKey === "0") {
        setCounts(INITIAL_COUNTS);
        setBlinkTokens(INITIAL_COUNTS);
        setLastPressedKey(null);
        hasReachedLimit.current = false;
        return;
      }

      if (INITIAL_COUNTS[pressedKey] !== undefined) {
        setLastPressedKey(pressedKey);
        setBlinkTokens((prev) => ({ ...prev, [pressedKey]: prev[pressedKey] + 1 }));
        setCounts((prev) => {
          const currentTotal = Object.values(prev).reduce((sum, value) => sum + value, 0);
          if (currentTotal >= MAX_TOTAL) {
            return prev;
          }

          return { ...prev, [pressedKey]: prev[pressedKey] + 1 };
        });
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (totalCount === MAX_TOTAL && !hasReachedLimit.current) {
      hasReachedLimit.current = true;
      alert("A soma total dos contadores atingiu 100.");
    }
  }, [totalCount]);

  return (
    <Container>
      <Header>Pressione as teclas "A", "S", "D", "F", "G" ou "H" para somar +1:</Header>

      <Board>
        {COUNTERS.map((counter) => (
          <CounterCard
            key={counter.id}
            type="button"
            onClick={() => incrementCounter(counter.id)}
            aria-label={`Somar ${counter.label}`}
            $blinkToken={blinkTokens[counter.id]}
            $isLastPressed={lastPressedKey === counter.id}
          >
            <CounterLabel>{counter.label}</CounterLabel>
            <CounterValue>{counts[counter.id]}</CounterValue>
            <CounterKey>"{counter.keyLabel}"</CounterKey>
          </CounterCard>
        ))}
      </Board>

      <Footer>
        <Total>Total: {totalCount}</Total>
        <ResetButton type="button" onClick={resetCounters}>
          Resetar (tecla 0)
        </ResetButton>
      </Footer>
    </Container>
  );
}

export default Hematologia;

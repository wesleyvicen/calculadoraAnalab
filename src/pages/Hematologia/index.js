import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Container,
  Header,
  FinishBanner,
  FinishText,
  FinishButton,
  SetupCard,
  SetupTitle,
  SetupGrid,
  SetupField,
  SetupLabel,
  SetupInput,
  SetupButton,
  SetupError,
  CurrentCountName,
  MainArea,
  Board,
  CounterCard,
  CounterLabel,
  CounterValue,
  CounterKey,
  Footer,
  Total,
  Observation,
  ResetButton,
  HistoryCard,
  HistoryTitle,
  HistoryList,
  HistoryItem,
} from "./styles";

const MAX_TOTAL = 100;
const INITIAL_COUNTS = {
  a: 0,
  s: 0,
  d: 0,
  f: 0,
  g: 0,
  h: 0,
  z: 0,
  x: 0,
  c: 0,
  v: 0,
  b: 0,
  p: 0,
  n: 0,
};
const COUNTERS = [
  { id: "a", label: "SEG", keyLabel: "A" },
  { id: "s", label: "LT", keyLabel: "S" },
  { id: "d", label: "EOS", keyLabel: "D" },
  { id: "f", label: "MON", keyLabel: "F" },
  { id: "g", label: "BAST", keyLabel: "G" },
  { id: "h", label: "LA", keyLabel: "H" },
  { id: "z", label: "BASO", keyLabel: "Z" },
  { id: "x", label: "PLAS", keyLabel: "X" },
  { id: "c", label: "META", keyLabel: "C" },
  { id: "v", label: "MIELO", keyLabel: "V" },
  { id: "b", label: "PROM", keyLabel: "B" },
  { id: "p", label: "BLASTO", keyLabel: "P" },
  { id: "n", label: "ERIT", keyLabel: "N" },
];
const COUNTER_IDS = COUNTERS.map((counter) => counter.id);
const ERIT_COUNTER_ID = "n";
const LIMITED_COUNTER_IDS = COUNTER_IDS.filter((id) => id !== ERIT_COUNTER_ID);
const DEFAULT_HEADER_TEXT =
  'Pressione as teclas "A", "S", "D", "F", "G", "H", "Z", "X", "C", "V", "B", "P" ou "N" para somar +1:';
const INTRO_HEADER_TEXT = "Pressione Enter para iniciar a contagem.";
const HISTORY_STORAGE_KEY = "hematologia:lastCountHistory:v1";
const HISTORY_LIMIT = 8;

function sumCounters(values, ids) {
  return ids.reduce((sum, key) => sum + (values[key] || 0), 0);
}

function formatSavedAt(isoDate) {
  if (!isoDate) {
    return "--";
  }

  const parsedDate = new Date(isoDate);
  if (Number.isNaN(parsedDate.getTime())) {
    return "--";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

function readCountHistory() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawHistory = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!rawHistory) {
      return [];
    }

    const parsedHistory = JSON.parse(rawHistory);
    if (!Array.isArray(parsedHistory)) {
      return [];
    }

    return parsedHistory.slice(0, HISTORY_LIMIT);
  } catch (error) {
    return [];
  }
}

function Hematologia() {
  const [counts, setCounts] = useState(INITIAL_COUNTS);
  const [setupValues, setSetupValues] = useState(() =>
    COUNTER_IDS.reduce((acc, id) => ({ ...acc, [id]: "0" }), {})
  );
  const [isSetupLocked, setIsSetupLocked] = useState(false);
  const [isLimitAlertActive, setIsLimitAlertActive] = useState(false);
  const [blinkTokens, setBlinkTokens] = useState(INITIAL_COUNTS);
  const [lastPressedKey, setLastPressedKey] = useState(null);
  const [countHistory, setCountHistory] = useState(() => readCountHistory());
  const [setupCountName, setSetupCountName] = useState("");
  const [currentCountName, setCurrentCountName] = useState("");
  const [setupError, setSetupError] = useState("");
  const hasReachedLimit = useRef(false);
  const audioContextRef = useRef(null);
  const limitAlertTimeoutRef = useRef(null);
  const lastResetHintAtRef = useRef(0);
  const setupActiveCounterRef = useRef(null);

  const totalCount = useMemo(() => sumCounters(counts, LIMITED_COUNTER_IDS), [counts]);
  const eritCount = counts[ERIT_COUNTER_ID] || 0;

  const buildZeroSetupValues = useCallback(
    () => COUNTER_IDS.reduce((acc, id) => ({ ...acc, [id]: "0" }), {}),
    []
  );

  const playFinishTone = useCallback(async () => {
    const BrowserAudioContext = window.AudioContext || window.webkitAudioContext;
    if (!BrowserAudioContext) {
      return;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new BrowserAudioContext();
    }

    const context = audioContextRef.current;
    if (context.state === "suspended") {
      try {
        await context.resume();
      } catch (error) {
        return;
      }
    }

    const now = context.currentTime;
    [0, 0.22].forEach((offset, index) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = index === 0 ? 880 : 1175;
      gainNode.gain.setValueAtTime(0.0001, now + offset);
      gainNode.gain.exponentialRampToValueAtTime(0.22, now + offset + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.16);
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + 0.18);
    });
  }, []);

  const speakFinished = useCallback(() => {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      return;
    }

    if (window.speechSynthesis.speaking) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(
      "A contagem finalizou. Clique em zero para reiniciar."
    );
    utterance.lang = "pt-BR";
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const ptVoice =
      voices.find((voice) => voice.lang && voice.lang.toLowerCase().startsWith("pt-br")) ||
      voices.find((voice) => voice.lang && voice.lang.toLowerCase().startsWith("pt"));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    window.speechSynthesis.speak(utterance);
  }, []);

  const speakResetHint = useCallback(() => {
    if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
      return;
    }

    const now = Date.now();
    if (now - lastResetHintAtRef.current < 1200) {
      return;
    }
    lastResetHintAtRef.current = now;

    const utterance = new SpeechSynthesisUtterance("Digite zero para reiniciar");
    utterance.lang = "pt-BR";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }, []);

  const stopLimitAlert = useCallback(() => {
    if (limitAlertTimeoutRef.current) {
      window.clearTimeout(limitAlertTimeoutRef.current);
      limitAlertTimeoutRef.current = null;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const persistCountHistory = useCallback((snapshot, countName) => {
    const snapshotTotal = sumCounters(snapshot, LIMITED_COUNTER_IDS);
    const snapshotErit = snapshot[ERIT_COUNTER_ID] || 0;

    if (snapshotTotal === 0 && snapshotErit === 0) {
      return;
    }

    const highlights = COUNTERS.filter((counter) => (snapshot[counter.id] || 0) > 0)
      .sort((a, b) => (snapshot[b.id] || 0) - (snapshot[a.id] || 0))
      .slice(0, 4)
      .map((counter) => `${counter.label}:${snapshot[counter.id]}`);

    const historyEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      savedAt: new Date().toISOString(),
      countName: String(countName || "").trim() || "Contagem sem nome",
      total: snapshotTotal,
      erit: snapshotErit,
      highlights,
    };

    setCountHistory((prev) => {
      const nextHistory = [historyEntry, ...prev].slice(0, HISTORY_LIMIT);

      try {
        window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(nextHistory));
      } catch (error) {
        return prev;
      }

      return nextHistory;
    });
  }, []);

  const startLimitAlert = useCallback(() => {
    stopLimitAlert();

    const tick = () => {
      if (!hasReachedLimit.current || !isLimitAlertActive) {
        stopLimitAlert();
        return;
      }

      void playFinishTone();
      speakFinished();
      limitAlertTimeoutRef.current = window.setTimeout(tick, 3500);
    };

    tick();
  }, [isLimitAlertActive, playFinishTone, speakFinished, stopLimitAlert]);

  function incrementCounter(counterId) {
    if (!isSetupLocked) {
      return;
    }

    if (totalCount >= MAX_TOTAL) {
      if (!isLimitAlertActive) {
        speakResetHint();
      }
      return;
    }

    setLastPressedKey(counterId);
    setBlinkTokens((prev) => ({ ...prev, [counterId]: prev[counterId] + 1 }));
    setCounts((prev) => {
      const currentTotal = sumCounters(prev, LIMITED_COUNTER_IDS);
      if (currentTotal >= MAX_TOTAL) {
        return prev;
      }

      return { ...prev, [counterId]: prev[counterId] + 1 };
    });
  }

  function resetCounters() {
    persistCountHistory(counts, currentCountName);
    setCounts(INITIAL_COUNTS);
    setSetupValues(buildZeroSetupValues());
    setCurrentCountName("");
    setSetupError("");
    setupActiveCounterRef.current = null;
    setIsSetupLocked(false);
    setBlinkTokens(INITIAL_COUNTS);
    setLastPressedKey(null);
    hasReachedLimit.current = false;
    setIsLimitAlertActive(false);
  }

  const startCountingWithInitialValues = useCallback(() => {
    const parsedCounts = COUNTER_IDS.reduce((acc, id) => {
      const parsed = parseInt(String(setupValues[id] ?? "0").trim(), 10);
      acc[id] = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
      return acc;
    }, {});
    const parsedTotal = sumCounters(parsedCounts, LIMITED_COUNTER_IDS);

    if (parsedTotal > MAX_TOTAL) {
      setSetupError(
        `A soma inicial das teclas (sem ERIT) não pode passar de ${MAX_TOTAL}. Ajuste os valores para iniciar.`
      );
      return;
    }

    const normalizedCountName = String(setupCountName || "").trim();
    const defaultCountName = `Contagem ${new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date())}`;
    const nextCountName = normalizedCountName || defaultCountName;

    setCounts(parsedCounts);
    setCurrentCountName(nextCountName);
    setSetupError("");
    setBlinkTokens(INITIAL_COUNTS);
    setLastPressedKey(null);
    setupActiveCounterRef.current = null;
    hasReachedLimit.current = false;
    setIsLimitAlertActive(false);
    setIsSetupLocked(true);
  }, [setupValues, setupCountName]);

  function handleSetupSubmit(event) {
    event.preventDefault();
    startCountingWithInitialValues();
  }

  useEffect(() => {
    function handleKeyDown(event) {
      const pressedKey = event.key.toLowerCase();

      if (!isSetupLocked && event.key === "Enter") {
        event.preventDefault();
        startCountingWithInitialValues();
        return;
      }

      if (!isSetupLocked) {
        const activeElementId =
          document.activeElement && "id" in document.activeElement
            ? document.activeElement.id
            : "";
        const isTypingCountName = activeElementId === "setup-count-name";

        if (isTypingCountName) {
          return;
        }

        if (INITIAL_COUNTS[pressedKey] !== undefined) {
          event.preventDefault();
          setupActiveCounterRef.current = pressedKey;
          const targetInput = document.getElementById(`setup-${pressedKey}`);
          if (targetInput && typeof targetInput.focus === "function") {
            targetInput.focus();
          }
          return;
        }

        if (/^\d$/.test(event.key) && setupActiveCounterRef.current) {
          event.preventDefault();
          const activeCounterId = setupActiveCounterRef.current;
          setSetupValues((prev) => {
            const currentValue = String(prev[activeCounterId] ?? "0");
            const nextValue = currentValue === "0" ? event.key : `${currentValue}${event.key}`;
            return { ...prev, [activeCounterId]: nextValue };
          });
          return;
        }

        if (event.key === "Backspace" && setupActiveCounterRef.current) {
          event.preventDefault();
          const activeCounterId = setupActiveCounterRef.current;
          setSetupValues((prev) => {
            const currentValue = String(prev[activeCounterId] ?? "0");
            const trimmedValue = currentValue.length > 1 ? currentValue.slice(0, -1) : "0";
            return { ...prev, [activeCounterId]: trimmedValue };
          });
        }

        return;
      }

      if (pressedKey === "0") {
        resetCounters();
        return;
      }

      if (!isSetupLocked) {
        return;
      }

      if (INITIAL_COUNTS[pressedKey] !== undefined) {
        if (totalCount >= MAX_TOTAL) {
          if (!isLimitAlertActive) {
            speakResetHint();
          }
          return;
        }

        setLastPressedKey(pressedKey);
        setBlinkTokens((prev) => ({ ...prev, [pressedKey]: prev[pressedKey] + 1 }));
        setCounts((prev) => {
          const currentTotal = sumCounters(prev, LIMITED_COUNTER_IDS);
          if (currentTotal >= MAX_TOTAL) {
            return prev;
          }

          return { ...prev, [pressedKey]: prev[pressedKey] + 1 };
        });
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isSetupLocked,
    isLimitAlertActive,
    resetCounters,
    speakResetHint,
    totalCount,
    startCountingWithInitialValues,
  ]);

  useEffect(() => {
    if (totalCount === MAX_TOTAL && !hasReachedLimit.current) {
      hasReachedLimit.current = true;
      setIsLimitAlertActive(true);
    }
  }, [totalCount]);

  useEffect(() => {
    if (!isLimitAlertActive) {
      stopLimitAlert();
      return;
    }

    startLimitAlert();
    return () => stopLimitAlert();
  }, [isLimitAlertActive, startLimitAlert, stopLimitAlert]);

  useEffect(
    () => () => {
      stopLimitAlert();
    },
    [stopLimitAlert]
  );

  function acknowledgeLimitReached() {
    setIsLimitAlertActive(false);
  }

  return (
    <Container $compactMode={isSetupLocked}>
      <Header>{isSetupLocked ? DEFAULT_HEADER_TEXT : INTRO_HEADER_TEXT}</Header>

      {isLimitAlertActive && (
        <FinishBanner>
          <FinishText>Contagem finalizada: limite de 100 atingido.</FinishText>
          <FinishButton type="button" onClick={acknowledgeLimitReached}>
            Confirmar finalização
          </FinishButton>
        </FinishBanner>
      )}

      {!isSetupLocked && (
        <SetupCard as="form" onSubmit={handleSetupSubmit}>
          <SetupTitle>Digite os valores iniciais de cada tecla</SetupTitle>
          <SetupField>
            <SetupLabel htmlFor="setup-count-name">Nome/Título da contagem</SetupLabel>
            <SetupInput
              id="setup-count-name"
              type="text"
              value={setupCountName}
              onChange={(event) => setSetupCountName(event.target.value)}
              onFocus={() => {
                setupActiveCounterRef.current = null;
              }}
              placeholder="Ex.: Leucograma João - turno manhã"
            />
          </SetupField>
          <SetupGrid>
            {COUNTERS.map((counter) => (
              <SetupField key={counter.id}>
                <SetupLabel htmlFor={`setup-${counter.id}`}>
                  {counter.keyLabel}: {counter.label}
                </SetupLabel>
                <SetupInput
                  id={`setup-${counter.id}`}
                  type="number"
                  inputMode="numeric"
                  min="0"
                  value={setupValues[counter.id]}
                  onChange={(event) =>
                    setSetupValues((prev) => ({ ...prev, [counter.id]: event.target.value }))
                  }
                />
              </SetupField>
            ))}
          </SetupGrid>
          <SetupButton type="submit">
            Iniciar contagem
          </SetupButton>
          {setupError && <SetupError>{setupError}</SetupError>}
        </SetupCard>
      )}

      <MainArea $compactMode={isSetupLocked}>
        <Board $compactMode={isSetupLocked}>
          {COUNTERS.map((counter) => (
            <CounterCard
              key={counter.id}
              type="button"
              onClick={() => incrementCounter(counter.id)}
              aria-label={`Somar ${counter.label}`}
              $blinkToken={blinkTokens[counter.id]}
              $isLastPressed={lastPressedKey === counter.id}
              $isActivated={counts[counter.id] > 0}
              disabled={!isSetupLocked}
            >
              <CounterLabel $isActivated={counts[counter.id] > 0}>{counter.label}</CounterLabel>
              <CounterValue>{counts[counter.id]}</CounterValue>
              <CounterKey $isActivated={counts[counter.id] > 0}>"{counter.keyLabel}"</CounterKey>
            </CounterCard>
          ))}
        </Board>

        <Footer $compactMode={isSetupLocked}>
          {isSetupLocked && <CurrentCountName>{currentCountName}</CurrentCountName>}
          <Total>Total: {totalCount}</Total>
          <Observation>
            Observação: ERIT contado individualmente sem participar da soma total = {eritCount}
          </Observation>
          <HistoryCard>
            <HistoryTitle>Histórico resumido (cache local)</HistoryTitle>
            <HistoryList>
              {countHistory.length === 0 && (
                <HistoryItem>Nenhuma contagem finalizada ainda.</HistoryItem>
              )}
              {countHistory.map((entry) => (
                <HistoryItem key={entry.id}>
                  {entry.countName} | {formatSavedAt(entry.savedAt)} | Total {entry.total} | ERIT{" "}
                  {entry.erit} | {entry.highlights.join(", ")}
                </HistoryItem>
              ))}
            </HistoryList>
          </HistoryCard>
          <ResetButton type="button" onClick={resetCounters}>
            Resetar (tecla 0)
          </ResetButton>
        </Footer>
      </MainArea>
    </Container>
  );
}

export default Hematologia;

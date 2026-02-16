import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Container,
  Header,
  HeaderBrand,
  HeaderLogo,
  HeaderTitle,
  InfoBanner,
  TopActions,
  AddButton,
  Grid,
  TimerCard,
  CardHeader,
  CardTitle,
  ToneBadge,
  EditNameButton,
  TitleEditorRow,
  TitleEditor,
  SaveNameButton,
  CancelNameButton,
  TimeValue,
  PresetRow,
  PresetLabel,
  PresetControls,
  PresetInput,
  QuickPresets,
  QuickPresetButton,
  ProgressTrack,
  ProgressFill,
  Actions,
  StartButton,
  PauseButton,
  StopButton,
  TestButton,
  AcknowledgeButton,
  StatusText,
} from "./styles";

const MAX_MINUTES = 240;
const DEFAULT_PRESET_MINUTES = 10;
const QUICK_PRESET_MINUTES = [1, 5, 10, 15, 30];
const CHANNEL_NAMES_STORAGE_KEY = "analab_cronometros_channel_names_v1";

const TONE_PRESETS = [
  { name: "Bip Alfa", wave: "sine", base: 880, accent: 1320 },
  { name: "Bip Beta", wave: "triangle", base: 740, accent: 988 },
  { name: "Bip Gama", wave: "square", base: 660, accent: 1046 },
  { name: "Bip Delta", wave: "sawtooth", base: 520, accent: 780 },
];
const INITIAL_CHANNELS = [ createChannel(1, "Coloração", 15, 0), createChannel(2, "Reação bioquímica", 20, 1), createChannel(3, "Reação de sorologia 1", 90, 2), createChannel(4, "Reação de sorologia 2", 30, 3), ];

function readCachedChannelNames() {
  try {
    const rawValue = window.localStorage.getItem(CHANNEL_NAMES_STORAGE_KEY);
    if (!rawValue) {
      return {};
    }

    const parsed = JSON.parse(rawValue);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    return {};
  }
}

function withCachedNames(channels) {
  const cachedNames = readCachedChannelNames();
  return channels.map((channel) =>
    cachedNames[channel.id] ? { ...channel, name: cachedNames[channel.id] } : channel
  );
}

function createChannel(id, name, presetMinutes, toneIndex) {
  const presetSeconds = Math.max(1, presetMinutes * 60);
  return {
    id,
    name,
    presetMinutes,
    presetInput: String(presetMinutes),
    presetSeconds,
    remainingSeconds: presetSeconds,
    status: "idle",
    alertPending: false,
    completedAtMs: null,
    toneIndex,
  };
}

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, "0")).join(":");
}

function normalizeMinutes(value) {
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return 1;
  }
  return Math.min(MAX_MINUTES, Math.max(1, parsed));
}

function parsePresetInputToSeconds(rawValue) {
  const value = String(rawValue).trim();
  if (!value) {
    return null;
  }

  const normalized = value.replace(",", ".").replace(":", ".");

  if (/^\d+$/.test(normalized)) {
    const minutes = normalizeMinutes(normalized);
    return minutes * 60;
  }

  const match = normalized.match(/^(\d+)\.(\d{1,2})$/);
  if (!match) {
    return null;
  }

  const minutesPart = parseInt(match[1], 10);
  const secondsPart = parseInt(match[2], 10);
  if (!Number.isFinite(minutesPart) || !Number.isFinite(secondsPart)) {
    return null;
  }

  const safeMinutes = Math.min(MAX_MINUTES, Math.max(0, minutesPart));
  const totalSeconds = safeMinutes * 60 + secondsPart;
  return Math.min(MAX_MINUTES * 60, Math.max(1, totalSeconds));
}

function formatPresetInputFromSeconds(totalSeconds) {
  const safeSeconds = Math.min(MAX_MINUTES * 60, Math.max(1, totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  if (seconds === 0) {
    return String(minutes);
  }

  return `${minutes}.${String(seconds).padStart(2, "0")}`;
}

function getProgressPercent(channel) {
  if (!channel.presetSeconds) {
    return 0;
  }

  const elapsed = channel.presetSeconds - channel.remainingSeconds;
  return Math.max(0, Math.min(100, Math.round((elapsed / channel.presetSeconds) * 100)));
}

function getCompletedElapsedSeconds(channel, nowMs) {
  if (channel.status !== "completed" || !channel.completedAtMs) {
    return 0;
  }

  return Math.max(0, Math.floor((nowMs - channel.completedAtMs) / 1000));
}

export default function Cronometros() {
  const [channels, setChannels] = useState(() => withCachedNames(INITIAL_CHANNELS));
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [editingNames, setEditingNames] = useState({});
  const [draftNames, setDraftNames] = useState({});
  const audioContextRef = useRef(null);
  const voicesReadyRef = useRef(false);
  const lastSavedNamesSignatureRef = useRef("");
  const channelsRef = useRef(channels);
  const alarmTimeoutsRef = useRef({});
  const speechQueueRef = useRef([]);
  const queuedSpeechIdsRef = useRef(new Set());
  const isSpeakingRef = useRef(false);
  const speakingChannelIdRef = useRef(null);

  const runningCount = useMemo(
    () => channels.filter((channel) => channel.status === "running").length,
    [channels]
  );
  const channelNamesSignature = useMemo(
    () => channels.map((channel) => `${channel.id}:${channel.name}`).join("|"),
    [channels]
  );
  const hasActiveTimers = useMemo(
    () =>
      channels.some(
        (channel) =>
          channel.status === "running" || channel.status === "paused" || channel.alertPending
      ),
    [channels]
  );

  useEffect(() => {
    channelsRef.current = channels;
  }, [channels]);

  const ensureAudioContext = useCallback(async () => {
    const BrowserAudioContext = window.AudioContext || window.webkitAudioContext;
    if (!BrowserAudioContext) {
      return null;
    }

    if (!audioContextRef.current) {
      audioContextRef.current = new BrowserAudioContext();
    }

    if (audioContextRef.current.state === "suspended") {
      try {
        await audioContextRef.current.resume();
      } catch (error) {
        return null;
      }
    }

    return audioContextRef.current;
  }, []);

  const playAlarm = useCallback(
    async (toneIndex) => {
      const context = await ensureAudioContext();
      if (!context) {
        return;
      }

      const tone = TONE_PRESETS[toneIndex % TONE_PRESETS.length];
      const now = context.currentTime;
      [0, 0.27, 0.54].forEach((offset, index) => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        oscillator.type = tone.wave;
        oscillator.frequency.value = index === 1 ? tone.accent : tone.base;
        gainNode.gain.setValueAtTime(0.0001, now + offset);
        gainNode.gain.exponentialRampToValueAtTime(0.22, now + offset + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.18);
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        oscillator.start(now + offset);
        oscillator.stop(now + offset + 0.2);
      });
    },
    [ensureAudioContext]
  );

  const processSpeechQueue = useCallback(() => {
    if (isSpeakingRef.current || !("speechSynthesis" in window)) {
      return;
    }

    const nextItem = speechQueueRef.current.shift();
    if (!nextItem) {
      return;
    }

    queuedSpeechIdsRef.current.delete(nextItem.channelId);
    isSpeakingRef.current = true;
    speakingChannelIdRef.current = nextItem.channelId;

    const utterance = new SpeechSynthesisUtterance(nextItem.message);
    utterance.lang = "pt-BR";
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const ptVoice =
      voices.find((voice) => voice.lang && voice.lang.toLowerCase().startsWith("pt-br")) ||
      voices.find((voice) => voice.lang && voice.lang.toLowerCase().startsWith("pt"));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    const releaseAndContinue = () => {
      isSpeakingRef.current = false;
      speakingChannelIdRef.current = null;
      processSpeechQueue();
    };

    utterance.onend = releaseAndContinue;
    utterance.onerror = releaseAndContinue;
    window.speechSynthesis.speak(utterance);
  }, []);

  const enqueueCompletionSpeech = useCallback(
    (channelId, channelName) => {
      if (!("speechSynthesis" in window) || typeof SpeechSynthesisUtterance === "undefined") {
        return;
      }

      if (speakingChannelIdRef.current === channelId || queuedSpeechIdsRef.current.has(channelId)) {
        return;
      }

      speechQueueRef.current.push({
        channelId,
        message: `${channelName} finalizou`,
      });
      queuedSpeechIdsRef.current.add(channelId);
      processSpeechQueue();
    },
    [processSpeechQueue]
  );

  const removeChannelSpeechFromQueue = useCallback((channelId) => {
    speechQueueRef.current = speechQueueRef.current.filter((item) => item.channelId !== channelId);
    queuedSpeechIdsRef.current.delete(channelId);
  }, []);

  useEffect(() => {
    if (!("speechSynthesis" in window) || voicesReadyRef.current) {
      return;
    }

    const hydrateVoices = () => {
      window.speechSynthesis.getVoices();
    };

    hydrateVoices();
    window.speechSynthesis.addEventListener("voiceschanged", hydrateVoices);
    voicesReadyRef.current = true;

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", hydrateVoices);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNowMs(Date.now());
      setChannels((prevChannels) =>
        prevChannels.map((channel) => {
          if (channel.status !== "running") {
            return channel;
          }

          if (channel.remainingSeconds <= 1) {
            return {
              ...channel,
              remainingSeconds: 0,
              status: "completed",
              alertPending: true,
              completedAtMs: Date.now(),
            };
          }

          return { ...channel, remainingSeconds: channel.remainingSeconds - 1 };
        })
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const clearAlarmLoop = useCallback((channelId) => {
    const timeoutId = alarmTimeoutsRef.current[channelId];
    if (timeoutId) {
      window.clearTimeout(timeoutId);
      delete alarmTimeoutsRef.current[channelId];
    }
  }, []);

  const triggerAlert = useCallback(
    (channel) => {
      void playAlarm(channel.toneIndex);
      enqueueCompletionSpeech(channel.id, channel.name);
    },
    [playAlarm, enqueueCompletionSpeech]
  );

  const startAlarmLoop = useCallback(
    (channelId) => {
      clearAlarmLoop(channelId);

      const tick = () => {
        const currentChannel = channelsRef.current.find((channel) => channel.id === channelId);
        if (!currentChannel || currentChannel.status !== "completed" || !currentChannel.alertPending) {
          clearAlarmLoop(channelId);
          return;
        }

        triggerAlert(currentChannel);
        alarmTimeoutsRef.current[channelId] = window.setTimeout(tick, 3500);
      };

      tick();
    },
    [clearAlarmLoop, triggerAlert]
  );

  useEffect(() => {
    channels.forEach((channel) => {
      const mustAlert = channel.status === "completed" && channel.alertPending;
      const hasLoop = Boolean(alarmTimeoutsRef.current[channel.id]);

      if (mustAlert && !hasLoop) {
        startAlarmLoop(channel.id);
      }

      if (!mustAlert && hasLoop) {
        clearAlarmLoop(channel.id);
      }
    });
  }, [channels, clearAlarmLoop, startAlarmLoop]);

  useEffect(
    () => () => {
      Object.values(alarmTimeoutsRef.current).forEach((timeoutId) => window.clearTimeout(timeoutId));
      alarmTimeoutsRef.current = {};
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      speechQueueRef.current = [];
      queuedSpeechIdsRef.current.clear();
      isSpeakingRef.current = false;
      speakingChannelIdRef.current = null;
    },
    []
  );

  useEffect(() => {
    if (channelNamesSignature === lastSavedNamesSignatureRef.current) {
      return;
    }

    try {
      const cachedNames = channels.reduce((accumulator, channel) => {
        accumulator[channel.id] = channel.name;
        return accumulator;
      }, {});
      window.localStorage.setItem(CHANNEL_NAMES_STORAGE_KEY, JSON.stringify(cachedNames));
      lastSavedNamesSignatureRef.current = channelNamesSignature;
    } catch (error) {
      // noop: localStorage indisponível neste ambiente
    }
  }, [channels, channelNamesSignature]);

  useEffect(() => {
    function handleBeforeUnload(event) {
      if (!hasActiveTimers) {
        return;
      }

      event.preventDefault();
      event.returnValue =
        "Existem cronômetros em execução ou pausados. Se sair agora, os tempos serão perdidos.";
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasActiveTimers]);

  function addChannel() {
    const nextId = channels.length === 0 ? 1 : Math.max(...channels.map((channel) => channel.id)) + 1;
    const toneIndex = (nextId - 1) % TONE_PRESETS.length;
    setChannels((prevChannels) => [
      ...prevChannels,
      createChannel(nextId, `Reação ${nextId}`, DEFAULT_PRESET_MINUTES, toneIndex),
    ]);
  }

  function changeChannelName(channelId, nextName) {
    setChannels((prevChannels) =>
      prevChannels.map((channel) => (channel.id === channelId ? { ...channel, name: nextName } : channel))
    );
  }

  function startEditChannelName(channel) {
    setEditingNames((prev) => ({ ...prev, [channel.id]: true }));
    setDraftNames((prev) => ({ ...prev, [channel.id]: channel.name }));
  }

  function cancelEditChannelName(channelId) {
    setEditingNames((prev) => ({ ...prev, [channelId]: false }));
    setDraftNames((prev) => ({ ...prev, [channelId]: "" }));
  }

  function saveChannelName(channel) {
    const nextName = String(draftNames[channel.id] ?? "").trim();
    changeChannelName(channel.id, nextName || channel.name);
    setEditingNames((prev) => ({ ...prev, [channel.id]: false }));
    setDraftNames((prev) => ({ ...prev, [channel.id]: "" }));
  }

  function startChannel(channelId) {
    void ensureAudioContext();
    setChannels((prevChannels) =>
      prevChannels.map((channel) => {
        if (channel.id !== channelId) {
          return channel;
        }

        if (channel.remainingSeconds === 0) {
          return {
            ...channel,
            remainingSeconds: channel.presetSeconds,
            status: "running",
            alertPending: false,
            completedAtMs: null,
          };
        }

        return { ...channel, status: "running", alertPending: false, completedAtMs: null };
      })
    );
  }

  function pauseChannel(channelId) {
    setChannels((prevChannels) =>
      prevChannels.map((channel) =>
        channel.id === channelId && channel.status === "running"
          ? { ...channel, status: "paused" }
          : channel
      )
    );
  }

  function stopChannel(channelId) {
    setChannels((prevChannels) =>
      prevChannels.map((channel) =>
        channel.id === channelId
          ? {
              ...channel,
              remainingSeconds: channel.presetSeconds,
              status: "idle",
              alertPending: false,
              completedAtMs: null,
            }
          : channel
      )
    );
  }

  function acknowledgeCompletion(channelId) {
    removeChannelSpeechFromQueue(channelId);
    setChannels((prevChannels) =>
      prevChannels.map((channel) =>
        channel.id === channelId ? { ...channel, alertPending: false, completedAtMs: null } : channel
      )
    );
  }

  function changePreset(channelId, nextMinutesValue) {
    const parsedPresetSeconds = parsePresetInputToSeconds(nextMinutesValue);

    setChannels((prevChannels) =>
      prevChannels.map((channel) => {
        if (channel.id !== channelId) {
          return channel;
        }

        const updatedChannel = {
          ...channel,
          presetInput: nextMinutesValue,
        };

        if (parsedPresetSeconds !== null) {
          updatedChannel.presetSeconds = parsedPresetSeconds;
          updatedChannel.presetMinutes = Math.floor(parsedPresetSeconds / 60);
          updatedChannel.completedAtMs = null;

          if (channel.status !== "running") {
            updatedChannel.remainingSeconds = parsedPresetSeconds;
            if (channel.status === "completed") {
              updatedChannel.status = "idle";
            }
          }
        }

        return updatedChannel;
      })
    );
  }

  function addQuickPreset(channelId, minutesToAdd) {
    const incrementSeconds = Math.max(1, minutesToAdd * 60);

    setChannels((prevChannels) =>
      prevChannels.map((channel) => {
        if (channel.id !== channelId) {
          return channel;
        }

        const nextPresetSeconds = Math.min(MAX_MINUTES * 60, channel.presetSeconds + incrementSeconds);
        const updatedChannel = {
          ...channel,
          presetInput: formatPresetInputFromSeconds(nextPresetSeconds),
          presetSeconds: nextPresetSeconds,
          presetMinutes: Math.floor(nextPresetSeconds / 60),
        };

        if (channel.status !== "running") {
          updatedChannel.remainingSeconds = nextPresetSeconds;
          updatedChannel.completedAtMs = null;
          if (channel.status === "completed") {
            updatedChannel.status = "idle";
          }
        }

        return updatedChannel;
      })
    );
  }

  function getStatusLabel(status) {
    if (status === "running") return "Rodando";
    if (status === "paused") return "Pausado";
    if (status === "completed") return "Finalizado";
    return "Pronto";
  }

  return (
    <Container>
      <Header>
        <HeaderBrand>
          <HeaderLogo src={`${process.env.PUBLIC_URL}/logo_analab_tools.png`} alt="LabSuite" />
          <HeaderTitle>Múltiplo Marcador de Tempo</HeaderTitle>
        </HeaderBrand>
        <TopActions>
          <AddButton type="button" onClick={addChannel}>
            + Novo contador
          </AddButton>
        </TopActions>
      </Header>

      <InfoBanner>
        Canais independentes com alerta sonoro automático ao finalizar. Em execução agora: {runningCount}
      </InfoBanner>

      <Grid>
        {channels.map((channel) => {
          const isAwaitingConfirmation = channel.status === "completed" && channel.alertPending;
          const disableStart = channel.status === "running" || isAwaitingConfirmation;
          const disablePause = channel.status !== "running" || isAwaitingConfirmation;
          const disableStop = channel.status === "idle" || isAwaitingConfirmation;
          const disableTest = isAwaitingConfirmation;

          return (
            <TimerCard key={channel.id} $status={channel.status}>
            <CardHeader>
              <CardTitle>{channel.name}</CardTitle>
              <ToneBadge>{TONE_PRESETS[channel.toneIndex % TONE_PRESETS.length].name}</ToneBadge>
            </CardHeader>

            {editingNames[channel.id] ? (
              <TitleEditorRow>
                <TitleEditor
                  type="text"
                  value={draftNames[channel.id] ?? channel.name}
                  onChange={(event) =>
                    setDraftNames((prev) => ({ ...prev, [channel.id]: event.target.value }))
                  }
                  placeholder="Nome da reação"
                  aria-label="Nome do contador"
                />
                <SaveNameButton type="button" onClick={() => saveChannelName(channel)}>
                  Salvar
                </SaveNameButton>
                <CancelNameButton type="button" onClick={() => cancelEditChannelName(channel.id)}>
                  Cancelar
                </CancelNameButton>
              </TitleEditorRow>
            ) : (
              <EditNameButton type="button" onClick={() => startEditChannelName(channel)}>
                Editar nome
              </EditNameButton>
            )}

            <TimeValue>{formatTime(channel.remainingSeconds)}</TimeValue>
            <ProgressTrack>
              <ProgressFill style={{ width: `${getProgressPercent(channel)}%` }} />
            </ProgressTrack>

            <PresetRow>
              <PresetLabel>Tempo programado: {formatTime(channel.presetSeconds)}</PresetLabel>
              <PresetControls>
                <span>tempo:</span>
                <PresetInput
                  type="text"
                  inputMode="decimal"
                  value={channel.presetInput}
                  onChange={(event) => changePreset(channel.id, event.target.value)}
                  placeholder="mm ou mm.ss"
                />
              </PresetControls>
            </PresetRow>
            <QuickPresets>
              {QUICK_PRESET_MINUTES.map((minutes) => (
                <QuickPresetButton
                  key={minutes}
                  type="button"
                  onClick={() => addQuickPreset(channel.id, minutes)}
                >
                  +{minutes} min
                </QuickPresetButton>
              ))}
            </QuickPresets>

            <Actions>
              <StartButton
                type="button"
                onClick={() => startChannel(channel.id)}
                disabled={disableStart}
              >
                Iniciar
              </StartButton>
              <PauseButton
                type="button"
                onClick={() => pauseChannel(channel.id)}
                disabled={disablePause}
              >
                Pausar
              </PauseButton>
              <StopButton type="button" onClick={() => stopChannel(channel.id)} disabled={disableStop}>
                Parar
              </StopButton>
              <TestButton
                type="button"
                onClick={() => playAlarm(channel.toneIndex)}
                disabled={disableTest}
              >
                Testar bip
              </TestButton>
            </Actions>

            <StatusText>Status: {getStatusLabel(channel.status)}</StatusText>
            {channel.status === "completed" && channel.completedAtMs ? (
              <StatusText>
                Finalizado há: {formatTime(getCompletedElapsedSeconds(channel, nowMs))}
              </StatusText>
            ) : null}
            {channel.status === "completed" && channel.alertPending ? (
              <AcknowledgeButton type="button" onClick={() => acknowledgeCompletion(channel.id)}>
                Confirmar finalização
              </AcknowledgeButton>
            ) : null}
            </TimerCard>
          );
        })}
      </Grid>
    </Container>
  );
}

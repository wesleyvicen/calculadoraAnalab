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
const CHANNELS_STATE_STORAGE_KEY = "analab_cronometros_channels_state_v1";

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
    runEndsAtMs: null,
    toneIndex,
  };
}

function normalizeChannelState(rawChannel, fallbackChannel, nowMs) {
  if (!rawChannel || typeof rawChannel !== "object") {
    return fallbackChannel;
  }

  const presetSeconds = Math.min(
    MAX_MINUTES * 60,
    Math.max(1, parseInt(rawChannel.presetSeconds, 10) || fallbackChannel.presetSeconds)
  );
  const normalizedStatus = ["idle", "running", "paused", "completed"].includes(rawChannel.status)
    ? rawChannel.status
    : "idle";
  const rawRemaining = parseInt(rawChannel.remainingSeconds, 10);
  const safeRemaining = Number.isFinite(rawRemaining)
    ? Math.min(MAX_MINUTES * 60, Math.max(0, rawRemaining))
    : presetSeconds;
  const rawToneIndex = parseInt(rawChannel.toneIndex, 10);
  const toneIndex = Number.isFinite(rawToneIndex) ? rawToneIndex : fallbackChannel.toneIndex;
  const name = String(rawChannel.name ?? fallbackChannel.name).trim() || fallbackChannel.name;
  const completedAtMs = Number.isFinite(rawChannel.completedAtMs) ? rawChannel.completedAtMs : null;
  const rawRunEndsAtMs = Number(rawChannel.runEndsAtMs);

  if (normalizedStatus === "running") {
    const runEndsAtMs = Number.isFinite(rawRunEndsAtMs)
      ? rawRunEndsAtMs
      : nowMs + safeRemaining * 1000;
    const millisecondsLeft = runEndsAtMs - nowMs;

    if (millisecondsLeft <= 0) {
      return {
        ...fallbackChannel,
        name,
        toneIndex,
        presetSeconds,
        presetMinutes: Math.floor(presetSeconds / 60),
        presetInput: formatPresetInputFromSeconds(presetSeconds),
        remainingSeconds: 0,
        status: "completed",
        alertPending: true,
        completedAtMs: completedAtMs ?? runEndsAtMs,
        runEndsAtMs: null,
      };
    }

    return {
      ...fallbackChannel,
      name,
      toneIndex,
      presetSeconds,
      presetMinutes: Math.floor(presetSeconds / 60),
      presetInput: formatPresetInputFromSeconds(presetSeconds),
      remainingSeconds: Math.ceil(millisecondsLeft / 1000),
      status: "running",
      alertPending: false,
      completedAtMs: null,
      runEndsAtMs,
    };
  }

  if (normalizedStatus === "completed") {
    return {
      ...fallbackChannel,
      name,
      toneIndex,
      presetSeconds,
      presetMinutes: Math.floor(presetSeconds / 60),
      presetInput: formatPresetInputFromSeconds(presetSeconds),
      remainingSeconds: 0,
      status: "completed",
      alertPending: Boolean(rawChannel.alertPending),
      completedAtMs: completedAtMs ?? nowMs,
      runEndsAtMs: null,
    };
  }

  return {
    ...fallbackChannel,
    name,
    toneIndex,
    presetSeconds,
    presetMinutes: Math.floor(presetSeconds / 60),
    presetInput: formatPresetInputFromSeconds(presetSeconds),
    remainingSeconds: safeRemaining || presetSeconds,
    status: normalizedStatus,
    alertPending: false,
    completedAtMs: null,
    runEndsAtMs: null,
  };
}

function buildInitialChannels() {
  const fallbackChannels = withCachedNames(INITIAL_CHANNELS);
  if (typeof window === "undefined") {
    return fallbackChannels;
  }

  try {
    const rawValue = window.localStorage.getItem(CHANNELS_STATE_STORAGE_KEY);
    if (!rawValue) {
      return fallbackChannels;
    }

    const parsedChannels = JSON.parse(rawValue);
    if (!Array.isArray(parsedChannels) || parsedChannels.length === 0) {
      return fallbackChannels;
    }

    const nowMs = Date.now();
    return parsedChannels
      .map((rawChannel) => {
        const rawId = parseInt(rawChannel?.id, 10);
        if (!Number.isFinite(rawId)) {
          return null;
        }

        const defaultName = `Reação ${rawId}`;
        const fallbackChannel =
          fallbackChannels.find((channel) => channel.id === rawId) ||
          createChannel(rawId, defaultName, DEFAULT_PRESET_MINUTES, (rawId - 1) % TONE_PRESETS.length);

        return normalizeChannelState(rawChannel, fallbackChannel, nowMs);
      })
      .filter(Boolean)
      .sort((left, right) => left.id - right.id);
  } catch (error) {
    return fallbackChannels;
  }
}

function syncRunningChannels(channels, nowMs) {
  let hasChanged = false;

  const nextChannels = channels.map((channel) => {
    if (channel.status !== "running") {
      return channel;
    }

    const runEndsAtMs =
      Number.isFinite(channel.runEndsAtMs) && channel.runEndsAtMs > 0
        ? channel.runEndsAtMs
        : nowMs + channel.remainingSeconds * 1000;
    const millisecondsLeft = runEndsAtMs - nowMs;

    if (millisecondsLeft <= 0) {
      hasChanged = true;
      return {
        ...channel,
        remainingSeconds: 0,
        status: "completed",
        alertPending: true,
        completedAtMs: runEndsAtMs,
        runEndsAtMs: null,
      };
    }

    const remainingSeconds = Math.ceil(millisecondsLeft / 1000);
    if (remainingSeconds !== channel.remainingSeconds || runEndsAtMs !== channel.runEndsAtMs) {
      hasChanged = true;
      return {
        ...channel,
        remainingSeconds,
        runEndsAtMs,
      };
    }

    return channel;
  });

  return hasChanged ? nextChannels : channels;
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
  const [channels, setChannels] = useState(() => buildInitialChannels());
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
  const notificationPermissionRequestedRef = useRef(false);
  const lastNotifiedCompletionRef = useRef({});

  const runningCount = useMemo(
    () => channels.filter((channel) => channel.status === "running").length,
    [channels]
  );
  const channelNamesSignature = useMemo(
    () => channels.map((channel) => `${channel.id}:${channel.name}`).join("|"),
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

  const ensureNotificationPermission = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission === "denied" || notificationPermissionRequestedRef.current) {
      return false;
    }

    notificationPermissionRequestedRef.current = true;

    try {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch (error) {
      return false;
    }
  }, []);

  const notifyCompletion = useCallback(async (channel) => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return;
    }

    const hasPermission =
      Notification.permission === "granted" || (await ensureNotificationPermission());
    if (!hasPermission) {
      return;
    }

    const title = "Cronômetro finalizado";
    const body = `${channel.name} chegou ao tempo final.`;
    const icon = `${process.env.PUBLIC_URL}/logo_analab_tools.png`;
    const tag = `cronometro-${channel.id}-${channel.completedAtMs ?? Date.now()}`;

    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.ready;
        if (registration?.showNotification) {
          await registration.showNotification(title, {
            body,
            icon,
            badge: icon,
            tag,
            renotify: false,
          });
          return;
        }
      } catch (error) {
        // fallback para Notification do contexto da página
      }
    }

    try {
      new Notification(title, { body, icon, tag });
    } catch (error) {
      // noop: navegador não permitiu exibir notificação
    }
  }, [ensureNotificationPermission]);

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
      const nextNowMs = Date.now();
      setNowMs(nextNowMs);
      setChannels((prevChannels) => syncRunningChannels(prevChannels, nextNowMs));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const syncNow = () => {
      const nextNowMs = Date.now();
      setNowMs(nextNowMs);
      setChannels((prevChannels) => syncRunningChannels(prevChannels, nextNowMs));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        syncNow();
      }
    };

    window.addEventListener("focus", syncNow);
    window.addEventListener("pageshow", syncNow);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", syncNow);
      window.removeEventListener("pageshow", syncNow);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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

  useEffect(() => {
    const completionMap = lastNotifiedCompletionRef.current;

    channels.forEach((channel) => {
      const mustNotify =
        channel.status === "completed" &&
        channel.alertPending &&
        Number.isFinite(channel.completedAtMs) &&
        channel.completedAtMs > 0;

      if (!mustNotify) {
        delete completionMap[channel.id];
        return;
      }

      if (completionMap[channel.id] === channel.completedAtMs) {
        return;
      }

      completionMap[channel.id] = channel.completedAtMs;
      void notifyCompletion(channel);
    });
  }, [channels, notifyCompletion]);

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
    try {
      window.localStorage.setItem(CHANNELS_STATE_STORAGE_KEY, JSON.stringify(channels));
    } catch (error) {
      // noop: localStorage indisponível neste ambiente
    }
  }, [channels]);

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
    void ensureNotificationPermission();
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
            runEndsAtMs: Date.now() + channel.presetSeconds * 1000,
          };
        }

        return {
          ...channel,
          status: "running",
          alertPending: false,
          completedAtMs: null,
          runEndsAtMs: Date.now() + channel.remainingSeconds * 1000,
        };
      })
    );
  }

  function pauseChannel(channelId) {
    const nowMs = Date.now();
    setChannels((prevChannels) =>
      prevChannels.map((channel) => {
        if (channel.id !== channelId || channel.status !== "running") {
          return channel;
        }

        const runEndsAtMs =
          Number.isFinite(channel.runEndsAtMs) && channel.runEndsAtMs > 0
            ? channel.runEndsAtMs
            : nowMs + channel.remainingSeconds * 1000;
        const remainingSeconds = Math.max(0, Math.ceil((runEndsAtMs - nowMs) / 1000));

        if (remainingSeconds <= 0) {
          return {
            ...channel,
            remainingSeconds: 0,
            status: "completed",
            alertPending: true,
            completedAtMs: runEndsAtMs,
            runEndsAtMs: null,
          };
        }

        return {
          ...channel,
          remainingSeconds,
          status: "paused",
          runEndsAtMs: null,
        };
      })
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
              runEndsAtMs: null,
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
          updatedChannel.runEndsAtMs = null;

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
          updatedChannel.runEndsAtMs = null;
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

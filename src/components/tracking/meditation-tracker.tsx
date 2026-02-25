"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface MeditationSession {
  id: string;
  date: string;
  duration: number; // in minutes
  type: "breathing" | "body-scan" | "mindfulness" | "guided" | "sleep";
  notes?: string;
}

interface MeditationTrackerProps {
  sessions: MeditationSession[];
  onStartSession: (session: Omit<MeditationSession, "id">) => void;
  onDeleteSession: (id: string) => void;
}

const MEDITATION_TYPES = {
  breathing: { label: "Oddechowa", icon: "🌬️", color: "bg-blue-100 text-blue-700" },
  "body-scan": { label: "Skan ciała", icon: "🧘", color: "bg-purple-100 text-purple-700" },
  mindfulness: { label: "Uważność", icon: "🧠", color: "bg-green-100 text-green-700" },
  guided: { label: "Prowadzona", icon: "🎧", color: "bg-amber-100 text-amber-700" },
  sleep: { label: "Na sen", icon: "🌙", color: "bg-indigo-100 text-indigo-700" },
};

const PRESET_DURATIONS = [3, 5, 10, 15, 20, 30];

export function MeditationTracker({ sessions, onStartSession, onDeleteSession }: MeditationTrackerProps) {
  const [showTimer, setShowTimer] = useState(false);
  const [selectedType, setSelectedType] = useState<MeditationSession["type"]>("breathing");
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate stats
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalSessions = sessions.length;

  // Calculate streak
  const calculateStreak = useCallback(() => {
    if (sessions.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const hasSession = sessions.some(
        (s) => new Date(s.date).toDateString() === checkDate.toDateString()
      );
      if (hasSession) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }, [sessions]);

  const streak = calculateStreak();

  // Timer logic
  useEffect(() => {
    if (isRunning && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            // Auto-save session
            onStartSession({
              date: new Date().toISOString(),
              duration: selectedDuration,
              type: selectedType,
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, timeLeft, selectedDuration, selectedType, onStartSession]);

  const startTimer = () => {
    setTimeLeft(selectedDuration * 60);
    setIsRunning(true);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const stopTimer = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(0);
    setShowTimer(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = isRunning ? ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-zinc-200 p-4 text-center">
          <p className="text-sm text-zinc-500">Sesje</p>
          <p className="text-2xl font-bold text-zinc-900">{totalSessions}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 text-center">
          <p className="text-sm text-zinc-500">Minuty</p>
          <p className="text-2xl font-bold text-zinc-900">{totalMinutes}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 text-center">
          <p className="text-sm text-zinc-500">Seria</p>
          <p className="text-2xl font-bold text-zinc-900">{streak} dni</p>
        </div>
      </div>

      {/* Timer / Start Card */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
        {isRunning ? (
          <div className="text-center">
            <p className="text-sm opacity-80 mb-2">
              {MEDITATION_TYPES[selectedType].label}
            </p>
            <p className="text-5xl font-bold mb-4">{formatTime(timeLeft)}</p>

            {/* Progress ring */}
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="white"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${(progress / 100) * 352} 352`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl">{MEDITATION_TYPES[selectedType].icon}</span>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={togglePause}
                className="px-6 py-3 bg-white/20 rounded-xl font-medium hover:bg-white/30 transition-colors"
              >
                {isPaused ? "Wznów" : "Pauza"}
              </button>
              <button
                onClick={stopTimer}
                className="px-6 py-3 bg-white/20 rounded-xl font-medium hover:bg-white/30 transition-colors"
              >
                Zakończ
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-lg font-medium mb-4">Rozpocznij medytację</p>

            {/* Type Selection */}
            <div className="flex justify-center gap-2 mb-4 flex-wrap">
              {(Object.keys(MEDITATION_TYPES) as MeditationSession["type"][]).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === type
                      ? "bg-white text-purple-600"
                      : "bg-white/20 hover:bg-white/30"
                  }`}
                >
                  {MEDITATION_TYPES[type].icon} {MEDITATION_TYPES[type].label}
                </button>
              ))}
            </div>

            {/* Duration Selection */}
            <div className="flex justify-center gap-2 mb-6">
              {PRESET_DURATIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDuration(d)}
                  className={`w-12 h-12 rounded-xl font-medium transition-colors ${
                    selectedDuration === d
                      ? "bg-white text-purple-600"
                      : "bg-white/20 hover:bg-white/30"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowTimer(true)}
              className="w-full py-4 bg-white text-purple-600 rounded-xl font-semibold hover:bg-white/90 transition-colors"
            >
              Rozpocznij {selectedDuration} min medytację
            </button>
          </div>
        )}
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="p-4 border-b border-zinc-100">
          <h3 className="font-semibold text-zinc-900">Ostatnie sesje</h3>
        </div>
        <div className="divide-y divide-zinc-50 max-h-64 overflow-y-auto">
          {sessions.length === 0 ? (
            <div className="p-6 text-center text-zinc-500">
              <p className="text-4xl mb-2">🧘</p>
              <p>Brak zapisanych sesji</p>
              <p className="text-sm text-zinc-400">Rozpocznij pierwszą medytację</p>
            </div>
          ) : (
            sessions.slice(0, 10).map((session) => (
              <div key={session.id} className="p-4 flex items-center justify-between hover:bg-zinc-50">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${MEDITATION_TYPES[session.type].color} flex items-center justify-center`}>
                    <span className="text-lg">{MEDITATION_TYPES[session.type].icon}</span>
                  </div>
                  <div>
                    <p className="font-medium text-zinc-900">
                      {MEDITATION_TYPES[session.type].label}
                    </p>
                    <p className="text-sm text-zinc-500">
                      {session.duration} min • {new Date(session.date).toLocaleDateString("pl-PL", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    {session.notes && (
                      <p className="text-xs text-zinc-400 mt-1">{session.notes}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => onDeleteSession(session.id)}
                  className="p-1.5 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">💡</span>
          </div>
          <div>
            <p className="font-medium text-zinc-900">Wskazówka</p>
            <p className="text-sm text-zinc-600 mt-1">
              Regularna medytacja, nawet 5 minut dziennie, może znacząco poprawić koncentrację
              i zmniejszyć poziom stresu. Znajdź spokojne miejsce i stałą porę dnia.
            </p>
          </div>
        </div>
      </div>

      {/* Timer Setup Modal */}
      {showTimer && !isRunning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-zinc-900 mb-4 text-center">
              Przygotuj się
            </h3>

            <div className="text-center mb-6">
              <p className="text-4xl mb-2">{MEDITATION_TYPES[selectedType].icon}</p>
              <p className="font-medium text-zinc-900">{MEDITATION_TYPES[selectedType].label}</p>
              <p className="text-2xl font-bold text-zinc-900 mt-2">{selectedDuration} minut</p>
            </div>

            <p className="text-center text-zinc-500 mb-6">
              Znajdź wygodną pozycję, zamknij oczy i skup się na oddechu.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowTimer(false)}
                className="flex-1 py-3 border border-zinc-200 rounded-xl text-zinc-600 font-medium hover:bg-zinc-50 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={startTimer}
                className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
              >
                Rozpocznij
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

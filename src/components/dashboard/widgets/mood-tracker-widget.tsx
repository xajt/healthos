"use client";

interface MoodEntry {
  id: string;
  date: string;
  mood: 1 | 2 | 3 | 4 | 5;
  note?: string;
}

interface MoodTrackerWidgetProps {
  entries: MoodEntry[];
}

const moodEmojis = {
  1: "😢",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😄",
};

export function MoodTrackerWidget({ entries }: MoodTrackerWidgetProps) {
  const avgMood = entries.length > 0
    ? (entries.reduce((sum, e) => sum + e.mood, 0) / entries.length).toFixed(1)
    : null;

  return (
    <div className="space-y-4">
      {avgMood && (
        <div className="text-center py-4">
          <span className="text-4xl">{moodEmojis[Math.round(parseFloat(avgMood)) as keyof typeof moodEmojis]}</span>
          <p className="text-2xl font-bold text-zinc-900 mt-2">{avgMood}</p>
          <p className="text-sm text-zinc-500">Średnia z {entries.length} dni</p>
        </div>
      )}

      <div className="space-y-2">
        {entries.slice(0, 5).map((entry) => (
          <div
            key={entry.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            <span className="text-2xl">{moodEmojis[entry.mood]}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-900">{entry.date}</p>
              {entry.note && (
                <p className="text-xs text-zinc-500 truncate">{entry.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-8 text-zinc-500">
          <p>Brak danych o nastroju</p>
          <p className="text-sm mt-1">Zacznij śledzić swój nastrój</p>
        </div>
      )}
    </div>
  );
}

// Demo data
export const demoMoodEntries: MoodEntry[] = [
  { id: "1", date: "Dzisiaj", mood: 4, note: "Dobry dzień!" },
  { id: "2", date: "Wczoraj", mood: 3 },
  { id: "3", date: "23.02", mood: 5, note: "Świetny trening" },
  { id: "4", date: "22.02", mood: 4 },
  { id: "5", date: "21.02", mood: 3, note: "Trochę zmęczony" },
];

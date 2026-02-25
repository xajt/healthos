"use client";

import { useState } from "react";

interface Insight {
  id: string;
  type: "tip" | "alert" | "recommendation" | "achievement";
  title: string;
  content: string;
  actionLabel?: string;
  actionUrl?: string;
  createdAt: string;
  isRead: boolean;
}

interface AiInsightsFeedProps {
  insights: Insight[];
  onDismiss?: (id: string) => void;
}

const insightIcons = {
  tip: "💡",
  alert: "⚠️",
  recommendation: "📊",
  achievement: "🏆",
};

const insightColors = {
  tip: "bg-amber-50 border-amber-200",
  alert: "bg-red-50 border-red-200",
  recommendation: "bg-blue-50 border-blue-200",
  achievement: "bg-green-50 border-green-200",
};

export function AiInsightsFeed({ insights, onDismiss }: AiInsightsFeedProps) {
  const [localInsights, setLocalInsights] = useState(insights);

  const handleDismiss = (id: string) => {
    setLocalInsights((prev) => prev.filter((i) => i.id !== id));
    onDismiss?.(id);
  };

  if (localInsights.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <h3 className="text-lg font-semibold text-zinc-900 mb-4">AI Insights</h3>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <p className="text-zinc-500">Brak nowych insights</p>
          <p className="text-sm text-zinc-400 mt-1">
            Dodaj więcej danych, aby otrzymać spersonalizowane rekomendacje
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-zinc-900">AI Insights</h3>
        <span className="text-sm text-zinc-500">{localInsights.length} nowych</span>
      </div>

      <div className="space-y-3">
        {localInsights.map((insight) => (
          <div
            key={insight.id}
            className={`relative p-4 rounded-xl border ${insightColors[insight.type]} transition-all`}
          >
            <button
              onClick={() => handleDismiss(insight.id)}
              className="absolute top-3 right-3 text-zinc-400 hover:text-zinc-600 transition-colors"
              aria-label="Zamknij"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-start gap-3">
              <span className="text-2xl" role="img" aria-label={insight.type}>
                {insightIcons[insight.type]}
              </span>
              <div className="flex-1 pr-6">
                <h4 className="font-medium text-zinc-900">{insight.title}</h4>
                <p className="text-sm text-zinc-600 mt-1">{insight.content}</p>
                {insight.actionLabel && insight.actionUrl && (
                  <a
                    href={insight.actionUrl}
                    className="inline-block mt-3 text-sm font-medium text-zinc-900 hover:underline"
                  >
                    {insight.actionLabel} →
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Demo insights for development
export const demoInsights: Insight[] = [
  {
    id: "1",
    type: "tip",
    title: "Zwiększ spożycie białka",
    content: "Zauważyłem, że wczoraj spożyłeś tylko 80g białka. Spróbuj dodać więcej źródeł białka do posiłków, np. jajka, kurczak lub strączki.",
    actionLabel: "Zobacz przepisy białkowe",
    actionUrl: "/dashboard/nutrition?filter=high-protein",
    createdAt: new Date().toISOString(),
    isRead: false,
  },
  {
    id: "2",
    type: "alert",
    title: "Niskie nawodnienie",
    content: "Wczoraj wypiłeś tylko 1.2L wody. To poniżej Twojego celu 2L. Dobre nawodnienie jest kluczowe dla regeneracji i wydolności.",
    actionLabel: "Dodaj wodę",
    actionUrl: "/dashboard/nutrition?action=add-water",
    createdAt: new Date().toISOString(),
    isRead: false,
  },
  {
    id: "3",
    type: "recommendation",
    title: "Optymalny czas treningu",
    content: "Na podstawie Twoich danych o śnie, najlepszy czas na trening to 17:00-19:00. Wtedy Twój poziom energii jest najwyższy.",
    createdAt: new Date().toISOString(),
    isRead: false,
  },
];

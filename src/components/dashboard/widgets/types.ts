export type WidgetType =
  | "weight-trend"
  | "mood-tracker"
  | "sleep-quality"
  | "calorie-history"
  | "activity-summary"
  | "supplement-checklist";

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  size: "small" | "medium" | "large";
}

export interface WidgetConfig {
  type: WidgetType;
  title: string;
  description: string;
  defaultSize: "small" | "medium" | "large";
  icon: string;
}

export const WIDGET_CONFIGS: Record<WidgetType, WidgetConfig> = {
  "weight-trend": {
    type: "weight-trend",
    title: "Trend wagi",
    description: "Wykres wagi ostatnie 30 dni",
    defaultSize: "medium",
    icon: "⚖️",
  },
  "mood-tracker": {
    type: "mood-tracker",
    title: "Nastrój",
    description: "Ostatnie mood check-ins",
    defaultSize: "small",
    icon: "😊",
  },
  "sleep-quality": {
    type: "sleep-quality",
    title: "Jakość snu",
    description: "Średnia jakość snu",
    defaultSize: "small",
    icon: "😴",
  },
  "calorie-history": {
    type: "calorie-history",
    title: "Historia kalorii",
    description: "Wykres kalorii ostatnie 7 dni",
    defaultSize: "medium",
    icon: "📊",
  },
  "activity-summary": {
    type: "activity-summary",
    title: "Aktywność",
    description: "Kroki, dystans, active minutes",
    defaultSize: "medium",
    icon: "🏃",
  },
  "supplement-checklist": {
    type: "supplement-checklist",
    title: "Suplementy",
    description: "Dzisiejsze suplementy",
    defaultSize: "small",
    icon: "💊",
  },
};

export const DEFAULT_WIDGETS: Widget[] = [
  { id: "weight-1", type: "weight-trend", title: "Trend wagi", size: "medium" },
  { id: "calorie-1", type: "calorie-history", title: "Historia kalorii", size: "medium" },
  { id: "mood-1", type: "mood-tracker", title: "Nastrój", size: "small" },
];

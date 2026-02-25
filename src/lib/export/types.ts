// Data types for export
export interface WeightEntry {
  date: string;
  weight: number;
  notes?: string;
}

export interface NutritionEntry {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WaterEntry {
  date: string;
  amount: number; // ml
}

export interface SleepEntry {
  date: string;
  duration: number; // hours
  quality: number; // 1-5
  bedTime: string;
  wakeTime: string;
}

export interface MoodEntry {
  date: string;
  mood: number; // 1-5
  energy: number; // 1-5
  stress: number; // 1-5
  notes?: string;
}

export interface BloodTestResult {
  date: string;
  name: string;
  value: number;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  status: "low" | "normal" | "high";
}

export interface SupplementLog {
  date: string;
  name: string;
  taken: boolean;
}

export interface WorkoutSession {
  date: string;
  name: string;
  type: string;
  duration: number; // minutes
  caloriesBurned?: number;
}

export interface HealthDataExport {
  dateRange: {
    start: string;
    end: string;
  };
  generatedAt: string;
  profile?: {
    name?: string;
    age?: number;
    gender?: string;
  };
  weight?: WeightEntry[];
  nutrition?: NutritionEntry[];
  water?: WaterEntry[];
  sleep?: SleepEntry[];
  mood?: MoodEntry[];
  bloodTests?: BloodTestResult[];
  supplements?: SupplementLog[];
  workouts?: WorkoutSession[];
}

// CSV export helpers
export function toCSV(data: Record<string, unknown>[], headers: string[]): string {
  const csvRows = [];

  // Header row
  csvRows.push(headers.join(","));

  // Data rows
  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      if (value === null || value === undefined) return "";
      if (typeof value === "string" && value.includes(",")) {
        return `"${value}"`;
      }
      return String(value);
    });
    csvRows.push(values.join(","));
  }

  return csvRows.join("\n");
}

export function downloadCSV(csvContent: string, filename: string) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// PDF generation (simple text-based for demo)
export function generatePDFReport(data: HealthDataExport): string {
  const lines: string[] = [];

  lines.push("═══════════════════════════════════════════════════════════════");
  lines.push("                    RAPORT ZDROWOTNY");
  lines.push("                    HealthOS");
  lines.push("═══════════════════════════════════════════════════════════════");
  lines.push("");
  lines.push(`Data wygenerowania: ${new Date(data.generatedAt).toLocaleString("pl-PL")}`);
  lines.push(`Okres: ${new Date(data.dateRange.start).toLocaleDateString("pl-PL")} - ${new Date(data.dateRange.end).toLocaleDateString("pl-PL")}`);
  lines.push("");

  if (data.profile) {
    lines.push("┌─────────────────────────────────────────────────────────────┐");
    lines.push("│ PROFIL UŻYTKOWNIKA                                          │");
    lines.push("├─────────────────────────────────────────────────────────────┤");
    if (data.profile.name) lines.push(`│ Imię: ${data.profile.name.padEnd(50)}│`);
    if (data.profile.age) lines.push(`│ Wiek: ${String(data.profile.age).padEnd(49)}│`);
    if (data.profile.gender) lines.push(`│ Płeć: ${data.profile.gender.padEnd(49)}│`);
    lines.push("└─────────────────────────────────────────────────────────────┘");
    lines.push("");
  }

  if (data.weight && data.weight.length > 0) {
    lines.push("┌─────────────────────────────────────────────────────────────┐");
    lines.push("│ WAGA                                                         │");
    lines.push("├─────────────────────────────────────────────────────────────┤");
    const avgWeight = data.weight.reduce((sum, w) => sum + w.weight, 0) / data.weight.length;
    const latestWeight = data.weight[data.weight.length - 1]?.weight;
    lines.push(`│ Średnia waga: ${avgWeight.toFixed(1)} kg`.padEnd(62) + "│");
    lines.push(`│ Aktualna waga: ${latestWeight?.toFixed(1) || "-"} kg`.padEnd(61) + "│");
    lines.push(`│ Liczba pomiarów: ${data.weight.length}`.padEnd(58) + "│");
    lines.push("└─────────────────────────────────────────────────────────────┘");
    lines.push("");
  }

  if (data.nutrition && data.nutrition.length > 0) {
    lines.push("┌─────────────────────────────────────────────────────────────┐");
    lines.push("│ ODŻYWIANIE                                                   │");
    lines.push("├─────────────────────────────────────────────────────────────┤");
    const avgCalories = data.nutrition.reduce((sum, n) => sum + n.calories, 0) / data.nutrition.length;
    const avgProtein = data.nutrition.reduce((sum, n) => sum + n.protein, 0) / data.nutrition.length;
    const avgCarbs = data.nutrition.reduce((sum, n) => sum + n.carbs, 0) / data.nutrition.length;
    const avgFat = data.nutrition.reduce((sum, n) => sum + n.fat, 0) / data.nutrition.length;
    lines.push(`│ Średnie kalorie: ${Math.round(avgCalories)} kcal`.padEnd(57) + "│");
    lines.push(`│ Średnie makroskładniki:`.padEnd(62) + "│");
    lines.push(`│   Białko: ${avgProtein.toFixed(1)}g`.padEnd(60) + "│");
    lines.push(`│   Węglowodany: ${avgCarbs.toFixed(1)}g`.padEnd(56) + "│");
    lines.push(`│   Tłuszcze: ${avgFat.toFixed(1)}g`.padEnd(58) + "│");
    lines.push("└─────────────────────────────────────────────────────────────┘");
    lines.push("");
  }

  if (data.sleep && data.sleep.length > 0) {
    lines.push("┌─────────────────────────────────────────────────────────────┐");
    lines.push("│ SEN                                                          │");
    lines.push("├─────────────────────────────────────────────────────────────┤");
    const avgDuration = data.sleep.reduce((sum, s) => sum + s.duration, 0) / data.sleep.length;
    const avgQuality = data.sleep.reduce((sum, s) => sum + s.quality, 0) / data.sleep.length;
    lines.push(`│ Średni czas snu: ${avgDuration.toFixed(1)}h`.padEnd(56) + "│");
    lines.push(`│ Średnia jakość: ${avgQuality.toFixed(1)}/5`.padEnd(56) + "│");
    lines.push(`│ Liczba nocy: ${data.sleep.length}`.padEnd(58) + "│");
    lines.push("└─────────────────────────────────────────────────────────────┘");
    lines.push("");
  }

  if (data.mood && data.mood.length > 0) {
    lines.push("┌─────────────────────────────────────────────────────────────┐");
    lines.push("│ SAMOPOCZUCIE                                                 │");
    lines.push("├─────────────────────────────────────────────────────────────┤");
    const avgMood = data.mood.reduce((sum, m) => sum + m.mood, 0) / data.mood.length;
    const avgEnergy = data.mood.reduce((sum, m) => sum + m.energy, 0) / data.mood.length;
    const avgStress = data.mood.reduce((sum, m) => sum + m.stress, 0) / data.mood.length;
    lines.push(`│ Średni nastrój: ${avgMood.toFixed(1)}/5`.padEnd(56) + "│");
    lines.push(`│ Średnia energia: ${avgEnergy.toFixed(1)}/5`.padEnd(55) + "│");
    lines.push(`│ Średni stres: ${avgStress.toFixed(1)}/5`.padEnd(57) + "│");
    lines.push("└─────────────────────────────────────────────────────────────┘");
    lines.push("");
  }

  if (data.bloodTests && data.bloodTests.length > 0) {
    lines.push("┌─────────────────────────────────────────────────────────────┐");
    lines.push("│ BADANIA KRWI                                                 │");
    lines.push("├─────────────────────────────────────────────────────────────┤");
    const abnormal = data.bloodTests.filter((b) => b.status !== "normal");
    lines.push(`│ Liczba wyników: ${data.bloodTests.length}`.padEnd(56) + "│");
    lines.push(`│ Wyniki poza normą: ${abnormal.length}`.padEnd(53) + "│");
    if (abnormal.length > 0) {
      lines.push("├─────────────────────────────────────────────────────────────┤");
      lines.push("│ Nieprawidłowe wyniki:".padEnd(62) + "│");
      abnormal.forEach((result) => {
        const status = result.status === "high" ? "↑ WYSOKI" : "↓ NISKI";
        lines.push(`│   ${result.name}: ${result.value}${result.unit} ${status}`.substring(0, 62).padEnd(62) + "│");
      });
    }
    lines.push("└─────────────────────────────────────────────────────────────┘");
    lines.push("");
  }

  if (data.workouts && data.workouts.length > 0) {
    lines.push("┌─────────────────────────────────────────────────────────────┐");
    lines.push("│ AKTYWNOŚĆ FIZYCZNA                                           │");
    lines.push("├─────────────────────────────────────────────────────────────┤");
    const totalDuration = data.workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalCalories = data.workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);
    lines.push(`│ Liczba treningów: ${data.workouts.length}`.padEnd(54) + "│");
    lines.push(`│ Całkowity czas: ${Math.round(totalDuration / 60)}h ${totalDuration % 60}m`.padEnd(54) + "│");
    lines.push(`│ Spalone kalorie: ~${totalCalories} kcal`.padEnd(53) + "│");
    lines.push("└─────────────────────────────────────────────────────────────┘");
    lines.push("");
  }

  lines.push("═══════════════════════════════════════════════════════════════");
  lines.push("");
  lines.push("Ten raport został wygenerowany automatycznie przez HealthOS.");
  lines.push("Nie zastępuje on porady lekarskiej. W przypadku wątpliwości");
  lines.push("skonsultuj się z lekarzem.");
  lines.push("");

  return lines.join("\n");
}

export function downloadTextReport(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

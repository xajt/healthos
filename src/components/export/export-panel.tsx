"use client";

import { useState } from "react";
import {
  HealthDataExport,
  toCSV,
  downloadCSV,
  generatePDFReport,
  downloadTextReport,
} from "@/lib/export/types";

interface ExportPanelProps {
  data: HealthDataExport;
}

type ExportType = "all" | "weight" | "nutrition" | "sleep" | "mood" | "bloodTests" | "workouts";

const EXPORT_OPTIONS: { key: ExportType; label: string; icon: string }[] = [
  { key: "all", label: "Wszystkie dane", icon: "📊" },
  { key: "weight", label: "Waga", icon: "⚖️" },
  { key: "nutrition", label: "Odżywianie", icon: "🍎" },
  { key: "sleep", label: "Sen", icon: "😴" },
  { key: "mood", label: "Samopoczucie", icon: "😊" },
  { key: "bloodTests", label: "Badania krwi", icon: "🩸" },
  { key: "workouts", label: "Treningi", icon: "💪" },
];

export function ExportPanel({ data }: ExportPanelProps) {
  const [selectedType, setSelectedType] = useState<ExportType>("all");
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState("");

  const handleExportCSV = () => {
    let csvData: Record<string, unknown>[] = [];
    let filename = "healthos-export";
    let headers: string[] = [];

    switch (selectedType) {
      case "weight":
        if (data.weight) {
          headers = ["date", "weight", "notes"];
          csvData = data.weight.map((w) => ({
            date: new Date(w.date).toLocaleDateString("pl-PL"),
            weight: w.weight,
            notes: w.notes || "",
          }));
          filename = "healthos-weight";
        }
        break;

      case "nutrition":
        if (data.nutrition) {
          headers = ["date", "calories", "protein", "carbs", "fat"];
          csvData = data.nutrition.map((n) => ({
            date: new Date(n.date).toLocaleDateString("pl-PL"),
            calories: n.calories,
            protein: n.protein,
            carbs: n.carbs,
            fat: n.fat,
          }));
          filename = "healthos-nutrition";
        }
        break;

      case "sleep":
        if (data.sleep) {
          headers = ["date", "duration", "quality", "bedTime", "wakeTime"];
          csvData = data.sleep.map((s) => ({
            date: new Date(s.date).toLocaleDateString("pl-PL"),
            duration: s.duration,
            quality: s.quality,
            bedTime: s.bedTime,
            wakeTime: s.wakeTime,
          }));
          filename = "healthos-sleep";
        }
        break;

      case "mood":
        if (data.mood) {
          headers = ["date", "mood", "energy", "stress", "notes"];
          csvData = data.mood.map((m) => ({
            date: new Date(m.date).toLocaleDateString("pl-PL"),
            mood: m.mood,
            energy: m.energy,
            stress: m.stress,
            notes: m.notes || "",
          }));
          filename = "healthos-mood";
        }
        break;

      case "bloodTests":
        if (data.bloodTests) {
          headers = ["date", "name", "value", "unit", "referenceMin", "referenceMax", "status"];
          csvData = data.bloodTests.map((b) => ({
            date: new Date(b.date).toLocaleDateString("pl-PL"),
            name: b.name,
            value: b.value,
            unit: b.unit,
            referenceMin: b.referenceMin,
            referenceMax: b.referenceMax,
            status: b.status,
          }));
          filename = "healthos-blood-tests";
        }
        break;

      case "workouts":
        if (data.workouts) {
          headers = ["date", "name", "type", "duration", "caloriesBurned"];
          csvData = data.workouts.map((w) => ({
            date: new Date(w.date).toLocaleDateString("pl-PL"),
            name: w.name,
            type: w.type,
            duration: w.duration,
            caloriesBurned: w.caloriesBurned || "",
          }));
          filename = "healthos-workouts";
        }
        break;

      case "all":
      default:
        // Export all as separate CSVs combined
        const allLines: string[] = [];

        if (data.weight && data.weight.length > 0) {
          allLines.push("WEIGHT");
          allLines.push("date,weight,notes");
          data.weight.forEach((w) => {
            allLines.push(`${w.date},${w.weight},${w.notes || ""}`);
          });
          allLines.push("");
        }

        if (data.nutrition && data.nutrition.length > 0) {
          allLines.push("NUTRITION");
          allLines.push("date,calories,protein,carbs,fat");
          data.nutrition.forEach((n) => {
            allLines.push(`${n.date},${n.calories},${n.protein},${n.carbs},${n.fat}`);
          });
          allLines.push("");
        }

        if (data.sleep && data.sleep.length > 0) {
          allLines.push("SLEEP");
          allLines.push("date,duration,quality,bedTime,wakeTime");
          data.sleep.forEach((s) => {
            allLines.push(`${s.date},${s.duration},${s.quality},${s.bedTime},${s.wakeTime}`);
          });
          allLines.push("");
        }

        if (data.mood && data.mood.length > 0) {
          allLines.push("MOOD");
          allLines.push("date,mood,energy,stress,notes");
          data.mood.forEach((m) => {
            allLines.push(`${m.date},${m.mood},${m.energy},${m.stress},${m.notes || ""}`);
          });
          allLines.push("");
        }

        if (data.workouts && data.workouts.length > 0) {
          allLines.push("WORKOUTS");
          allLines.push("date,name,type,duration,caloriesBurned");
          data.workouts.forEach((w) => {
            allLines.push(`${w.date},${w.name},${w.type},${w.duration},${w.caloriesBurned || ""}`);
          });
        }

        downloadCSV(allLines.join("\n"), "healthos-all-data.csv");
        return;
    }

    if (csvData.length > 0) {
      const csv = toCSV(csvData, headers);
      downloadCSV(csv, `${filename}.csv`);
    }
  };

  const handleExportPDF = () => {
    const report = generatePDFReport(data);
    const filename = `healthos-report-${new Date().toISOString().split("T")[0]}.txt`;
    downloadTextReport(report, filename);
  };

  const handlePreview = () => {
    const report = generatePDFReport(data);
    setPreviewContent(report);
    setShowPreview(true);
  };

  const handleShareWithDoctor = () => {
    // Generate shareable link or email content
    const report = generatePDFReport(data);
    const subject = encodeURIComponent("Raport zdrowotny - HealthOS");
    const body = encodeURIComponent(`Dzień dobry,\n\nPrzesyłam mój raport zdrowotny wygenerowany w aplikacji HealthOS.\n\nOkres raportu: ${new Date(data.dateRange.start).toLocaleDateString("pl-PL")} - ${new Date(data.dateRange.end).toLocaleDateString("pl-PL")}\n\n${report}`);

    // Open email client
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const getDataCount = (type: ExportType): number => {
    switch (type) {
      case "weight":
        return data.weight?.length || 0;
      case "nutrition":
        return data.nutrition?.length || 0;
      case "sleep":
        return data.sleep?.length || 0;
      case "mood":
        return data.mood?.length || 0;
      case "bloodTests":
        return data.bloodTests?.length || 0;
      case "workouts":
        return data.workouts?.length || 0;
      case "all":
        return (
          (data.weight?.length || 0) +
          (data.nutrition?.length || 0) +
          (data.sleep?.length || 0) +
          (data.mood?.length || 0) +
          (data.bloodTests?.length || 0) +
          (data.workouts?.length || 0)
        );
      default:
        return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Type Selection */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4">
        <h3 className="font-semibold text-zinc-900 mb-4">Wybierz dane do eksportu</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {EXPORT_OPTIONS.map((option) => (
            <button
              key={option.key}
              onClick={() => setSelectedType(option.key)}
              className={`p-3 rounded-xl text-left transition-colors ${
                selectedType === option.key
                  ? "bg-zinc-900 text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
              }`}
            >
              <span className="text-xl">{option.icon}</span>
              <p className="font-medium mt-1">{option.label}</p>
              <p className="text-xs opacity-70">{getDataCount(option.key)} wpisów</p>
            </button>
          ))}
        </div>
      </div>

      {/* Date Range Display */}
      <div className="bg-zinc-50 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500">Okres eksportu</p>
            <p className="font-medium text-zinc-900">
              {new Date(data.dateRange.start).toLocaleDateString("pl-PL")} -{" "}
              {new Date(data.dateRange.end).toLocaleDateString("pl-PL")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-500">Wygenerowano</p>
            <p className="font-medium text-zinc-900">
              {new Date(data.generatedAt).toLocaleDateString("pl-PL")}
            </p>
          </div>
        </div>
      </div>

      {/* Export Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <button
          onClick={handleExportCSV}
          className="flex items-center justify-center gap-2 p-4 bg-white border border-zinc-200 rounded-xl hover:border-zinc-300 transition-colors"
        >
          <span className="text-2xl">📊</span>
          <div className="text-left">
            <p className="font-medium text-zinc-900">Eksportuj CSV</p>
            <p className="text-xs text-zinc-500">Dane w formacie tabeli</p>
          </div>
        </button>

        <button
          onClick={handleExportPDF}
          className="flex items-center justify-center gap-2 p-4 bg-white border border-zinc-200 rounded-xl hover:border-zinc-300 transition-colors"
        >
          <span className="text-2xl">📄</span>
          <div className="text-left">
            <p className="font-medium text-zinc-900">Pobierz raport</p>
            <p className="text-xs text-zinc-500">Podsumowanie tekstowe</p>
          </div>
        </button>

        <button
          onClick={handleShareWithDoctor}
          className="flex items-center justify-center gap-2 p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-colors"
        >
          <span className="text-2xl">👨‍⚕️</span>
          <div className="text-left">
            <p className="font-medium">Wyślij lekarzowi</p>
            <p className="text-xs opacity-80">Przez email</p>
          </div>
        </button>
      </div>

      {/* Preview Button */}
      <button
        onClick={handlePreview}
        className="w-full py-3 border border-zinc-200 rounded-xl text-zinc-600 font-medium hover:bg-zinc-50 transition-colors"
      >
        👁️ Podgląd raportu
      </button>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900">Podgląd raportu</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-zinc-100 rounded-full"
              >
                <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <pre className="text-xs font-mono text-zinc-700 whitespace-pre-wrap">{previewContent}</pre>
            </div>
            <div className="p-4 border-t border-zinc-100 flex gap-2">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 py-3 border border-zinc-200 rounded-xl text-zinc-600 font-medium hover:bg-zinc-50 transition-colors"
              >
                Zamknij
              </button>
              <button
                onClick={() => {
                  handleExportPDF();
                  setShowPreview(false);
                }}
                className="flex-1 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
              >
                Pobierz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

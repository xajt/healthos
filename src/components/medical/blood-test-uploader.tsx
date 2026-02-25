"use client";

import { useState, useCallback } from "react";

interface BloodTestResult {
  id: string;
  name: string;
  value: number;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  status: "low" | "normal" | "high";
}

interface BloodTestUpload {
  id: string;
  date: string;
  labName?: string;
  results: BloodTestResult[];
  notes?: string;
  imageUrl?: string;
}

interface BloodTestUploaderProps {
  onUpload: (test: Omit<BloodTestUpload, "id">) => void;
  onClose?: () => void;
}

// Common blood test markers with reference ranges
const BLOOD_MARKERS = {
  hemoglobin: { name: "Hemoglobina", unit: "g/dL", min: 12, max: 16 },
  hematocrit: { name: "Hematokryt", unit: "%", min: 36, max: 48 },
  rbc: { name: "Erytrocyty", unit: "T/L", min: 4.0, max: 5.5 },
  wbc: { name: "Leukocyty", unit: "G/L", min: 4.0, max: 10.0 },
  platelets: { name: "Płytki krwi", unit: "G/L", min: 150, max: 400 },
  glucose: { name: "Glukoza", unit: "mg/dL", min: 70, max: 100 },
  cholesterol_total: { name: "Cholesterol całkowity", unit: "mg/dL", min: 0, max: 200 },
  cholesterol_hdl: { name: "HDL", unit: "mg/dL", min: 40, max: 100 },
  cholesterol_ldl: { name: "LDL", unit: "mg/dL", min: 0, max: 100 },
  triglycerides: { name: "Trójglicerydy", unit: "mg/dL", min: 0, max: 150 },
  creatinine: { name: "Kreatynina", unit: "mg/dL", min: 0.7, max: 1.3 },
  egfr: { name: "eGFR", unit: "mL/min", min: 90, max: 200 },
  alt: { name: "ALT", unit: "U/L", min: 0, max: 40 },
  ast: { name: "AST", unit: "U/L", min: 0, max: 40 },
  tsh: { name: "TSH", unit: "mIU/L", min: 0.4, max: 4.0 },
  ft4: { name: "FT4", unit: "pmol/L", min: 12, max: 22 },
  vitamin_d: { name: "Witamina D", unit: "ng/mL", min: 30, max: 100 },
  b12: { name: "Witamina B12", unit: "pg/mL", min: 200, max: 900 },
  iron: { name: "Żelazo", unit: "µg/dL", min: 60, max: 170 },
  ferritin: { name: "Ferrytyna", unit: "ng/mL", min: 15, max: 200 },
} as const;

type MarkerKey = keyof typeof BLOOD_MARKERS;

export function BloodTestUploader({ onUpload, onClose }: BloodTestUploaderProps) {
  const [step, setStep] = useState<"upload" | "results" | "review">("upload");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [labName, setLabName] = useState("");
  const [testDate, setTestDate] = useState(new Date().toISOString().split("T")[0]);
  const [results, setResults] = useState<BloodTestResult[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<MarkerKey>("hemoglobin");
  const [markerValue, setMarkerValue] = useState("");

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const addResult = () => {
    const value = parseFloat(markerValue);
    if (isNaN(value)) return;

    const marker = BLOOD_MARKERS[selectedMarker];
    const status: BloodTestResult["status"] =
      value < marker.min ? "low" : value > marker.max ? "high" : "normal";

    // Check if marker already exists
    const existingIndex = results.findIndex((r) => r.name === marker.name);
    if (existingIndex >= 0) {
      const updated = [...results];
      updated[existingIndex] = {
        id: `${selectedMarker}-${Date.now()}`,
        name: marker.name,
        value,
        unit: marker.unit,
        referenceMin: marker.min,
        referenceMax: marker.max,
        status,
      };
      setResults(updated);
    } else {
      setResults((prev) => [
        ...prev,
        {
          id: `${selectedMarker}-${Date.now()}`,
          name: marker.name,
          value,
          unit: marker.unit,
          referenceMin: marker.min,
          referenceMax: marker.max,
          status,
        },
      ]);
    }

    setMarkerValue("");
  };

  const removeResult = (id: string) => {
    setResults((prev) => prev.filter((r) => r.id !== id));
  };

  const handleSubmit = () => {
    onUpload({
      date: new Date(testDate).toISOString(),
      labName: labName || undefined,
      results,
      imageUrl: imagePreview || undefined,
    });
  };

  const getStatusColor = (status: BloodTestResult["status"]) => {
    switch (status) {
      case "low":
        return "text-blue-600 bg-blue-50";
      case "high":
        return "text-red-600 bg-red-50";
      default:
        return "text-green-600 bg-green-50";
    }
  };

  const getStatusLabel = (status: BloodTestResult["status"]) => {
    switch (status) {
      case "low":
        return "Nisko";
      case "high":
        return "Wysoko";
      default:
        return "Norma";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900">
            {step === "upload" && "Dodaj wyniki badań"}
            {step === "results" && "Wprowadź wyniki"}
            {step === "review" && "Podsumowanie"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {step === "upload" && (
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Zdjęcie wyników (opcjonalnie)
                </label>
                <div className="border-2 border-dashed border-zinc-200 rounded-xl p-6 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <button
                        onClick={() => setImagePreview(null)}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow"
                      >
                        <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="blood-test-image"
                      />
                      <label
                        htmlFor="blood-test-image"
                        className="cursor-pointer"
                      >
                        <div className="text-4xl mb-2">📸</div>
                        <p className="text-sm text-zinc-600">Kliknij aby dodać zdjęcie</p>
                        <p className="text-xs text-zinc-400 mt-1">lub pomiń ten krok</p>
                      </label>
                    </>
                  )}
                </div>
              </div>

              {/* Lab Name */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Nazwa laboratorium (opcjonalnie)
                </label>
                <input
                  type="text"
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  placeholder="np. Synevo, Diagnostyka"
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>

              {/* Test Date */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Data badania
                </label>
                <input
                  type="date"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {step === "results" && (
            <div className="space-y-4">
              {/* Add Result */}
              <div className="bg-zinc-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-zinc-700 mb-2">
                  Dodaj wynik
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={selectedMarker}
                    onChange={(e) => setSelectedMarker(e.target.value as MarkerKey)}
                    className="px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-transparent text-sm"
                  >
                    {Object.entries(BLOOD_MARKERS).map(([key, marker]) => (
                      <option key={key} value={key}>
                        {marker.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    step="0.01"
                    value={markerValue}
                    onChange={(e) => setMarkerValue(e.target.value)}
                    placeholder="Wartość"
                    className="px-3 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={addResult}
                    disabled={!markerValue}
                    className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  >
                    Dodaj
                  </button>
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Norma: {BLOOD_MARKERS[selectedMarker].min} - {BLOOD_MARKERS[selectedMarker].max} {BLOOD_MARKERS[selectedMarker].unit}
                </p>
              </div>

              {/* Results List */}
              <div className="space-y-2">
                {results.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500">
                    <p className="text-4xl mb-2">🩸</p>
                    <p>Brak dodanych wyników</p>
                  </div>
                ) : (
                  results.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-3 bg-white border border-zinc-200 rounded-xl"
                    >
                      <div>
                        <p className="font-medium text-zinc-900">{result.name}</p>
                        <p className="text-sm text-zinc-500">
                          {result.value} {result.unit}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(result.status)}`}>
                          {getStatusLabel(result.status)}
                        </span>
                        <button
                          onClick={() => removeResult(result.id)}
                          className="p-1 hover:bg-red-50 rounded text-zinc-400 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-4">
              {/* Summary */}
              <div className="bg-zinc-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-500">Data badania</p>
                    <p className="font-medium text-zinc-900">
                      {new Date(testDate).toLocaleDateString("pl-PL")}
                    </p>
                  </div>
                  {labName && (
                    <div>
                      <p className="text-zinc-500">Laboratorium</p>
                      <p className="font-medium text-zinc-900">{labName}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-zinc-500">Liczba wyników</p>
                    <p className="font-medium text-zinc-900">{results.length}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500">Poza normą</p>
                    <p className="font-medium text-zinc-900">
                      {results.filter((r) => r.status !== "normal").length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div>
                  <p className="text-sm font-medium text-zinc-700 mb-2">Załączone zdjęcie</p>
                  <img src={imagePreview} alt="Test" className="max-h-32 rounded-lg" />
                </div>
              )}

              {/* Results Summary */}
              <div>
                <p className="text-sm font-medium text-zinc-700 mb-2">Wyniki</p>
                <div className="space-y-1">
                  {results.map((result) => (
                    <div key={result.id} className="flex items-center justify-between text-sm">
                      <span className="text-zinc-600">{result.name}</span>
                      <span className={`font-medium ${
                        result.status === "normal" ? "text-green-600" :
                        result.status === "high" ? "text-red-600" : "text-blue-600"
                      }`}>
                        {result.value} {result.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-100 flex gap-2">
          {step !== "upload" && (
            <button
              onClick={() => setStep(step === "review" ? "results" : "upload")}
              className="flex-1 py-3 border border-zinc-200 rounded-xl text-zinc-600 font-medium hover:bg-zinc-50 transition-colors"
            >
              Wróć
            </button>
          )}
          {step === "upload" && (
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-zinc-200 rounded-xl text-zinc-600 font-medium hover:bg-zinc-50 transition-colors"
            >
              Anuluj
            </button>
          )}
          {step === "upload" && (
            <button
              onClick={() => setStep("results")}
              className="flex-1 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
            >
              Dalej
            </button>
          )}
          {step === "results" && (
            <button
              onClick={() => setStep("review")}
              disabled={results.length === 0}
              className="flex-1 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              Dalej
            </button>
          )}
          {step === "review" && (
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
            >
              Zapisz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

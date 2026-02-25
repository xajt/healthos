"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

interface BloodTestResult {
  id: string;
  name: string;
  value: number;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  status: "low" | "normal" | "high";
}

interface BloodTest {
  id: string;
  date: string;
  labName?: string;
  results: BloodTestResult[];
  notes?: string;
  imageUrl?: string;
}

interface BloodTestDashboardProps {
  tests: BloodTest[];
  onAddTest: (test: Omit<BloodTest, "id">) => void;
  onDeleteTest: (id: string) => void;
}

export function BloodTestDashboard({ tests, onAddTest, onDeleteTest }: BloodTestDashboardProps) {
  const [showUploader, setShowUploader] = useState(false);
  const [selectedTest, setSelectedTest] = useState<BloodTest | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);

  // Get all unique markers across all tests
  const allMarkers = [...new Set(tests.flatMap((t) => t.results.map((r) => r.name)))];

  // Get history for a specific marker
  const getMarkerHistory = (markerName: string) => {
    return tests
      .filter((t) => t.results.some((r) => r.name === markerName))
      .map((t) => {
        const result = t.results.find((r) => r.name === markerName)!;
        return {
          date: new Date(t.date).toLocaleDateString("pl-PL", { day: "numeric", month: "short" }),
          value: result.value,
          referenceMin: result.referenceMin,
          referenceMax: result.referenceMax,
          fullDate: t.date,
        };
      })
      .sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());
  };

  // Count abnormal results
  const abnormalCount = tests.reduce(
    (sum, t) => sum + t.results.filter((r) => r.status !== "normal").length,
    0
  );

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
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Badania</p>
          <p className="text-2xl font-bold text-zinc-900">{tests.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Parametrów</p>
          <p className="text-2xl font-bold text-zinc-900">{allMarkers.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Poza normą</p>
          <p className={`text-2xl font-bold ${abnormalCount > 0 ? "text-red-500" : "text-green-500"}`}>
            {abnormalCount}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-sm text-zinc-500">Ostatnie</p>
          <p className="text-lg font-bold text-zinc-900">
            {tests[0] ? new Date(tests[0].date).toLocaleDateString("pl-PL", { day: "numeric", month: "short" }) : "-"}
          </p>
        </div>
      </div>

      {/* Marker Trend Chart */}
      {allMarkers.length > 0 && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-zinc-900">Trend parametrów</h3>
            <select
              value={selectedMarker || allMarkers[0]}
              onChange={(e) => setSelectedMarker(e.target.value)}
              className="px-3 py-2 border border-zinc-200 rounded-lg text-sm"
            >
              {allMarkers.map((marker) => (
                <option key={marker} value={marker}>
                  {marker}
                </option>
              ))}
            </select>
          </div>

          {(() => {
            const history = getMarkerHistory(selectedMarker || allMarkers[0]);
            if (history.length < 2) {
              return (
                <div className="h-48 flex items-center justify-center text-zinc-500">
                  <p>Dodaj więcej badań aby zobaczyć trend</p>
                </div>
              );
            }

            const marker = history[0];
            return (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
                    <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#71717a"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      domain={[marker.referenceMin * 0.8, marker.referenceMax * 1.2]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#fff",
                        border: "1px solid #e4e4e7",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [`${value}`, "Wartość"]}
                    />
                    <ReferenceArea
                      y1={marker.referenceMin}
                      y2={marker.referenceMax}
                      fill="#22c55e"
                      fillOpacity={0.1}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#18181b"
                      strokeWidth={2}
                      dot={{ fill: "#18181b", strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            );
          })()}
        </div>
      )}

      {/* Recent Tests */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="font-semibold text-zinc-900">Badania</h3>
          <button
            onClick={() => setShowUploader(true)}
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            + Dodaj badanie
          </button>
        </div>

        {tests.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            <p className="text-4xl mb-2">🩸</p>
            <p>Brak zapisanych badań</p>
            <p className="text-sm text-zinc-400">Dodaj wyniki badań krwi</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {tests.map((test) => (
              <div key={test.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-zinc-900">
                      {new Date(test.date).toLocaleDateString("pl-PL", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    {test.labName && (
                      <p className="text-sm text-zinc-500">{test.labName}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedTest(selectedTest?.id === test.id ? null : test)}
                      className="text-sm text-zinc-500 hover:text-zinc-700"
                    >
                      {selectedTest?.id === test.id ? "Ukryj" : "Szczegóły"}
                    </button>
                    <button
                      onClick={() => onDeleteTest(test.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Quick Results Preview */}
                <div className="flex flex-wrap gap-2">
                  {test.results.slice(0, 5).map((result) => (
                    <span
                      key={result.id}
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(result.status)}`}
                    >
                      {result.name}: {result.value}
                    </span>
                  ))}
                  {test.results.length > 5 && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-zinc-100 text-zinc-600">
                      +{test.results.length - 5} więcej
                    </span>
                  )}
                </div>

                {/* Expanded Details */}
                {selectedTest?.id === test.id && (
                  <div className="mt-4 space-y-3">
                    {test.imageUrl && (
                      <div>
                        <p className="text-sm font-medium text-zinc-700 mb-2">Skan wyników</p>
                        <img src={test.imageUrl} alt="Test results" className="max-h-48 rounded-lg" />
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2">
                      {test.results.map((result) => (
                        <div
                          key={result.id}
                          className="p-3 bg-zinc-50 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-zinc-900">{result.name}</p>
                            <span className={`px-2 py-0.5 rounded text-xs ${getStatusColor(result.status)}`}>
                              {getStatusLabel(result.status)}
                            </span>
                          </div>
                          <p className="text-lg font-bold text-zinc-900">
                            {result.value} <span className="text-sm font-normal text-zinc-500">{result.unit}</span>
                          </p>
                          <p className="text-xs text-zinc-500">
                            Norma: {result.referenceMin} - {result.referenceMax}
                          </p>
                        </div>
                      ))}
                    </div>

                    {test.notes && (
                      <div className="p-3 bg-amber-50 rounded-lg">
                        <p className="text-sm text-amber-800">{test.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Insights */}
      {abnormalCount > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">⚠️</span>
            </div>
            <div>
              <p className="font-medium text-zinc-900">Uwaga</p>
              <p className="text-sm text-zinc-600 mt-1">
                Masz {abnormalCount} wyników poza normą. Skonsultuj się z lekarzem
                aby omówić wyniki badań.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Uploader Modal */}
      {showUploader && (
        <BloodTestUploader
          onUpload={(test) => {
            onAddTest(test);
            setShowUploader(false);
          }}
          onClose={() => setShowUploader(false)}
        />
      )}
    </div>
  );
}

// Import the uploader
import { BloodTestUploader } from "./blood-test-uploader";

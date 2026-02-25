"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

interface Document {
  id: string;
  name: string;
  category: "lab" | "prescription" | "imaging" | "vaccination" | "other";
  date: string;
  notes?: string;
  fileUrl?: string;
  fileName?: string;
}

const CATEGORY_CONFIG = {
  lab: { label: "Badania", icon: "🩸", color: "bg-red-100 text-red-700" },
  prescription: { label: "Recepty", icon: "💊", color: "bg-blue-100 text-blue-700" },
  imaging: { label: "Obrazowanie", icon: "📸", color: "bg-purple-100 text-purple-700" },
  vaccination: { label: "Szczepienia", icon: "💉", color: "bg-green-100 text-green-700" },
  other: { label: "Inne", icon: "📄", color: "bg-zinc-100 text-zinc-700" },
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([
    { id: "1", name: "Morfologia krwi - Luty 2026", category: "lab", date: "2026-02-15" },
    { id: "2", name: "Recepta na witaminy", category: "prescription", date: "2026-02-10" },
    { id: "3", name: "RTG klatki piersiowej", category: "imaging", date: "2026-01-20" },
    { id: "4", name: "Szczepionka przeciw grypie", category: "vaccination", date: "2025-10-15" },
    { id: "5", name: "Lipidogram", category: "lab", date: "2025-11-20" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newDoc, setNewDoc] = useState({
    name: "",
    category: "other" as Document["category"],
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const handleAddDocument = () => {
    if (!newDoc.name.trim()) return;

    const doc: Document = {
      id: `${Date.now()}`,
      name: newDoc.name,
      category: newDoc.category,
      date: newDoc.date,
      notes: newDoc.notes || undefined,
    };

    setDocuments((prev) => [doc, ...prev]);
    setNewDoc({ name: "", category: "other", date: new Date().toISOString().split("T")[0], notes: "" });
    setShowAddModal(false);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Group documents by category
  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<Document["category"], Document[]>);

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">Dokumenty medyczne</h1>
          <p className="text-zinc-500">Przechowuj i organizuj dokumentację medyczną</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
            const count = groupedDocuments[key as Document["category"]]?.length || 0;
            return (
              <div key={key} className="bg-white rounded-xl border border-zinc-200 p-4 text-center">
                <span className="text-2xl">{config.icon}</span>
                <p className="text-lg font-bold text-zinc-900 mt-1">{count}</p>
                <p className="text-xs text-zinc-500">{config.label}</p>
              </div>
            );
          })}
        </div>

        {/* Add Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            + Dodaj dokument
          </button>
        </div>

        {/* Documents List */}
        {documents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center">
            <p className="text-4xl mb-2">📁</p>
            <p className="text-zinc-500">Brak zapisanych dokumentów</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedDocuments).map(([category, docs]) => (
              <div key={category} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
                <div className={`px-4 py-3 ${CATEGORY_CONFIG[category as Document["category"]].color} flex items-center gap-2`}>
                  <span>{CATEGORY_CONFIG[category as Document["category"]].icon}</span>
                  <span className="font-medium">{CATEGORY_CONFIG[category as Document["category"]].label}</span>
                  <span className="text-sm opacity-70">({docs.length})</span>
                </div>
                <div className="divide-y divide-zinc-50">
                  {docs.map((doc) => (
                    <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-zinc-50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
                          <span className="text-lg">📄</span>
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900">{doc.name}</p>
                          <p className="text-sm text-zinc-500">
                            {new Date(doc.date).toLocaleDateString("pl-PL", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                          {doc.notes && (
                            <p className="text-xs text-zinc-400 mt-1">{doc.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Document Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6">
              <h3 className="text-lg font-semibold text-zinc-900 mb-4">Dodaj dokument</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Nazwa dokumentu
                  </label>
                  <input
                    type="text"
                    value={newDoc.name}
                    onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                    placeholder="np. Morfologia krwi"
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Kategoria
                  </label>
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value as Document["category"] })}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  >
                    {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.icon} {config.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Data
                  </label>
                  <input
                    type="date"
                    value={newDoc.date}
                    onChange={(e) => setNewDoc({ ...newDoc, date: e.target.value })}
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Notatki (opcjonalnie)
                  </label>
                  <input
                    type="text"
                    value={newDoc.notes}
                    onChange={(e) => setNewDoc({ ...newDoc, notes: e.target.value })}
                    placeholder="Dodatkowe informacje..."
                    className="w-full px-4 py-3 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3 border border-zinc-200 rounded-xl text-zinc-600 font-medium hover:bg-zinc-50 transition-colors"
                  >
                    Anuluj
                  </button>
                  <button
                    onClick={handleAddDocument}
                    disabled={!newDoc.name.trim()}
                    className="flex-1 py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  >
                    Dodaj
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

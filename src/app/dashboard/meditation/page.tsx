"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MeditationTracker } from "@/components/tracking/meditation-tracker";

interface MeditationSession {
  id: string;
  date: string;
  duration: number;
  type: "breathing" | "body-scan" | "mindfulness" | "guided" | "sleep";
  notes?: string;
}

// Demo data
const DEMO_SESSIONS: MeditationSession[] = [
  { id: "1", date: "2026-02-25T07:00:00Z", duration: 10, type: "breathing" },
  { id: "2", date: "2026-02-24T22:00:00Z", duration: 15, type: "sleep", notes: "Przed snem" },
  { id: "3", date: "2026-02-23T07:00:00Z", duration: 5, type: "mindfulness" },
  { id: "4", date: "2026-02-22T07:00:00Z", duration: 10, type: "breathing" },
  { id: "5", date: "2026-02-21T21:00:00Z", duration: 20, type: "body-scan" },
  { id: "6", date: "2026-02-20T07:00:00Z", duration: 5, type: "breathing" },
  { id: "7", date: "2026-02-19T07:00:00Z", duration: 10, type: "guided" },
];

export default function MeditationPage() {
  const [sessions, setSessions] = useState<MeditationSession[]>(DEMO_SESSIONS);

  const handleStartSession = (session: Omit<MeditationSession, "id">) => {
    const newSession: MeditationSession = {
      ...session,
      id: `${Date.now()}`,
    };
    setSessions((prev) => [newSession, ...prev]);
  };

  const handleDeleteSession = (id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">Medytacja</h1>
          <p className="text-zinc-500">Praktykuj uważność i redukuj stres</p>
        </div>

        <MeditationTracker
          sessions={sessions}
          onStartSession={handleStartSession}
          onDeleteSession={handleDeleteSession}
        />
      </div>
    </DashboardLayout>
  );
}

"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { WorkoutTracker } from "@/components/fitness";

interface Exercise {
  id: string;
  name: string;
  category: "strength" | "cardio" | "flexibility" | "balance";
  muscleGroup: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
}

interface WorkoutSession {
  id: string;
  date: string;
  name: string;
  type: "strength" | "cardio" | "hiit" | "yoga" | "other";
  duration: number;
  exercises: Exercise[];
  notes?: string;
  caloriesBurned?: number;
}

// Demo data
const DEMO_SESSIONS: WorkoutSession[] = [
  {
    id: "1",
    date: "2026-02-25T07:00:00Z",
    name: "Push Day - Klatka i Barki",
    type: "strength",
    duration: 60,
    caloriesBurned: 300,
    exercises: [
      { id: "1-1", name: "Wyciskanie sztangi", category: "strength", muscleGroup: "Klatka", sets: 4, reps: 8, weight: 80 },
      { id: "1-2", name: "Wyciskanie hantli", category: "strength", muscleGroup: "Klatka", sets: 3, reps: 10, weight: 30 },
      { id: "1-3", name: "Wyciskanie żołnierskie", category: "strength", muscleGroup: "Barki", sets: 4, reps: 8, weight: 50 },
    ],
  },
  {
    id: "2",
    date: "2026-02-23T18:00:00Z",
    name: "Cardio - Bieganie",
    type: "cardio",
    duration: 35,
    caloriesBurned: 350,
    exercises: [
      { id: "2-1", name: "Bieganie", category: "cardio", muscleGroup: "Całe ciało", duration: 30, distance: 5 },
    ],
  },
  {
    id: "3",
    date: "2026-02-22T07:00:00Z",
    name: "Pull Day - Plecy i Bicep",
    type: "strength",
    duration: 55,
    caloriesBurned: 280,
    exercises: [
      { id: "3-1", name: "Martwy ciąg", category: "strength", muscleGroup: "Plecy", sets: 4, reps: 6, weight: 100 },
      { id: "3-2", name: "Podciąganie", category: "strength", muscleGroup: "Plecy", sets: 4, reps: 8 },
      { id: "3-3", name: "Uginanie na biceps", category: "strength", muscleGroup: "Biceps", sets: 3, reps: 12, weight: 15 },
    ],
  },
  {
    id: "4",
    date: "2026-02-20T08:00:00Z",
    name: "Poranna joga",
    type: "yoga",
    duration: 30,
    caloriesBurned: 100,
    exercises: [
      { id: "4-1", name: "Pozycje jogi", category: "flexibility", muscleGroup: "Całe ciało", duration: 30 },
    ],
  },
];

export default function WorkoutsPage() {
  const [sessions, setSessions] = useState<WorkoutSession[]>(DEMO_SESSIONS);

  const handleStartWorkout = (session: Omit<WorkoutSession, "id">) => {
    const newSession: WorkoutSession = {
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
          <h1 className="text-2xl font-bold text-zinc-900">Treningi</h1>
          <p className="text-zinc-500">Planuj i śledź swoje sesje treningowe</p>
        </div>

        <WorkoutTracker
          sessions={sessions}
          onStartWorkout={handleStartWorkout}
          onDeleteSession={handleDeleteSession}
        />
      </div>
    </DashboardLayout>
  );
}

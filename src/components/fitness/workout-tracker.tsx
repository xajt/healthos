"use client";

import { useState } from "react";

interface Exercise {
  id: string;
  name: string;
  category: "strength" | "cardio" | "flexibility" | "balance";
  muscleGroup: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number; // for cardio in minutes
  distance?: number; // for cardio in km
}

interface WorkoutSession {
  id: string;
  date: string;
  name: string;
  type: "strength" | "cardio" | "hiit" | "yoga" | "other";
  duration: number; // minutes
  exercises: Exercise[];
  notes?: string;
  caloriesBurned?: number;
}

interface WorkoutTrackerProps {
  sessions: WorkoutSession[];
  onStartWorkout: (session: Omit<WorkoutSession, "id">) => void;
  onDeleteSession: (id: string) => void;
}

const WORKOUT_TYPES = {
  strength: { label: "Siłowy", icon: "💪", color: "bg-red-100 text-red-700" },
  cardio: { label: "Cardio", icon: "🏃", color: "bg-blue-100 text-blue-700" },
  hiit: { label: "HIIT", icon: "⚡", color: "bg-orange-100 text-orange-700" },
  yoga: { label: "Joga", icon: "🧘", color: "bg-purple-100 text-purple-700" },
  other: { label: "Inny", icon: "🎯", color: "bg-zinc-100 text-zinc-700" },
};

const EXERCISE_DATABASE: Exercise[] = [
  // Strength - Chest
  { id: "bench-press", name: "Wyciskanie sztangi", category: "strength", muscleGroup: "Klatka piersiowa" },
  { id: "dumbbell-press", name: "Wyciskanie hantli", category: "strength", muscleGroup: "Klatka piersiowa" },
  { id: "push-ups", name: "Pompki", category: "strength", muscleGroup: "Klatka piersiowa" },
  // Strength - Back
  { id: "deadlift", name: "Martwy ciąg", category: "strength", muscleGroup: "Plecy" },
  { id: "pull-ups", name: "Podciąganie", category: "strength", muscleGroup: "Plecy" },
  { id: "rows", name: "Wiosłowanie", category: "strength", muscleGroup: "Plecy" },
  // Strength - Legs
  { id: "squats", name: "Przysiady", category: "strength", muscleGroup: "Nogi" },
  { id: "leg-press", name: "Wypychanie na suwnicy", category: "strength", muscleGroup: "Nogi" },
  { id: "lunges", name: "Wykroki", category: "strength", muscleGroup: "Nogi" },
  // Strength - Shoulders
  { id: "overhead-press", name: "Wyciskanie żołnierskie", category: "strength", muscleGroup: "Barki" },
  { id: "lateral-raises", name: "Wznosy boczne", category: "strength", muscleGroup: "Barki" },
  // Strength - Arms
  { id: "bicep-curls", name: "Uginanie na biceps", category: "strength", muscleGroup: "Biceps" },
  { id: "tricep-dips", name: "Pompki na poręczach", category: "strength", muscleGroup: "Triceps" },
  // Strength - Core
  { id: "plank", name: "Deska", category: "strength", muscleGroup: "Brzuch" },
  { id: "crunches", name: "Brzuszki", category: "strength", muscleGroup: "Brzuch" },
  // Cardio
  { id: "running", name: "Bieganie", category: "cardio", muscleGroup: "Całe ciało" },
  { id: "cycling", name: "Rower", category: "cardio", muscleGroup: "Nogi" },
  { id: "swimming", name: "Pływanie", category: "cardio", muscleGroup: "Całe ciało" },
  { id: "rowing", name: "Wioślarz", category: "cardio", muscleGroup: "Całe ciało" },
  { id: "jumping-rope", name: "Skakanka", category: "cardio", muscleGroup: "Całe ciało" },
  // Flexibility
  { id: "stretching", name: "Rozciąganie", category: "flexibility", muscleGroup: "Całe ciało" },
  { id: "yoga-poses", name: "Pozycje jogi", category: "flexibility", muscleGroup: "Całe ciało" },
];

export function WorkoutTracker({ sessions, onStartWorkout, onDeleteSession }: WorkoutTrackerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWorkout, setNewWorkout] = useState({
    name: "",
    type: "strength" as WorkoutSession["type"],
    duration: 45,
    exercises: [] as Exercise[],
    notes: "",
  });
  const [selectedExercise, setSelectedExercise] = useState("");
  const [exerciseDetails, setExerciseDetails] = useState({
    sets: 3,
    reps: 10,
    weight: 0,
    duration: 0,
    distance: 0,
  });

  // Stats
  const totalWorkouts = sessions.length;
  const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalCalories = sessions.reduce((sum, s) => sum + (s.caloriesBurned || 0), 0);
  const thisWeekWorkouts = sessions.filter((s) => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return new Date(s.date) >= weekAgo;
  }).length;

  const addExercise = () => {
    const exercise = EXERCISE_DATABASE.find((e) => e.id === selectedExercise);
    if (!exercise) return;

    const newExercise: Exercise = {
      ...exercise,
      id: `${exercise.id}-${Date.now()}`,
      sets: exercise.category === "strength" ? exerciseDetails.sets : undefined,
      reps: exercise.category === "strength" ? exerciseDetails.reps : undefined,
      weight: exercise.category === "strength" ? exerciseDetails.weight : undefined,
      duration: exercise.category === "cardio" ? exerciseDetails.duration : undefined,
      distance: exercise.category === "cardio" ? exerciseDetails.distance : undefined,
    };

    setNewWorkout((prev) => ({
      ...prev,
      exercises: [...prev.exercises, newExercise],
    }));

    setExerciseDetails({ sets: 3, reps: 10, weight: 0, duration: 0, distance: 0 });
    setSelectedExercise("");
  };

  const removeExercise = (id: string) => {
    setNewWorkout((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((e) => e.id !== id),
    }));
  };

  const handleSubmit = () => {
    if (!newWorkout.name || newWorkout.exercises.length === 0) return;

    // Estimate calories burned
    const caloriesPerMinute = {
      strength: 5,
      cardio: 10,
      hiit: 12,
      yoga: 3,
      other: 5,
    };

    onStartWorkout({
      date: new Date().toISOString(),
      name: newWorkout.name,
      type: newWorkout.type,
      duration: newWorkout.duration,
      exercises: newWorkout.exercises,
      notes: newWorkout.notes || undefined,
      caloriesBurned: Math.round(newWorkout.duration * caloriesPerMinute[newWorkout.type]),
    });

    setShowAddModal(false);
    setNewWorkout({ name: "", type: "strength", duration: 45, exercises: [], notes: "" });
  };

  const selectedExerciseData = EXERCISE_DATABASE.find((e) => e.id === selectedExercise);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-zinc-200 p-4 text-center">
          <p className="text-sm text-zinc-500">Ten tydzień</p>
          <p className="text-2xl font-bold text-zinc-900">{thisWeekWorkouts}</p>
          <p className="text-xs text-zinc-400">treningów</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 text-center">
          <p className="text-sm text-zinc-500">Razem</p>
          <p className="text-2xl font-bold text-zinc-900">{totalWorkouts}</p>
          <p className="text-xs text-zinc-400">treningów</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 text-center">
          <p className="text-sm text-zinc-500">Czas</p>
          <p className="text-2xl font-bold text-zinc-900">{Math.round(totalMinutes / 60)}h</p>
          <p className="text-xs text-zinc-400">{totalMinutes} min</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4 text-center">
          <p className="text-sm text-zinc-500">Spalone</p>
          <p className="text-2xl font-bold text-zinc-900">{totalCalories}</p>
          <p className="text-xs text-zinc-400">kcal</p>
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="font-semibold text-zinc-900">Historia treningów</h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            + Nowy trening
          </button>
        </div>

        {sessions.length === 0 ? (
          <div className="p-8 text-center text-zinc-500">
            <p className="text-4xl mb-2">💪</p>
            <p>Brak zapisanych treningów</p>
            <p className="text-sm text-zinc-400">Zacznij śledzić swoje postępy!</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-50">
            {sessions.slice(0, 10).map((session) => (
              <div key={session.id} className="p-4 hover:bg-zinc-50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${WORKOUT_TYPES[session.type].color} flex items-center justify-center`}>
                      <span className="text-lg">{WORKOUT_TYPES[session.type].icon}</span>
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900">{session.name}</p>
                      <p className="text-sm text-zinc-500">
                        {new Date(session.date).toLocaleDateString("pl-PL", {
                          day: "numeric",
                          month: "short",
                        })} • {session.duration} min
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {session.caloriesBurned && (
                      <span className="text-sm text-zinc-500">{session.caloriesBurned} kcal</span>
                    )}
                    <button
                      onClick={() => onDeleteSession(session.id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Exercise tags */}
                <div className="flex flex-wrap gap-1">
                  {session.exercises.slice(0, 5).map((exercise) => (
                    <span
                      key={exercise.id}
                      className="px-2 py-0.5 bg-zinc-100 rounded text-xs text-zinc-600"
                    >
                      {exercise.name}
                    </span>
                  ))}
                  {session.exercises.length > 5 && (
                    <span className="px-2 py-0.5 bg-zinc-100 rounded text-xs text-zinc-600">
                      +{session.exercises.length - 5}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Workout Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900">Nowy trening</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-zinc-100 rounded-full">
                <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Workout Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Nazwa</label>
                  <input
                    type="text"
                    value={newWorkout.name}
                    onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                    placeholder="np. Trening A - Klatka"
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Typ</label>
                  <select
                    value={newWorkout.type}
                    onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value as WorkoutSession["type"] })}
                    className="w-full px-3 py-2 border border-zinc-200 rounded-lg"
                  >
                    {Object.entries(WORKOUT_TYPES).map(([key, config]) => (
                      <option key={key} value={key}>{config.icon} {config.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Czas trwania (min)</label>
                <input
                  type="number"
                  value={newWorkout.duration}
                  onChange={(e) => setNewWorkout({ ...newWorkout, duration: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg"
                />
              </div>

              {/* Add Exercise */}
              <div className="bg-zinc-50 rounded-xl p-3">
                <label className="block text-sm font-medium text-zinc-700 mb-2">Dodaj ćwiczenie</label>
                <select
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg mb-2"
                >
                  <option value="">Wybierz ćwiczenie...</option>
                  {EXERCISE_DATABASE.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name} ({exercise.muscleGroup})
                    </option>
                  ))}
                </select>

                {selectedExerciseData?.category === "strength" && (
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="Serie"
                      value={exerciseDetails.sets}
                      onChange={(e) => setExerciseDetails({ ...exerciseDetails, sets: parseInt(e.target.value) || 0 })}
                      className="px-2 py-1 border border-zinc-200 rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Powt."
                      value={exerciseDetails.reps}
                      onChange={(e) => setExerciseDetails({ ...exerciseDetails, reps: parseInt(e.target.value) || 0 })}
                      className="px-2 py-1 border border-zinc-200 rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Waga (kg)"
                      value={exerciseDetails.weight}
                      onChange={(e) => setExerciseDetails({ ...exerciseDetails, weight: parseInt(e.target.value) || 0 })}
                      className="px-2 py-1 border border-zinc-200 rounded text-sm"
                    />
                  </div>
                )}

                {selectedExerciseData?.category === "cardio" && (
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <input
                      type="number"
                      placeholder="Czas (min)"
                      value={exerciseDetails.duration}
                      onChange={(e) => setExerciseDetails({ ...exerciseDetails, duration: parseInt(e.target.value) || 0 })}
                      className="px-2 py-1 border border-zinc-200 rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Dystans (km)"
                      value={exerciseDetails.distance}
                      onChange={(e) => setExerciseDetails({ ...exerciseDetails, distance: parseInt(e.target.value) || 0 })}
                      className="px-2 py-1 border border-zinc-200 rounded text-sm"
                    />
                  </div>
                )}

                <button
                  onClick={addExercise}
                  disabled={!selectedExercise}
                  className="w-full py-2 bg-zinc-200 text-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-300 disabled:opacity-50"
                >
                  Dodaj ćwiczenie
                </button>
              </div>

              {/* Exercise List */}
              {newWorkout.exercises.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-700">Ćwiczenia ({newWorkout.exercises.length})</p>
                  {newWorkout.exercises.map((exercise) => (
                    <div key={exercise.id} className="flex items-center justify-between p-2 bg-white border border-zinc-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-zinc-900">{exercise.name}</p>
                        <p className="text-xs text-zinc-500">
                          {exercise.sets && `${exercise.sets}x${exercise.reps}`}
                          {exercise.weight && ` @ ${exercise.weight}kg`}
                          {exercise.duration && `${exercise.duration} min`}
                          {exercise.distance && ` ${exercise.distance}km`}
                        </p>
                      </div>
                      <button onClick={() => removeExercise(exercise.id)} className="p-1 hover:bg-red-50 rounded text-red-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-zinc-100">
              <button
                onClick={handleSubmit}
                disabled={!newWorkout.name || newWorkout.exercises.length === 0}
                className="w-full py-3 bg-zinc-900 text-white rounded-xl font-medium hover:bg-zinc-800 disabled:opacity-50"
              >
                Zapisz trening
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

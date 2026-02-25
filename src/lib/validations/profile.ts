import { z } from "zod";

// Step 1: Basic Info
export const basicInfoSchema = z.object({
  first_name: z.string().min(1, "Imię jest wymagane"),
  last_name: z.string().min(1, "Nazwisko jest wymagane"),
  birth_date: z.string().min(1, "Data urodzenia jest wymagana"),
  gender: z.enum(["male", "female", "other"], { message: "Płeć jest wymagana" }),
  height_cm: z.number().min(100, "Wzrost musi być minimum 100 cm").max(250, "Wzrost musi być maksimum 250 cm"),
  current_weight_kg: z.number().min(30, "Waga musi być minimum 30 kg").max(300, "Waga musi być maksimum 300 kg"),
  target_weight_kg: z.number().min(30, "Waga docelowa musi być minimum 30 kg").max(300, "Waga docelowa musi być maksimum 300 kg"),
});

// Step 2: Health Info
export const healthInfoSchema = z.object({
  health_conditions: z.array(z.string()),
  allergies: z.array(z.string()),
  medications: z.array(z.string()),
  blood_type: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"]).optional(),
});

// Step 3: Lifestyle
export const lifestyleSchema = z.object({
  activity_level: z.enum(["sedentary", "light", "moderate", "active", "very_active"], { message: "Poziom aktywności jest wymagany" }),
  work_type: z.string().optional(),
  sleep_hours_target: z.number().min(4, "Minimum 4 godziny").max(12, "Maksimum 12 godzin"),
  stress_level: z.number().min(1).max(10),
});

// Step 4: Fitness
export const fitnessSchema = z.object({
  fitness_goal: z.enum(["lose_weight", "gain_muscle", "maintain", "improve_health", "increase_energy"], { message: "Cel fitness jest wymagany" }),
  workout_frequency_per_week: z.number().min(0).max(7),
  preferred_workout_types: z.array(z.string()),
});

// Step 5: Goals
export const goalsSchema = z.object({
  daily_calorie_target: z.number().min(1000).max(5000).optional(),
  daily_protein_target: z.number().min(30).max(300).optional(),
  daily_water_ml_target: z.number().min(1000).max(5000),
  primary_goals: z.array(z.string()),
});

// Step 6: Medical
export const medicalSchema = z.object({
  health_conditions: z.array(z.string()),
  allergies: z.array(z.string()),
  medications: z.array(z.string()),
  blood_type: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"]).optional(),
});

// Step 7: Psychological
export const psychologicalSchema = z.object({
  motivation_level: z.number().min(1).max(10),
  preferred_motivation_style: z.enum(["gentle", "moderate", "intense"]).optional(),
  mental_health_focus: z.array(z.string()),
});

// Full profile schema
export const onboardingSchema = basicInfoSchema
  .merge(healthInfoSchema)
  .merge(lifestyleSchema)
  .merge(fitnessSchema)
  .merge(goalsSchema)
  .merge(psychologicalSchema);

export type BasicInfoForm = z.infer<typeof basicInfoSchema>;
export type HealthInfoForm = z.infer<typeof healthInfoSchema>;
export type LifestyleForm = z.infer<typeof lifestyleSchema>;
export type FitnessForm = z.infer<typeof fitnessSchema>;
export type GoalsForm = z.infer<typeof goalsSchema>;
export type MedicalForm = z.infer<typeof medicalSchema>;
export type PsychologicalForm = z.infer<typeof psychologicalSchema>;
export type OnboardingForm = z.infer<typeof onboardingSchema>;

// Step configuration
export const ONBOARDING_STEPS = [
  { id: 1, title: "Podstawowe", description: "Twoje dane osobowe" },
  { id: 2, title: "Zdrowotne", description: "Stan zdrowia" },
  { id: 3, title: "Lifestyle", description: "Tryb życia" },
  { id: 4, title: "Fitness", description: "Aktywność fizyczna" },
  { id: 5, title: "Cele", description: "Twoje cele" },
  { id: 6, title: "Medyczne", description: "Dane medyczne" },
  { id: 7, title: "Psychologiczne", description: "Motywacja" },
] as const;

export const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Siedzący", description: "Praca biurowa, brak treningów" },
  { value: "light", label: "Lekki", description: "1-2 treningi tygodniowo" },
  { value: "moderate", label: "Umiarkowany", description: "3-4 treningi tygodniowo" },
  { value: "active", label: "Aktywny", description: "5-6 treningów tygodniowo" },
  { value: "very_active", label: "Bardzo aktywny", description: "Codzienny trening + praca fizyczna" },
] as const;

export const FITNESS_GOALS = [
  { value: "lose_weight", label: "Redukcja wagi", icon: "📉" },
  { value: "gain_muscle", label: "Budowa mięśni", icon: "💪" },
  { value: "maintain", label: "Utrzymanie wagi", icon: "⚖️" },
  { value: "improve_health", label: "Poprawa zdrowia", icon: "❤️" },
  { value: "increase_energy", label: "Więcej energii", icon: "⚡" },
] as const;

export const WORKOUT_TYPES = [
  "Siłownia",
  "Bieganie",
  "Rower",
  "Pływanie",
  "Joga",
  "CrossFit",
  "Walka",
  "Tenis",
  "Koszykówka",
  "Piłka nożna",
  "Inne",
] as const;

export const HEALTH_CONDITIONS = [
  "Cukrzyca typu 1",
  "Cukrzyca typu 2",
  "Nadciśnienie",
  "Choroby serca",
  "Astma",
  "Choroby tarczycy",
  "Artretyzm",
  "Choroby kręgosłupa",
  "Inne",
] as const;

export const ALLERGIES = [
  "Gluten",
  "Laktoza",
  "Orzechy",
  "Jaja",
  "Owoce morza",
  "Soja",
  "Inne",
] as const;

export const BLOOD_TYPES = [
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
  { value: "unknown", label: "Nie wiem" },
] as const;

export const MOTIVATION_STYLES = [
  { value: "gentle", label: "Łagodny", description: "Wsparcie i pozytywne wzmocnienia" },
  { value: "moderate", label: "Umiarkowany", description: "Zbalansowane podejście" },
  { value: "intense", label: "Intensywny", description: "Wyzwania i mocna motywacja" },
] as const;

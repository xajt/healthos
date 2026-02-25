"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase";
import { ProgressIndicator } from "./progress-indicator";
import { Step1Basic } from "./step-1-basic";
import { Step2Health } from "./step-2-health";
import { Step3Lifestyle } from "./step-3-lifestyle";
import { Step4Fitness } from "./step-4-fitness";
import { Step5Goals } from "./step-5-goals";
import { Step6Medical } from "./step-6-medical";
import { Step7Psychological } from "./step-7-psychological";
import type { OnboardingForm } from "@/lib/validations/profile";

interface OnboardingFormProps {
  userId: string;
  initialData?: Partial<OnboardingForm>;
}

export function OnboardingForm({ userId, initialData }: OnboardingFormProps) {
  const router = useRouter();
  const supabase = createBrowserClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingForm>>(initialData || {});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFormData = (stepData: Partial<OnboardingForm>) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const handleNext = (stepData: Partial<OnboardingForm>) => {
    updateFormData(stepData);
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleFinalSubmit = async (stepData: Partial<OnboardingForm>) => {
    const finalData = { ...formData, ...stepData };
    setIsSubmitting(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          ...finalData,
          onboarding_completed: true,
          onboarding_completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) throw updateError;

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Wystąpił błąd. Spróbuj ponownie.");
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Basic
            defaultValues={formData}
            onSubmit={handleNext}
          />
        );
      case 2:
        return (
          <Step2Health
            defaultValues={formData}
            onSubmit={handleNext}
          />
        );
      case 3:
        return (
          <Step3Lifestyle
            defaultValues={formData}
            onSubmit={handleNext}
          />
        );
      case 4:
        return (
          <Step4Fitness
            defaultValues={formData}
            onSubmit={handleNext}
          />
        );
      case 5:
        return (
          <Step5Goals
            defaultValues={formData}
            onSubmit={handleNext}
          />
        );
      case 6:
        return (
          <Step6Medical
            defaultValues={formData}
            onSubmit={handleNext}
          />
        );
      case 7:
        return (
          <Step7Psychological
            defaultValues={formData}
            onSubmit={handleFinalSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4">
      <div className="max-w-xl mx-auto">
        <div className="mb-8">
          <ProgressIndicator currentStep={currentStep} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-6 md:p-8">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {renderStep()}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-200">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentStep === 1
                  ? "text-zinc-300 cursor-not-allowed"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              ← Wstecz
            </button>

            <button
              type="submit"
              form="onboarding-step"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-lg hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Zapisywanie..."
                : currentStep === 7
                ? "Zapisz i rozpocznij"
                : "Dalej →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

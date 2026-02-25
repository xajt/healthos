"use client";

import { ONBOARDING_STEPS } from "@/lib/validations/profile";

interface ProgressIndicatorProps {
  currentStep: number;
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  return (
    <div className="w-full">
      {/* Mobile progress bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-zinc-900">
            Krok {currentStep} z {ONBOARDING_STEPS.length}
          </span>
          <span className="text-sm text-zinc-500">
            {ONBOARDING_STEPS[currentStep - 1]?.title}
          </span>
        </div>
        <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-zinc-900 transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / ONBOARDING_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop steps */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {ONBOARDING_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep > step.id
                      ? "bg-zinc-900 text-white"
                      : currentStep === step.id
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-200 text-zinc-500"
                  }`}
                >
                  {currentStep > step.id ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    currentStep >= step.id ? "text-zinc-900" : "text-zinc-400"
                  }`}
                >
                  {step.title}
                </span>
              </div>
              {index < ONBOARDING_STEPS.length - 1 && (
                <div
                  className={`w-12 lg:w-20 h-0.5 mx-2 ${
                    currentStep > step.id ? "bg-zinc-900" : "bg-zinc-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

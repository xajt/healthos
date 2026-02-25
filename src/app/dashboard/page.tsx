import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Header } from "@/components/layout/header";
import { LogoutButton } from "@/components/auth/logout-button";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const displayName = profile?.first_name || user.email?.split("@")[0] || "Użytkownik";

  return (
    <DashboardLayout>
      <Header userName={displayName} />

      {/* Desktop header */}
      <header className="hidden md:flex bg-white border-b border-zinc-200 h-16 items-center justify-between px-6">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Dashboard</h2>
          <p className="text-sm text-zinc-500">Przegląd Twojego zdrowia</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-600">Cześć, {displayName}</span>
          <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center">
            <span className="text-sm font-medium text-zinc-600">
              {displayName.charAt(0).toUpperCase()}
            </span>
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="p-4 md:p-6 lg:p-8">
        {/* Onboarding reminder */}
        {profile?.onboarding_completed === false && (
          <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-amber-800">
                  Ukończ konfigurację profilu
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Aby otrzymywać spersonalizowane rekomendacje, ukończ proces onboarding.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Welcome message (mobile) */}
        <div className="md:hidden mb-6">
          <h1 className="text-2xl font-bold text-zinc-900">Witaj, {displayName}!</h1>
          <p className="text-zinc-500 mt-1">Jak się dzisiaj czujesz?</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white rounded-xl p-4 md:p-6 border border-zinc-200">
            <h3 className="text-xs md:text-sm font-medium text-zinc-500 uppercase tracking-wide">
              Kalorie
            </h3>
            <p className="text-2xl md:text-3xl font-bold text-zinc-900 mt-2">
              0 <span className="text-lg font-normal text-zinc-400">/ {profile?.daily_calorie_target || 2000}</span>
            </p>
            <p className="text-xs text-zinc-400 mt-1">kcal dzisiaj</p>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 border border-zinc-200">
            <h3 className="text-xs md:text-sm font-medium text-zinc-500 uppercase tracking-wide">
              Woda
            </h3>
            <p className="text-2xl md:text-3xl font-bold text-zinc-900 mt-2">
              0 <span className="text-lg font-normal text-zinc-400">/ {profile?.daily_water_ml_target || 2000}</span>
            </p>
            <p className="text-xs text-zinc-400 mt-1">ml dzisiaj</p>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 border border-zinc-200">
            <h3 className="text-xs md:text-sm font-medium text-zinc-500 uppercase tracking-wide">
              Sen
            </h3>
            <p className="text-2xl md:text-3xl font-bold text-zinc-900 mt-2">
              --<span className="text-lg font-normal text-zinc-400"> / {profile?.sleep_hours_target || 8}h</span>
            </p>
            <p className="text-xs text-zinc-400 mt-1">ostatnia noc</p>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 border border-zinc-200">
            <h3 className="text-xs md:text-sm font-medium text-zinc-500 uppercase tracking-wide">
              Aktywność
            </h3>
            <p className="text-2xl md:text-3xl font-bold text-zinc-900 mt-2">
              0 <span className="text-lg font-normal text-zinc-400">min</span>
            </p>
            <p className="text-xs text-zinc-400 mt-1">dzisiaj</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-6 md:mt-8">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">Szybkie akcje</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button className="bg-white rounded-xl p-4 border border-zinc-200 text-left hover:border-zinc-300 hover:bg-zinc-50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <span className="text-sm font-medium text-zinc-900">Dodaj posiłek</span>
            </button>

            <button className="bg-white rounded-xl p-4 border border-zinc-200 text-left hover:border-zinc-300 hover:bg-zinc-50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-zinc-900">Dodaj wodę</span>
            </button>

            <button className="bg-white rounded-xl p-4 border border-zinc-200 text-left hover:border-zinc-300 hover:bg-zinc-50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-zinc-900">Zarejestruj trening</span>
            </button>

            <button className="bg-white rounded-xl p-4 border border-zinc-200 text-left hover:border-zinc-300 hover:bg-zinc-50 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-zinc-900">Sprawdź nastrój</span>
            </button>
          </div>
        </div>

        {/* AI Insights placeholder */}
        <div className="mt-6 md:mt-8">
          <h3 className="text-lg font-semibold text-zinc-900 mb-4">AI Insights</h3>
          <div className="bg-white rounded-xl p-6 border border-zinc-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="text-zinc-600">
                  Dodaj swoje pierwsze dane, aby otrzymać spersonalizowane rekomendacje od AI.
                </p>
                <p className="text-sm text-zinc-400 mt-2">
                  Zacznij od zalogowania posiłku lub pomiaru wagi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Header } from "@/components/layout/header";
import { LogoutButton } from "@/components/auth/logout-button";
import {
  TodaysOverview,
  AiInsightsFeed,
  WidgetsContainer,
  demoInsights,
} from "@/components/dashboard";

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

  // Redirect to onboarding if not completed
  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  // Demo data - will be replaced with real data from database
  const todayStats = {
    calories: { consumed: 1450, target: profile?.daily_calorie_target || 2000 },
    water: { consumed: 1200, target: profile?.daily_water_ml_target || 2000 },
    steps: { count: 6234, target: 10000 },
    workouts: { completed: 3, target: 5 },
  };

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

      <div className="p-4 md:p-6 lg:p-8 space-y-8">
        {/* Today's Overview */}
        <div>
          <TodaysOverview stats={todayStats} userName={displayName} />
        </div>

        {/* AI Insights Feed */}
        <div className="mt-8">
          <AiInsightsFeed insights={demoInsights} />
        </div>

        {/* Customizable Widgets */}
        <div className="mt-8">
          <WidgetsContainer />
        </div>
      </div>
    </DashboardLayout>
  );
}

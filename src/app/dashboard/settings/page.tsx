import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Header } from "@/components/layout/header";
import { ProfileSettingsForm } from "./profile-settings-form";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
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
      <header className="hidden md:flex bg-white border-b border-zinc-200 h-16 items-center px-6">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Ustawienia</h2>
          <p className="text-sm text-zinc-500">Zarządzaj swoim profilem</p>
        </div>
      </header>

      <div className="p-4 md:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          <ProfileSettingsForm profile={profile} userId={user.id} />
        </div>
      </div>
    </DashboardLayout>
  );
}

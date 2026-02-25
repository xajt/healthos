"use client";

import { createBrowserClient } from "@/lib/supabase";

export function LogoutButton() {
  const supabase = createBrowserClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/auth/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded-md px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
    >
      Wyloguj się
    </button>
  );
}

"use client";

import { useState } from "react";
import { LogoutButton } from "@/components/auth/logout-button";

interface HeaderProps {
  userName?: string;
}

export function Header({ userName }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-zinc-200 sticky top-0 z-40 md:hidden">
      <div className="flex justify-between items-center h-16 px-4">
        <h1 className="text-lg font-bold text-zinc-900">HealthOS</h1>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
          >
            <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center">
              <span className="text-sm font-medium text-zinc-600">
                {userName?.charAt(0).toUpperCase() || "?"}
              </span>
            </div>
          </button>

          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-zinc-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-zinc-100">
                  <p className="text-sm font-medium text-zinc-900">{userName}</p>
                </div>
                <div className="py-1">
                  <LogoutButton />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

import { BottomNav, Sidebar } from "@/components/layout/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Sidebar />
      <main className="md:ml-64 pb-20 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

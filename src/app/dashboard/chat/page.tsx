"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { HealthChat } from "@/components/ai";
import { getAIResponse } from "@/lib/ai/mock-ai-service";

export default function ChatPage() {
  const handleSendMessage = async (message: string): Promise<string> => {
    const response = await getAIResponse(message);
    return response;
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 lg:p-8 h-[calc(100vh-80px)]">
        <div className="max-w-3xl mx-auto h-full bg-white rounded-2xl border border-zinc-200 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-zinc-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h1 className="font-semibold text-zinc-900">Asystent Zdrowia</h1>
              <p className="text-sm text-zinc-500">AI wspomagające Twoje decyzje zdrowotne</p>
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 overflow-hidden">
            <HealthChat onSendMessage={handleSendMessage} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

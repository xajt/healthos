import { SignupForm } from "@/components/auth/signup-form";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            HealthOS
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Utwórz nowe konto
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}

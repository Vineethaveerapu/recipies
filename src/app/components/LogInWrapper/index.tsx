"use client";
import LogInForm from "../LogInForm";
import Navigation from "../Navigation";
import { useUserContext } from "@/utils/contexts";
import { UserContextType } from "@/utils/types";

const LogInWrapper = ({ children }: { children: React.ReactNode }) => {
  const { user, isReady } = useUserContext() as UserContextType;

  if (!isReady) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-slate-500">Loading your experience...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 py-16 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <main className="mx-auto flex min-h-[60vh] w-full max-w-6xl items-center justify-center px-4">
          <LogInForm />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-6">
      <div className="mx-auto w-full max-w-6xl px-4">
        <Navigation />
      </div>
      <main className="mx-auto w-full max-w-6xl px-4 pt-8">{children}</main>
    </div>
  );
};

export default LogInWrapper;

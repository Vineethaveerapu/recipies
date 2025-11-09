"use client";
import { FormEvent, useState } from "react";
import { userArray } from "@/data/user";
import { useUserContext } from "@/utils/contexts";
import { UserContextType } from "@/utils/types";

const LogInForm = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { login, isReady } = useUserContext() as UserContextType;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanedInput = userInput.trim().toLowerCase();

    if (!cleanedInput) {
      setErrorMessage("Please enter a username to continue.");
      return;
    }

    const foundUser = userArray.find(
      (item) => item.name.toLowerCase() === cleanedInput
    );

    if (!foundUser) {
      setErrorMessage(
        "We could not find that user. Try Vini, John or Lisa to explore the app."
      );
      return;
    }

    login(foundUser);
    setErrorMessage(null);
    setUserInput("");
  };

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-3xl border border-white/70 bg-white/90 p-8 shadow-xl ring-1 ring-rose-100/60 backdrop-blur-lg transition-shadow duration-200 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/80 dark:ring-red-700/20"
      >
        <header className="space-y-1 text-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Welcome back
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Log in to see your personal recipes and favourites.
          </p>
        </header>
        <div className="space-y-2">
          <label
            className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
            htmlFor="username"
          >
            Username
          </label>
          <input
            onChange={(event) => setUserInput(event.target.value)}
            value={userInput}
            id="username"
            type="text"
            placeholder="Try Vini, John or Lisa"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-red-600 focus:ring-2 focus:ring-red-600/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-red-600 dark:focus:ring-red-700/30"
            autoComplete="username"
            disabled={!isReady}
          />
        </div>
        <div className="space-y-2">
          <label
            className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Any password works in this demo"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-red-600 focus:ring-2 focus:ring-red-600/30 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-red-600 dark:focus:ring-red-700/30"
            autoComplete="current-password"
            disabled={!isReady}
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-white dark:bg-red-700 dark:text-white dark:hover:bg-red-600 dark:focus:ring-red-500 dark:focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={!isReady}
        >
          Log In
        </button>
        {errorMessage && (
          <p className="rounded-lg border border-red-200/80 bg-red-50/80 px-3 py-2 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300">
            {errorMessage}
          </p>
        )}
      </form>
    </section>
  );
};

export default LogInForm;

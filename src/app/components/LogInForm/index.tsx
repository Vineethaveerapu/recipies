"use client";
import { userArray } from "@/data/user";
import { useState } from "react";
import { useUserContext } from "@/utils/contexts";
import { UserContextType } from "@/utils/types";

const LogInForm = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [userNotFound, setUserNotFound] = useState<boolean>(true);
  const { user, setUser } = useUserContext() as UserContextType;

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const loggedInUser = userArray.filter((user) => user.name === userInput);
    if (!loggedInUser[0]) {
      setUserNotFound(false);
    } else {
      setUserNotFound(true);
      setUser(loggedInUser[0]);
    }
  };

  const handleChange = (e: { target: { value: string } }) => {
    setUserInput(e.target.value);
  };

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-2xl border border-slate-200 bg-white/80 p-8 shadow-lg backdrop-blur-md transition-shadow duration-200 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900/70"
      >
        <div className="space-y-2">
          <label
            className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
            htmlFor="username"
          >
            Enter your Username
          </label>
          <input
            onChange={handleChange}
            value={userInput}
            id="username"
            type="text"
            placeholder="Username"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-2 focus:ring-slate-400/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-500/30"
          />
        </div>
        <div className="space-y-2">
          <label
            className="block text-sm font-semibold text-slate-700 dark:text-slate-200"
            htmlFor="password"
          >
            Enter your Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none transition-colors focus:border-slate-400 focus:ring-2 focus:ring-slate-400/40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-slate-500 dark:focus:ring-slate-500/30"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          Log In
        </button>
        {!userNotFound && (
          <p className="rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 dark:border-red-900 dark:bg-red-950/60 dark:text-red-300">
            User not found
          </p>
        )}
      </form>
    </section>
  );
};

export default LogInForm;

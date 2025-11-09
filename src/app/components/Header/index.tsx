"use client";
import { useUserContext } from "@/utils/contexts";
import { UserContextType } from "@/utils/types";

const Header = () => {
  const { user, favouriteCategory, logout, isReady } =
    useUserContext() as UserContextType;

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-red-700 sm:text-sm">
            My Recipes
          </span>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
            The Meal Planner
          </h1>
        </div>

        {isReady ? (
          user ? (
            <div className="flex flex-col items-start gap-1 text-left sm:items-end sm:text-right">
              <p className="text-xs text-slate-500 dark:text-slate-300 sm:text-sm">
                Welcome back,{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {user.name}
                </span>
              </p>
              {favouriteCategory && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Favourite category: {favouriteCategory}
                </p>
              )}
              <button
                onClick={logout}
                className="mt-1 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-red-600 hover:text-red-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-red-600 sm:px-4"
              >
                Log out
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-300 sm:text-sm">
              Sign in to unlock personalised recipes.
            </p>
          )
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-300 sm:text-sm">
            Preparing your workspace...
          </p>
        )}
      </div>
    </header>
  );
};

export default Header;

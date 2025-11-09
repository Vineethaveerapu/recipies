"use client";
import { useUserContext } from "@/utils/contexts";
import { UserContextType } from "@/utils/types";

const Header = () => {
  const { user, favouriteCategory, logout, isReady } =
    useUserContext() as UserContextType;

  return (
    <header className="  bg-white/90  ">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-semibold uppercase tracking-wider text-red-500">
            My Recipes
          </span>
          <h1 className="text-2xl font-bold  text-black">The Meal Planner</h1>
        </div>

        {isReady ? (
          user ? (
            <div className="flex flex-col items-end gap-1 text-right">
              <p className="text-sm  text-black-300">
                Welcome back{" "}
                <span className="font-semibold text-slate-900 ">
                  {user.name}
                </span>
              </p>
              {favouriteCategory && (
                <p className="text-xs">
                  Favourite category: {favouriteCategory}
                </p>
              )}
              <button
                onClick={logout}
                className="rounded-full  px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 transition  hover:text-red-500 hover:bg-red-500 hover:text-white dark:bg-slate-900 dark:text-slate-200 cursor-pointer"
              >
                Log out
              </button>
            </div>
          ) : (
            <p className="text-sm text-black-300">
              Log in to unlock personalised recipes.
            </p>
          )
        ) : (
          <p className="text-sm text-black-300">
            Preparing your meal planner...
          </p>
        )}
      </div>
    </header>
  );
};

export default Header;

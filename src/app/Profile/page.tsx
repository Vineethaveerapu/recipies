"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/utils/contexts";
import { UserContextType } from "@/utils/types";

const ProfilePage = () => {
  const { user, favouriteCategory, savedItems, removeSavedItem } =
    useUserContext() as UserContextType;
  const router = useRouter();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-10 pb-16">
      <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 p-8 text-white shadow-xl">
        <p className="text-sm uppercase tracking-widest text-white/70">
          Profile overview
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{user.name}</h1>
        <p className="mt-4 max-w-2xl text-sm text-white/80 sm:text-base">
          This is your cooking hub. Jump back into saved recipes, adjust your
          favourite category or explore something new.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-wide text-white/70">
              Favourite category
            </p>
            <p className="mt-1 text-lg font-semibold">
              {favouriteCategory ?? "Not selected"}
            </p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-wide text-white/70">
              Saved recipes
            </p>
            <p className="mt-1 text-lg font-semibold">{savedItems.length}</p>
          </div>
          <button
            onClick={() => router.push("/category")}
            className="rounded-2xl bg-red-700/90 p-4 text-left text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-red-700"
          >
            Update categories
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Saved recipes
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Click any recipe to open it or remove it from your list.
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="text-sm font-semibold text-red-700 transition hover:text-red-800"
          >
            Discover more recipes →
          </button>
        </header>

        {savedItems.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedItems.map((item) => (
              <li
                key={item.id}
                className="flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <Image
                    src={item.thumbnail}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-300">
                      {item.category}
                    </p>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-3">
                    <button
                      onClick={() => router.push(`/item/${item.id}`)}
                      className="flex-1 rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600"
                    >
                      Open recipe
                    </button>
                    <button
                      onClick={() => removeSavedItem(item.id)}
                      className="flex-1 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-600 hover:text-red-700 dark:border-slate-700 dark:text-slate-300 dark:hover:border-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            You have not saved any recipes yet. Browse recipes and hit save to
            add them here.
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;

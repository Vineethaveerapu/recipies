"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/utils/contexts";
import { UserContextType } from "@/utils/types";

type MealSummary = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

type MealDetail = MealSummary & {
  strCategory: string;
  strArea: string;
  strInstructions: string;
};

const API_ENDPOINT = "https://www.themealdb.com/api/json/v1/1/";

export default function Home() {
  const { user, favouriteCategory, savedItems } =
    useUserContext() as UserContextType;
  const router = useRouter();

  const [featuredRecipe, setFeaturedRecipe] = useState<MealDetail | null>(null);
  const [categoryMeals, setCategoryMeals] = useState<MealSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const randomResponse = await fetch(`${API_ENDPOINT}random.php`);
        const randomData = await randomResponse.json();
        const randomMeal = randomData?.meals?.[0] ?? null;
        setFeaturedRecipe(randomMeal);

        if (favouriteCategory) {
          const categoryResponse = await fetch(
            `${API_ENDPOINT}filter.php?c=${encodeURIComponent(
              favouriteCategory
            )}`
          );
          const categoryData = await categoryResponse.json();
          setCategoryMeals(categoryData?.meals?.slice(0, 6) ?? []);
        } else {
          setCategoryMeals([]);
        }
      } catch (error) {
        console.error("Failed to load home data", error);
        setErrorMessage(
          "We could not load recommendations right now. Please refresh the page."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user, favouriteCategory]);

  const savedItemsPreview = useMemo(() => savedItems.slice(0, 3), [savedItems]);

  if (!user) {
    return null;
    // The login wrapper handles this state.
  }

  const viewItem = (id: string) => {
    router.push(`/item/${id}`);
  };

  return (
    <div className="space-y-10 pb-16">
      <section className="rounded-3xl bg-gradient-to-r from-red-700/80 via-red-600/70 to-amber-600/60 p-6 text-white shadow-xl sm:p-8">
        <p className="text-xs uppercase tracking-widest text-white/80 sm:text-sm">
          Welcome back
        </p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
          {user.name}, ready for something delicious?
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
          We have prepared a curated recipe just for you. Dive in, or explore
          dishes from your favourite categories to save them for later.
        </p>
        {featuredRecipe && (
          <div className="mt-4 flex flex-col items-stretch gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm sm:flex-row sm:gap-4 sm:rounded-2xl sm:p-4">
            <div className="relative h-32 w-full flex-shrink-0 overflow-hidden rounded-lg border border-white/40 sm:h-auto sm:w-[25%] sm:rounded-xl">
              <Image
                src={featuredRecipe.strMealThumb}
                alt={featuredRecipe.strMeal}
                fill
                sizes="(max-width: 640px) 30vw, 25vw"
                className="object-cover"
                priority
              />
            </div>
            <div className="flex min-w-0 flex-1 flex-col space-y-1.5 sm:space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-white/70 sm:text-xs">
                Featured recipe
              </p>
              <h2 className="text-base font-semibold leading-tight sm:text-lg">
                {featuredRecipe.strMeal}
              </h2>
              <p className="text-[10px] text-white/80 sm:text-xs">
                {featuredRecipe.strCategory} • {featuredRecipe.strArea}
              </p>
              <p className="line-clamp-2 text-[10px] leading-relaxed text-white/80 sm:line-clamp-3 sm:text-xs">
                {featuredRecipe.strInstructions}
              </p>
              <button
                onClick={() => viewItem(featuredRecipe.idMeal)}
                className="mt-auto w-fit rounded-full bg-white px-4 py-1.5 text-[10px] font-semibold text-red-700 transition hover:bg-red-50/80 hover:shadow-md sm:px-5 sm:py-2 sm:text-xs"
              >
                View recipe →
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Your category highlights
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              {favouriteCategory
                ? `Top picks from ${favouriteCategory}.`
                : "Pick a favourite category on the Categories page to get tailored recommendations here."}
            </p>
          </div>
          <button
            onClick={() => router.push("/category")}
            className="text-sm font-semibold text-red-700 transition hover:text-red-800"
          >
            Manage categories →
          </button>
        </header>

        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            Loading recipes...
          </div>
        ) : errorMessage ? (
          <div className="rounded-3xl border border-red-200/80 bg-red-50/80 p-6 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
            {errorMessage}
          </div>
        ) : categoryMeals.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryMeals.map((meal) => (
              <li
                key={meal.idMeal}
                className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                onClick={() => viewItem(meal.idMeal)}
              >
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <Image
                    src={meal.strMealThumb}
                    alt={meal.strMeal}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-6">
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">
                    {meal.strMeal}
                  </p>
                  <span className="text-xs font-medium uppercase tracking-wide text-red-700">
                    {favouriteCategory}
                  </span>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Tap to open the full recipe.
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            No category picked yet. Choose one to see highlights appear here.
          </div>
        )}
      </section>

      <section className="space-y-4">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Saved items
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-300">
              We keep your favourites handy so you can cook them again.
            </p>
          </div>
          <button
            onClick={() => router.push("/profile")}
            className="text-sm font-semibold text-red-700 transition hover:text-red-800"
          >
            View all →
          </button>
        </header>

        {savedItems.length > 0 ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedItemsPreview.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-xl sm:flex-row sm:items-center sm:p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl sm:h-20 sm:w-20 sm:rounded-2xl">
                  <Image
                    src={item.thumbnail}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {item.name}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {item.category}
                  </p>
                  <button
                    onClick={() => viewItem(item.id)}
                    className="text-left text-sm font-semibold text-red-700 transition hover:text-red-800"
                  >
                    Open recipe →
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            You have not saved any recipes yet. Tap the save button on a recipe
            page to add it here.
          </div>
        )}
      </section>
    </div>
  );
}

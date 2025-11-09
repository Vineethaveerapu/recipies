"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserContext } from "@/utils/contexts";
import { UserContextType } from "@/utils/types";

type MealSummary = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

const API_ENDPOINT = "https://www.themealdb.com/api/json/v1/1/filter.php";

const CategoryDetailPage = () => {
  const params = useParams<{ category: string }>();
  const router = useRouter();
  const { setFavouriteCategory, favouriteCategory } =
    useUserContext() as UserContextType;

  const [meals, setMeals] = useState<MealSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const categoryName = useMemo(() => {
    if (!params.category) {
      return "";
    }
    return decodeURIComponent(params.category)
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
      .trim();
  }, [params.category]);

  useEffect(() => {
    if (!categoryName) {
      return;
    }

    const fetchMeals = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(
          `${API_ENDPOINT}?c=${encodeURIComponent(categoryName)}`
        );
        const data = await response.json();
        setMeals(data?.meals ?? []);
      } catch (error) {
        console.error("Failed to fetch meals for category", error);
        setErrorMessage(
          "We could not load the meals for this category. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeals();
  }, [categoryName]);

  const handleViewItem = (idMeal: string) => {
    router.push(`/item/${idMeal}`);
  };

  const handleSetFavourite = () => {
    setFavouriteCategory(categoryName);
  };

  return (
    <div className="space-y-10 pb-16">
      <section className="space-y-3">
        <button
          onClick={() => router.back()}
          className="text-sm font-semibold text-red-700 transition hover:text-red-800"
        >
          ← Back to categories
        </button>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {categoryName || "Category"}
          </h1>
          <button
            onClick={handleSetFavourite}
            className={`rounded-full border px-5 py-2 text-xs font-semibold uppercase tracking-wide transition ${
              favouriteCategory === categoryName
                ? "border-red-600 bg-red-50/80 text-red-700 shadow-sm dark:border-red-600/80 dark:bg-red-950/40 dark:text-red-300"
                : "border-slate-200 text-slate-600 hover:border-red-600 hover:text-red-700 dark:border-slate-700 dark:text-slate-300"
            }`}
          >
            {favouriteCategory === categoryName
              ? "✓ Favourite category"
              : "Set as favourite"}
          </button>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Pick a dish to open it in the recipe view and save it to your profile.
        </p>
      </section>

      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          Loading meals...
        </div>
      ) : errorMessage ? (
        <div className="rounded-3xl border border-red-200/80 bg-red-50/80 p-6 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
          {errorMessage}
        </div>
      ) : meals.length > 0 ? (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {meals.map((meal) => (
            <li
              key={meal.idMeal}
              onClick={() => handleViewItem(meal.idMeal)}
              className="group flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
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
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                  {meal.strMeal}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  Tap to open this recipe.
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          No meals found for this category.
        </div>
      )}
    </div>
  );
};

export default CategoryDetailPage;


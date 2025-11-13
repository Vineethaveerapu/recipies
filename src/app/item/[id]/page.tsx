"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserContext } from "@/utils/contexts";
import { SavedItemType, UserContextType } from "@/utils/types";

type MealDetail = {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string | null;
  [key: `strIngredient${number}`]: string | null;
  [key: `strMeasure${number}`]: string | null;
};

const API_ENDPOINT = "https://www.themealdb.com/api/json/v1/1/lookup.php";

const ItemPage = () => {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { addSavedItem, removeSavedItem, savedItems } =
    useUserContext() as UserContextType;

  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mealId = params.id ? decodeURIComponent(params.id) : "";

  useEffect(() => {
    if (!mealId) {
      return;
    }

    const fetchMeal = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(
          `${API_ENDPOINT}?i=${encodeURIComponent(mealId)}`
        );
        const data = await response.json();
        const mealData = data?.meals?.[0] ?? null;
        setMeal(mealData);
      } catch (error) {
        console.error("Failed to fetch meal details", error);
        setErrorMessage(
          "We could not load the details for this recipe. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeal();
  }, [mealId]);

  const ingredients = useMemo(() => {
    if (!meal) {
      return [];
    }

    const parsedIngredients: Array<{ ingredient: string; measure: string }> =
      [];

    for (let index = 1; index <= 20; index += 1) {
      const ingredient =
        meal[`strIngredient${index}` as keyof MealDetail]?.trim();
      const measure = meal[`strMeasure${index}` as keyof MealDetail]?.trim();

      if (ingredient) {
        parsedIngredients.push({
          ingredient,
          measure: measure || ""
        });
      }
    }

    return parsedIngredients;
  }, [meal]);

  const isSaved = useMemo(
    () => savedItems.some((item) => item.id === mealId),
    [savedItems, mealId]
  );

  const handleToggleSave = () => {
    if (!meal) {
      return;
    }

    const savedItem: SavedItemType = {
      id: meal.idMeal,
      name: meal.strMeal,
      thumbnail: meal.strMealThumb,
      category: meal.strCategory
    };

    if (isSaved) {
      removeSavedItem(savedItem.id);
    } else {
      addSavedItem(savedItem);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      <section className="space-y-3">
        <button
          onClick={() => router.back()}
          className="text-sm font-semibold text-red-700 transition hover:text-red-800"
        >
          ← Back
        </button>
        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            Loading recipe...
          </div>
        ) : errorMessage ? (
          <div className="rounded-3xl border border-red-200/80 bg-red-50/80 p-6 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
            {errorMessage}
          </div>
        ) : meal ? (
          <>
            <header className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {meal.strMeal}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-300">
                  {meal.strCategory} • {meal.strArea}
                </p>
              </div>
              <button
                onClick={handleToggleSave}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
                  isSaved
                    ? "bg-red-700 text-white shadow-md shadow-red-700/20 hover:bg-red-800"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-red-600 hover:text-red-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                }`}
              >
                {isSaved ? "✓ Saved to profile" : "Save this recipe"}
              </button>
            </header>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr),minmax(0,1fr)]">
              <div className="space-y-6">
                <div className="relative aspect-video overflow-hidden rounded-3xl border border-slate-100 shadow-xl dark:border-slate-800 lg:aspect-[4/3]">
                  {meal.strMealThumb && (
                    <Image
                      src={meal.strMealThumb}
                      alt={meal.strMeal}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover"
                      priority
                    />
                  )}
                </div>
                <section className="space-y-3 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Instructions
                  </h2>
                  <div className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                    {meal.strInstructions
                      .split("\r\n")
                      .filter(Boolean)
                      .map((step, index) => (
                        <p key={index}>
                          <span className="mr-2 font-semibold text-red-700">
                            Step {index + 1}:
                          </span>
                          {step}
                        </p>
                      ))}
                  </div>
                </section>
                {meal.strYoutube && (
                  <section className="rounded-3xl bg-slate-900/90 p-6 text-white shadow-xl">
                    <h2 className="text-xl font-semibold">
                      Watch the tutorial
                    </h2>
                    <p className="mt-2 text-sm text-white/80">
                      Prefer video instructions? Follow along on YouTube.
                    </p>
                    <button
                      onClick={() =>
                        window.open(meal.strYoutube ?? "", "_blank")
                      }
                      className="mt-4 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-red-50/80 hover:shadow-lg"
                    >
                      Open video →
                    </button>
                  </section>
                )}
              </div>
              <aside className="space-y-6">
                <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:bg-slate-900 dark:ring-slate-800">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Ingredients
                  </h2>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    {ingredients.map((item, index) => (
                      <li
                        key={`${item.ingredient}-${index}`}
                        className="flex flex-col gap-1 rounded-xl bg-slate-50 px-4 py-2 sm:flex-row sm:items-center sm:justify-between dark:bg-slate-800/60"
                      >
                        <span className="font-medium text-slate-800 dark:text-slate-100">
                          {item.ingredient}
                        </span>
                        <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-300">
                          {item.measure}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </aside>
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
            No recipe found.
          </div>
        )}
      </section>
    </div>
  );
};

export default ItemPage;

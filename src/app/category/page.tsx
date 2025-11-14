"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/utils/contexts";
import { Category, UserContextType } from "@/utils/types";

const API_ENDPOINT = "https://www.themealdb.com/api/json/v1/1/categories.php";

const CategoryPage = () => {
  const { favouriteCategory, setFavouriteCategory, user } =
    useUserContext() as UserContextType;
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await fetch(API_ENDPOINT);
        const data = await response.json();
        setCategories(data?.categories ?? []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        setErrorMessage(
          "We could not load categories right now. Please retry in a moment."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleViewCategory = (categoryName: string) => {
    router.push(`/category/${categoryName.toLowerCase()}`);
  };

  const handleSelectFavourite = (categoryName: string) => {
    setFavouriteCategory(categoryName);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-10 pb-16">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Categories
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-300">
          Explore all available categories. Choose one as your favourite to see
          tailored recommendations on the home page.
        </p>
      </section>

      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          Loading categories...
        </div>
      ) : errorMessage ? (
        <div className="rounded-3xl border border-red-200/80 bg-red-50/80 p-6 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-300">
          {errorMessage}
        </div>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const isFavourite =
              favouriteCategory?.toLowerCase() ===
              category.strCategory.toLowerCase();

            return (
              <li
                key={category.idCategory}
                className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  {category.strCategoryThumb && (
                    <Image
                      src={category.strCategoryThumb}
                      alt={category.strCategory}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {category.strCategory}
                    </h2>
                    <p className="line-clamp-4 text-sm text-slate-500 dark:text-slate-300">
                      {category.strCategoryDescription}
                    </p>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-3">
                    <button
                      onClick={() => handleViewCategory(category.strCategory)}
                      className="flex-1 rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-600"
                    >
                      View items
                    </button>
                    <button
                      onClick={() =>
                        handleSelectFavourite(category.strCategory)
                      }
                      className={`flex-1 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        isFavourite
                          ? "border-red-600 bg-red-50/80 text-red-700 shadow-sm dark:border-red-600/80 dark:bg-red-950/40 dark:text-red-300"
                          : "border-slate-200 text-slate-600 hover:border-red-600 hover:text-red-700 dark:border-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {isFavourite ? "✓ Favourite" : "Set favourite"}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CategoryPage;

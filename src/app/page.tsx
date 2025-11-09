"use client";
import { useUserContext } from "@/utils/contexts";
import { UserContextType } from "@/utils/types";
import { useEffect } from "react";

export default function Home() {
  const { user } = useUserContext() as UserContextType;
  const API_ENDPOINT = "https://www.themealdb.com/api/json/v1/1/";

  const getCategoryRecipes = async () => {
    try {
      const response = await fetch(
        `${API_ENDPOINT}filter.php?c=${user?.favouriteCategories}`
      );
      const data = await response.json();
      return data.meals;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const getRandomRecipe = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}random.php`);
      const data = await response.json();
      return data.meals[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  useEffect(() => {
    getCategoryRecipes();
    getRandomRecipe();
  }, [user?.favouriteCategories]);

  return (
    <div>
      {user && (
        <>
          <h1>Welcome to my site {user.name}</h1>
          {user.favouriteCategories ? (
            <p>Your favourite categories are </p>
          ) : (
            <p>You have no favourite categories</p>
          )}
          <p>Your favourite recipes are {user.favouriteRecipes?.join(", ")}</p>
        </>
      )}
    </div>
  );
}

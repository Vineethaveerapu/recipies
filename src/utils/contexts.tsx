"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { SavedItemType, UserContextType, UserType } from "./types";

const STORAGE_KEY = "recipes-app-state";

type StoredState = {
  user: UserType;
  favouriteCategory: string | null;
  savedItems: SavedItemType[];
};

type StoredUserState = {
  favouriteCategory: string | null;
  savedItems: SavedItemType[];
};

const getUserStorageKey = (userId: string) => `${STORAGE_KEY}-${userId}`;

const UserContext = createContext<UserContextType | null>(null);

export const UserContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [savedItems, setSavedItems] = useState<SavedItemType[]>([]);
  const [favouriteCategory, setFavouriteCategoryState] = useState<
    string | null
  >(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedState = window.localStorage.getItem(STORAGE_KEY);

    if (storedState) {
      try {
        const parsedState: StoredState = JSON.parse(storedState);
        setUser(parsedState.user);
        setSavedItems(parsedState.savedItems ?? []);
        setFavouriteCategoryState(
          parsedState.favouriteCategory ??
            parsedState.user?.favouriteCategories?.[0] ??
            null
        );
      } catch (error) {
        console.error("Failed to parse stored user state", error);
      }
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady || typeof window === "undefined") {
      return;
    }

    if (user) {
      const stateToStore: StoredState = {
        user,
        favouriteCategory,
        savedItems
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [user, favouriteCategory, savedItems, isReady]);

  useEffect(() => {
    if (!isReady || typeof window === "undefined" || !user) {
      return;
    }

    const perUserState: StoredUserState = {
      favouriteCategory,
      savedItems
    };
    window.localStorage.setItem(
      getUserStorageKey(user.id),
      JSON.stringify(perUserState)
    );
  }, [user, favouriteCategory, savedItems, isReady]);

  const login = (selectedUser: UserType) => {
    if (typeof window !== "undefined") {
      const storedPerUser = window.localStorage.getItem(
        getUserStorageKey(selectedUser.id)
      );

      if (storedPerUser) {
        try {
          const parsedPerUser: StoredUserState = JSON.parse(storedPerUser);
          setSavedItems(parsedPerUser.savedItems ?? []);
          setFavouriteCategoryState(
            parsedPerUser.favouriteCategory ??
              selectedUser.favouriteCategories[0] ??
              null
          );
        } catch (error) {
          console.error("Failed to parse per user state", error);
          setSavedItems([]);
          setFavouriteCategoryState(
            selectedUser.favouriteCategories[0] ?? null
          );
        }
      } else {
        setSavedItems([]);
        setFavouriteCategoryState(selectedUser.favouriteCategories[0] ?? null);
      }
    }

    setUser(selectedUser);
  };

  const logout = () => {
    setUser(null);
    setSavedItems([]);
    setFavouriteCategoryState(null);
  };

  const setFavouriteCategory = (category: string) => {
    setFavouriteCategoryState(category);
  };

  const addSavedItem = (item: SavedItemType) => {
    setSavedItems((prevItems) => {
      if (prevItems.some((savedItem) => savedItem.id === item.id)) {
        return prevItems;
      }

      return [...prevItems, item];
    });
  };

  const removeSavedItem = (itemId: string) => {
    setSavedItems((prevItems) =>
      prevItems.filter((savedItem) => savedItem.id !== itemId)
    );
  };

  const value = useMemo(
    () => ({
      user,
      favouriteCategory,
      savedItems,
      isReady,
      login,
      logout,
      setFavouriteCategory,
      addSavedItem,
      removeSavedItem
    }),
    [user, favouriteCategory, savedItems, isReady]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used within a UserContextProvider");
  }

  return context;
};

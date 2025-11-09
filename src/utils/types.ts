export interface UserType {
  id: string;
  name: string;
  favouriteCategories: string[];
}

export interface SavedItemType {
  id: string;
  name: string;
  thumbnail: string;
  category: string;
}

export interface UserContextType {
  user: UserType | null;
  favouriteCategory: string | null;
  savedItems: SavedItemType[];
  isReady: boolean;
  login: (user: UserType) => void;
  logout: () => void;
  setFavouriteCategory: (category: string) => void;
  addSavedItem: (item: SavedItemType) => void;
  removeSavedItem: (itemId: string) => void;
}

export interface NavItemType {
  name: string;
  link: string;
}

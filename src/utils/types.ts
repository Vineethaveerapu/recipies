export interface UserType {
  name: string;
  favouriteCategories: string[] | null;
  favouriteRecipes: string[] | null;
}

export interface UserContextType {
  user: UserType | null;
  setUser: (user: UserType) => void;
}

export interface NavItemType {
  name: string;
  link: string;
}

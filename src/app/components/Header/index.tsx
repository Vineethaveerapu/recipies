"use client";
import { useUserContext } from "@/utils/contexts";
import { UserContextType } from "@/utils/types";

const Header = () => {
  const { user } = useUserContext() as UserContextType;
  return (
    <header>
      <h1>Recipe App</h1>
      {user && <p>Hello {user.name}</p>}
    </header>
  );
};

export default Header;

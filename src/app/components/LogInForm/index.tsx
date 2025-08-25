"use client";
import { userArray } from "@/data/user";
import { useState } from "react";



const LogInForm = () => {
    const [userInput, setUserInput] = useState<string>("");
    const [userNotFound, setUserNotFound] = useState<boolean>(true);


  const handleClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  const loggedInUser = userArray.filter((user) => user.name === userInput);
  if (!loggedInUser[0]) {
    setUserNotFound(false);
  }else{
    setUserNotFound(true);
  }

  };
  const handleChange = (e: { target: { value: string } }) => {
    setUserInput(e.target.value);
  };
  return (
    <>
    <form>
      <label htmlFor="username">Enter your Username</label>
      <input onChange={handleChange} id="username" type="text" placeholder="Username" />
      <label htmlFor="password">Enter your Password</label>
      <input id="password" type="password" placeholder="Password" />
      <button onClick={handleClick}>Log In</button>
    </form>
    {!userNotFound && <p>User not found</p>}
    </>
  );
};

export default LogInForm;
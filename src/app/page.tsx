import Header from "./components/Header";
import LogInForm from "./components/LogInForm";

export default function Home() {
  const user = false;
  return (
    <div>
      <Header />
      {user ? <p>You are logged in</p> : <LogInForm />}
    </div>
  );
}

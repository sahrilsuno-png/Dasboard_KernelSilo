import { useState } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | undefined>();

  const handleLogin = (name: string) => {
    setUserName(name);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUserName(undefined);
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return <Dashboard userName={userName} onLogout={handleLogout} />;
};

export default Index;

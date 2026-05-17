import { Outlet, useNavigate, useLocation } from "react-router";
import "./App.css";
import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import {useThemeStore} from "./store/useThemeStore"

function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();
  const {theme} = useThemeStore()
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log("User Auth:", authUser);
  useEffect(() => {
  // Sets the theme directly on the root html element
  document.documentElement.setAttribute("data-theme", theme);
}, [theme]);

  useEffect(() => {
    // If checking is finished and there is no user
    if (!isCheckingAuth && !authUser) {
      // Don't redirect if they are already on login or signup pages
      if (location.pathname !== "/login" && location.pathname !== "/signup" && location.pathname!== "/settings") {
        navigate("/signup");
      }
    }
    else {
      // If user is authenticated and tries to access login or signup, redirect to home
      if ((location.pathname === "/login" || location.pathname === "/signup") && authUser) {
        navigate("/");
      }
    }
  }, [authUser, isCheckingAuth, navigate, location.pathname]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  // Inside your App() component function


  return (
    <div className="app-container" data-theme={theme}>
      <NavBar />
      <Toaster />

      <main className="pt-16.5 container mx-auto px-4">
        {}
        <Outlet />
      </main>

      {/* Anything placed here (like a Footer) stays on every page */}
    </div>
  );
}

export default App;

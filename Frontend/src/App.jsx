import { Outlet, useNavigate, useLocation } from "react-router";
import "./App.css";
import { useEffect } from "react";
import NavBar from "./components/Navbar";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";
import BottomNav from "./components/BottomNav"; // IMPORT YOUR BOTTOM NAV

function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log("User Auth:", authUser);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!isCheckingAuth && !authUser) {
      if (location.pathname !== "/login" && location.pathname !== "/signup" && location.pathname !== "/settings") {
        navigate("/signup");
      }
    } else {
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

  // Helper check: Hide the navigation bar if user is on auth screens
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="app-container min-h-screen flex flex-col pb-16 md:pb-0" data-theme={theme}>
      <NavBar />
      <Toaster />

      <main className="flex-1 pt-16.5 container mx-auto px-4">
        <Outlet />
      </main>

      {/* Renders the navigation menu for authenticated users across application panels */}
      {authUser && !isAuthPage && <BottomNav />}
    </div>
  );
}

export default App;

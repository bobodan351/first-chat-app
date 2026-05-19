import { Outlet, useNavigate, useLocation } from "react-router";
import "./App.css";
import { useEffect } from "react";
import NavBar from "./components/Navbar";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";
import BottomNav from "./components/BottomNav";

function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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

  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="app-container min-h-screen flex flex-col" data-theme={theme}>
      <NavBar />
      <Toaster />

      {/* 
        FIXED: Added explicitly isolated 'pb-20' padding down here to the main viewport layout.
        This forces your page text/chat lists upward so the floating navbar cannot cover them.
      */}
      <main className="flex-1 pt-16.5 pb-20 md:pb-0 container mx-auto px-4 overflow-x-hidden">
        <Outlet />
      </main>

      {authUser && !isAuthPage && <BottomNav />}
    </div>
  );
}

export default App;

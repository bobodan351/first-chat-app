import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import NavBar from './components/NavBar.jsx'
import SideBar from './components/Sidebar.jsx' // Don't forget to import this!
import HomePage from "./pages/HomePage.jsx"
import { createBrowserRouter, RouterProvider } from 'react-router'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import FeedContainer from './pages/FeedContainer.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App is now the main wrapper
    children: [
      {
        path: "/", // This is the default page (index)
        element: <HomePage />
      },
      {
      path: "login", element: <LoginPage/>
      },
      {
        path: "profile", element: <ProfilePage/>
      },
      {
        path: "signup", element: <SignUpPage/>
      },
      {
        path: "settings", element:<SettingsPage/>
      },
      {
        path: "feeds", element: <FeedContainer/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>
)

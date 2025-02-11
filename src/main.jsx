import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigation,
  Outlet,
  Navigate,
} from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Signin from "./components/Signin.jsx";
import Signup from "./components/Signup.jsx";
import Register from "./components/Register.jsx";
import Goals from "./components/Goals.jsx";
import Musclegain from "./components/Musclegain.jsx";
import Fatloss from "./components/Fatloss.jsx";
import Activity from "./components/Activity.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Protectedroute from "./components/Protectedroute.jsx";

const token = localStorage.getItem("token");

// Loading Screen Component
const LoadingScreen = () => (
  <div className="fixed top-0 left-0 w-full h-full bg-white flex justify-center items-center text-xl">
    Loading...
  </div>
);

// Layout Component that wraps all pages
const Layout = () => {
  const navigation = useNavigation();
  return (
    <>
      {navigation.state === "loading" && <LoadingScreen />}
      <Outlet /> {/* This renders the current route */}
    </>
  );
};

// Define Routes with Layout Wrapper
const router = createBrowserRouter([
  {
    element: <Layout />, // 👈 Wrap all routes inside Layout
    children: [
      {
        path: "/",
        element: token ? <Navigate to="/dashboard" /> : <App />,
      },
      {
        path: "/signin",
        element: <Signin />,
      },
      {
        path: "/signup/userdata",
        element: (
          <Protectedroute>
            <Signup />
          </Protectedroute>
        ),
      },
      {
        path: "/signup",
        element: <Register />,
      },
      {
        path: "/goals",
        element: (
          <Protectedroute>
            <Goals />
          </Protectedroute>
        ),
      },
      {
        path: "/musclegain",
        element: (
          <Protectedroute>
            <Musclegain />
          </Protectedroute>
        ),
      },
      {
        path: "/fatloss",
        element: (
          <Protectedroute>
            <Fatloss />
          </Protectedroute>
        ),
      },
      {
        path: "/activity",
        element: (
          <Protectedroute>
            <Activity />
          </Protectedroute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <Protectedroute>
            <Dashboard />
          </Protectedroute>
        ),
      },
    ],
  },
]);

// Render the App
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

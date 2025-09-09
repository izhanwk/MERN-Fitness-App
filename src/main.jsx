import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import Sessions from "./components/Sessions.jsx";
import Changepassword from "./components/Changepassword.jsx";
import { Navigate } from "react-router-dom";
import Edit from "./components/Edit.jsx";
const token = localStorage.getItem("token");

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: token ? <Navigate to="/dashboard" /> : <App />,
    },
    {
      path: "/signin",
      element: <Signin />,
    },
    {
      path: "/changepassword",
      element: <Changepassword />,
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
    {
      path: "/sessions",
      element: (
        <Protectedroute>
          <Sessions />
        </Protectedroute>
      ),
    },
    {
      path: "/edit",
      element: (
        <Protectedroute>
          <Edit />
        </Protectedroute>
      ),
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

// React
import { StrictMode } from "react";

// Styles
import "./index.css";

// React Router
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";

// Context
import StoreProvider from "@/lib/context/StoreProvider.tsx";

// Components
import App from "./App.tsx";
import Landing from "./routes/landing/landing.tsx";
import Auth from "@/app/routes/login/auth.tsx";
import Faraday from "@/app/routes/data/data.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/data",
        element: <Faraday />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <RouterProvider router={router} />
    </StoreProvider>
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import "@elmethis/react/style.css";
import "@copilotkit/react-core/v2/styles.css";

import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);

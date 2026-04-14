import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import "@elmethis/react/style.css";

import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import { PuzzleApp } from "./pages/puzzle-app.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/puzzle",
    element: <PuzzleApp />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

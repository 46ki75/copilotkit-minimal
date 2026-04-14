import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import "@elmethis/react/style.css";

import App from "./App.tsx";
import { CopilotKit } from "@copilotkit/react-core";

import { ToolCallRenderer } from "./components/ToolCallRenderer.tsx";
import { defineToolCallRenderer } from "@copilotkit/react-core/v2";
import { createBrowserRouter, RouterProvider } from "react-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CopilotKit
      runtimeUrl="http://localhost:3000/copilotkit"
      renderToolCalls={[
        defineToolCallRenderer({
          name: "*",
          render: ({ name, status, result, args }) => {
            return (
              <ToolCallRenderer
                name={name}
                status={status}
                result={result}
                args={args}
              />
            );
          },
        }),
      ]}
    >
      <RouterProvider router={router} />
    </CopilotKit>
  </StrictMode>,
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import "@elmethis/react/style.css";

import App from "./App.tsx";
import { CopilotKit } from "@copilotkit/react-core";

import { ToolCallRenderer } from "./components/ToolCallRenderer.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CopilotKit
      runtimeUrl="http://localhost:3000/copilotkit"
      renderToolCalls={[ToolCallRenderer]}
    >
      <App />
    </CopilotKit>
  </StrictMode>,
);

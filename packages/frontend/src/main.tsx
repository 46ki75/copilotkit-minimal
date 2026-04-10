import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CopilotKit } from "@copilotkit/react-core";
import "@copilotkit/react-ui/styles.css";

import { ToolCallRenderer } from "./components/tool-call-renderer.tsx";

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

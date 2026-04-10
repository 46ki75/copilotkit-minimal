import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { CopilotKit } from "@copilotkit/react-core";
import { defineToolCallRenderer } from "@copilotkit/react-core/v2";
import "@copilotkit/react-ui/styles.css";

const mcpToolRenderer = defineToolCallRenderer({
  name: "*", // Wildcard matches all tools (like MCP tools)
  render: ({ name, status, result }) => {
    if (status === "inProgress" || status === "executing") {
      return (
        <div
          style={{
            padding: "0.5rem",
            background: "#f3f4f6",
            borderRadius: "0.25rem",
            color: "#6b7280",
            fontSize: "0.875rem",
          }}
        >
          🔄 Executing: <strong>{name}</strong>...
        </div>
      );
    }

    if (status === "complete") {
      return (
        <div
          style={{
            padding: "0.5rem",
            background: "#ecfdf5",
            borderRadius: "0.25rem",
            color: "#065f46",
            fontSize: "0.875rem",
          }}
        >
          ✅ Finished: <strong>{name}</strong>
          <details
            style={{
              marginTop: "0.5rem",
              fontSize: "0.75rem",
              whiteSpace: "pre-wrap",
            }}
          >
            <summary>View Output</summary>
            {typeof result === "string"
              ? result
              : JSON.stringify(result, null, 2)}
          </details>
        </div>
      );
    }

    return <></>;
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CopilotKit
      runtimeUrl="http://localhost:3000/copilotkit"
      renderToolCalls={[mcpToolRenderer]}
    >
      <App />
    </CopilotKit>
  </StrictMode>,
);

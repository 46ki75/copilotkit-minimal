import "./App.css";
import { CopilotChat } from "@copilotkit/react-ui";
import { useDefaultRenderTool } from "@copilotkit/react-core/v2";

function GenericMCPRenderer() {
  useDefaultRenderTool({
    render: ({ name, status, result }) => {
      // In progress/executing state
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

      // Completed state
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
              {JSON.stringify(result, null, 2)}
            </details>
          </div>
        );
      }

      return <></>;
    },
  });

  // This is a headless component, it doesn't render its own outer DOM wrapper.
  return null;
}

function App() {
  return (
    <div className="app-container">
      {/* Mount the renderer anywhere inside the <CopilotKit> provider */}
      <GenericMCPRenderer />

      <main>
        <h1>CopilotKit Minimal Setup</h1>
        <p>This is a minimal implementation of CopilotKit.</p>
        <p>Interact with the chat below. MCP tools will render inline!</p>

        <pre>
          <span>SAMPLE:&nbsp;</span>
          <code>What is a new service called Amazon S3 Files?</code>
        </pre>

        <div style={{ height: "500px", marginTop: "2rem" }}>
          <CopilotChat
            instructions="You are a helpful assistant. Use tools if needed."
            labels={{ title: "My Assistant", initial: "How can I help?" }}
          />
        </div>
      </main>
    </div>
  );
}

export default App;

import "./App.css";
import { CopilotChat } from "@copilotkit/react-ui";

function App() {
  return (
    <div className="app-container">
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

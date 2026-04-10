import "./App.css";
import { CopilotPopup } from "@copilotkit/react-ui";

function App() {
  return (
    <div className="app-container">
      <CopilotPopup
        instructions="You are a helpful assistant."
        labels={{ title: "My Assistant", initial: "How can I help?" }}
      />

      <main>
        <h1>CopilotKit Minimal Setup</h1>
        <p>This is a minimal implementation of CopilotKit.</p>
        <p>
          Click the chat icon in the bottom right corner to start interacting!
        </p>
      </main>
    </div>
  );
}

export default App;

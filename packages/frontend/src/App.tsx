import "./App.css";
import { CopilotChat } from "@copilotkit/react-ui";

function App() {
  return (
    <div className="app-container">
      <main>
        <h1>CopilotKit Minimal Setup</h1>
        <p>This is a minimal implementation of CopilotKit.</p>
        <p>
          Click the chat icon in the bottom right corner to start interacting!
        </p>

        <div>
          <CopilotChat />
        </div>
      </main>
    </div>
  );
}

export default App;

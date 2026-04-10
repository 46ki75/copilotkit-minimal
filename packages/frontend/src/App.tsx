import { useFrontendTool } from "@copilotkit/react-core/v2";
import "./App.css";
import { CopilotChat } from "@copilotkit/react-ui";
import { z } from "zod";

import { v4, v7 } from "uuid";

function App() {
  useFrontendTool({
    name: "getDate",
    description: "Get the current date and time",
    handler: async () => {
      return new Date().toString();
    },
  });

  useFrontendTool({
    name: "generateUUID",
    description: "Generate a new UUID of a specified version (v4 or v7)",
    parameters: z.object({
      version: z.enum(["v4", "v7"]).default("v4"),
    }),
    handler: async ({ version }) => {
      const genFnMap: Record<typeof version, () => string> = {
        v4: v4,
        v7: v7,
      };

      const uuid = genFnMap[version]();

      return { version, uuid };
    },
  });

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

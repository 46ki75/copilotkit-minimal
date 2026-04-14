import { ElmToggleTheme } from "@elmethis/react";
import { ChatContainer } from "./containers/ChatContainer";
import { ChatHistory } from "./components/ChatHistory";
import { useChatHistory } from "./hooks/use-chat-history";

import styles from "./App.module.css";
import "@copilotkit/react-core/v2/styles.css";
import {
  CopilotKitProvider,
  useAgent,
  defineToolCallRenderer,
  createA2UIMessageRenderer,
} from "@copilotkit/react-core/v2";
import { useRef } from "react";

import { ToolCallRenderer } from "./components/ToolCallRenderer.tsx";

function AppContent() {
  const { agent } = useAgent();
  const chatHistory = useChatHistory();
  const { selectHistory } = chatHistory;
  const latestSelectIdRef = useRef<number | null>(null);

  const handleNewChat = async () => {
    agent.setMessages([]);
    selectHistory(null);
  };

  const handleSelectChat = async (historyId: number) => {
    latestSelectIdRef.current = historyId;
    const selected = await selectHistory(historyId);
    if (latestSelectIdRef.current !== historyId) return;
    agent.setMessages(selected?.messages || []);
  };

  const handleDeleteChat = async (historyId: number) => {
    await chatHistory.deleteHistory(historyId);
    if (latestSelectIdRef.current === historyId) {
      agent.setMessages([]);
      selectHistory(null);
    }
  };

  return (
    <>
      <div className={styles["toggle-theme"]}>
        <ElmToggleTheme size={64} />
      </div>

      <div className={styles["app-container"]}>
        <ChatHistory
          chatHistory={chatHistory}
          handleNewChat={handleNewChat}
          handleSelectChat={handleSelectChat}
          handleDeleteChat={handleDeleteChat}
        />

        <div style={{ flex: 1 }}>
          <ChatContainer chatHistory={chatHistory} />
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <CopilotKitProvider
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
      renderActivityMessages={[
        createA2UIMessageRenderer({
          theme: {},
        }),
      ]}
    >
      <AppContent />
    </CopilotKitProvider>
  );
}

export default App;

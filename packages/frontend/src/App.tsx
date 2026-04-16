import { ElmToggleTheme } from "@elmethis/react";
import { ChatContainer } from "./containers/ChatContainer";
import { ChatHistory } from "./components/ChatHistory";
import { useChatHistory } from "./hooks/use-chat-history";

import styles from "./App.module.css";
import "@copilotkit/react-core/v2/styles.css";
import {
  CopilotKitProvider,
  useAgent,
  createA2UIMessageRenderer,
} from "@copilotkit/react-core/v2";
import { useRef } from "react";
import { useToDo } from "./containers/ToDo";

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

  const { render } = useToDo();

  return (
    <>
      {render()}

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
      runtimeUrl="http://localhost:8080/copilotkit"
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

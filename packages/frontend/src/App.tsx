import { ElmToggleTheme } from "@elmethis/react";
import { ChatContainer } from "./containers/ChatContainer";
import { ChatHistory } from "./components/ChatHistory";
import { useChatHistory } from "./hooks/use-chat-history";

import styles from "./App.module.css";
import { useAgent } from "@copilotkit/react-core/v2";
import { useRef } from "react";

function App() {
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

export default App;

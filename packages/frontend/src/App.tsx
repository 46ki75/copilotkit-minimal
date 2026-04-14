import { ElmToggleTheme } from "@elmethis/react";
import { ChatContainer } from "./components/ChatContainer";
import { ChatHistory } from "./components/ChatHistory";
import { useChatHistory } from "./composables/chat-history";

import styles from "./App.module.css";
import { useAgent } from "@copilotkit/react-core/v2";

function App() {
  const { agent } = useAgent();
  const chatHistory = useChatHistory();
  const { createNewChat, selectHistory, currentHistory } = chatHistory;

  const handleNewChat = async () => {
    agent.setMessages([]);
    await createNewChat();
  };

  const handleSelectChat = async (historyId: number) => {
    await selectHistory(historyId);
    agent.setMessages(currentHistory?.messages || []);
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
        />

        <div style={{ flex: 1 }}>
          <ChatContainer chatHistory={chatHistory} />
        </div>
      </div>
    </>
  );
}

export default App;

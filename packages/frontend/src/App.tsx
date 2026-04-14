import { ElmToggleTheme } from "@elmethis/react";
import { ChatContainer } from "./components/ChatContainer";
import { ChatHistory } from "./components/ChatHistory";
import { useChatHistory } from "./composables/chat-history";

import styles from "./App.module.css";

function App() {
  const chatHistory = useChatHistory();

  return (
    <>
      <div className={styles["toggle-theme"]}>
        <ElmToggleTheme size={64} />
      </div>

      <div className={styles["app-container"]}>
        <ChatHistory chatHistory={chatHistory} />

        <div style={{ flex: 1 }}>
          <ChatContainer chatHistory={chatHistory} />
        </div>
      </div>
    </>
  );
}

export default App;

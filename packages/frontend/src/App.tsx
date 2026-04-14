import { ElmToggleTheme } from "@elmethis/react";
import { ChatContainer } from "./components/ChatContainer";
import { ChatHistory } from "./components/ChatHistory";

import styles from "./App.module.css";

function App() {
  return (
    <>
      <div className={styles["toggle-theme"]}>
        <ElmToggleTheme size={64} />
      </div>

      <div className={styles["app-container"]}>
        <ChatHistory
          histories={[
            {
              id: "05385def-6c6d-4c4a-ba8d-6684f734fe05",
              title: "test",
            },
          ]}
        />

        <div style={{ flex: 1 }}>
          <ChatContainer />
        </div>
      </div>
    </>
  );
}

export default App;

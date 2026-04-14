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
        <ChatHistory />

        <div style={{ flex: 1 }}>
          <ChatContainer />
        </div>
      </div>
    </>
  );
}

export default App;

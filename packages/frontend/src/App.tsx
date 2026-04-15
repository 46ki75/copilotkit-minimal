import { ElmToggleTheme } from "@elmethis/react";
import { ChatContainer } from "./containers/ChatContainer";

import styles from "./App.module.css";
import "@copilotkit/react-core/v2/styles.css";
import { CopilotKitProvider } from "@copilotkit/react-core/v2";

function AppContent() {
  return (
    <>
      <div className={styles["toggle-theme"]}>
        <ElmToggleTheme size={64} />
      </div>

      <div className={styles["app-container"]}>
        <div style={{ flex: 1 }}>
          {/* <ChatContainer chatHistory={chatHistory} /> */}
          <ChatContainer />
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <CopilotKitProvider runtimeUrl="http://localhost:3000/copilotkit">
      <AppContent />
    </CopilotKitProvider>
  );
}

export default App;

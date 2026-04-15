import { ElmToggleTheme } from "@elmethis/react";
import { ChatContainer } from "./containers/ChatContainer";

import styles from "./App.module.css";
import "@copilotkit/react-core/v2/styles.css";
import {
  CopilotKitProvider,
  createA2UIMessageRenderer,
} from "@copilotkit/react-core/v2";

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

const renderActivityMessages = [
  createA2UIMessageRenderer({
    theme: {},
  }),
];

function App() {
  return (
    <CopilotKitProvider
      runtimeUrl="http://localhost:3000/copilotkit"
      renderActivityMessages={renderActivityMessages}
    >
      <AppContent />
    </CopilotKitProvider>
  );
}

export default App;

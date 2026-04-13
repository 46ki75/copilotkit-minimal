import { ElmToggleTheme } from "@elmethis/react";
import { ChatContainer } from "./components/ChatContainer";

function App() {
  return (
    <div>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          padding: ".5rem",
        }}
      >
        <ElmToggleTheme />
      </div>
      <ChatContainer />
    </div>
  );
}

export default App;

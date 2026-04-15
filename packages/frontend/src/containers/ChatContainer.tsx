import React, { useMemo } from "react";
import {
  CopilotChat,
  // useAgent,
  useConfigureSuggestions,
} from "@copilotkit/react-core/v2";

// Styles
import styles from "./ChatContainer.module.css";
// import { useGenerateUuidFrontendTool } from "../frontend-tool/generate-uuid";
import { useGetDateFrontendTool } from "../frontend-tool/get-date";

export interface ChatContainerProps {
  style?: React.CSSProperties;
  // chatHistory: ReturnType<typeof useChatHistory>;
}

export const ChatContainer = (props: ChatContainerProps) => {
  useGetDateFrontendTool();

  const suggestionsConfig = useMemo(
    () => ({
      available: "always" as const,
      suggestions: [
        {
          title: "What time is it in Tokyo?",
          message: "What time is it in Tokyo right now?",
        },
      ],
    }),
    [],
  );
  useConfigureSuggestions(suggestionsConfig);

  return (
    <div style={props.style}>
      <main data-copilotkit className={styles["wrapper"]}>
        <CopilotChat
          className={styles["chat-container"]}
          attachments={{
            enabled: true,
          }}
        />
      </main>
    </div>
  );
};

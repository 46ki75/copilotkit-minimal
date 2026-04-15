import React, { useMemo } from "react";
import {
  CopilotChat,
  CopilotChatToolCallsView,
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

// Workaround: TOOL_CALL_START can fire for an already-present tool call when a
// MESSAGES_SNAPSHOT is processed before the event, producing duplicate IDs in
// message.toolCalls. Deduplicate by ID before handing off to the default view.
type ToolCallsViewProps = React.ComponentProps<typeof CopilotChatToolCallsView>;
function DeduplicatedToolCallsView({ message, messages }: ToolCallsViewProps) {
  const deduped = message.toolCalls
    ? {
        ...message,
        toolCalls: [
          ...new Map(message.toolCalls.map((tc) => [tc.id, tc])).values(),
        ],
      }
    : message;
  return <CopilotChatToolCallsView message={deduped} messages={messages} />;
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
          chatView={{
            messageView: {
              assistantMessage: { toolCallsView: DeduplicatedToolCallsView },
            },
          }}
        />
      </main>
    </div>
  );
};

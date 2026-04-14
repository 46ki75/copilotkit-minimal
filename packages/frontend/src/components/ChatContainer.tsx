import React, { useEffect, useRef } from "react";
import {
  CopilotChat,
  useAgent,
  useConfigureSuggestions,
} from "@copilotkit/react-core/v2";

// Components
import {
  ElmDivider,
  ElmHeading,
  ElmInlineText,
  ElmMarkdown,
} from "@elmethis/react";

// Styles
import styles from "./ChatContainer.module.css";
import { useGenerateUuidFrontendTool } from "../frontend-tool/generate-uuid";
import { useGetDateFrontendTool } from "../frontend-tool/get-date";
import { UserMessage } from "./UserMessage";
import { ScrollToBottomButton } from "./ScrollToBottomButton";
import { SuggestionPill } from "./SuggestionPill";
import { type useChatHistory } from "../composables/chat-history";

export interface ChatContainerProps {
  style?: React.CSSProperties;
  chatHistory: ReturnType<typeof useChatHistory>;
}

export const ChatContainer = (props: ChatContainerProps) => {
  const { agent } = useAgent();
  const { currentHistory, saveMessagesToHistory } = props.chatHistory;

  const currentHistoryRef = useRef(currentHistory);

  useEffect(() => {
    currentHistoryRef.current = currentHistory;
  }, [currentHistory]);

  useEffect(() => {
    const { unsubscribe } = agent.subscribe({
      onRunFinalized: async () => {
        const history = currentHistoryRef.current;
        if (!history?.id) return;
        await saveMessagesToHistory(history.id, agent.messages);
      },
    });

    return unsubscribe;
  }, [agent, saveMessagesToHistory]);

  useGetDateFrontendTool();
  useGenerateUuidFrontendTool();

  useConfigureSuggestions({
    available: "always",
    suggestions: [
      {
        title: "What time is it in Tokyo?",
        message: "What time is it in Tokyo right now?",
      },
      {
        title: "Ask about Amazon S3 Files",
        message: " What is a new service called Amazon S3 Files?",
      },
      {
        title: "Ask about how to use axum web framework",
        message: " How to use axum web framework in Rust?",
      },
      {
        title: "Ask for UUID v4",
        message: " Generate a new UUID of version 4.",
      },
      {
        title: "Ask for UUID v7",
        message: " Generate a new UUID of version 7.",
      },
    ],
  });

  return (
    <div style={props.style}>
      <main data-copilotkit className={styles["wrapper"]}>
        <div className={styles.title}>
          <ElmInlineText>
            {currentHistory?.title}:{currentHistory?.id}
          </ElmInlineText>
        </div>
        <CopilotChat
          className={styles["chat-container"]}
          messageView={{
            /*
             * @see {@link https://docs.copilotkit.ai/built-in-agent/custom-look-and-feel/slots#nested-slots-drill-down}
             */
            assistantMessage: {
              markdownRenderer: ({ content }) => (
                <ElmMarkdown markdown={content} />
              ),

              toolbar: (args) => (
                <div
                  {...args}
                  style={{
                    display: "flex",
                    gap: 32,
                    flexDirection: "column",
                    marginBlockStart: 32,
                  }}
                >
                  <ElmDivider />

                  {args.children}
                </div>
              ),
              // copyButton: (args) => {
              //   return <button onClick={args.onClick}>A</button>;
              // },
            },
            userMessage: {
              messageRenderer: (args) => {
                return <UserMessage content={args.content} />;
              },
            },
          }}
          welcomeScreen={{
            welcomeMessage: () => {
              return (
                <div>
                  <ElmHeading level={1}>
                    <ElmInlineText>Welcome to Copilot Chat!</ElmInlineText>
                  </ElmHeading>
                </div>
              );
            },
          }}
          input={{}}
          suggestionView={{
            suggestion: SuggestionPill,
          }}
          scrollView={{
            // The gradient overlay at the bottom of the scroll area.
            feather: () => null,
            scrollToBottomButton: ({ onClick }) => {
              return <ScrollToBottomButton onClick={onClick} />;
            },
          }}
        />
      </main>
    </div>
  );
};

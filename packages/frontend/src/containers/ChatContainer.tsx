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
import { UserMessage } from "../components/UserMessage";
import { ScrollToBottomButton } from "../components/ScrollToBottomButton";
import { SuggestionPill } from "../components/SuggestionPill";
import { type useChatHistory } from "../hooks/use-chat-history";

export interface ChatContainerProps {
  style?: React.CSSProperties;
  chatHistory: ReturnType<typeof useChatHistory>;
}

export const ChatContainer = (props: ChatContainerProps) => {
  const { agent } = useAgent();
  const {
    currentHistoryWithMessages,
    saveMessagesToHistory,
    createNewChat,
    selectHistory,
  } = props.chatHistory;

  const currentHistoryRef = useRef(currentHistoryWithMessages);

  useEffect(() => {
    currentHistoryRef.current = currentHistoryWithMessages;
  }, [currentHistoryWithMessages]);

  useEffect(() => {
    const { unsubscribe } = agent.subscribe({
      onRunStartedEvent: async () => {
        if (currentHistoryRef.current == null) {
          const created = await createNewChat();
          if (created?.id) {
            selectHistory(created.id);
            currentHistoryRef.current = created;
          }
        }
      },
      onRunFinalized: async () => {
        const history = currentHistoryRef.current;
        if (history?.id) {
          await saveMessagesToHistory(history.id, agent.messages);
        }
      },
    });

    return unsubscribe;
  }, [agent, saveMessagesToHistory, createNewChat, selectHistory]);

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
            {currentHistoryWithMessages ? (
              <>
                {currentHistoryWithMessages?.title}:
                {currentHistoryWithMessages?.id}
              </>
            ) : (
              <>Hello</>
            )}
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

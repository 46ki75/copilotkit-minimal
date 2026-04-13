import React from "react";
import {
  CopilotChat,
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

export interface ChatContainerProps {
  style?: React.CSSProperties;
}

export const ChatContainer = (props: ChatContainerProps) => {
  useGetDateFrontendTool();
  useGenerateUuidFrontendTool();

  useConfigureSuggestions({
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
      <main data-copilotkit>
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

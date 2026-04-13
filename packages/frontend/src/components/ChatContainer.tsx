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
import clsx from "clsx";

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
        title: "Ask about AWS Lambda Function URLs",
        message:
          "How do I restrict requests to AWS Lambda Function URLs except Amazon CloudFront origins?",
      },
      {
        title: "Ask for current date",
        message: " What is the current date and time?",
      },
      {
        title: "Ask for UUID v4",
        message: " Generate a new UUID of version 4.",
      },
      {
        title: "Ask for UUID v7",
        message: " Generate a new UUID of version 7.",
      },
      {
        title: "Ask for AWS Lambda Durable Functions example code",
        message:
          "Show me an example code of AWS Lambda Durable Functions in Python Durable SDK.",
      },
    ],
  });

  return (
    <div style={props.style}>
      <main data-copilotkit className={styles["transparent-background"]}>
        <CopilotChat
          className={clsx([
            styles["chat-container"],
            styles["transparent-background"],
          ])}
          messageView={{
            /*
             * @see {@link https://docs.copilotkit.ai/built-in-agent/custom-look-and-feel/slots#nested-slots-drill-down}
             */
            assistantMessage: {
              className: styles["transparent-background"],
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
              className: styles["transparent-background"],
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
          input={{
            className: styles["transparent-background"],
          }}
          suggestionView={{
            className: styles["transparent-background"],
          }}
          scrollView={{
            className: styles["transparent-background"],
          }}
        />
      </main>
    </div>
  );
};

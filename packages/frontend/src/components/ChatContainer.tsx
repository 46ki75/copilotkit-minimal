import React from "react";
import {
  CopilotChat,
  useConfigureSuggestions,
  useFrontendTool,
} from "@copilotkit/react-core/v2";

// Components
import { ElmHeading, ElmInlineText, ElmMarkdown } from "@elmethis/react";

// Styles
import styles from "./ChatContainer.module.css";
import { useGenerateUuidFrontendTool } from "../frontend-tool/generate-uuid";

export interface ChatContainerProps {
  style?: React.CSSProperties;
}

export const ChatContainer = (props: ChatContainerProps) => {
  useFrontendTool({
    name: "get_date",
    description: "Get the current date and time",
    handler: async () => {
      return new Date().toString();
    },
  });

  useGenerateUuidFrontendTool();

  useConfigureSuggestions({
    suggestions: [
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
    <div className={styles["chat-container"]} style={props.style}>
      <main>
        <ElmHeading level={1}>
          <ElmInlineText>CopilotKit Minimal Setup</ElmInlineText>
        </ElmHeading>

        <CopilotChat
          messageView={{
            assistantMessage: {
              markdownRenderer: ({ content }) => (
                <ElmMarkdown markdown={content} />
              ),
            },
          }}
        />
      </main>
    </div>
  );
};

import React from "react";
import { useFrontendTool } from "@copilotkit/react-core/v2";
import { CopilotChat } from "@copilotkit/react-ui";
import { z } from "zod";
import { v4, v7 } from "uuid";

// Components
import { ElmHeading, ElmInlineText } from "@elmethis/react";

// Styles
import styles from "./ChatContainer.module.css";

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

  useFrontendTool({
    name: "generate_uuid",
    description: "Generate a new UUID of a specified version (v4 or v7)",
    parameters: z.object({
      version: z.enum(["v4", "v7"]).default("v4"),
    }),
    handler: async ({ version }) => {
      const genFnMap: Record<typeof version, () => string> = {
        v4: v4,
        v7: v7,
      };

      const uuid = genFnMap[version]();

      return { version, uuid };
    },
  });

  return (
    <div className={styles["chat-container"]} style={props.style}>
      <main>
        <ElmHeading level={1}>
          <ElmInlineText>CopilotKit Minimal Setup</ElmInlineText>
        </ElmHeading>

        <div style={{ height: "500px", marginTop: "2rem" }}>
          <CopilotChat
            instructions="You are a helpful assistant. Use tools if needed."
            labels={{ title: "My Assistant", initial: "How can I help?" }}
            suggestions={[
              {
                title: "Ask about Amazon S3 Files",
                message: " What is a new service called Amazon S3 Files?",
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
            ]}
          />
        </div>
      </main>
    </div>
  );
};

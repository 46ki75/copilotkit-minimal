import React from "react";

import styles from "./puzzle-app.module.css";
import { Puzzle } from "./puzzle";
import {
  CopilotChat,
  CopilotKit,
  defineToolCallRenderer,
} from "@copilotkit/react-core/v2";
import { ToolCallRenderer } from "../components/ToolCallRenderer";
import {
  ElmDivider,
  ElmHeading,
  ElmInlineText,
  ElmMarkdown,
} from "@elmethis/react";
import { UserMessage } from "../components/UserMessage";
import { SuggestionPill } from "../components/SuggestionPill";
import { ScrollToBottomButton } from "../components/ScrollToBottomButton";

export interface PuzzleAppProps {
  style?: React.CSSProperties;
}

export const PuzzleApp = (props: PuzzleAppProps) => {
  return (
    <div>
      <CopilotKit
        runtimeUrl="http://localhost:3000/copilotkit"
        renderToolCalls={[
          defineToolCallRenderer({
            name: "*",
            render: ({ name, status, result, args }) => {
              return (
                <ToolCallRenderer
                  name={name}
                  status={status}
                  result={result}
                  args={args}
                />
              );
            },
          }),
        ]}
      >
        <div className={styles["puzzle-app"]} style={props.style}>
          <Puzzle />
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
        </div>
      </CopilotKit>
    </div>
  );
};

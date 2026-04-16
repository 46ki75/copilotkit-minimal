import React, { useEffect, useRef } from "react";
import {
  CopilotChat,
  CopilotChatToolCallsView,
  useAgent,
  useConfigureSuggestions,
  useDefaultRenderTool,
} from "@copilotkit/react-core/v2";

// Components
import {
  ElmDivider,
  ElmHeading,
  ElmInlineText,
  ElmMarkdown,
  ElmModelSelect,
} from "@elmethis/react";

// Styles
import styles from "./ChatContainer.module.css";
import { useGenerateUuidFrontendTool } from "../frontend-tool/generate-uuid";
import { useGetDateFrontendTool } from "../frontend-tool/get-date";
import { UserMessage } from "../components/UserMessage";
import { ScrollToBottomButton } from "../components/ScrollToBottomButton";
import { SuggestionPill } from "../components/SuggestionPill";
import { type useChatHistory } from "../hooks/use-chat-history";
import { useUuidCrd } from "../gen-ui/uuid-card";
import { ToolCallRenderer } from "../components/ToolCallRenderer";

import OpenaiIcon from "../assets/openai.svg?url";
import GoogleGeminiIcon from "../assets/google-gemini.svg?url";

export interface ChatContainerProps {
  style?: React.CSSProperties;
  chatHistory: ReturnType<typeof useChatHistory>;
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
  const { agent } = useAgent();
  const {
    currentHistoryWithMessages,
    saveMessagesToHistory,
    createHistory: createNewChat,
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

  useDefaultRenderTool({
    render: ({ name, status, result, parameters }) => {
      return (
        <ToolCallRenderer
          name={name}
          status={status}
          result={result}
          parameters={parameters}
        />
      );
    },
  });

  // Register frontend tools
  useGetDateFrontendTool();
  useGenerateUuidFrontendTool();

  // Display-only component
  // <https://docs.copilotkit.ai/integrations/built-in-agent/generative-ui/your-components/display-only>
  useUuidCrd();

  useConfigureSuggestions({
    available: "always",
    suggestions: [
      {
        title: "What time is it in Tokyo?",
        message: "What time is it in Tokyo right now?",
      },
      {
        title: "Add tasks",
        message:
          "Add a new task to your task list. 1. Buy groceries 2. Walk the dog 3. Read a book",
      },
      {
        title: "Ask about Toasty in Rust",
        message: " How to use the ORM called Toasty in Rust?",
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

  const models = [
    {
      modelId: "openai/gpt-5.4-nano" as const,
      label: "OpenAI: GPT-5.4 Nano",
      icon: OpenaiIcon,
    },
    {
      modelId: "google/gemini-3.1-flash-lite-preview" as const,
      label: "Google: Gemini 3.1 Flash Lite Preview",
      icon: GoogleGeminiIcon,
    },
  ];

  const [selectedModelId, setSelectedModelId] = React.useState<
    (typeof models)[number]["modelId"] | null
  >("openai/gpt-5.4-nano");

  return (
    <div style={props.style}>
      <main data-copilotkit className={styles["wrapper"]}>
        <div className={styles["model-select-container"]}>
          <ElmModelSelect
            models={models}
            selectedModelId={selectedModelId}
            setSelectedModelId={setSelectedModelId}
          />
        </div>
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
          attachments={{
            enabled: true,
          }}
          messageView={{
            /*
             * @see {@link https://docs.copilotkit.ai/built-in-agent/custom-look-and-feel/slots#nested-slots-drill-down}
             */
            assistantMessage: {
              // Temporary workaround for duplicate tool calls due to TOOL_CALL_START firing on already-present
              // tool calls when processing MESSAGES_SNAPSHOT. See comment on DeduplicatedToolCallsView.
              toolCallsView: DeduplicatedToolCallsView,

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

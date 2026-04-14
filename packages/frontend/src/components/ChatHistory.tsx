import React from "react";

import styles from "./ChatHistory.module.css";
import { ElmInlineText, ElmMdiIcon } from "@elmethis/react";
import { mdiChat, mdiChatPlus } from "@mdi/js";

import { type useChatHistory } from "../composables/chat-history";

export interface ChatHistoryProps {
  style?: React.CSSProperties;
  chatHistory: ReturnType<typeof useChatHistory>;

  handleNewChat: () => void;
  handleSelectChat: (historyId: number) => void;
}

export const ChatHistory = (props: ChatHistoryProps) => {
  const { histories } = props.chatHistory;

  return (
    <div className={styles["chat-history"]} style={props.style}>
      <div
        key={"new"}
        className={styles["chat-item"]}
        onClick={props.handleNewChat}
      >
        <ElmMdiIcon d={mdiChatPlus} />
        <ElmInlineText>Create a New Chat</ElmInlineText>
      </div>

      {histories?.map((history) => (
        <div
          key={history.id}
          className={styles["chat-item"]}
          onClick={() => props.handleSelectChat(history.id)}
        >
          <ElmMdiIcon d={mdiChat} />
          <ElmInlineText>
            {history.title}:{history.id}
          </ElmInlineText>
        </div>
      ))}
    </div>
  );
};

import React from "react";

import styles from "./ChatHistory.module.css";
import { ElmInlineText, ElmMdiIcon } from "@elmethis/react";
import { mdiChat, mdiChatPlus, mdiDelete } from "@mdi/js";

import { type useChatHistory } from "../hooks/use-chat-history";

export interface ChatHistoryProps {
  style?: React.CSSProperties;
  chatHistory: ReturnType<typeof useChatHistory>;

  handleNewChat: () => void;
  handleSelectChat: (historyId: number) => void;
  handleDeleteChat: (historyId: number) => void;
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

          <span
            className={styles["delete-icon"]}
            onClick={(e) => {
              e.stopPropagation();
              props.handleDeleteChat(history.id);
            }}
          >
            <ElmMdiIcon d={mdiDelete} color="#c56565" />
          </span>
        </div>
      ))}
    </div>
  );
};

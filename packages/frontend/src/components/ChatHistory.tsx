import React from "react";

import styles from "./ChatHistory.module.css";
import { ElmInlineText, ElmMdiIcon } from "@elmethis/react";
import { mdiChat } from "@mdi/js";

export interface ChatHistoryProps {
  style?: React.CSSProperties;

  handleNewChat?: () => void;

  histories: Array<{
    id: string;
    title: string;
    onClick?: () => void;
  }>;
}

export const ChatHistory = (props: ChatHistoryProps) => {
  return (
    <div className={styles["chat-history"]} style={props.style}>
      <div
        key={"new"}
        className={styles["chat-item"]}
        onClick={props.handleNewChat}
      >
        <ElmMdiIcon d={mdiChat} />
        <ElmInlineText>New Chat</ElmInlineText>
      </div>

      {props.histories.map((history) => (
        <div
          key={history.id}
          className={styles["chat-item"]}
          onClick={history.onClick}
        >
          <ElmMdiIcon d={mdiChat} />
          <ElmInlineText>{history.title}</ElmInlineText>
        </div>
      ))}
    </div>
  );
};

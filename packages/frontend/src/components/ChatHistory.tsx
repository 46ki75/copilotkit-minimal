import React from "react";

import styles from "./ChatHistory.module.css";
import { ElmInlineText, ElmMdiIcon } from "@elmethis/react";
import { mdiChat, mdiChatPlus } from "@mdi/js";
import { useAgent } from "@copilotkit/react-core/v2";

export interface ChatHistoryProps {
  style?: React.CSSProperties;

  histories: Array<{
    id: string;
    title: string;
    onClick?: () => void;
  }>;
}

export const ChatHistory = (props: ChatHistoryProps) => {
  const { agent } = useAgent();

  const handleNewChat = () => {
    agent.setMessages([]);
  };

  return (
    <div className={styles["chat-history"]} style={props.style}>
      <div key={"new"} className={styles["chat-item"]} onClick={handleNewChat}>
        <ElmMdiIcon d={mdiChatPlus} />
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

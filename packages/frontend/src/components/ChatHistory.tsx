import React from "react";

import styles from "./ChatHistory.module.css";
import { ElmInlineText, ElmMdiIcon } from "@elmethis/react";
import { mdiChat, mdiChatPlus } from "@mdi/js";
import { useAgent } from "@copilotkit/react-core/v2";

import { useChatHistory } from "../composables/chat-history";

export interface ChatHistoryProps {
  style?: React.CSSProperties;
}

export const ChatHistory = (props: ChatHistoryProps) => {
  const { agent } = useAgent();

  const { histories, createNewChat } = useChatHistory();

  const handleNewChat = async () => {
    agent.setMessages([]);
    await createNewChat();
  };

  return (
    <div className={styles["chat-history"]} style={props.style}>
      <div key={"new"} className={styles["chat-item"]} onClick={handleNewChat}>
        <ElmMdiIcon d={mdiChatPlus} />
        <ElmInlineText>Create a New Chat</ElmInlineText>
      </div>

      {histories?.map((history) => (
        <div key={history.id} className={styles["chat-item"]}>
          <ElmMdiIcon d={mdiChat} />
          <ElmInlineText>
            {history.title}:{history.id}
          </ElmInlineText>
        </div>
      ))}
    </div>
  );
};

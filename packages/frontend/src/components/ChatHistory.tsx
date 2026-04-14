import React, { useEffect, useState } from "react";

import styles from "./ChatHistory.module.css";
import { ElmInlineText, ElmMdiIcon } from "@elmethis/react";
import { mdiChat, mdiChatPlus } from "@mdi/js";
import { useAgent } from "@copilotkit/react-core/v2";

import {
  ChatHistoryDB,
  type ChatHistoryRecord,
} from "../composables/chat-history";

export interface ChatHistoryProps {
  style?: React.CSSProperties;
}

export const ChatHistory = (props: ChatHistoryProps) => {
  const { agent } = useAgent();

  const [histories, setHistories] = useState<ChatHistoryRecord[]>();

  useEffect(() => {
    (async () => {
      const allHistories = await ChatHistoryDB.chatHistories
        .reverse()
        .toArray();
      setHistories(allHistories);
    })();
  }, []);

  const handleNewChat = async () => {
    agent.setMessages([]);

    await ChatHistoryDB.chatHistories.add({
      title: "New Chat",
      messages: [],
    });

    const allHistories = await ChatHistoryDB.chatHistories.reverse().toArray();
    setHistories(allHistories);
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

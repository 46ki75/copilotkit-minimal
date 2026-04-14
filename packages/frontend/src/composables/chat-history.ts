import { type Message } from "@copilotkit/react-core/v2";
import { Dexie, type EntityTable } from "dexie";
import { useEffect, useState } from "react";

export interface ChatHistoryRecord {
  id: number;
  title: string;
  messages: Message[];
}

export const ChatHistoryDB = new Dexie("ChatHistoryDatabase") as Dexie & {
  chatHistories: EntityTable<ChatHistoryRecord, "id">;
};

ChatHistoryDB.version(1).stores({
  chatHistories: "++id, title",
});

export const useChatHistory = () => {
  const [histories, setHistories] = useState<ChatHistoryRecord[]>();

  const createNewChat = async () => {
    await ChatHistoryDB.chatHistories.add({
      title: "New Chat",
      messages: [],
    });

    const allHistories = await ChatHistoryDB.chatHistories.reverse().toArray();
    setHistories(allHistories);
  };

  useEffect(() => {
    (async () => {
      const allHistories = await ChatHistoryDB.chatHistories
        .reverse()
        .toArray();
      setHistories(allHistories);
    })();
  }, []);

  return {
    histories,
    createNewChat,
  };
};

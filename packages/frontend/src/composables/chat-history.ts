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
  const [currentHistory, setCurrentHistory] = useState<ChatHistoryRecord>();

  const createNewChat = async () => {
    await ChatHistoryDB.chatHistories.add({
      title: "New Chat",
      messages: [],
    });

    const allHistories = await ChatHistoryDB.chatHistories.reverse().toArray();
    setHistories(allHistories);
  };

  const saveMessagesToHistory = async (
    historyId: number,
    messages: Message[],
  ) => {
    await ChatHistoryDB.chatHistories.update(historyId, { messages });

    const allHistories = await ChatHistoryDB.chatHistories.reverse().toArray();
    setHistories(allHistories);
  };

  const selectHistory = async (historyId: number) => {
    const selectedHistory = await ChatHistoryDB.chatHistories.get(historyId);
    if (selectedHistory) {
      setCurrentHistory(selectedHistory);
    }
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
    currentHistory,
    selectHistory,
    createNewChat,
    saveMessagesToHistory,
  };
};

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
  const [currentHistory, setCurrentHistory] = useState<ChatHistoryRecord | null | undefined>();

  const createNewChat = async () => {
    const id = await ChatHistoryDB.chatHistories.add({
      title: "New Chat",
      messages: [],
    });

    const allHistories = await ChatHistoryDB.chatHistories.reverse().toArray();
    setHistories(allHistories);
    const created = allHistories.find((h) => h.id === id);
    setCurrentHistory(created);
    return created;
  };

  const saveMessagesToHistory = async (
    historyId: number,
    messages: Message[],
  ) => {
    await ChatHistoryDB.chatHistories.update(historyId, { messages });

    const allHistories = await ChatHistoryDB.chatHistories.reverse().toArray();
    setHistories(allHistories);
  };

  const selectHistory = async (historyId: number | null) => {
    if (historyId === null) {
      setCurrentHistory(null);
      return null;
    }
    const selectedHistory = await ChatHistoryDB.chatHistories.get(historyId);
    if (selectedHistory) {
      setCurrentHistory(selectedHistory);
    }
    return selectedHistory;
  };

  useEffect(() => {
    (async () => {
      const allHistories = await ChatHistoryDB.chatHistories
        .reverse()
        .toArray();
      setHistories(allHistories);
      setCurrentHistory(allHistories[0]);
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

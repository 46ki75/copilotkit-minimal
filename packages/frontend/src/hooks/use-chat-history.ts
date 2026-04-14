import { type Message } from "@copilotkit/react-core/v2";
import { Dexie, type EntityTable } from "dexie";
import { useEffect, useState } from "react";

export interface ChatHistoryRecord {
  id: number;
  title: string;
}

export interface ChatMessagesRecord {
  id: number;
  messages: Message[];
}

// Convenience type for when both are needed together
export type ChatHistoryWithMessages = ChatHistoryRecord & ChatMessagesRecord;

export const ChatHistoryDB = new Dexie("ChatHistoryDatabase") as Dexie & {
  chatHistories: EntityTable<ChatHistoryRecord, "id">;
  chatMessages: EntityTable<ChatMessagesRecord, "id">;
};

ChatHistoryDB.version(1).stores({
  chatHistories: "++id, title",
  chatMessages: "id",
});

export const useChatHistory = () => {
  const [histories, setHistories] = useState<ChatHistoryRecord[]>();
  const [currentHistoryWithMessages, setCurrentHistoryWithMessages] = useState<
    ChatHistoryWithMessages | null | undefined
  >();

  const refreshHistories = async () => {
    const allHistories = await ChatHistoryDB.chatHistories.reverse().toArray();
    setHistories(allHistories);
    return allHistories;
  };

  const createHistory = async () => {
    const id = await ChatHistoryDB.transaction(
      "rw",
      ChatHistoryDB.chatHistories,
      ChatHistoryDB.chatMessages,
      async () => {
        const newId = await ChatHistoryDB.chatHistories.add({
          title: "New Chat",
        });
        await ChatHistoryDB.chatMessages.add({ id: newId, messages: [] });
        return newId;
      },
    );

    const allHistories = await refreshHistories();
    const created = allHistories.find((h) => h.id === id);
    if (created) {
      const withMessages: ChatHistoryWithMessages = {
        ...created,
        messages: [],
      };
      setCurrentHistoryWithMessages(withMessages);
      return withMessages;
    }
    return undefined;
  };

  const saveMessagesToHistory = async (
    historyId: number,
    messages: Message[],
  ) => {
    await ChatHistoryDB.chatMessages.put({ id: historyId, messages });

    // Keep currentHistory in sync if it's the active one
    setCurrentHistoryWithMessages((prev) =>
      prev?.id === historyId ? { ...prev, messages } : prev,
    );
  };

  const selectHistory = async (historyId: number | null) => {
    if (historyId === null) {
      setCurrentHistoryWithMessages(null);
      return null;
    }

    const [meta, payload] = await Promise.all([
      ChatHistoryDB.chatHistories.get(historyId),
      ChatHistoryDB.chatMessages.get(historyId),
    ]);

    if (!meta || !payload) return null;

    const selected: ChatHistoryWithMessages = { ...meta, ...payload };
    setCurrentHistoryWithMessages(selected);
    return selected;
  };

  const deleteHistory = async (historyId: number) => {
    await ChatHistoryDB.transaction(
      "rw",
      ChatHistoryDB.chatHistories,
      ChatHistoryDB.chatMessages,
      async () => {
        await ChatHistoryDB.chatHistories.delete(historyId);
        await ChatHistoryDB.chatMessages.delete(historyId);
      },
    );

    // If the deleted history is currently selected, clear it
    setCurrentHistoryWithMessages((prev) =>
      prev?.id === historyId ? null : prev,
    );
  };

  useEffect(() => {
    (async () => {
      await refreshHistories();
      setCurrentHistoryWithMessages(null);
    })();
  }, []);

  return {
    histories,
    currentHistoryWithMessages,
    selectHistory,
    createHistory,
    saveMessagesToHistory,
    deleteHistory,
  };
};

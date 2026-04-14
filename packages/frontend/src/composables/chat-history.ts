import { type Message } from "@copilotkit/react-core/v2";
import { Dexie, type EntityTable } from "dexie";

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

import React, { useReducer } from "react";

import styles from "./Task.module.css";
import { v7 } from "uuid";
import { ElmCheckbox } from "@elmethis/react";
import { useFrontendTool } from "@copilotkit/react-core/v2";
import z from "zod";

type Action =
  | { type: "ADD_TASK"; id: string; text: string }
  | { type: "DONE_TASK"; id: string }
  | { type: "DELETE_TASK"; id: string };

type TaskItem = {
  id: string;
  text: string;
  isDone?: boolean;
};

export const useTask = () => {
  const [tasks, ditpatch] = useReducer((state: TaskItem[], action: Action) => {
    switch (action.type) {
      case "ADD_TASK":
        return [...state, { id: action.id, text: action.text }];
      case "DONE_TASK":
        return state.map((task) =>
          task.id === action.id ? { ...task, isDone: true } : task,
        );
      case "DELETE_TASK":
        return state.filter((task) => task.id !== action.id);
      default:
        return state;
    }
  }, []);

  const addTask = (text: string) => {
    ditpatch({ type: "ADD_TASK", id: v7(), text });
  };

  const doneTask = (id: string) => {
    ditpatch({ type: "DONE_TASK", id });
  };

  const deleteTask = (id: string) => {
    ditpatch({ type: "DELETE_TASK", id });
  };

  const listTasks = (isDone?: boolean) => {
    return tasks.filter((task) =>
      isDone !== undefined ? task.isDone === isDone : true,
    );
  };

  useFrontendTool({
    name: "add_task",
    description: "Add a task",
    parameters: z.object({
      text: z.string().describe("The text of the task"),
    }),
    handler: async ({ text }) => {
      addTask(text);
    },
  });

  useFrontendTool({
    name: "list_tasks",
    description: "List tasks",
    parameters: z.object({
      isDone: z
        .boolean()
        .optional()
        .describe("Whether to list only done or not done tasks"),
    }),
    handler: async ({ isDone }) => {
      return listTasks(isDone);
    },
  });

  useFrontendTool({
    name: "done_task",
    description: "Mark a task as done",
    parameters: z.object({
      id: z.string().describe("The ID of the task"),
    }),
    handler: async ({ id }) => {
      doneTask(id);
    },
  });

  useFrontendTool({
    name: "delete_task",
    description: "Delete a task",
    parameters: z.object({
      id: z.string().describe("The ID of the task"),
    }),
    handler: async ({ id }) => {
      deleteTask(id);
    },
  });

  const render = () => {
    return (
      <div className={styles["task"]}>
        {tasks.map((task) => (
          <ElmCheckbox
            key={task.id}
            checked={task.isDone}
            label={task.text}
            onChange={() => ditpatch({ type: "DONE_TASK", id: task.id })}
          />
        ))}
      </div>
    );
  };

  return { addTask, doneTask, deleteTask, listTasks, render };
};

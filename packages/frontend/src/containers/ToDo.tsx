import React, { useReducer } from "react";

import styles from "./ToDo.module.css";
import { v7 } from "uuid";
import { ElmCheckbox } from "@elmethis/react";
import { useFrontendTool } from "@copilotkit/react-core/v2";
import z from "zod";

type Action =
  | { type: "ADD_TODO"; id: string; text: string }
  | { type: "DONE_TODO"; id: string }
  | { type: "DELETE_TODO"; id: string };

type TodoItem = {
  id: string;
  text: string;
  isDone?: boolean;
};

export const useToDo = () => {
  const [todos, ditpatch] = useReducer((state: TodoItem[], action: Action) => {
    switch (action.type) {
      case "ADD_TODO":
        return [...state, { id: action.id, text: action.text }];
      case "DONE_TODO":
        return state.map((todo) =>
          todo.id === action.id ? { ...todo, isDone: true } : todo,
        );
      case "DELETE_TODO":
        return state.filter((todo) => todo.id !== action.id);
      default:
        return state;
    }
  }, []);

  const addTodo = (text: string) => {
    ditpatch({ type: "ADD_TODO", id: v7(), text });
  };

  const doneTodo = (id: string) => {
    ditpatch({ type: "DONE_TODO", id });
  };

  const deleteTodo = (id: string) => {
    ditpatch({ type: "DELETE_TODO", id });
  };

  const listTodos = (isDone?: boolean) => {
    return todos.filter((todo) =>
      isDone !== undefined ? todo.isDone === isDone : true,
    );
  };

  useFrontendTool({
    name: "add_todo",
    description: "Add a to-do item",
    parameters: z.object({
      text: z.string().describe("The text of the to-do item"),
    }),
    handler: async ({ text }) => {
      addTodo(text);
    },
  });

  const render = () => {
    return (
      <div className={styles["to-do"]}>
        {todos.map((todo) => (
          <ElmCheckbox
            key={todo.id}
            checked={todo.isDone}
            label={todo.text}
            onChange={() => ditpatch({ type: "DONE_TODO", id: todo.id })}
          />
        ))}
      </div>
    );
  };

  return { addTodo, doneTodo, deleteTodo, listTodos, render };
};

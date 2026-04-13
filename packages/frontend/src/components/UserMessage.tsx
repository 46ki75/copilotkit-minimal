import React from "react";

import styles from "./UserMessage.module.css";

import { ElmInlineText, ElmMarkdown } from "@elmethis/react";

export interface UserMessageProps {
  style?: React.CSSProperties;

  content: string;
}

export const UserMessage = (props: UserMessageProps) => {
  return (
    <div className={styles["user-message"]} style={props.style}>
      <div className={styles["inner-container"]}>
        <div>
          <ElmInlineText>User</ElmInlineText>
        </div>

        <div className={styles["content"]}>
          <ElmMarkdown markdown={props.content} />
        </div>
      </div>
    </div>
  );
};

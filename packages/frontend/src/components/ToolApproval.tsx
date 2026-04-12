import React from "react";

import styles from "./ToolApproval.module.css";
import { ElmButton } from "@elmethis/react";

export interface ToolApprovalProps extends React.PropsWithChildren {
  style?: React.CSSProperties;

  approveLabel?: string;
  rejectLabel?: string;

  onApprove?: () => void;
  onReject?: () => void;
}

export const ToolApproval = (props: ToolApprovalProps) => {
  return (
    <div className={styles["human-in-the-loop"]} style={props.style}>
      <div className={styles.message}>{props.children}</div>

      <div className={styles["button-reject"]}>
        <ElmButton onClick={props.onReject} block>
          <span>{props.rejectLabel || "Reject"}</span>
        </ElmButton>
      </div>

      <div className={styles["button-approve"]}>
        <ElmButton onClick={props.onApprove} block primary>
          <span>{props.approveLabel || "Approve"}</span>
        </ElmButton>
      </div>
    </div>
  );
};

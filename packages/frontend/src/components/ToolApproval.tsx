import React from "react";

// Styles
import styles from "./ToolApproval.module.css";

// Components
import { ElmButton, ElmInlineText, ElmMdiIcon } from "@elmethis/react";
import { mdiMinusCircle, mdiTools } from "@mdi/js";

// Types
import type { ToolCallStatus } from "@copilotkit/react-core/v2";
import { clsx } from "clsx";

export interface ToolApprovalProps extends React.PropsWithChildren {
  style?: React.CSSProperties;

  status: ToolCallStatus;

  approveLabel?: string;
  rejectLabel?: string;

  onApprove?: () => void;
  onReject?: () => void;

  resultContent: React.ReactNode;
}

export const ToolApproval = (props: ToolApprovalProps) => {
  return (
    <div
      className={clsx(styles["human-in-the-loop"], {
        [styles["in-progress"]]: props.status === "inProgress",
        [styles.executing]: props.status === "executing",
        [styles.complete]: props.status === "complete",
      })}
      style={props.style}
    >
      <div className={styles.message}>{props.children}</div>

      <div className={styles["button-container"]}>
        <ElmButton
          onClick={props.onReject}
          block
          loading={props.status === "inProgress"}
          disabled={props.status === "complete"}
        >
          <ElmMdiIcon d={mdiMinusCircle} />
          <ElmInlineText code>{props.rejectLabel || "Reject"}</ElmInlineText>
        </ElmButton>

        <ElmButton
          onClick={props.onApprove}
          block
          loading={props.status === "inProgress"}
          disabled={props.status === "complete"}
        >
          <ElmMdiIcon d={mdiTools} />
          <ElmInlineText code>{props.approveLabel || "Approve"}</ElmInlineText>
        </ElmButton>
      </div>

      <div className={styles["result-container"]}>{props.resultContent}</div>
    </div>
  );
};

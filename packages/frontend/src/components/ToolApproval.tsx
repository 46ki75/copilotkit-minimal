import React from "react";

// Styles
import styles from "./ToolApproval.module.css";

// Components
import { ElmButton, ElmInlineText, ElmMdiIcon } from "@elmethis/react";
import { mdiMinusCircle, mdiTools } from "@mdi/js";

// Types
import type { ToolCallStatus } from "@copilotkit/react-core/v2";

export interface ToolApprovalProps extends React.PropsWithChildren {
  style?: React.CSSProperties;

  status: ToolCallStatus;

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
          <ElmMdiIcon d={mdiMinusCircle} />
          <ElmInlineText code>{props.rejectLabel || "Reject"}</ElmInlineText>
        </ElmButton>
      </div>

      <div className={styles["button-approve"]}>
        <ElmButton onClick={props.onApprove} block>
          <ElmMdiIcon d={mdiTools} />
          <ElmInlineText code>{props.approveLabel || "Approve"}</ElmInlineText>
        </ElmButton>
      </div>
    </div>
  );
};

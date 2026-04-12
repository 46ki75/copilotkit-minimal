import React from "react";

import styles from "./HumanInTheLoop.module.css";
import { ElmButton } from "@elmethis/react";

export interface HumanInTheLoopProps {
  style?: React.CSSProperties;

  approveLabel?: string;
  rejectLabel?: string;

  onApprove?: () => void;
  onReject?: () => void;
}

export const HumanInTheLoop = (props: HumanInTheLoopProps) => {
  return (
    <div className={styles["human-in-the-loop"]} style={props.style}>
      <ElmButton onClick={props.onReject} block>
        {props.rejectLabel || "Reject"}
      </ElmButton>

      <ElmButton onClick={props.onApprove} block>
        {props.approveLabel || "Approve"}
      </ElmButton>
    </div>
  );
};

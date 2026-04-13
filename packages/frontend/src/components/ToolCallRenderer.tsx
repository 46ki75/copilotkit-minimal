import { ToolCallStatus } from "@copilotkit/react-core/v2";
import {
  ElmButton,
  ElmCodeBlock,
  ElmInlineText,
  ElmMdiIcon,
} from "@elmethis/react";
import styles from "./ToolCallRenderer.module.css";
import {
  mdiAccountCheck,
  mdiAccountClock,
  mdiAccountRemove,
  mdiProgressWrench,
  mdiTimelineClock,
  mdiTools,
  mdiWrenchClock,
} from "@mdi/js";
import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

const COLOR = {
  crimson: "#c56565",
  emerald: "#59b57c",
} as const;

const TOOL_STATUS_CONFIG = {
  [ToolCallStatus.InProgress]: {
    color: "#6987b8",
    message: "Preparing",
  },
  [ToolCallStatus.Executing]: {
    color: "#6987b8",
    message: "Executing",
  },
  [ToolCallStatus.Complete]: {
    color: "#4ba96f",
    message: "Success",
  },
} as const;

interface ToolCallRendererProps {
  name: string;
  status: ToolCallStatus;
  result?: string;
  args: unknown;

  onApprove?: () => void;
  onReject?: () => void;
}

const safeStringifyArgs = (value: unknown, fallback = ""): string => {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return fallback;
  }
};

const safeStringifyResult = (
  result: string | undefined,
  fallback = "",
): string => {
  try {
    return JSON.stringify(JSON.parse(result ?? "null"), null, 2);
  } catch {
    return result ?? fallback;
  }
};

export const ToolCallRenderer = ({
  name,
  status,
  result,
  args,
  onApprove,
  onReject,
}: ToolCallRendererProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [startTime] = useState(() => performance.now());
  const [currentTime, setCurrentTime] = useState(() => performance.now());
  const [completeAt, setCompleteAt] = useState(0);
  const statusRef = useRef(status);

  const [approvalState, setApprovalState] = useState<
    "pending" | "approved" | "rejected" | "not-required"
  >(onApprove && onReject ? "pending" : "not-required");

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const s = statusRef.current;
      if (s === ToolCallStatus.Complete) {
        setCompleteAt((t) => t || performance.now());
        window.clearInterval(id);
        setIsOpen(false);
        return;
      }

      setCurrentTime(performance.now());
    }, 100);
    return () => window.clearInterval(id);
  }, []);

  const duration = ((completeAt || currentTime) - startTime) / 1000;
  const config = TOOL_STATUS_CONFIG[status];

  const parsedIsError = JSON.parse(result ?? "null")?.isError;
  const isError = typeof parsedIsError === "boolean" ? parsedIsError : false;

  return (
    <>
      <div
        className={clsx(styles["tool-call-renderer"], {
          [styles["open"]]: isOpen,
          [styles["requires-approval"]]: approvalState === "pending",
        })}
      >
        {/* Summary content */}
        <div
          className={styles["summary-content"]}
          onClick={() => setIsOpen((v) => !v)}
        >
          <ElmMdiIcon
            d={mdiTools}
            size="1.25rem"
            color={isError ? COLOR.crimson : config.color}
          />
          <ElmInlineText code color={isError ? COLOR.crimson : config.color}>
            {name}
          </ElmInlineText>
          <ElmInlineText code>
            <span style={{ fontSize: "0.75rem" }}>
              {approvalState === "rejected"
                ? "Rejected"
                : isError
                  ? "Error"
                  : config.message}
            </span>
          </ElmInlineText>

          <ElmInlineText color="oklch(from gray l c h / 0.5)">
            {duration.toFixed(1)}s
          </ElmInlineText>
        </div>

        <div className={styles["detail-content"]}>
          {/* Arguments content */}
          <div className={styles["status-message"]}>
            <ElmMdiIcon d={mdiProgressWrench} size="1.25rem" />
            <ElmInlineText code>Preparing arguments...</ElmInlineText>
          </div>
          <div className={styles["args-content"]}>
            <ElmCodeBlock
              caption="Arguments"
              code={safeStringifyArgs(args)}
              language="json"
            />
          </div>

          {onApprove && onReject && (
            <div className={styles["status-message"]}>
              <ElmMdiIcon d={mdiAccountClock} size="1.25rem" />
              <ElmInlineText code>Waiting for approval...</ElmInlineText>
            </div>
          )}

          {approvalState === "approved" && (
            <div className={styles["status-message"]}>
              <ElmMdiIcon
                d={mdiAccountCheck}
                size="1.25rem"
                color={COLOR.emerald}
              />
              <ElmInlineText code color={COLOR.emerald}>
                Approved
              </ElmInlineText>
            </div>
          )}

          {approvalState === "rejected" && (
            <div className={styles["status-message"]}>
              <ElmMdiIcon
                d={mdiAccountRemove}
                size="1.25rem"
                color={COLOR.crimson}
              />
              <ElmInlineText code color={COLOR.crimson}>
                Rejected
              </ElmInlineText>
            </div>
          )}

          {approvalState !== "pending" && approvalState !== "rejected" && (
            <div className={styles["status-message"]}>
              <ElmMdiIcon d={mdiWrenchClock} size="1.25rem" />
              <ElmInlineText code>Executing...</ElmInlineText>
            </div>
          )}

          <div className={styles["result-content"]}>
            {status === ToolCallStatus.Complete && (
              <ElmCodeBlock
                caption="Result"
                code={safeStringifyResult(result)}
                language="json"
              />
            )}
          </div>

          {/* Spent time */}
          {status === ToolCallStatus.Complete && (
            <div className={styles["status-message"]}>
              <ElmMdiIcon d={mdiTimelineClock} size="1.25rem" />
              <ElmInlineText>Total time spent</ElmInlineText>
              <ElmInlineText color="oklch(from gray l c h / 0.5)">
                {duration.toFixed(1)}s
              </ElmInlineText>
            </div>
          )}
        </div>

        {/* Approval buttons */}
        {approvalState === "pending" && (
          <div className={styles["approval-button-container"]}>
            <ElmButton
              block
              onClick={() => {
                setApprovalState("rejected");
                onReject?.();
              }}
            >
              <ElmInlineText>Reject</ElmInlineText>
            </ElmButton>
            <ElmButton
              block
              onClick={() => {
                setApprovalState("approved");
                onApprove?.();
              }}
            >
              <ElmInlineText>Approve</ElmInlineText>
            </ElmButton>
          </div>
        )}
      </div>
    </>
  );
};

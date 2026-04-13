import { ToolCallStatus } from "@copilotkit/react-core/v2";
import {
  ElmButton,
  ElmCodeBlock,
  ElmInlineText,
  ElmMdiIcon,
  type ElmCodeBlockProps,
} from "@elmethis/react";
import styles from "./ToolCallRenderer.module.css";
import {
  mdiAccountCheck,
  mdiAccountClock,
  mdiAccountRemove,
  mdiChevronRight,
  mdiCircleSmall,
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
  const [isArgumentsOpen, setIsArgumentsOpen] = useState(true);
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);

  const requiresApproval = !!(onApprove && onReject);
  const [approvalState, setApprovalState] = useState<
    "pending" | "approved" | "rejected" | "not-required"
  >(requiresApproval ? "pending" : "not-required");

  const [startTime] = useState(() => performance.now());
  const [approvalStartTime] = useState(() =>
    requiresApproval ? performance.now() : 0,
  );
  const approvalEndTimeRef = useRef(0);

  useEffect(() => {
    if (
      status === ToolCallStatus.InProgress ||
      status === ToolCallStatus.Executing
    ) {
      const argumentsCloseTimeout = setTimeout(
        () => setIsArgumentsOpen(false),
        0,
      );

      const resultOpenTimeout = setTimeout(() => setIsResultOpen(true), 0);

      return () => {
        clearTimeout(argumentsCloseTimeout);
        clearTimeout(resultOpenTimeout);
      };
    } else if (status === ToolCallStatus.Complete) {
      const completeAt = performance.now();
      const approvalWait =
        approvalStartTime > 0
          ? (approvalEndTimeRef.current || completeAt) - approvalStartTime
          : 0;
      const computed = completeAt - startTime - approvalWait;

      const durationTimeout = setTimeout(() => setDuration(computed), 0);
      const closeTimeout = setTimeout(() => setIsOpen(false), 1000);
      const resultCloseTimeout = setTimeout(() => setIsResultOpen(false), 500);

      return () => {
        clearTimeout(durationTimeout);
        clearTimeout(closeTimeout);
        clearTimeout(resultCloseTimeout);
      };
    }
  }, [status, startTime, approvalStartTime]);
  const durationLabel =
    duration === null
      ? null
      : duration < 10000
        ? `${duration.toFixed(0)}ms`
        : `${(duration / 1000).toFixed(1)}s`;
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

          {durationLabel !== null && (
            <ElmInlineText code color="oklch(from gray l c h / 0.5)">
              {durationLabel}
            </ElmInlineText>
          )}
        </div>

        <div className={styles["detail-content"]}>
          {/* Arguments content */}
          <div
            className={clsx(styles["status-message"], styles["foldable"])}
            onClick={() => setIsArgumentsOpen((v) => !v)}
          >
            <span
              className={clsx(styles["chevron"], {
                [styles["open"]]: isArgumentsOpen,
              })}
            >
              <ElmMdiIcon d={mdiChevronRight} size="1.25rem" />
            </span>
            <ElmMdiIcon d={mdiProgressWrench} size="1.25rem" />
            <ElmInlineText code>Preparing arguments...</ElmInlineText>
          </div>

          <div
            className={clsx(styles["args-content"], {
              [styles["open"]]: isArgumentsOpen,
            })}
          >
            <ElmCodeBlock
              style={{ overflow: "hidden" } as ElmCodeBlockProps["style"]}
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
            <div
              className={clsx(styles["status-message"], styles["foldable"])}
              onClick={() => setIsResultOpen((v) => !v)}
            >
              <span
                className={clsx(styles["chevron"], {
                  [styles["open"]]: isResultOpen,
                })}
              >
                <ElmMdiIcon d={mdiChevronRight} size="1.25rem" />
              </span>
              <ElmMdiIcon d={mdiWrenchClock} size="1.25rem" />
              <ElmInlineText code>Executing...</ElmInlineText>
            </div>
          )}

          <div
            className={clsx(styles["result-content"], {
              [styles["open"]]: isResultOpen,
            })}
          >
            {status === ToolCallStatus.Complete && (
              <ElmCodeBlock
                style={{ overflow: "hidden" } as ElmCodeBlockProps["style"]}
                caption="Result"
                code={safeStringifyResult(result)}
                language="json"
              />
            )}
          </div>

          {/* Spent time */}
          {duration !== null && (
            <div className={styles["status-message"]}>
              <ElmMdiIcon d={mdiCircleSmall} size="1.25rem" />
              <ElmMdiIcon d={mdiTimelineClock} size="1.25rem" />
              <ElmInlineText>Total time spent</ElmInlineText>
              <ElmInlineText color="oklch(from gray l c h / 0.5)">
                {duration.toFixed(0)}ms
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
                approvalEndTimeRef.current = performance.now();
                setApprovalState("rejected");
                onReject?.();
              }}
            >
              <ElmInlineText>Reject</ElmInlineText>
            </ElmButton>
            <ElmButton
              block
              onClick={() => {
                approvalEndTimeRef.current = performance.now();
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

import { ToolCallStatus } from "@copilotkit/react-core/v2";
import { ElmCodeBlock, ElmInlineText, ElmMdiIcon } from "@elmethis/react";
import styles from "./ToolCallRenderer.module.css";
import {
  mdiProgressWrench,
  mdiTimelineClock,
  mdiTools,
  mdiWrenchClock,
} from "@mdi/js";
import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

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
}: ToolCallRendererProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [startTime] = useState(() => performance.now());
  const [currentTime, setCurrentTime] = useState(() => performance.now());
  const [completeAt, setCompleteAt] = useState(0);
  const statusRef = useRef(status);

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

  const summaryContent = (
    <div
      className={styles["summary-content"]}
      onClick={() => setIsOpen((v) => !v)}
    >
      <ElmMdiIcon
        d={mdiTools}
        size="1.25rem"
        color={isError ? "#c56565" : config.color}
      />
      <ElmInlineText code color={isError ? "#c56565" : config.color}>
        {name}
      </ElmInlineText>
      <ElmInlineText code>
        <span style={{ fontSize: "0.75rem" }}>
          {isError ? "Error" : config.message}
        </span>
      </ElmInlineText>

      <ElmInlineText color="oklch(from gray l c h / 0.5)">
        {duration.toFixed(1)}s
      </ElmInlineText>
    </div>
  );

  const argsContent = (
    <>
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
    </>
  );

  const resultContent = (
    <>
      <div className={styles["status-message"]}>
        <ElmMdiIcon d={mdiWrenchClock} size="1.25rem" />
        <ElmInlineText code>Executing...</ElmInlineText>
      </div>

      <div className={styles["result-content"]}>
        {status === ToolCallStatus.Complete && (
          <ElmCodeBlock
            caption="Result"
            code={safeStringifyResult(result)}
            language="json"
          />
        )}
      </div>
    </>
  );

  const totalSpentTimeContent = (
    <>
      <div className={styles["status-message"]}>
        <ElmMdiIcon d={mdiTimelineClock} size="1.25rem" />
        <ElmInlineText>Total time spent</ElmInlineText>
        <ElmInlineText color="oklch(from gray l c h / 0.5)">
          {duration.toFixed(1)}s
        </ElmInlineText>
      </div>
    </>
  );

  return (
    <div
      className={clsx(styles["tool-call-renderer"], {
        [styles["open"]]: isOpen,
      })}
    >
      {summaryContent}

      <div className={styles["detail-content"]}>
        {argsContent}
        {resultContent}
        {status === ToolCallStatus.Complete && totalSpentTimeContent}
      </div>
    </div>
  );
};

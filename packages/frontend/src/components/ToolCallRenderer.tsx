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
    icon: mdiTools,
    color: "#cdb57b",
    message: "Preparing",
  },
  [ToolCallStatus.Executing]: {
    icon: mdiTools,
    color: "#6987b8",
    message: "Executing",
  },
  [ToolCallStatus.Complete]: {
    icon: mdiTools,
    color: "#4ba96f",
    message: "Complete",
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
  const [isOpen, setIsOpen] = useState(false);
  const [startTime] = useState(() => performance.now());
  const [currentTime, setCurrentTime] = useState(() => performance.now());
  const [executingAt, setExecutingAt] = useState(0);
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
        return;
      }
      if (s === ToolCallStatus.Executing) {
        setExecutingAt((t) => t || performance.now());
      }
      setCurrentTime(performance.now());
    }, 100);
    return () => window.clearInterval(id);
  }, []);

  const duration = ((completeAt || currentTime) - startTime) / 1000;
  const prepareDuration = executingAt ? (executingAt - startTime) / 1000 : 0;
  const executionDuration =
    executingAt && completeAt ? (completeAt - executingAt) / 1000 : 0;

  const config = TOOL_STATUS_CONFIG[status];

  const summaryContent = (
    <div
      className={styles["summary-content"]}
      onClick={() => setIsOpen((v) => !v)}
    >
      <ElmMdiIcon d={config.icon} size="1.25rem" color={config.color} />
      <ElmInlineText code color={config.color}>
        {name}
      </ElmInlineText>
      <ElmInlineText>{config.message}</ElmInlineText>

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
        <ElmInlineText color="oklch(from gray l c h / 0.5)">
          {prepareDuration.toFixed(1)}s
        </ElmInlineText>
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
        <ElmInlineText color="oklch(from gray l c h / 0.5)">
          {executionDuration.toFixed(1)}s
        </ElmInlineText>
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
        [styles["in-progress"]]: status === ToolCallStatus.InProgress,
        [styles["executing"]]: status === ToolCallStatus.Executing,
        [styles["complete"]]: status === ToolCallStatus.Complete,
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

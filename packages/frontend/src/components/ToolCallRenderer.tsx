import { ToolCallStatus } from "@copilotkit/react-core/v2";
import {
  ElmCodeBlock,
  ElmInlineText,
  ElmMdiIcon,
  ElmToggle,
} from "@elmethis/react";
import styles from "./ToolCallRenderer.module.css";
import { mdiTools } from "@mdi/js";
import { useEffect, useRef, useState } from "react";

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

const MARGIN_STYLE = { "--elmethis-margin-block-start": "0.5rem" } as const;

const safeStringify = (value: unknown, fallback = ""): string => {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return fallback;
  }
};

export const ToolCallRenderer = ({
  name,
  status,
  result,
  args,
}: ToolCallRendererProps) => {
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
    <>
      <ElmMdiIcon d={config.icon} size="1.25rem" color={config.color} />
      <ElmInlineText code color={config.color}>
        {name}
      </ElmInlineText>
      <ElmInlineText>{config.message}</ElmInlineText>

      <ElmInlineText>{duration.toFixed(1)}s</ElmInlineText>
    </>
  );

  const detailContent = () => {
    const parsedArgs = safeStringify(args);

    if (
      status === ToolCallStatus.InProgress ||
      status === ToolCallStatus.Executing
    ) {
      return (
        <div>
          <ElmCodeBlock caption="Arguments" code={parsedArgs} language="json" />
        </div>
      );
    }

    if (status === ToolCallStatus.Complete) {
      let parsedResult: string;
      try {
        parsedResult = JSON.stringify(JSON.parse(result ?? "null"), null, 2);
      } catch {
        parsedResult = result ?? "";
      }

      return (
        <div>
          <ElmCodeBlock
            caption={`Arguments in ${prepareDuration.toFixed(1)}s`}
            code={parsedArgs}
            language="json"
          />
          <ElmCodeBlock
            caption={`Result in ${executionDuration.toFixed(1)}s`}
            code={parsedResult}
            language="json"
            style={MARGIN_STYLE}
          />

          <ElmInlineText>Total {duration.toFixed(1)}s</ElmInlineText>
        </div>
      );
    }

    return null;
  };

  return (
    <ElmToggle
      style={MARGIN_STYLE}
      summaryContent={
        <span className={styles["inline-summary"]}>{summaryContent}</span>
      }
    >
      {detailContent()}
    </ElmToggle>
  );
};

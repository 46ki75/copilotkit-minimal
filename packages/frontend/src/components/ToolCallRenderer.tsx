import {
  defineToolCallRenderer,
  ToolCallStatus,
} from "@copilotkit/react-core/v2";
import {
  ElmCodeBlock,
  ElmInlineText,
  ElmMdiIcon,
  ElmToggle,
} from "@elmethis/react";
import styles from "./ToolCallRenderer.module.css";
import { mdiTools } from "@mdi/js";

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

const MARGIN_STYLE = { "--elmethis-margin-block-start": "0.5rem" } as const;

const safeStringify = (value: unknown, fallback = ""): string => {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return fallback;
  }
};

export const DefaultToolCallRenderer = defineToolCallRenderer({
  name: "*",
  render: ({ name, status, result, args }) => {
    const config = TOOL_STATUS_CONFIG[status];

    const summaryContent = (
      <>
        <ElmMdiIcon d={config.icon} size="1.25rem" color={config.color} />
        <ElmInlineText code color={config.color}>
          {name}
        </ElmInlineText>
        <ElmInlineText>{config.message}</ElmInlineText>
      </>
    );

    const detailContent = () => {
      const parsedArgs = safeStringify(args);

      if (status === ToolCallStatus.InProgress) {
        return (
          <div>
            <ElmCodeBlock
              caption="Arguments"
              code={parsedArgs}
              language="json"
            />
          </div>
        );
      }

      if (status === ToolCallStatus.Executing) {
        return (
          <div>
            <ElmCodeBlock
              caption="Arguments"
              code={parsedArgs}
              language="json"
            />
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
              caption="Arguments"
              code={parsedArgs}
              language="json"
            />
            <ElmCodeBlock
              caption="Result"
              code={parsedResult}
              language="json"
              style={MARGIN_STYLE}
            />
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
  },
});

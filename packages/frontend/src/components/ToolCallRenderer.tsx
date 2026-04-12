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

// Styles
import styles from "./ToolCallRenderer.module.css";
import { mdiTools } from "@mdi/js";

const STATUS_MESSAGE_MAP: Record<string, string> = {
  [ToolCallStatus.InProgress]: "Preparering",
  [ToolCallStatus.Executing]: "Executing",
  [ToolCallStatus.Complete]: "Complete",
} as const;

export const DefaultToolCallRenderer = defineToolCallRenderer({
  name: "*", // Wildcard matches all tools (like MCP tools)
  render: ({ name, status, result, args }) => {
    const summaryContent = () => {
      const toolStatusMap = {
        [ToolCallStatus.InProgress]: {
          mdiIcon: mdiTools,
          color: "#cdb57b",
          message: "Preparering",
        },
        [ToolCallStatus.Executing]: {
          mdiIcon: mdiTools,
          color: "#6987b8",
          message: "Executing",
        },
        [ToolCallStatus.Complete]: {
          mdiIcon: mdiTools,
          color: "#4ba96f",
          message: "Complete",
        },
      };

      return (
        <>
          <ElmMdiIcon
            d={toolStatusMap[status].mdiIcon}
            size="1.25rem"
            color={toolStatusMap[status].color}
          />
          <ElmInlineText code color={toolStatusMap[status].color}>
            {name}
          </ElmInlineText>

          <ElmInlineText>{STATUS_MESSAGE_MAP[status]}</ElmInlineText>
        </>
      );
    };

    const detailContent = () => {
      if (status === "inProgress") {
        return <div>Executing...</div>;
      }

      if (status === "executing") {
        let parsedArgs: string;
        try {
          parsedArgs = JSON.stringify(args, null, 2);
        } catch {
          parsedArgs = args ?? "";
        }

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

      if (status === "complete") {
        let parsedArgs: string;
        try {
          parsedArgs = JSON.stringify(args, null, 2);
        } catch {
          parsedArgs = args ?? "";
        }

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
              style={{ "--elmethis-margin-block-start": "1rem" }}
            />
          </div>
        );
      }

      return null;
    };

    return (
      <ElmToggle
        style={{ "--elmethis-margin-block-start": "1rem" }}
        summaryContent={
          <span className={styles["inline-summary"]}>{summaryContent()}</span>
        }
      >
        {detailContent()}
      </ElmToggle>
    );
  },
});

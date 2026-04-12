import {
  defineToolCallRenderer,
  ToolCallStatus,
} from "@copilotkit/react-core/v2";
import {
  ElmCodeBlock,
  ElmHeading,
  ElmInlineText,
  ElmMdiIcon,
  ElmToggle,
} from "@elmethis/react";

// Styles
import styles from "./ToolCallRenderer.module.css";
import { mdiCheckCircle, mdiTools } from "@mdi/js";

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
          mdiIcon: mdiCheckCircle,
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
      if (status === "inProgress" || status === "executing") {
        return <div>Executing...</div>;
      }

      if (status === "complete") {
        let parsedResult: string;
        try {
          parsedResult = JSON.stringify(JSON.parse(result ?? "null"), null, 2);
        } catch {
          parsedResult = result ?? "";
        }

        let parsedArgs: string;
        try {
          parsedArgs = JSON.stringify(JSON.parse(args ?? "null"), null, 2);
        } catch {
          parsedArgs = args ?? "";
        }

        return (
          <div
            style={
              { "--elmethis-margin-block-start": "2rem" } as React.CSSProperties
            }
          >
            <ElmHeading
              level={2}
              style={{ "--elmethis-margin-block-start": "0rem" }}
            >
              <ElmInlineText>args</ElmInlineText>
            </ElmHeading>

            <ElmCodeBlock code={parsedArgs} language="json" />

            <ElmHeading level={2}>
              <ElmInlineText>Result</ElmInlineText>
            </ElmHeading>

            <ElmCodeBlock code={parsedResult} language="json" />
          </div>
        );
      }

      return null;
    };

    return (
      <ElmToggle
        summaryContent={
          <span className={styles["inline-summary"]}>{summaryContent()}</span>
        }
      >
        {detailContent()}
      </ElmToggle>
    );
  },
});

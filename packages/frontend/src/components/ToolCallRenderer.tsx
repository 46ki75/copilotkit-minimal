import { defineToolCallRenderer } from "@copilotkit/react-core/v2";
import {
  ElmCodeBlock,
  ElmInlineText,
  ElmSpinner,
  ElmToggle,
} from "@elmethis/react";

// Styles
import styles from "./ToolCallRenderer.module.css";

export const ToolCallRenderer = defineToolCallRenderer({
  name: "*", // Wildcard matches all tools (like MCP tools)
  render: ({ name, status, result }) => {
    const summaryContent = () => {
      if (status === "inProgress" || status === "executing") {
        return (
          <>
            <ElmSpinner radius={8} />
            <ElmInlineText>&nbsp;Executing:&nbsp;</ElmInlineText>
            <ElmInlineText code color="#6987b8">
              {name}
            </ElmInlineText>
          </>
        );
      }

      if (status === "complete") {
        return (
          <>
            <ElmInlineText>Finished:&nbsp;</ElmInlineText>
            <ElmInlineText code color="#4ba96f">
              {name}
            </ElmInlineText>
          </>
        );
      }

      return <strong>{name}</strong>;
    };

    const detailContent = () => {
      if (status === "inProgress" || status === "executing") {
        return <div>Executing...</div>;
      }

      if (status === "complete") {
        return (
          <div>
            <ElmCodeBlock
              code={JSON.stringify(JSON.parse(result ?? "null"), null, 2)}
              language="json"
            ></ElmCodeBlock>
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

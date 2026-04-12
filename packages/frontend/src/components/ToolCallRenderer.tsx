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
          <span>
            <ElmSpinner radius={12} />
            <ElmInlineText>&nbsp;Executing:&nbsp;</ElmInlineText>
            <ElmInlineText code color="#6987b8">
              {name}
            </ElmInlineText>
          </span>
        );
      }

      if (status === "complete") {
        return (
          <span>
            <ElmInlineText>Finished:&nbsp;</ElmInlineText>
            <ElmInlineText code color="#4ba96f">
              {name}
            </ElmInlineText>
          </span>
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
      <ElmToggle summaryContent={summaryContent()}>{detailContent()}</ElmToggle>
    );
  },
});

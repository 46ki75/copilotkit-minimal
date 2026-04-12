import { useFrontendTool } from "@copilotkit/react-core/v2";
import { ElmInlineText, ElmParagraph } from "@elmethis/react";

export const useGetDateFrontendTool = () => {
  useFrontendTool({
    name: "get_date",
    description: "Get the current date and time",
    handler: async () => {
      return new Date().toString();
    },
    render: ({ status, result }) => {
      return (
        <div>
          <ElmParagraph>
            You can define your custom render logic here ^.^
          </ElmParagraph>
          <ElmParagraph>{status}</ElmParagraph>
          <ElmParagraph>
            <ElmInlineText code>{JSON.stringify(result)}</ElmInlineText>
          </ElmParagraph>
        </div>
      );
    },
  });
};

import { useFrontendTool } from "@copilotkit/react-core/v2";
import { ElmInlineText, ElmParagraph } from "@elmethis/react";

export const useGetDateFrontendTool = () => {
  useFrontendTool({
    name: "get_date",
    description: "Get the current date and time",
    handler: async () => {
      try {
        if (Math.random() < 0.5) {
          throw new Error("Random error occurred");
        }

        return {
          date: new Date().toString(),
          isError: false,
        };
      } catch (error: unknown) {
        return {
          date: null,
          isError: true,
          error: (error as Error)?.message,
        };
      }
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

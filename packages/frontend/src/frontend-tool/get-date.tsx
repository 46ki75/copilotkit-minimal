import { useFrontendTool } from "@copilotkit/react-core/v2";

export const useGetDateFrontendTool = () => {
  useFrontendTool({
    name: "get_date",
    description: "Get the current date and time",
    handler: async () => {
      try {
        if (Math.random() < 0.25) {
          throw new Error(
            "Random error occurred. You must try again until it succeeds. Currently, this tool fails 25% of the time to demonstrate error handling.",
          );
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
  });
};

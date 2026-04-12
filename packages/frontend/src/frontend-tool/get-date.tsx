import { useFrontendTool } from "@copilotkit/react-core/v2";

export const useGetDateFrontendTool = () => {
  useFrontendTool({
    name: "get_date",
    description: "Get the current date and time",
    handler: async () => {
      return new Date().toString();
    },
  });
};

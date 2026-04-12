import { v4, v7 } from "uuid";
import z from "zod";

import { useHumanInTheLoop } from "@copilotkit/react-core/v2";

// Components
import { ElmButton, ElmInlineText, ElmParagraph } from "@elmethis/react";

const approvalSchema = z.object({
  version: z.enum(["v4", "v7"]).describe("Version of UUID to generate"),
  uuid: z.string().describe("The generated UUID"),
});

const rejectionSchema = z.object({
  errors: z.array(z.string()).describe("List of error messages"),
});

const approvalOrRejectionSchema = z.union([approvalSchema, rejectionSchema]);

export const useGenerateUuidFrontendTool = () => {
  useHumanInTheLoop({
    name: "generate_uuid",
    description: "Generate a new UUID of a specified version (v4 or v7)",
    parameters: z.object({
      version: z.enum(["v4", "v7"]).default("v4"),
    }),

    render: ({ args, respond, status, result }) => {
      switch (status) {
        case "inProgress": {
          return <ElmParagraph>Generating UUID...</ElmParagraph>;
        }

        case "executing": {
          const approveHandler = () => {
            const genFnMap: Record<typeof args.version, () => string> = {
              v4: v4,
              v7: v7,
            };

            const uuid = genFnMap[args.version]();

            const response: z.infer<typeof approvalSchema> = {
              version: args.version,
              uuid,
            };

            respond(response);
          };

          const rejectHandler = () => {
            const response: z.infer<typeof rejectionSchema> = {
              errors: ["User rejected the operation"],
            };
            respond(response);
          };

          return (
            <div>
              <ElmParagraph>
                Are you sure you want to generate a new UUID of version
                {args.version}?
              </ElmParagraph>
              <ElmButton onClick={approveHandler}>Approve</ElmButton>
              <ElmButton onClick={rejectHandler}>Reject</ElmButton>
            </div>
          );
        }

        case "complete": {
          const resultData = approvalOrRejectionSchema.parse(
            typeof result === "string" ? JSON.parse(result) : result
          );

          if ("errors" in resultData) {
            return (
              <div>
                <ElmParagraph>Failed to generate UUID:</ElmParagraph>
                {resultData.errors.map((error, index) => (
                  <ElmParagraph key={index}>
                    <ElmInlineText code>{error}</ElmInlineText>
                  </ElmParagraph>
                ))}
              </div>
            );
          }

          const { version, uuid } = resultData;

          return (
            <ElmParagraph>
              Generated UUID ({version}):{" "}
              <ElmInlineText code>{uuid}</ElmInlineText>
            </ElmParagraph>
          );
        }
      }
    },
  });
};

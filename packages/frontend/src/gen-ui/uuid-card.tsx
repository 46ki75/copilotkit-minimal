import { useComponent } from "@copilotkit/react-core/v2";
import { z } from "zod";

import styles from "./uuid-card.module.css";
import { ElmInlineText } from "@elmethis/react";

const uuidCardSchema = z.object({
  uuid: z.string().describe("UUID"),
  version: z.string().describe("UUID version"),
});

export const useUuidCrd = () => {
  useComponent({
    name: "show_uuid_card",
    description:
      "Display a UUID card to the user. You should use this component to display the generated UUID to the user.",
    parameters: uuidCardSchema,
    render: ({ uuid, version }) => {
      return (
        <div className={styles["uuid-card"]}>
          <ElmInlineText bold>UUID {version}:</ElmInlineText>
          <ElmInlineText code>{uuid}</ElmInlineText>
        </div>
      );
    },
  });
};

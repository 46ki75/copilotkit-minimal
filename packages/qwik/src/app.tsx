import { component$ } from "@builder.io/qwik";
import { CopilotKit } from "@cloud.ikuma/copilotkit-qwik";

export const App = component$(() => {
  return (
    <>
      <div>
        <CopilotKit></CopilotKit>
      </div>
    </>
  );
});

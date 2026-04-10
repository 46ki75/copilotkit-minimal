import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNodeHttpEndpoint,
} from "@copilotkit/runtime";
import OpenAI from "openai";

dotenv.config();

const fastify = Fastify({ logger: true });
const port = parseInt(process.env.PORT || "3000", 10);

fastify.register(cors, {
  origin: true,
});

// We let fastify parse the JSON body normally (remove custom parser)
fastify.all("/copilotkit", async (request, reply) => {
  const runtime = new CopilotRuntime();

  // Create an OpenAI client configured for OpenRouter
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
  });

  // Pass the custom OpenAI client to the OpenAIAdapter
  // Optional: model parameter specifies the default OpenRouter model to use.
  const serviceAdapter = new OpenAIAdapter({
    openai,
    model: "minimax/minimax-m2.5",
  });

  try {
    const handler = copilotRuntimeNodeHttpEndpoint({
      endpoint: "/copilotkit",
      runtime,
      serviceAdapter,
    });

    // CopilotKit node HTTP endpoint expects the body to be accessible on the request for Express compatibility
    // Make sure we attach Fastify's parsed body to the raw request before passing it
    Object.assign(request.raw, { body: request.body });

    reply.hijack(); // Hand over to raw node HTTP handler
    return handler(request.raw, reply.raw);
  } catch (error) {
    request.log.error(error, "Error running CopilotKit endpoint");
    reply.status(500).send("Endpoint error");
  }
});

fastify.listen(
  { port, host: "0.0.0.0" },
  (err: Error | null, address: string) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`CopilotKit backend running on ${address}`);
  },
);

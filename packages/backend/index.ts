import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  CopilotRuntime,
  OpenAIAdapter,
  copilotRuntimeNodeHttpEndpoint,
} from "@copilotkit/runtime";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.all(
  "/copilotkit",
  async (req: Request, res: Response, next: NextFunction) => {
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
      return handler(req, res);
    } catch (error) {
      console.error("Error running CopilotKit endpoint:", error);
      res.status(500).send("Endpoint error");
    }
  },
);

app.listen(port, () => {
  console.log(`CopilotKit backend running on http://localhost:${port}`);
});

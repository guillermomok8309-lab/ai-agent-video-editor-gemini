#!/usr/bin/env node
import { Command } from "commander";

import { loadConfig } from "../config/env.js";
import { logger } from "../config/logger.js";
import { exitWithError } from "../lib/errors.js";
import { runAgentTask, createVideoPlan } from "../lib/agent.js";
import { testGeminiConnection } from "../lib/gemini.js";

const program = new Command();

program
  .name("video-use")
  .description("Gemini-powered video editing agent CLI")
  .version("0.1.0");

program
  .command("agent")
  .description("Ask the Gemini agent to plan or execute a video-editing task")
  .argument("<task>", "Prompt or task description")
  .option("--json", "Return structured JSON output when possible")
  .option("--model <name>", "Specify a Gemini model")
  .action(async (task: string, opts: { json?: boolean; model?: string }) => {
    try {
      loadConfig();
      const result = await runAgentTask(task, { model: opts.model, json: !!opts.json });
      console.log(result.output);
    } catch (error) {
      exitWithError(error);
    }
  });

program
  .command("plan")
  .description("Generate a structured editing plan for a given video task")
  .argument("<task>", "Video editing scenario")
  .option("--model <name>", "Specify a Gemini model")
  .action(async (task: string, opts: { model?: string }) => {
    try {
      loadConfig();
      const result = await createVideoPlan(task, opts.model);
      console.log(JSON.stringify(result, null, 2));
    } catch (error) {
      exitWithError(error);
    }
  });

program
  .command("health")
  .description("Check Gemini API connectivity")
  .action(async () => {
    try {
      loadConfig();
      const status = await testGeminiConnection();
      console.log(JSON.stringify(status, null, 2));
    } catch (error) {
      exitWithError(error);
    }
  });

program
  .command("chat")
  .description("Open an interactive Gemini chat loop")
  .action(async () => {
    try {
      loadConfig();
      logger.info("Interactive Gemini chat started. Type 'exit' to quit.");
      const rl = await import("node:readline/promises");
      const readline = rl.default.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      while (true) {
        const prompt = await readline.question("video-agent> ");
        if (prompt.trim().toLowerCase() === "exit") {
          break;
        }
        const result = await runAgentTask(prompt, { model: undefined, json: false });
        console.log(result.output);
      }

      readline.close();
    } catch (error) {
      exitWithError(error);
    }
  });

program.parseAsync(process.argv).catch((error: unknown) => {
  exitWithError(error);
});

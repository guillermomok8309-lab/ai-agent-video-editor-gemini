import { config as loadDotenv } from "dotenv";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { ConfigError } from "../lib/errors.js";
import type { AppConfig, LogLevel } from "../types/index.js";

const LOG_LEVELS: LogLevel[] = ["debug", "info", "warn", "error"];

let cachedConfig: AppConfig | undefined;

function findEnvFile(): string | undefined {
  const candidates = [
    resolve(process.cwd(), ".env"),
    resolve(dirname(fileURLToPath(import.meta.url)), "../../.env"),
  ];
  return candidates.find((value) => existsSync(value));
}

function parseLogLevel(value: string | undefined): LogLevel {
  const normalized = (value ?? "info").toLowerCase();
  return LOG_LEVELS.includes(normalized as LogLevel) ? (normalized as LogLevel) : "info";
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const envPath = findEnvFile();
  if (envPath) {
    loadDotenv({ path: envPath });
  }

  const apiKey = (env.GEMINI_API_KEY ?? env.GOOGLE_API_KEY ?? "").trim();
  if (!apiKey && env.NODE_ENV !== "test") {
    throw new ConfigError("GEMINI_API_KEY not found in .env or environment");
  }

  cachedConfig = {
    geminiApiKey: apiKey,
    geminiModel: env.GEMINI_MODEL ?? "gemini-2.0-flash",
    geminiTemperature: Number.parseFloat(env.GEMINI_TEMPERATURE ?? "0.5"),
    logLevel: parseLogLevel(env.LOG_LEVEL),
  };

  return cachedConfig;
}

export function getConfig(): AppConfig {
  if (!cachedConfig) {
    return loadConfig();
  }
  return cachedConfig;
}

export function resetConfigCache(): void {
  cachedConfig = undefined;
}

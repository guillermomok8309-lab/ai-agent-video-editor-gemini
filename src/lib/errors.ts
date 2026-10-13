export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppError";
  }
}

export class ConfigError extends AppError {}

export class GeminiError extends AppError {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = "GeminiError";
  }
}

export function exitWithError(error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);
  console.error("\nERROR:", message);
  process.exit(1);
}

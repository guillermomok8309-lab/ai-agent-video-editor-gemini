import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export function readPackageVersion(): string {
  const packagePath = new URL("../../package.json", import.meta.url);
  const pkg = JSON.parse(readFileSync(packagePath, "utf8")) as { version?: string };
  return pkg.version ?? "0.1.0";
}

export function getProjectRoot(): string {
  return fileURLToPath(new URL("../..", import.meta.url));
}

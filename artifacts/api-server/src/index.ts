import { existsSync } from "fs";
import path from "path";

// import.meta.dirname is empty once esbuild bundles this to CJS for production —
// that's fine, production env vars come from the deployment, not a local .env file.
if (import.meta.dirname) {
  const localEnvPath = path.resolve(import.meta.dirname, "../.env");
  if (existsSync(localEnvPath)) {
    process.loadEnvFile(localEnvPath);
  }
}

async function main() {
  const { default: app } = await import("./app.js");

  const rawPort = process.env["PORT"];

  if (!rawPort) {
    throw new Error(
      "PORT environment variable is required but was not provided.",
    );
  }

  const port = Number(rawPort);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error(`Invalid PORT value: "${rawPort}"`);
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

main();

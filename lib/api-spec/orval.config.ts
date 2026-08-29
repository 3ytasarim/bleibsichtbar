import { defineConfig, InputTransformerFn } from "orval";
import path from "path";

const root = path.resolve(__dirname, "..", "..");
const apiClientReactSrc = path.resolve(root, "lib", "api-client-react", "src");
const apiZodSrc = path.resolve(root, "lib", "api-zod", "src");

// Our exports make assumptions about the title of the API being "Api" (i.e. generated output is `api.ts`).
const titleTransformer: InputTransformerFn = (config) => {
  config.info ??= {};
  config.info.title = "Api";

  return config;
};

export default defineConfig({
  "api-client-react": {
    input: {
      target: "./openapi.yaml",
      override: {
        transformer: titleTransformer,
      },
    },
    output: {
      workspace: apiClientReactSrc,
      target: "generated",
      client: "react-query",
      mode: "split",
      baseUrl: "/api",
      clean: true,
      prettier: true,
      override: {
        fetch: {
          includeHttpResponseReturnType: false,
        },
        mutator: {
          path: path.resolve(apiClientReactSrc, "custom-fetch.ts"),
          name: "customFetch",
        },
      },
    },
  },
  // NOTE: orval's "zod" client always writes lib/api-zod/src/index.ts as a
  // fixed 3-line barrel (`./generated/api`, `./generated/types`,
  // `./generated/api.schemas`) regardless of what this config actually
  // produces — with `mode: "split"` and no `schemas.path` override, only
  // `generated/api.ts` (which is self-contained) really gets written, so
  // that barrel is permanently broken/ambiguous no matter how this config
  // is tuned. lib/api-zod/package.json's export map points straight at
  // generated/api.ts instead of the barrel, and lib/api-zod/tsconfig.json
  // excludes src/index.ts from typecheck — don't "fix" index.ts by hand,
  // orval overwrites it (clean: true) on every run.
  zod: {
    input: {
      target: "./openapi.yaml",
      override: {
        transformer: titleTransformer,
      },
    },
    output: {
      workspace: apiZodSrc,
      client: "zod",
      target: "generated",
      mode: "split",
      clean: true,
      prettier: true,
      override: {
        zod: {
          coerce: {
            query: ['boolean', 'number', 'string'],
            param: ['boolean', 'number', 'string'],
          },
        },
        useDates: true,
      },
    },
  },
});

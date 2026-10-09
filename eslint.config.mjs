import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const reactHooksPlugin = nextVitals.find(
  (config) => config.plugins?.["react-hooks"],
)?.plugins?.["react-hooks"];

if (!reactHooksPlugin) {
  throw new Error(
    "eslint-config-next did not provide eslint-plugin-react-hooks",
  );
}

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // These React Compiler diagnostics identify real modernization work, but
    // the current codebase predates the compiler rules. Keep them visible
    // without making the correctness gate non-deterministically unshippable.
    plugins: { "react-hooks": reactHooksPlugin },
    rules: {
      "react-hooks/immutability": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    files: ["scripts/**/*.cjs"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    files: [
      "src/app/**/*.{ts,tsx}",
      "src/components/**/*.{ts,tsx}",
      "src/contexts/**/*.{ts,tsx}",
      "src/hooks/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            {
              name: "@/lib/google-sheets",
              message: "Route UI must use @/server/queries or a server action.",
            },
            {
              name: "@/lib/pension-sheets",
              message: "Route UI must use @/server/queries or a server action.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "dev/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

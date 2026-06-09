import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
  test: {
    // Unit tests only (top-level). Integration tests live in tests/integration/
    // and run via `npm run test:integration` (they hit the live database).
    include: ["tests/*.test.ts"],
    environment: "node",
    coverage: {
      provider: "v8",
      all: true,
      include: ["lib/**/*.ts"],
      exclude: ["lib/types.ts"],
      reporter: ["text", "text-summary"],
    },
  },
});

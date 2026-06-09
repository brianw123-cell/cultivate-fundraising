import { defineConfig } from "vitest/config";
import path from "node:path";

// Integration tests hit the live Supabase project, so they're opt-in and
// separate from the fast unit suite. Run with: npm run test:integration
export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
  test: {
    include: ["tests/integration/**/*.test.ts"],
    environment: "node",
    testTimeout: 30000,
    hookTimeout: 30000,
  },
});

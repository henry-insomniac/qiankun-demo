import { defineConfig } from "vitest/config";

export default defineConfig({
  define: {
    __SHELL_BASE_PATH__: JSON.stringify(""),
    __USE_HASH_ROUTING__: JSON.stringify(false),
  },
  test: {
    environment: "node",
    globals: true,
    include: ["packages/**/src/**/*.test.ts", "apps/**/src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
});

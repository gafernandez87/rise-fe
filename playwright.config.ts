import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  workers: 2,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    browserName: "chromium",
    channel: process.env.PLAYWRIGHT_CHANNEL,
    reducedMotion: "reduce",
    trace: "retain-on-failure",
  },
  // The server is managed manually. Tests never start or restart it.
});

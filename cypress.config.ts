import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:4200",
    specPattern: "e2e/integration/**/*.spec.ts",
    supportFile: "e2e/support/index.ts",
  },
  fixturesFolder: "e2e/fixtures",
  screenshotsFolder: "e2e/screenshots",
  video: false,
  videosFolder: "e2e/videos",
});

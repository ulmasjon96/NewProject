import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  timeout: 30_000,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:8080/My-Portfolio/',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 8080',
    url: 'http://127.0.0.1:8080/My-Portfolio/',
    reuseExistingServer: true,
    timeout: 120_000,
  },
});

import { defineConfig } from '@playwright/test'

const PORT = 3200

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: process.env.CI ? undefined : 'chrome',
  },
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  webServer: {
    command: `pnpm build && pnpm start --port ${PORT}`,
    url: `http://localhost:${PORT}/pl`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
})

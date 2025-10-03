import { defineConfig } from 'cypress'
import { startDevServer } from '@cypress/vite-dev-server'
import viteConfig from './vite.config'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      on('dev-server:start', (options) => {
        return startDevServer({ options, viteConfig })
      })
    },
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    chromeWebSecurity: false,
    experimentalRunAllSpecs: true,
    // Healthcare app specific settings
    env: {
      API_URL: 'http://localhost:3001',
      TEST_USER_EMAIL: 'nurse@school.edu',
      TEST_USER_PASSWORD: 'NursePassword123!',
      COVERAGE: false
    }
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig
    },
    specPattern: 'src/**/__tests__/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts'
  }
})
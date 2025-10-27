import { defineConfig } from 'cypress';
import codeCoverageTask from '@cypress/code-coverage/task';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    fixturesFolder: 'cypress/fixtures',
    
    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Timeouts
    defaultCommandTimeout: 2500,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,
    
    // Test isolation and cleanup
    testIsolation: true,
    
    // Retry configuration
    retries: {
      runMode: 2,
      openMode: 0,
    },
    
    // Video and screenshot settings
    video: true,
    videoCompression: 32,
    screenshotOnRunFailure: true,
    
    // Browser settings
    chromeWebSecurity: false,
    
    // Environment variables
    env: {
      apiUrl: 'http://localhost:3001',
      coverage: false,
    },
    
    setupNodeEvents(on, config) {
      // Code coverage setup
      codeCoverageTask(on, config);
      
      // Custom tasks can be added here
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
      
      return config;
    },
  },
  
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
  },
});

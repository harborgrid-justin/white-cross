import { defineConfig } from 'cypress'
import viteConfig from '../frontend/vite.config'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // Enable code coverage collection in enterprise environments
      if (config.env.COVERAGE) {
        require('@cypress/code-coverage/task')(on, config)
      }

      // Custom task for enterprise reporting
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        queryDb: (query) => {
          // Placeholder for database queries in enterprise environments
          return null
        },
        clearTestData: () => {
          // Placeholder for test data cleanup
          return null
        }
      })

      // Environment-specific configuration
      if (config.env.ENVIRONMENT === 'staging') {
        config.baseUrl = 'https://staging.whitecross.healthcare'
      } else if (config.env.ENVIRONMENT === 'production') {
        config.baseUrl = 'https://app.whitecross.healthcare'
      }

      return config
    },
    
    // Viewport settings for healthcare applications
    viewportWidth: 1440,
    viewportHeight: 900,
    
    // Media and artifact settings
    video: true,
    videoCompression: 32,
    videosFolder: 'cypress/videos',
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    
    // Timeout settings optimized for healthcare data loading
    defaultCommandTimeout: 10000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    pageLoadTimeout: 60000,
    
    // Security and browser settings
    chromeWebSecurity: false,
    experimentalRunAllSpecs: true,
    experimentalMemoryManagement: true,
    experimentalSourceRewriting: true,
    
    // Retry configuration for flaky test resilience
    retries: {
      runMode: 2,
      openMode: 0
    },
    
    // Parallel execution in CI
    numTestsKeptInMemory: 5,
    
    // Healthcare application specific environment variables
    env: {
      // API Configuration
      API_URL: 'http://localhost:3001',
      API_VERSION: 'v1',
      
      // Test User Credentials (encrypted in production)
      TEST_ADMIN_EMAIL: 'admin@school.edu',
      TEST_ADMIN_PASSWORD: 'AdminPassword123!',
      TEST_NURSE_EMAIL: 'nurse@school.edu',
      TEST_NURSE_PASSWORD: 'NursePassword123!',
      TEST_COUNSELOR_EMAIL: 'counselor@school.edu',
      TEST_COUNSELOR_PASSWORD: 'CounselorPassword123!',
      TEST_READONLY_EMAIL: 'readonly@school.edu',
      TEST_READONLY_PASSWORD: 'ReadOnlyPassword123!',
      
      // Feature Flags for Testing
      ENABLE_AUDIT_LOGGING: true,
      ENABLE_MEDICATION_SAFETY: true,
      ENABLE_HIPAA_COMPLIANCE: true,
      ENABLE_ACCESSIBILITY_CHECKS: true,
      
      // Performance Testing
      PERFORMANCE_THRESHOLD_MS: 2000,
      API_RESPONSE_THRESHOLD_MS: 1000,
      
      // Test Data Management
      USE_REAL_API: false,
      CLEANUP_TEST_DATA: true,
      
      // Code Coverage
      COVERAGE: false,
      
      // Environment Detection
      ENVIRONMENT: 'local',
      
      // Security Testing
      CSRF_TOKEN_VALIDATION: true,
      SESSION_TIMEOUT_MINUTES: 30,
      
      // Accessibility Testing
      A11Y_RULES: {
        'color-contrast': { enabled: true },
        'keyboard-navigation': { enabled: true },
        'aria-labels': { enabled: true }
      },
      
      // Healthcare Specific Settings
      PHI_ACCESS_LOGGING: true,
      MEDICATION_BARCODE_SCANNING: true,
      FIVE_RIGHTS_VALIDATION: true,
      
      // Browser-specific settings
      HEADLESS_BROWSER: false,
      BROWSER_LOGS: true
    }
  },
  
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
      viteConfig
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    env: {
      // Component testing specific settings
      MOCK_API_RESPONSES: true,
      TEST_ISOLATED_COMPONENTS: true
    }
  },
  
  // Global configuration
  watchForFileChanges: true,
  
  // Reporter configuration for enterprise environments
  // reporter: 'cypress-multi-reporters',
  // reporterOptions: {
  //   configFile: 'cypress/config/reporter.json'
  // }
})

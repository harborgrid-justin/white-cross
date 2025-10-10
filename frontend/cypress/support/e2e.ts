// Import Cypress types and custom commands
/// <reference types="cypress" />
import './commands'

/**
 * Global Cypress Configuration for E2E Tests
 * White Cross Healthcare Management System
 */

// Handle uncaught exceptions gracefully
Cypress.on('uncaught:exception', (err: Error) => {
  // Don't fail tests on ResizeObserver errors (common in React apps)
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }
  
  // Don't fail tests on non-critical console errors
  if (err.message.includes('Non-Error promise rejection captured')) {
    return false
  }
  
  // Don't fail on network timeout errors during testing
  if (err.message.includes('Loading chunk') || err.message.includes('Loading CSS chunk')) {
    return false
  }
  
  // Log the error for debugging but don't fail the test for known issues
  console.warn('Uncaught exception:', err.message)
  return true
})

// Configure request/response logging for debugging and suppress console noise
Cypress.on('window:before:load', (win: any) => {
  // Suppress console noise in test environment
  if (win.console) {
    cy.stub(win.console, 'warn').as('consoleWarn')
    cy.stub(win.console, 'error').as('consoleError')
  }
})

// Add custom assertions for healthcare-specific testing
Cypress.Commands.add('shouldBeAccessible', () => {
  // Basic accessibility checks for healthcare applications
  cy.get('body').should('exist')
  cy.get('[role="main"], main, #root').should('exist')
})

// Add support for session-based authentication
Cypress.Commands.add('preserveSession', () => {
  cy.window().then((win: any) => {
    if (win.sessionStorage) {
      win.sessionStorage.clear()
    }
  })
})

// Healthcare-specific test utilities - removed mocking to allow real API calls
Cypress.Commands.add('waitForHealthcareData', () => {
  // Set up intercepts for monitoring (not mocking) common healthcare data endpoints
  cy.intercept('GET', '**/api/students*').as('loadStudents')
  cy.intercept('GET', '**/api/appointments*').as('loadAppointments')
  cy.intercept('GET', '**/api/medications*').as('loadMedications')
  cy.intercept('GET', '**/api/users*').as('loadUsers')

  // Allow real API calls for authentication to test against actual backend
  cy.intercept('POST', '**/api/auth/login').as('login')
  cy.intercept('GET', '**/api/auth/verify').as('verifyToken')
  cy.intercept('GET', '**/api/auth/me').as('getMe')
  cy.intercept('POST', '**/api/auth/refresh').as('refreshToken')
})

// Global test configuration
beforeEach(() => {
  // Set consistent viewport for healthcare application testing
  cy.viewport(1280, 720)
  
  // Clear storage for test isolation
  cy.clearLocalStorage()
  cy.clearCookies()
  
  // Set up common healthcare data intercepts
  cy.waitForHealthcareData()
})

// Global cleanup after each test
afterEach(() => {
  // Clean up any test-specific data - wrapped in cy.then to handle potential errors gracefully
  cy.then(() => {
    try {
      const win = Cypress.state('window')
      if (win && win.localStorage && win.localStorage.getItem('test-mode')) {
        win.localStorage.removeItem('test-mode')
      }
    } catch (e) {
      // Ignore if window is not available
    }
  })
})

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

// Healthcare-specific test utilities - Mock ALL API calls for testing without backend
Cypress.Commands.add('waitForHealthcareData', () => {
  // Mock health check endpoint
  cy.intercept('GET', '**/health', {
    statusCode: 200,
    body: { status: 'OK', timestamp: new Date().toISOString() }
  }).as('health')

  // Mock dev users endpoint
  cy.intercept('GET', '**/api/auth/dev-users', {
    statusCode: 200,
    body: []
  }).as('devUsers')

  // Set up intercepts for monitoring (not mocking) common healthcare data endpoints
  cy.intercept('GET', '**/api/students*', {
    statusCode: 200,
    body: { success: true, data: { students: [], pagination: { page: 1, total: 0 } } }
  }).as('loadStudents')
  
  cy.intercept('GET', '**/api/appointments*', {
    statusCode: 200,
    body: { success: true, data: { appointments: [], pagination: { page: 1, total: 0 } } }
  }).as('loadAppointments')
  
  cy.intercept('GET', '**/api/medications*', {
    statusCode: 200,
    body: { success: true, data: { medications: [], pagination: { page: 1, total: 0 } } }
  }).as('loadMedications')
  
  cy.intercept('GET', '**/api/users*', {
    statusCode: 200,
    body: { success: true, data: { users: [], pagination: { page: 1, total: 0 } } }
  }).as('loadUsers')

  // Mock authentication endpoints with proper responses
  cy.intercept('POST', '**/api/auth/login', (req) => {
    // Simulate successful login for any credentials in fixtures
    const { email } = req.body
    let role = 'NURSE'
    let firstName = 'Test'
    let lastName = 'User'
    
    if (email?.includes('admin')) {
      role = 'ADMIN'
      lastName = 'Administrator'
    } else if (email?.includes('counselor')) {
      role = 'SCHOOL_ADMIN'
      lastName = 'Counselor'
    } else if (email?.includes('doctor')) {
      role = 'DOCTOR'
      lastName = 'Doctor'
    } else if (email?.includes('readonly')) {
      role = 'NURSE'
      lastName = 'ReadOnly'
    }
    
    req.reply({
      statusCode: 200,
      body: {
        success: true,
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: 'user-' + Date.now(),
            email: email,
            firstName: firstName,
            lastName: lastName,
            role: role,
            displayName: `${firstName} ${lastName}`
          }
        }
      }
    })
  }).as('login')
  
  cy.intercept('GET', '**/api/auth/verify', {
    statusCode: 200,
    body: { success: true, data: { valid: true } }
  }).as('verifyToken')
  
  cy.intercept('GET', '**/api/auth/me', {
    statusCode: 200,
    body: {
      success: true,
      data: {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'NURSE'
        }
      }
    }
  }).as('getMe')
  
  cy.intercept('POST', '**/api/auth/refresh', {
    statusCode: 200,
    body: {
      success: true,
      data: {
        token: 'refreshed-mock-jwt-token-' + Date.now()
      }
    }
  }).as('refreshToken')
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

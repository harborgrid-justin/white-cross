/// <reference types="cypress" />

/**
 * Appointment Scheduling E2E Tests
 * Tests the appointment scheduling functionality for the White Cross platform
 */

describe('Appointment Scheduling', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/appointments')
  })

  it('should display the appointments page with proper elements', () => {
    cy.contains('Appointments').should('be.visible')
    cy.url().should('include', '/appointments')
  })

  it('should load appointments page without errors', () => {
    // Verify page loads successfully
    cy.get('body').should('be.visible')
    cy.url().should('include', '/appointments')
  })

  it('should be accessible to nurses', () => {
    // Verify nurse role can access appointments
    cy.url().should('include', '/appointments')
    cy.contains('Appointments').should('be.visible')
  })

  it('should have proper navigation', () => {
    // Test navigation back to dashboard
    cy.visit('/dashboard')
    cy.url().should('include', '/dashboard')

    // Navigate back to appointments
    cy.visit('/appointments')
    cy.url().should('include', '/appointments')
  })
})

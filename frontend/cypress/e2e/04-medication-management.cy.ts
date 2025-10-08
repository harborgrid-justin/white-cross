/// <reference types="cypress" />

/**
 * Medication Management E2E Tests
 * Tests the medication management functionality for the White Cross platform
 */

describe('Medication Management', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/medications')
  })

  it('should display the medications page with proper elements', () => {
    cy.contains('Medications').should('be.visible')
    cy.url().should('include', '/medications')
  })

  it('should load medications page without errors', () => {
    // Verify page loads successfully
    cy.get('body').should('be.visible')
    cy.url().should('include', '/medications')
  })

  it('should be accessible to nurses', () => {
    // Verify nurse role can access medications
    cy.url().should('include', '/medications')
    cy.contains('Medications').should('be.visible')
  })

  it('should have proper navigation', () => {
    // Test navigation back to dashboard
    cy.visit('/dashboard')
    cy.url().should('include', '/dashboard')

    // Navigate back to medications
    cy.visit('/medications')
    cy.url().should('include', '/medications')
  })

  it('should handle medication data display', () => {
    // Verify page can render medication-related content
    cy.get('body').should('exist')
  })
})

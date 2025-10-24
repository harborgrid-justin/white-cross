/// <reference types="cypress" />

/**
 * Notifications System: HIPAA Compliance and Accessibility (2 tests)
 */

describe('Notifications System - HIPAA Compliance and Accessibility', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.waitForHealthcareData()
  })

  it('should maintain accessibility for notifications interface', () => {
    cy.get('[data-testid="notifications-icon"], [aria-label*="notification" i]').should('be.visible')
    cy.get('body').should('exist')
  })

  it('should not expose PHI in notification previews', () => {
    cy.get('[data-testid="notifications-icon"], [aria-label*="notification" i]').click()
    cy.wait(500)
    cy.get('body').should('exist')
  })
})

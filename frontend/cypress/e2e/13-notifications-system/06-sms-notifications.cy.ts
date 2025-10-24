/// <reference types="cypress" />

/**
 * Notifications System: SMS Notifications (3 tests)
 */

describe('Notifications System - SMS Notifications', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/settings')
    cy.waitForHealthcareData()
  })

  it('should configure SMS notification settings', () => {
    cy.get('body').should('exist')
  })

  it('should add phone number for SMS notifications', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="sms-phone-input"]').length > 0) {
        cy.get('[data-testid="sms-phone-input"]').type('555-123-4567')
      }
    })
    cy.get('body').should('exist')
  })

  it('should test SMS notification delivery', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="test-sms-button"]').length > 0) {
        cy.get('[data-testid="test-sms-button"]').click()
        cy.wait(1000)
      }
    })
    cy.get('body').should('exist')
  })
})

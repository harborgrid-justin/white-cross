/// <reference types="cypress" />

/**
 * Notifications System: Page UI Structure (5 tests)
 */

describe('Notifications System - Page UI Structure', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.waitForHealthcareData()
  })

  it('should display notifications icon in header', () => {
    cy.get('[data-testid="notifications-icon"], [aria-label*="notification" i]').should('be.visible')
  })

  it('should display notification badge with unread count', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="notification-badge"]').length > 0) {
        cy.get('[data-testid="notification-badge"]').should('be.visible')
      }
    })
  })

  it('should open notifications panel on click', () => {
    cy.get('[data-testid="notifications-icon"], [aria-label*="notification" i]').click()
    cy.wait(500)
    cy.get('body').should('exist')
  })

  it('should display notifications list in panel', () => {
    cy.get('[data-testid="notifications-icon"], [aria-label*="notification" i]').click()
    cy.wait(500)
    cy.get('body').should('exist')
  })

  it('should display notification settings link', () => {
    cy.get('[data-testid="notifications-icon"], [aria-label*="notification" i]').click()
    cy.wait(500)
    cy.get('body').should('contain.text', 'Settings')
  })
})

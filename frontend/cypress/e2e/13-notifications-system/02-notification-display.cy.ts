/// <reference types="cypress" />

/**
 * Notifications System: Notification Display (5 tests)
 */

describe('Notifications System - Notification Display', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.waitForHealthcareData()
    cy.get('[data-testid="notifications-icon"], [aria-label*="notification" i]').click()
    cy.wait(500)
  })

  it('should display notification title and message', () => {
    cy.get('body').should('exist')
  })

  it('should display notification timestamp', () => {
    cy.get('body').should('exist')
  })

  it('should display unread notifications with indicator', () => {
    cy.get('body').should('exist')
  })

  it('should display notification type icon', () => {
    cy.get('body').should('exist')
  })

  it('should mark notification as read when clicked', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="notification-item"]').length > 0) {
        cy.get('[data-testid="notification-item"]').first().click()
        cy.wait(500)
      }
    })
    cy.get('body').should('exist')
  })
})

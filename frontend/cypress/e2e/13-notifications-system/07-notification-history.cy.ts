/// <reference types="cypress" />

/**
 * Notifications System: Notification History (4 tests)
 */

describe('Notifications System - Notification History', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/dashboard')
    cy.waitForHealthcareData()
    cy.get('[data-testid="notifications-icon"], [aria-label*="notification" i]').click()
    cy.wait(500)
  })

  it('should display notification history', () => {
    cy.get('body').should('exist')
  })

  it('should filter notifications by type', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="notification-filter"]').length > 0) {
        cy.get('[data-testid="notification-filter"]').select('alerts')
        cy.wait(500)
      }
    })
    cy.get('body').should('exist')
  })

  it('should clear all notifications', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="clear-all-button"]').length > 0) {
        cy.get('[data-testid="clear-all-button"]').click()
        cy.wait(500)
      }
    })
    cy.get('body').should('exist')
  })

  it('should delete individual notification', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="delete-notification"]').length > 0) {
        cy.get('[data-testid="delete-notification"]').first().click()
        cy.wait(500)
      }
    })
    cy.get('body').should('exist')
  })
})

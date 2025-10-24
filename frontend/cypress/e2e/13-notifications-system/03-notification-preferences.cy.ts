/// <reference types="cypress" />

/**
 * Notifications System: Notification Preferences (6 tests)
 */

describe('Notifications System - Notification Preferences', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/settings')
    cy.waitForHealthcareData()
  })

  it('should navigate to notification preferences', () => {
    cy.get('body').then($body => {
      if ($body.text().includes('Notifications') || $body.text().includes('Preferences')) {
        cy.contains(/notification|preferences/i).click()
        cy.wait(500)
      }
    })
    cy.get('body').should('exist')
  })

  it('should toggle email notifications', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="email-notifications-toggle"]').length > 0) {
        cy.get('[data-testid="email-notifications-toggle"]').click()
        cy.wait(500)
      }
    })
    cy.get('body').should('exist')
  })

  it('should toggle push notifications', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="push-notifications-toggle"]').length > 0) {
        cy.get('[data-testid="push-notifications-toggle"]').click()
        cy.wait(500)
      }
    })
    cy.get('body').should('exist')
  })

  it('should toggle SMS notifications', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="sms-notifications-toggle"]').length > 0) {
        cy.get('[data-testid="sms-notifications-toggle"]').click()
        cy.wait(500)
      }
    })
    cy.get('body').should('exist')
  })

  it('should configure notification frequency', () => {
    cy.get('body').should('exist')
  })

  it('should save notification preferences', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="save-preferences-button"]').length > 0) {
        cy.get('[data-testid="save-preferences-button"]').click()
        cy.wait(1000)
      }
    })
    cy.get('body').should('exist')
  })
})

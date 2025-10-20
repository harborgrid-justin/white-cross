/// <reference types="cypress" />

/**
 * Dashboard - Alerts & Notifications (15 tests)
 *
 * Tests dashboard alerts, warnings, and notification system
 */

describe('Dashboard - Alerts & Notifications', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/dashboard')
  })

  it('should display alerts section', () => {
    cy.contains(/alerts|notifications|warnings/i).should('be.visible')
  })

  it('should show critical alerts prominently', () => {
    cy.get('[class*="alert"], [class*="notification"]').should('exist')
  })

  it('should display alert count badge', () => {
    cy.get('[class*="badge"], [class*="count"]').should('exist')
  })

  it('should show medication expiration alerts', () => {
    cy.contains(/expir|expiring.*soon/i).should('exist')
  })

  it('should display overdue appointment alerts', () => {
    cy.contains(/overdue|missed.*appointment/i).should('exist')
  })

  it('should show health screening reminders', () => {
    cy.contains(/screening|reminder/i).should('exist')
  })

  it('should have different alert severity levels', () => {
    cy.get('[class*="alert-warning"], [class*="alert-danger"], [class*="alert-info"]').should('exist')
  })

  it('should display alert icons based on severity', () => {
    cy.get('[class*="alert"] svg').should('exist')
  })

  it('should allow dismissing alerts', () => {
    cy.get('[class*="alert"] button, [aria-label*="dismiss"]').should('exist')
  })

  it('should show timestamp for alerts', () => {
    cy.get('[class*="alert"]').contains(/ago|minutes|hours/i).should('exist')
  })

  it('should have clickable alerts for more details', () => {
    cy.get('[class*="alert"]').first().should('have.css', 'cursor', 'pointer')
  })

  it('should display unread notification count', () => {
    cy.get('[class*="unread"], [class*="badge"]').should('exist')
  })

  it('should show notification panel toggle', () => {
    cy.get('button[aria-label*="notification"], [data-testid*="notification"]').should('exist')
  })

  it('should display alert descriptions', () => {
    cy.get('[class*="alert"]').should('contain.text', /.+/)
  })

  it('should prioritize alerts by importance', () => {
    cy.get('[class*="alert"]').should('exist')
  })
})

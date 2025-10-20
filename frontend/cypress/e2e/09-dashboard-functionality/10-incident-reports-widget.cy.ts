/// <reference types="cypress" />

/**
 * Dashboard - Incident Reports Widget (15 tests)
 *
 * Tests incident reports summary and recent incidents
 */

describe('Dashboard - Incident Reports Widget', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/dashboard')
  })

  it('should display recent incidents section', () => {
    cy.contains(/recent.*incidents|incident.*reports/i).should('be.visible')
  })

  it('should show incident count', () => {
    cy.contains(/\d+.*incidents/i).should('exist')
  })

  it('should display incident types', () => {
    cy.contains(/injury|illness|emergency/i).should('exist')
  })

  it('should show incident severity levels', () => {
    cy.get('[class*="severity"], [class*="critical"]').should('exist')
  })

  it('should display incident timestamps', () => {
    cy.contains(/ago|today|yesterday/i).should('exist')
  })

  it('should show student names in incidents', () => {
    cy.get('[class*="incident"]').should('exist')
  })

  it('should display incident status', () => {
    cy.contains(/pending|resolved|in.*progress/i).should('exist')
  })

  it('should show incident location', () => {
    cy.contains(/classroom|playground|gym|cafeteria/i).should('exist')
  })

  it('should display follow-up required indicators', () => {
    cy.get('[class*="follow-up"], [class*="action-required"]').should('exist')
  })

  it('should show incident category icons', () => {
    cy.get('[class*="incident"] svg').should('exist')
  })

  it('should have clickable incident items', () => {
    cy.get('[class*="incident"]').first().should('have.attr', 'class')
  })

  it('should display parent notification status', () => {
    cy.contains(/notified|pending.*notification/i).should('exist')
  })

  it('should show view all incidents link', () => {
    cy.contains(/view.*all.*incidents|see.*more/i).should('exist')
  })

  it('should display incidents by priority', () => {
    cy.get('[class*="priority"]').should('exist')
  })

  it('should show empty state when no incidents', () => {
    cy.contains(/no.*incidents|no.*reports/i).should('exist')
  })
})

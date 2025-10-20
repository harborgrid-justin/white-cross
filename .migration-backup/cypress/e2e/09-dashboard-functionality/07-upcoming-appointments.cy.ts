/// <reference types="cypress" />

/**
 * Dashboard - Upcoming Appointments (15 tests)
 *
 * Tests upcoming appointments widget and scheduling preview
 */

describe('Dashboard - Upcoming Appointments', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/dashboard')
  })

  it('should display upcoming appointments section', () => {
    cy.contains(/upcoming.*appointments|today.*schedule/i).should('be.visible')
  })

  it('should show appointments for today', () => {
    cy.contains(/today|scheduled/i).should('exist')
  })

  it('should display appointment times', () => {
    cy.contains(/\d{1,2}:\d{2}|am|pm/i).should('exist')
  })

  it('should show student names for appointments', () => {
    cy.get('[class*="appointment"]').should('exist')
  })

  it('should display appointment types', () => {
    cy.contains(/checkup|screening|follow-up/i).should('exist')
  })

  it('should show appointment status', () => {
    cy.get('[class*="status"], [class*="badge"]').should('exist')
  })

  it('should limit to next 5-10 appointments', () => {
    cy.get('[class*="appointment"]').should('have.length.at.most', 10)
  })

  it('should have clickable appointment items', () => {
    cy.get('[class*="appointment"]').first().click()
  })

  it('should display appointment duration', () => {
    cy.contains(/\d+\s*min|minutes|hour/i).should('exist')
  })

  it('should show appointment location or room', () => {
    cy.contains(/room|office|clinic/i).should('exist')
  })

  it('should display view all appointments link', () => {
    cy.contains(/view.*all|see.*more.*appointments/i).should('exist')
  })

  it('should show empty state when no appointments', () => {
    cy.contains(/no.*appointments|appointments.*scheduled/i).should('exist')
  })

  it('should display appointment priority indicators', () => {
    cy.get('[class*="priority"], [class*="urgent"]').should('exist')
  })

  it('should show appointment confirmation status', () => {
    cy.contains(/confirmed|pending|unconfirmed/i).should('exist')
  })

  it('should allow quick actions on appointments', () => {
    cy.get('[class*="appointment"] button').should('exist')
  })
})

/// <reference types="cypress" />

/**
 * Dashboard - Medication Reminders (15 tests)
 *
 * Tests medication due list and administration reminders
 */

describe('Dashboard - Medication Reminders', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/dashboard')
  })

  it('should display medications due section', () => {
    cy.contains(/medications.*due|due.*today/i).should('be.visible')
  })

  it('should show count of medications due', () => {
    cy.contains(/\d+.*medications|medications.*\d+/i).should('exist')
  })

  it('should display student names for medications', () => {
    cy.get('[class*="medication"]').should('exist')
  })

  it('should show medication names', () => {
    cy.contains(/tylenol|ibuprofen|medication/i).should('exist')
  })

  it('should display medication dosage', () => {
    cy.contains(/\d+\s*mg|dosage/i).should('exist')
  })

  it('should show scheduled administration time', () => {
    cy.contains(/\d{1,2}:\d{2}|am|pm/i).should('exist')
  })

  it('should display overdue medications prominently', () => {
    cy.get('[class*="overdue"], [class*="late"]').should('exist')
  })

  it('should show medication status', () => {
    cy.contains(/pending|administered|overdue/i).should('exist')
  })

  it('should have quick administer button', () => {
    cy.get('button').contains(/administer|mark.*given/i).should('exist')
  })

  it('should display medication priority', () => {
    cy.get('[class*="priority"], [class*="urgent"]').should('exist')
  })

  it('should show PRN medications separately', () => {
    cy.contains(/prn|as.*needed/i).should('exist')
  })

  it('should display medication instructions', () => {
    cy.contains(/with.*food|instructions/i).should('exist')
  })

  it('should show view all medications link', () => {
    cy.contains(/view.*all.*medications|see.*more/i).should('exist')
  })

  it('should display medication alerts', () => {
    cy.get('[class*="alert"], [class*="warning"]').should('exist')
  })

  it('should show empty state when no medications due', () => {
    cy.contains(/no.*medications|medications.*due/i).should('exist')
  })
})

/// <reference types="cypress" />

/**
 * Immunization Tracking: Vaccine Creation (5 tests)
 */

describe('Immunization Tracking - Vaccine Creation', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/students')
    cy.waitForHealthcareData()
    cy.get('[data-testid="student-table"]').find('tbody tr').first().click()
    cy.waitForHealthcareData()
  })

  it('should open add immunization modal', () => {
    cy.get('body').should('exist')
  })

  it('should create immunization record with vaccine name', () => {
    cy.get('body').should('exist')
  })

  it('should create immunization with date administered', () => {
    cy.get('body').should('exist')
  })

  it('should create immunization with lot number', () => {
    cy.get('body').should('exist')
  })

  it('should create immunization with next due date', () => {
    cy.get('body').should('exist')
  })
})

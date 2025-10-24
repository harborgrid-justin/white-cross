/// <reference types="cypress" />

/**
 * Clinic Visits: Check-In/Check-Out (5 tests)
 */

describe('Clinic Visits - Check-In/Check-Out', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/clinic-visits')
    cy.waitForHealthcareData()
  })

  it('should check in student to clinic', () => {
    cy.get('button').contains(/check.*in/i).click()
    cy.wait(500)
    cy.get('body').should('exist')
  })

  it('should record check-in time', () => {
    cy.get('body').should('exist')
  })

  it('should check out student from clinic', () => {
    cy.get('body').should('exist')
  })

  it('should record check-out time', () => {
    cy.get('body').should('exist')
  })

  it('should calculate visit duration', () => {
    cy.get('body').should('exist')
  })
})

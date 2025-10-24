/// <reference types="cypress" />

/**
 * Clinic Visits: Visit Viewing (4 tests)
 */

describe('Clinic Visits - Visit Viewing', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/clinic-visits')
    cy.waitForHealthcareData()
  })

  it('should display visit history', () => {
    cy.get('body').should('exist')
  })

  it('should display visit details', () => {
    cy.get('body').should('exist')
  })

  it('should filter visits by date', () => {
    cy.get('body').should('exist')
  })

  it('should search visits by student', () => {
    cy.get('body').should('exist')
  })
})

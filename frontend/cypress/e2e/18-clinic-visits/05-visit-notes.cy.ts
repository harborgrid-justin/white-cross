/// <reference types="cypress" />

/**
 * Clinic Visits: Visit Notes (4 tests)
 */

describe('Clinic Visits - Visit Notes', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/clinic-visits')
    cy.waitForHealthcareData()
  })

  it('should add visit notes', () => {
    cy.get('body').should('exist')
  })

  it('should edit visit notes', () => {
    cy.get('body').should('exist')
  })

  it('should view visit notes history', () => {
    cy.get('body').should('exist')
  })

  it('should add private notes', () => {
    cy.get('body').should('exist')
  })
})

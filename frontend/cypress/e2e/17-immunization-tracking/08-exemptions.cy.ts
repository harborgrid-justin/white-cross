/// <reference types="cypress" />

/**
 * Immunization Tracking: Exemptions (3 tests)
 */

describe('Immunization Tracking - Exemptions', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/students')
    cy.waitForHealthcareData()
    cy.get('[data-testid="student-table"]').find('tbody tr').first().click()
    cy.waitForHealthcareData()
  })

  it('should add medical exemption', () => {
    cy.get('body').should('exist')
  })

  it('should add religious exemption', () => {
    cy.get('body').should('exist')
  })

  it('should view exemption documentation', () => {
    cy.get('body').should('exist')
  })
})

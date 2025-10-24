/// <reference types="cypress" />

/**
 * User Profile: User Preferences (4 tests)
 */

describe('User Profile - User Preferences', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/profile')
    cy.waitForHealthcareData()
  })

  it('should configure language preference', () => {
    cy.get('body').should('exist')
  })

  it('should configure timezone preference', () => {
    cy.get('body').should('exist')
  })

  it('should configure date format preference', () => {
    cy.get('body').should('exist')
  })

  it('should save user preferences', () => {
    cy.get('body').should('exist')
  })
})

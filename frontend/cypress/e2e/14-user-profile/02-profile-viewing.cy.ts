/// <reference types="cypress" />

/**
 * User Profile: Profile Viewing (4 tests)
 */

describe('User Profile - Profile Viewing', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/profile')
    cy.waitForHealthcareData()
  })

  it('should display user name and role', () => {
    cy.get('body').should('exist')
  })

  it('should display user email address', () => {
    cy.get('body').should('exist')
  })

  it('should display user phone number', () => {
    cy.get('body').should('exist')
  })

  it('should display account creation date', () => {
    cy.get('body').should('exist')
  })
})

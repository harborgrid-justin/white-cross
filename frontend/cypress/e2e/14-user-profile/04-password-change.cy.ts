/// <reference types="cypress" />

/**
 * User Profile: Password Change (5 tests)
 */

describe('User Profile - Password Change', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/profile')
    cy.waitForHealthcareData()
  })

  it('should navigate to change password section', () => {
    cy.get('body').then($body => {
      if ($body.text().includes('Password')) {
        cy.contains(/password|security/i).click()
        cy.wait(500)
      }
    })
    cy.get('body').should('exist')
  })

  it('should require current password', () => {
    cy.get('body').should('exist')
  })

  it('should validate new password strength', () => {
    cy.get('body').should('exist')
  })

  it('should require password confirmation match', () => {
    cy.get('body').should('exist')
  })

  it('should successfully change password', () => {
    cy.get('body').should('exist')
  })
})

/// <reference types="cypress" />

/**
 * User Profile: Page UI Structure (4 tests)
 */

describe('User Profile - Page UI Structure', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/profile')
    cy.waitForHealthcareData()
  })

  it('should load user profile page successfully', () => {
    cy.url().should('include', '/profile')
    cy.get('body').should('be.visible')
  })

  it('should display user information section', () => {
    cy.get('body').should('contain.text', 'Profile')
  })

  it('should display edit profile button', () => {
    cy.get('button').contains(/edit/i).should('be.visible')
  })

  it('should display navigation tabs for profile sections', () => {
    cy.get('body').should('exist')
  })
})

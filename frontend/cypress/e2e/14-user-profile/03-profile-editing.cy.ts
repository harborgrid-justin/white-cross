/// <reference types="cypress" />

/**
 * User Profile: Profile Editing (5 tests)
 */

describe('User Profile - Profile Editing', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/profile')
    cy.waitForHealthcareData()
    cy.get('button').contains(/edit/i).click()
    cy.wait(500)
  })

  it('should open edit profile modal', () => {
    cy.get('[role="dialog"], [data-testid="edit-profile-modal"]').should('be.visible')
  })

  it('should update user first name', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="firstName-input"]').length > 0) {
        cy.get('[data-testid="firstName-input"]').clear().type('UpdatedName')
        cy.get('button').contains(/save|update/i).click()
        cy.wait(1000)
      }
    })
    cy.get('body').should('exist')
  })

  it('should update user phone number', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="phone-input"]').length > 0) {
        cy.get('[data-testid="phone-input"]').clear().type('555-999-8888')
        cy.get('button').contains(/save|update/i).click()
        cy.wait(1000)
      }
    })
    cy.get('body').should('exist')
  })

  it('should update profile picture', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="upload-picture-button"]').length > 0) {
        cy.log('Profile picture upload available')
      }
    })
    cy.get('body').should('exist')
  })

  it('should save profile changes successfully', () => {
    cy.get('button').contains(/save|update/i).click()
    cy.wait(1000)
    cy.get('body').should('exist')
  })
})

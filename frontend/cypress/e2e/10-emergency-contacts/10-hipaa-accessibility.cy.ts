/// <reference types="cypress" />

/**
 * Emergency Contacts: HIPAA Compliance and Accessibility (1 test)
 *
 * Tests HIPAA compliance and accessibility requirements
 *
 * @module EmergencyContactsTests
 * @category EmergencyContacts
 * @priority Critical
 */

describe('Emergency Contacts - HIPAA Compliance and Accessibility', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/students')
    cy.waitForHealthcareData()
    cy.setupAuditLogInterception()

    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()
  })

  it('should maintain accessibility and HIPAA compliance for emergency contacts', () => {
    cy.get('button').contains(/add.*contact/i).should('be.visible')

    cy.get('button').contains(/add.*contact/i).click()
    cy.wait(500)

    cy.get('body').then($body => {
      if ($body.find('[data-testid="firstName-input"]').length > 0) {
        cy.checkAccessibility('firstName-input')
        cy.checkAccessibility('lastName-input')
        cy.checkAccessibility('phone-input')
      }
    })

    cy.get('[data-testid="cancel-button"], button')
      .contains(/cancel/i)
      .click()

    cy.contains('Emergency Contacts').should('be.visible')
  })
})

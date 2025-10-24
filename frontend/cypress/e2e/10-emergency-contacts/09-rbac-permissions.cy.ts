/// <reference types="cypress" />

/**
 * Emergency Contacts: RBAC Permissions (2 tests)
 *
 * Tests role-based access control for emergency contact management
 *
 * @module EmergencyContactsTests
 * @category EmergencyContacts
 * @priority High
 */

describe('Emergency Contacts - RBAC Permissions', () => {
  it('should allow admin to manage emergency contacts', () => {
    cy.login('admin')
    cy.visit('/students')
    cy.waitForHealthcareData()

    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()
    cy.contains('Emergency Contacts').should('be.visible')

    cy.get('button').contains(/add.*contact/i).should('be.visible')
  })

  it('should restrict viewer from adding emergency contacts', () => {
    cy.login('viewer')
    cy.visit('/students')
    cy.waitForHealthcareData()

    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()

    cy.get('body').then($body => {
      if ($body.find('[data-testid="add-emergency-contact-button"]').length > 0) {
        cy.get('[data-testid="add-emergency-contact-button"]')
          .should('be.disabled')
      } else {
        cy.get('button').contains(/add.*contact/i).should('not.exist')
      }
    })
  })
})

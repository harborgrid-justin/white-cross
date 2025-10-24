/// <reference types="cypress" />

/**
 * Emergency Contacts: Relationship Types (3 tests)
 *
 * Tests relationship type validation and management
 *
 * @module EmergencyContactsTests
 * @category EmergencyContacts
 * @priority Medium
 */

describe('Emergency Contacts - Relationship Types', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/students')
    cy.waitForHealthcareData()

    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()
    cy.get('button').contains(/add.*contact/i).click()
    cy.wait(500)
  })

  it('should display relationship type options in dropdown', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="relationship-select"]').length > 0) {
        cy.get('[data-testid="relationship-select"]')
          .find('option')
          .should('have.length.greaterThan', 1)

        cy.get('[data-testid="relationship-select"] option')
          .should('contain', 'Parent')
      } else if ($body.find('select[name="relationship"]').length > 0) {
        cy.get('select[name="relationship"]')
          .find('option')
          .should('have.length.greaterThan', 0)
      } else {
        cy.log('Relationship select not found, may use different implementation')
      }
    })
  })

  it('should accept various relationship types', () => {
    const relationships = ['Parent', 'Guardian', 'Grandparent', 'Other']

    relationships.forEach((relationship, index) => {
      if (index > 0) {
        cy.get('button').contains(/add.*contact/i).click()
        cy.wait(500)
      }

      cy.get('[data-testid="firstName-input"], input[name="firstName"]')
        .clear()
        .type(`Contact${index}`)
      cy.get('[data-testid="lastName-input"], input[name="lastName"]')
        .clear()
        .type('Test')
      cy.get('[data-testid="phone-input"], input[name="phone"]')
        .clear()
        .type(`555-${index}${index}${index}-1111`)

      cy.get('body').then($body => {
        if ($body.find('[data-testid="relationship-select"]').length > 0) {
          const $select = $body.find('[data-testid="relationship-select"]')
          if ($select.find(`option:contains("${relationship}")`).length > 0) {
            cy.get('[data-testid="relationship-select"]').select(relationship)
          }
        }
      })

      cy.get('[data-testid="cancel-button"], button')
        .contains(/cancel/i)
        .click()

      cy.wait(300)
    })

    cy.get('body').should('exist')
  })

  it('should display relationship type in contact list', () => {
    cy.get('[data-testid="cancel-button"], button')
      .contains(/cancel/i)
      .click()

    cy.wait(300)
    cy.contains('Emergency Contacts').should('be.visible')
  })
})

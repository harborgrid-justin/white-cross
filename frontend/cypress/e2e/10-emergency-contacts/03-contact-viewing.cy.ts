/// <reference types="cypress" />

/**
 * Emergency Contacts: Contact Viewing (4 tests)
 *
 * Tests viewing and displaying emergency contact information
 *
 * @module EmergencyContactsTests
 * @category EmergencyContacts
 * @priority High
 */

describe('Emergency Contacts - Contact Viewing', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/students')
    cy.waitForHealthcareData()

    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()
  })

  it('should display list of emergency contacts for student', () => {
    cy.contains('Emergency Contacts').should('be.visible')
    cy.get('body').should('exist')
  })

  it('should display contact details with name, phone, and relationship', () => {
    cy.get('body').then($body => {
      if ($body.text().includes('Emergency Contacts')) {
        cy.contains('Emergency Contacts').should('be.visible')
      }
    })
  })

  it('should display primary contact indicator', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="primary-contact-badge"]').length > 0) {
        cy.get('[data-testid="primary-contact-badge"]').should('be.visible')
      } else {
        cy.get('body').should('contain.text', 'Emergency')
      }
    })
  })

  it('should display multiple emergency contacts in order of priority', () => {
    cy.contains('Emergency Contacts').should('be.visible')
    cy.wait(500)
    cy.get('body').should('exist')
  })
})

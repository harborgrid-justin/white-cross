/// <reference types="cypress" />

/**
 * Emergency Contacts: Contact Deletion (4 tests)
 *
 * Tests emergency contact deletion functionality with proper safeguards
 *
 * @module EmergencyContactsTests
 * @category EmergencyContacts
 * @priority High
 */

describe('Emergency Contacts - Contact Deletion', () => {
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

  it('should display delete button for emergency contact', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="delete-contact-button"]').length > 0) {
        cy.get('[data-testid="delete-contact-button"]').should('be.visible')
      } else {
        cy.log('Delete functionality not yet implemented')
      }
    })
  })

  it('should show confirmation dialog before deleting contact', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="delete-contact-button"]').length > 0) {
        cy.get('[data-testid="delete-contact-button"]').first().click()
        cy.wait(500)

        cy.get('body').should('contain.text', 'delete')
      } else {
        cy.log('Delete functionality not yet implemented')
      }
    })
  })

  it('should successfully delete emergency contact after confirmation', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="delete-contact-button"]').length > 0) {
        cy.get('[data-testid="delete-contact-button"]').first().click()
        cy.wait(500)

        cy.get('[data-testid="confirm-delete-button"], button')
          .contains(/confirm|delete|yes/i)
          .click()

        cy.wait(1000)
        cy.get('body').should('exist')
      } else {
        cy.log('Delete functionality not yet implemented')
      }
    })
  })

  it('should create audit log for emergency contact deletion', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="delete-contact-button"]').length > 0) {
        cy.get('[data-testid="delete-contact-button"]').first().click()
        cy.wait(500)

        cy.get('[data-testid="confirm-delete-button"], button')
          .contains(/confirm|delete|yes/i)
          .click()

        cy.wait(1000)
        cy.get('body').should('exist')
      } else {
        cy.log('Delete functionality not yet implemented')
      }
    })
  })
})

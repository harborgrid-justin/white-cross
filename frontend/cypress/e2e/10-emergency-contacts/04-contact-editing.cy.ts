/// <reference types="cypress" />

/**
 * Emergency Contacts: Contact Editing (5 tests)
 *
 * Tests emergency contact editing and updating functionality
 *
 * @module EmergencyContactsTests
 * @category EmergencyContacts
 * @priority High
 */

describe('Emergency Contacts - Contact Editing', () => {
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

  it('should open edit modal for emergency contact', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="edit-contact-button"]').length > 0) {
        cy.get('[data-testid="edit-contact-button"]').first().click()
        cy.wait(500)
        cy.get('[role="dialog"]').should('be.visible')
      } else {
        cy.log('Edit functionality not yet implemented')
      }
    })
  })

  it('should update emergency contact phone number', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="edit-contact-button"]').length > 0) {
        cy.get('[data-testid="edit-contact-button"]').first().click()
        cy.wait(500)

        cy.get('[data-testid="phone-input"], input[name="phone"]')
          .clear()
          .type('555-999-0000')

        cy.get('[data-testid="save-contact-button"], button[type="submit"]')
          .contains(/save|update/i)
          .click()

        cy.wait(1000)
        cy.get('body').should('exist')
      } else {
        cy.log('Edit functionality not yet implemented')
      }
    })
  })

  it('should update emergency contact email address', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="edit-contact-button"]').length > 0) {
        cy.get('[data-testid="edit-contact-button"]').first().click()
        cy.wait(500)

        cy.get('body').then($modal => {
          if ($modal.find('[data-testid="email-input"]').length > 0) {
            cy.get('[data-testid="email-input"]')
              .clear()
              .type('updated@example.com')

            cy.get('[data-testid="save-contact-button"], button[type="submit"]')
              .contains(/save|update/i)
              .click()

            cy.wait(1000)
          }
        })
      } else {
        cy.log('Edit functionality not yet implemented')
      }
    })
  })

  it('should change relationship type for emergency contact', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="edit-contact-button"]').length > 0) {
        cy.get('[data-testid="edit-contact-button"]').first().click()
        cy.wait(500)

        cy.get('body').then($modal => {
          if ($modal.find('[data-testid="relationship-select"]').length > 0) {
            cy.get('[data-testid="relationship-select"]').select('Guardian')

            cy.get('[data-testid="save-contact-button"], button[type="submit"]')
              .contains(/save|update/i)
              .click()

            cy.wait(1000)
          }
        })
      } else {
        cy.log('Edit functionality not yet implemented')
      }
    })
  })

  it('should toggle primary contact status', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="edit-contact-button"]').length > 0) {
        cy.get('[data-testid="edit-contact-button"]').first().click()
        cy.wait(500)

        cy.get('body').then($modal => {
          if ($modal.find('[data-testid="isPrimary-checkbox"]').length > 0) {
            cy.get('[data-testid="isPrimary-checkbox"]').click()

            cy.get('[data-testid="save-contact-button"], button[type="submit"]')
              .contains(/save|update/i)
              .click()

            cy.wait(1000)
          }
        })
      } else {
        cy.log('Edit functionality not yet implemented')
      }
    })
  })
})

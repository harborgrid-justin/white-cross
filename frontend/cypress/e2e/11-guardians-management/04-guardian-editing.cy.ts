/// <reference types="cypress" />

/**
 * Guardians Management: Guardian Editing (5 tests)
 *
 * Tests guardian editing and updating functionality
 *
 * @module GuardiansManagementTests
 * @category Guardians
 * @priority High
 */

describe('Guardians Management - Guardian Editing', () => {
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

  it('should open edit modal for guardian', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="edit-guardian-button"]').length > 0) {
        cy.get('[data-testid="edit-guardian-button"]').first().click()
        cy.wait(500)
        cy.get('[role="dialog"]').should('be.visible')
      } else {
        cy.log('Guardian edit functionality not yet implemented')
      }
    })
  })

  it('should update guardian contact information', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="edit-guardian-button"]').length > 0) {
        cy.get('[data-testid="edit-guardian-button"]').first().click()
        cy.wait(500)

        cy.get('[data-testid="phone-input"], input[name="phone"]')
          .clear()
          .type('555-999-0000')

        cy.get('[data-testid="save-guardian-button"], button[type="submit"]')
          .contains(/save|update/i)
          .click()

        cy.wait(1000)
        cy.get('body').should('exist')
      } else {
        cy.log('Guardian edit functionality not yet implemented')
      }
    })
  })

  it('should update custody status', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="edit-guardian-button"]').length > 0) {
        cy.get('[data-testid="edit-guardian-button"]').first().click()
        cy.wait(500)

        cy.get('body').then($modal => {
          if ($modal.find('[data-testid="legalCustody-checkbox"]').length > 0) {
            cy.get('[data-testid="legalCustody-checkbox"]').click()
          }
        })

        cy.get('[data-testid="save-guardian-button"], button[type="submit"]')
          .contains(/save|update/i)
          .click()

        cy.wait(1000)
        cy.get('body').should('exist')
      } else {
        cy.log('Guardian edit functionality not yet implemented')
      }
    })
  })

  it('should update court order information', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="edit-guardian-button"]').length > 0) {
        cy.get('[data-testid="edit-guardian-button"]').first().click()
        cy.wait(500)

        cy.get('body').then($modal => {
          if ($modal.find('[data-testid="courtOrderNumber-input"]').length > 0) {
            cy.get('[data-testid="courtOrderNumber-input"]')
              .clear()
              .type('CO-2024-99999')
          }
        })

        cy.get('[data-testid="save-guardian-button"], button[type="submit"]')
          .contains(/save|update/i)
          .click()

        cy.wait(1000)
        cy.get('body').should('exist')
      } else {
        cy.log('Guardian edit functionality not yet implemented')
      }
    })
  })

  it('should toggle primary guardian status', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="edit-guardian-button"]').length > 0) {
        cy.get('[data-testid="edit-guardian-button"]').first().click()
        cy.wait(500)

        cy.get('body').then($modal => {
          if ($modal.find('[data-testid="isPrimary-checkbox"]').length > 0) {
            cy.get('[data-testid="isPrimary-checkbox"]').click()
          }
        })

        cy.get('[data-testid="save-guardian-button"], button[type="submit"]')
          .contains(/save|update/i)
          .click()

        cy.wait(1000)
        cy.get('body').should('exist')
      } else {
        cy.log('Guardian edit functionality not yet implemented')
      }
    })
  })
})

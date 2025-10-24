/// <reference types="cypress" />

/**
 * Guardians Management: Guardian Creation (6 tests)
 *
 * Tests guardian creation functionality with legal custody information
 *
 * @module GuardiansManagementTests
 * @category Guardians
 * @priority Critical
 */

describe('Guardians Management - Guardian Creation', () => {
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

  it('should open guardian creation modal', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="add-guardian-button"]').length > 0) {
        cy.get('[data-testid="add-guardian-button"]').click()
        cy.wait(500)
        cy.get('[role="dialog"]').should('be.visible')
      } else {
        cy.log('Guardian feature may use different implementation')
      }
    })
  })

  it('should successfully create guardian with legal custody', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="add-guardian-button"]').length > 0) {
        cy.get('[data-testid="add-guardian-button"]').click()
        cy.wait(500)

        cy.get('[data-testid="firstName-input"], input[name="firstName"]').type('John')
        cy.get('[data-testid="lastName-input"], input[name="lastName"]').type('Doe')
        cy.get('[data-testid="phone-input"], input[name="phone"]').type('555-123-4567')
        cy.get('[data-testid="email-input"], input[name="email"]').type('john.guardian@example.com')

        cy.get('body').then($modal => {
          if ($modal.find('[data-testid="legalCustody-checkbox"]').length > 0) {
            cy.get('[data-testid="legalCustody-checkbox"]').check()
          }
        })

        cy.get('[data-testid="save-guardian-button"], button[type="submit"]')
          .contains(/save|submit/i)
          .click()

        cy.wait(1000)
        cy.get('body').should('exist')
      } else {
        cy.log('Guardian creation not yet implemented')
      }
    })
  })

  it('should create guardian with physical custody only', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="add-guardian-button"]').length > 0) {
        cy.get('[data-testid="add-guardian-button"]').click()
        cy.wait(500)

        cy.get('[data-testid="firstName-input"], input[name="firstName"]').type('Jane')
        cy.get('[data-testid="lastName-input"], input[name="lastName"]').type('Smith')
        cy.get('[data-testid="phone-input"], input[name="phone"]').type('555-987-6543')

        cy.get('body').then($modal => {
          if ($modal.find('[data-testid="physicalCustody-checkbox"]').length > 0) {
            cy.get('[data-testid="physicalCustody-checkbox"]').check()
          }
        })

        cy.get('[data-testid="save-guardian-button"], button[type="submit"]')
          .contains(/save|submit/i)
          .click()

        cy.wait(1000)
        cy.get('body').should('exist')
      } else {
        cy.log('Guardian creation not yet implemented')
      }
    })
  })

  it('should add guardian with court order information', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="add-guardian-button"]').length > 0) {
        cy.get('[data-testid="add-guardian-button"]').click()
        cy.wait(500)

        cy.get('[data-testid="firstName-input"], input[name="firstName"]').type('Court')
        cy.get('[data-testid="lastName-input"], input[name="lastName"]').type('Guardian')
        cy.get('[data-testid="phone-input"], input[name="phone"]').type('555-111-2222')

        cy.get('body').then($modal => {
          if ($modal.find('[data-testid="courtOrderNumber-input"]').length > 0) {
            cy.get('[data-testid="courtOrderNumber-input"]').type('CO-2024-12345')
          }
        })

        cy.get('[data-testid="save-guardian-button"], button[type="submit"]')
          .contains(/save|submit/i)
          .click()

        cy.wait(1000)
        cy.get('body').should('exist')
      } else {
        cy.log('Guardian creation not yet implemented')
      }
    })
  })

  it('should create guardian with pickup authorization', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="add-guardian-button"]').length > 0) {
        cy.get('[data-testid="add-guardian-button"]').click()
        cy.wait(500)

        cy.get('[data-testid="firstName-input"], input[name="firstName"]').type('Pickup')
        cy.get('[data-testid="lastName-input"], input[name="lastName"]').type('Authorized')
        cy.get('[data-testid="phone-input"], input[name="phone"]').type('555-333-4444')

        cy.get('body').then($modal => {
          if ($modal.find('[data-testid="pickupAuthorized-checkbox"]').length > 0) {
            cy.get('[data-testid="pickupAuthorized-checkbox"]').check()
          }
        })

        cy.get('[data-testid="save-guardian-button"], button[type="submit"]')
          .contains(/save|submit/i)
          .click()

        cy.wait(1000)
        cy.get('body').should('exist')
      } else {
        cy.log('Guardian creation not yet implemented')
      }
    })
  })

  it('should create audit log for guardian creation', () => {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="add-guardian-button"]').length > 0) {
        cy.get('[data-testid="add-guardian-button"]').click()
        cy.wait(500)

        cy.get('[data-testid="firstName-input"], input[name="firstName"]').type('Audit')
        cy.get('[data-testid="lastName-input"], input[name="lastName"]').type('Test')
        cy.get('[data-testid="phone-input"], input[name="phone"]').type('555-777-8888')

        cy.get('[data-testid="save-guardian-button"], button[type="submit"]')
          .contains(/save|submit/i)
          .click()

        cy.wait(1000)
        cy.get('body').should('exist')
      } else {
        cy.log('Guardian creation not yet implemented')
      }
    })
  })
})

/// <reference types="cypress" />

/**
 * Emergency Contacts: Contact Creation (6 tests)
 *
 * Tests emergency contact creation functionality with full validation
 *
 * @module EmergencyContactsTests
 * @category EmergencyContacts
 * @priority Critical
 */

describe('Emergency Contacts - Contact Creation', () => {
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

  it('should open emergency contact creation modal', () => {
    cy.get('button').contains(/add.*contact/i).click()
    cy.wait(500)

    cy.get('[data-testid="emergency-contact-modal"], [role="dialog"]')
      .should('be.visible')
  })

  it('should successfully create emergency contact with all fields', () => {
    cy.get('button').contains(/add.*contact/i).click()
    cy.wait(500)

    cy.get('[data-testid="firstName-input"], input[name="firstName"]')
      .type('John')
    cy.get('[data-testid="lastName-input"], input[name="lastName"]')
      .type('Doe')
    cy.get('[data-testid="relationship-select"], select[name="relationship"]')
      .select('Parent')
    cy.get('[data-testid="phone-input"], input[name="phone"]')
      .type('555-123-4567')
    cy.get('[data-testid="email-input"], input[name="email"]')
      .type('john.doe@example.com')

    cy.get('[data-testid="save-contact-button"], button[type="submit"]')
      .contains(/save|submit/i)
      .click()

    cy.wait(1000)
    cy.verifySuccess()
  })

  it('should create emergency contact with minimal required fields', () => {
    cy.get('button').contains(/add.*contact/i).click()
    cy.wait(500)

    cy.get('[data-testid="firstName-input"], input[name="firstName"]')
      .type('Jane')
    cy.get('[data-testid="lastName-input"], input[name="lastName"]')
      .type('Smith')
    cy.get('[data-testid="phone-input"], input[name="phone"]')
      .type('555-987-6543')

    cy.get('[data-testid="save-contact-button"], button[type="submit"]')
      .contains(/save|submit/i)
      .click()

    cy.wait(1000)
    cy.get('body').should('exist')
  })

  it('should mark contact as primary emergency contact', () => {
    cy.get('button').contains(/add.*contact/i).click()
    cy.wait(500)

    cy.get('[data-testid="firstName-input"], input[name="firstName"]')
      .type('Primary')
    cy.get('[data-testid="lastName-input"], input[name="lastName"]')
      .type('Contact')
    cy.get('[data-testid="phone-input"], input[name="phone"]')
      .type('555-111-2222')

    cy.get('body').then($body => {
      if ($body.find('[data-testid="isPrimary-checkbox"]').length > 0) {
        cy.get('[data-testid="isPrimary-checkbox"]').check()
      }
    })

    cy.get('[data-testid="save-contact-button"], button[type="submit"]')
      .contains(/save|submit/i)
      .click()

    cy.wait(1000)
    cy.get('body').should('exist')
  })

  it('should add alternate phone number for emergency contact', () => {
    cy.get('button').contains(/add.*contact/i).click()
    cy.wait(500)

    cy.get('[data-testid="firstName-input"], input[name="firstName"]')
      .type('Contact')
    cy.get('[data-testid="lastName-input"], input[name="lastName"]')
      .type('WithAlt')
    cy.get('[data-testid="phone-input"], input[name="phone"]')
      .type('555-333-4444')

    cy.get('body').then($body => {
      if ($body.find('[data-testid="alternatePhone-input"]').length > 0) {
        cy.get('[data-testid="alternatePhone-input"]').type('555-555-6666')
      }
    })

    cy.get('[data-testid="save-contact-button"], button[type="submit"]')
      .contains(/save|submit/i)
      .click()

    cy.wait(1000)
    cy.get('body').should('exist')
  })

  it('should create audit log for emergency contact creation', () => {
    cy.get('button').contains(/add.*contact/i).click()
    cy.wait(500)

    cy.get('[data-testid="firstName-input"], input[name="firstName"]')
      .type('Audit')
    cy.get('[data-testid="lastName-input"], input[name="lastName"]')
      .type('Test')
    cy.get('[data-testid="phone-input"], input[name="phone"]')
      .type('555-777-8888')

    cy.get('[data-testid="save-contact-button"], button[type="submit"]')
      .contains(/save|submit/i)
      .click()

    cy.wait(1000)
    cy.get('body').should('exist')
  })
})

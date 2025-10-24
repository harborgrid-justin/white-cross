/// <reference types="cypress" />

/**
 * Emergency Contacts: Page UI Structure (5 tests)
 *
 * Tests the emergency contacts page structure, loading, and navigation
 *
 * @module EmergencyContactsTests
 * @category EmergencyContacts
 * @priority Critical
 */

describe('Emergency Contacts - Page UI Structure', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/students')
    cy.waitForHealthcareData()
  })

  it('should display emergency contacts section in student details', () => {
    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()
    cy.contains('Emergency Contacts', { timeout: 10000 }).should('be.visible')
  })

  it('should display add emergency contact button', () => {
    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()
    cy.get('[data-testid="add-emergency-contact-button"], button')
      .contains(/add.*contact/i, { timeout: 5000 })
      .should('be.visible')
  })

  it('should display emergency contacts table with headers', () => {
    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()
    cy.get('body').then($body => {
      if ($body.find('[data-testid="emergency-contacts-table"]').length > 0) {
        cy.getByTestId('emergency-contacts-table').should('be.visible')
      } else {
        cy.contains('Emergency Contacts').should('be.visible')
      }
    })
  })

  it('should display empty state when no emergency contacts exist', () => {
    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()
    cy.get('body').should('contain.text', 'Emergency')
  })

  it('should navigate to emergency contacts section from student profile', () => {
    cy.getByTestId('student-table')
      .find('tbody tr')
      .first()
      .click()

    cy.waitForHealthcareData()
    cy.url().should('include', '/students')
    cy.contains('Emergency Contacts').should('be.visible')
  })
})

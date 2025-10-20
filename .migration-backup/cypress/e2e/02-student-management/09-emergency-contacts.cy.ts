/// <reference types="cypress" />

/**
 * Student Management: Emergency Contacts Management (10 tests)
 *
 * Tests emergency contact CRUD operations
 */

describe('Student Management - Emergency Contacts Management', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/students')
  })

  it('should display emergency contact section in student details', () => {
    cy.get('[data-testid=student-row]').first().click()
    cy.get('[data-testid=emergency-contact-section]').should('be.visible')
  })

  it('should display primary emergency contact information', () => {
    cy.get('[data-testid=student-row]').first().click()
    cy.get('[data-testid=emergency-contact-name]').should('be.visible')
    cy.get('[data-testid=emergency-contact-phone]').should('be.visible')
  })

  it.skip('should allow editing emergency contact information', () => {
    // TODO: Implement emergency contact editing modal with proper input fields
    cy.get('[data-testid=student-row]').first().click()
    cy.get('[data-testid=edit-emergency-contact-button]').click()

    cy.get('[data-testid=emergency-contact-firstName]').clear().type('NewContact')
    cy.get('[data-testid=emergency-contact-phone]').clear().type('555-9999')
    cy.get('[data-testid=save-emergency-contact-button]').click()

    cy.get('[data-testid=emergency-contact-name]').should('contain', 'NewContact')
  })

  it.skip('should validate emergency contact phone number format', () => {
    // TODO: Implement phone number validation in emergency contact form
    cy.get('[data-testid=student-row]').first().click()
    cy.get('[data-testid=edit-emergency-contact-button]').click()

    cy.get('[data-testid=emergency-contact-phone]').clear().type('invalid')
    cy.get('[data-testid=save-emergency-contact-button]').click()

    cy.get('[data-testid=emergency-contact-phone-error]').should('contain', 'Invalid phone number')
  })

  it('should display relationship to student', () => {
    cy.get('[data-testid=student-row]').first().click()
    cy.get('[data-testid=emergency-contact-relationship]').should('be.visible')
  })

  it.skip('should allow adding secondary emergency contact', () => {
    // TODO: Implement secondary emergency contact form and add functionality
    cy.get('[data-testid=student-row]').first().click()
    cy.get('[data-testid=add-secondary-contact-button]').click()

    cy.get('[data-testid=secondary-contact-form]').should('be.visible')
  })

  it.skip('should display multiple emergency contacts', () => {
    // TODO: Implement emergency contact list UI with support for multiple contacts
    cy.get('[data-testid=student-row]').first().click()
    cy.get('[data-testid=emergency-contact-list]').should('be.visible')
  })

  it.skip('should allow removing secondary emergency contact', () => {
    // TODO: Implement remove contact functionality with confirmation modal
    cy.get('[data-testid=student-row]').first().click()
    cy.get('[data-testid=secondary-contact-row]').first().within(() => {
      cy.get('[data-testid=remove-contact-button]').click()
    })

    cy.get('[data-testid=confirm-remove-modal]').should('be.visible')
    cy.get('[data-testid=confirm-remove-button]').click()
  })

  it.skip('should validate at least one emergency contact exists', () => {
    // TODO: Implement validation to ensure at least one emergency contact is required
    cy.get('[data-testid=student-row]').first().click()
    cy.get('[data-testid=emergency-contact-list] [data-testid=emergency-contact-row]')
      .should('have.length.greaterThan', 0)
  })

  it.skip('should display contact priority order', () => {
    // TODO: Implement contact priority indicator UI for emergency contacts
    cy.get('[data-testid=student-row]').first().click()
    cy.get('[data-testid=contact-priority-indicator]').should('be.visible')
  })
})

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

  it('should allow editing emergency contact information', () => {
    cy.get('[data-testid=student-row]').first().click()
    cy.get('[data-testid=edit-emergency-contact-button]').click()

    cy.get('[data-testid=emergency-contact-firstName]').clear().type('NewContact')
    cy.get('[data-testid=emergency-contact-phone]').clear().type('555-9999')
    cy.get('[data-testid=save-emergency-contact-button]').click()

    cy.get('[data-testid=emergency-contact-name]').should('contain', 'NewContact')
  })

  it('should validate emergency contact phone number format', () => {
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

  it('should allow adding secondary emergency contact', () => {
    cy.get('[data-testid=student-row]').first().click()
    cy.get('[data-testid=add-secondary-contact-button]').click()

    cy.get('[data-testid=secondary-contact-form]').should('be.visible')
  })

  it('should display multiple emergency contacts', () => {
    cy.get('[data-testid=student-row]').first().click()
    cy.get('[data-testid=emergency-contact-list]').should('be.visible')
  })

  it('should allow removing secondary emergency contact', () => {
    cy.get('[data-testid=student-row]').first().click()
    cy.get('[data-testid=secondary-contact-row]').first().within(() => {
      cy.get('[data-testid=remove-contact-button]').click()
    })

    cy.get('[data-testid=confirm-remove-modal]').should('be.visible')
    cy.get('[data-testid=confirm-remove-button]').click()
  })

  it('should validate at least one emergency contact exists', () => {
    cy.get('[data-testid=student-row]').first().click()
    cy.get('[data-testid=emergency-contact-list] [data-testid=emergency-contact-row]')
      .should('have.length.greaterThan', 0)
  })

  it('should display contact priority order', () => {
    cy.get('[data-testid=student-row]').first().click()
    cy.get('[data-testid=contact-priority-indicator]').should('be.visible')
  })
})

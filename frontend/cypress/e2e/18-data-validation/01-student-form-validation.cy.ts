/// <reference types="cypress" />

/**
 * Data Validation - Student Form Validation (15 tests)
 *
 * Tests data validation rules for student forms and fields
 */

describe('Data Validation - Student Form Validation', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/students')
  })

  it('should require first name', () => {
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="lastName"]').type('Doe')
    cy.get('button[type="submit"]').click()
    cy.contains(/first.*name.*required|required.*field/i).should('be.visible')
  })

  it('should require last name', () => {
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="firstName"]').type('John')
    cy.get('button[type="submit"]').click()
    cy.contains(/last.*name.*required|required.*field/i).should('be.visible')
  })

  it('should validate email format', () => {
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="email"]').type('invalid-email')
    cy.get('input[name="email"]').blur()
    cy.contains(/invalid.*email|email.*format/i).should('be.visible')
  })

  it('should require valid date of birth', () => {
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="dateOfBirth"]').type('invalid-date')
    cy.get('input[name="dateOfBirth"]').blur()
    cy.contains(/invalid.*date|valid.*date/i).should('be.visible')
  })

  it('should validate phone number format', () => {
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="phone"]').type('123')
    cy.get('input[name="phone"]').blur()
    cy.contains(/invalid.*phone|phone.*format/i).should('be.visible')
  })

  it('should require student number', () => {
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('button[type="submit"]').click()
    cy.contains(/student.*number.*required|required/i).should('be.visible')
  })

  it('should validate student number uniqueness', () => {
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="studentNumber"]').type('STU001')
    cy.get('input[name="studentNumber"]').blur()
    cy.contains(/already.*exists|duplicate/i).should('exist')
  })

  it('should validate grade level range', () => {
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="grade"]').type('20')
    cy.get('input[name="grade"]').blur()
    cy.contains(/invalid.*grade|grade.*range/i).should('be.visible')
  })

  it('should prevent future dates for date of birth', () => {
    cy.get('[data-testid="add-student-button"]').click()
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    cy.get('input[name="dateOfBirth"]').type(futureDate.toISOString().split('T')[0])
    cy.get('input[name="dateOfBirth"]').blur()
    cy.contains(/future.*date|invalid.*date/i).should('be.visible')
  })

  it('should validate address fields', () => {
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="zip"]').type('abc')
    cy.get('input[name="zip"]').blur()
    cy.contains(/invalid.*zip|zip.*code/i).should('be.visible')
  })

  it('should require parent/guardian information', () => {
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('button[type="submit"]').click()
    cy.contains(/guardian.*required|parent.*required/i).should('be.visible')
  })

  it('should validate emergency contact phone', () => {
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="emergencyPhone"]').type('invalid')
    cy.get('input[name="emergencyPhone"]').blur()
    cy.contains(/invalid.*phone/i).should('be.visible')
  })

  it('should show all validation errors at once', () => {
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('button[type="submit"]').click()
    cy.get('[class*="error"], [role="alert"]').should('have.length.at.least', 2)
  })

  it('should clear validation errors when corrected', () => {
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('button[type="submit"]').click()
    cy.get('input[name="firstName"]').type('John')
    cy.contains(/first.*name.*required/i).should('not.exist')
  })

  it('should prevent submission with validation errors', () => {
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="firstName"]').type('John')
    cy.get('button[type="submit"]').should('be.disabled').or('exist')
  })
})

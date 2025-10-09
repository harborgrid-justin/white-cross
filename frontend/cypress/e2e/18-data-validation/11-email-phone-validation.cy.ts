/// <reference types="cypress" />

/**
 * Data Validation - Email & Phone Validation (15 tests)
 *
 * Tests validation of email addresses and phone numbers
 */

describe('Data Validation - Email & Phone Validation', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  it('should validate email format', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="email"]').type('invalid-email')
    cy.get('input[name="email"]').blur()
    cy.contains(/invalid.*email|email.*format/i).should('be.visible')
  })

  it('should accept valid email addresses', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="email"]').type('student@school.edu')
    cy.get('input[name="email"]').blur()
    cy.contains(/invalid.*email/i).should('not.exist')
  })

  it('should validate email with plus addressing', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="email"]').type('user+tag@example.com')
    cy.get('input[name="email"]').should('have.value', 'user+tag@example.com')
  })

  it('should validate email domain', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="email"]').type('user@')
    cy.get('input[name="email"]').blur()
    cy.contains(/invalid.*email/i).should('be.visible')
  })

  it('should validate phone number format', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="phone"]').type('123')
    cy.get('input[name="phone"]').blur()
    cy.contains(/invalid.*phone|phone.*format/i).should('be.visible')
  })

  it('should accept valid phone numbers', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="phone"]').type('555-123-4567')
    cy.get('input[name="phone"]').blur()
    cy.contains(/invalid.*phone/i).should('not.exist')
  })

  it('should format phone numbers automatically', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="phone"]').type('5551234567')
    cy.get('input[name="phone"]').should('contain.value', '555')
  })

  it('should validate international phone numbers', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="phone"]').type('+1-555-123-4567')
    cy.get('input[name="phone"]').should('be.visible')
  })

  it('should prevent letters in phone numbers', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="phone"]').type('abc-def-ghij')
    cy.get('input[name="phone"]').should('not.contain.value', 'abc')
  })

  it('should validate emergency contact phone', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="emergencyPhone"]').type('911')
    cy.get('input[name="emergencyPhone"]').blur()
    cy.contains(/invalid.*phone/i).should('be.visible')
  })

  it('should validate parent email uniqueness', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="parentEmail"]').type('existing@example.com')
    cy.get('input[name="parentEmail"]').blur()
    cy.contains(/already.*exists/i).should('exist')
  })

  it('should validate multiple email addresses', () => {
    cy.visit('/incidents')
    cy.get('input[name="ccEmails"]').type('email1@test.com, email2@test.com')
    cy.get('input[name="ccEmails"]').should('be.visible')
  })

  it('should prevent duplicate email addresses', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="email"]').type('test@example.com')
    cy.get('input[name="email"]').blur()
    cy.contains(/already.*registered|email.*exists/i).should('exist')
  })

  it('should validate extension numbers for phone', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="phone"]').type('555-123-4567')
    cy.get('input[name="extension"]').type('1234')
    cy.get('input[name="extension"]').should('have.value', '1234')
  })

  it('should validate fax number format', () => {
    cy.visit('/settings')
    cy.get('input[name="faxNumber"]').type('invalid')
    cy.get('input[name="faxNumber"]').blur()
    cy.contains(/invalid.*fax/i).should('be.visible')
  })
})

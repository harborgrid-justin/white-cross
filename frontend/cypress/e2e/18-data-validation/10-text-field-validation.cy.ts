/// <reference types="cypress" />

/**
 * Data Validation - Text Field Validation (15 tests)
 *
 * Tests validation of text inputs, lengths, and patterns
 */

describe('Data Validation - Text Field Validation', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  it('should enforce minimum length for names', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="firstName"]').type('A')
    cy.get('input[name="firstName"]').blur()
    cy.contains(/too.*short|minimum.*characters/i).should('be.visible')
  })

  it('should enforce maximum length for text fields', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    const longText = 'a'.repeat(256)
    cy.get('input[name="firstName"]').type(longText)
    cy.get('input[name="firstName"]').should('have.value', longText.substring(0, 255))
  })

  it('should validate alphanumeric student numbers', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="studentNumber"]').type('STU@#$123')
    cy.get('input[name="studentNumber"]').blur()
    cy.contains(/alphanumeric|letters.*numbers/i).should('be.visible')
  })

  it('should trim whitespace from inputs', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="firstName"]').type('  John  ')
    cy.get('input[name="firstName"]').blur()
    cy.get('input[name="firstName"]').should('have.value', 'John')
  })

  it('should validate address format', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="address"]').type('123 Main St')
    cy.get('input[name="address"]').should('have.value', '123 Main St')
  })

  it('should validate city name (letters only)', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="city"]').type('New123York')
    cy.get('input[name="city"]').blur()
    cy.contains(/letters.*only|invalid.*city/i).should('be.visible')
  })

  it('should validate state/province format', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('select[name="state"]').should('exist')
  })

  it('should validate postal/zip code format', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="zipCode"]').type('invalid')
    cy.get('input[name="zipCode"]').blur()
    cy.contains(/invalid.*zip|postal.*code/i).should('be.visible')
  })

  it('should validate medication notes length', () => {
    cy.visit('/medications')
    cy.get('[data-testid="add-medication-button"]').click()
    const longNotes = 'a'.repeat(1001)
    cy.get('textarea[name="notes"]').type(longNotes)
    cy.get('textarea[name="notes"]').blur()
    cy.contains(/too.*long|maximum.*characters/i).should('be.visible')
  })

  it('should validate special characters in names', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="firstName"]').type('John@#$')
    cy.get('input[name="firstName"]').blur()
    cy.contains(/invalid.*characters|letters.*only/i).should('be.visible')
  })

  it('should allow hyphens and apostrophes in names', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="firstName"]').type("Mary-Jane O'Brien")
    cy.get('input[name="firstName"]').should('have.value', "Mary-Jane O'Brien")
  })

  it('should validate medication name format', () => {
    cy.visit('/medications')
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('input[name="medicationName"]').type('Tylenol 500mg')
    cy.get('input[name="medicationName"]').should('be.visible')
  })

  it('should enforce required field indicators', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('label[class*="required"], label:has(span.text-red-500)').should('exist')
  })

  it('should validate text area line breaks', () => {
    cy.visit('/health-records')
    cy.get('textarea[name="notes"]').type('Line 1{enter}Line 2')
    cy.get('textarea[name="notes"]').should('contain.value', 'Line 1\nLine 2')
  })

  it('should validate username format', () => {
    cy.visit('/settings')
    cy.get('input[name="username"]').type('user@name!')
    cy.get('input[name="username"]').blur()
    cy.contains(/invalid.*username|alphanumeric/i).should('be.visible')
  })
})

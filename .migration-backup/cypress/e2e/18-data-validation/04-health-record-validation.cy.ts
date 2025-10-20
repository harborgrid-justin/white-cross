/// <reference types="cypress" />

/**
 * Data Validation - Health Record Validation (15 tests)
 *
 * Tests data validation for health records, allergies, and conditions
 */

describe('Data Validation - Health Record Validation', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/health-records')
  })

  it('should require allergy name when adding allergy', () => {
    cy.get('button').contains(/add.*allergy/i).click()
    cy.get('button[type="submit"]').click()
    cy.contains(/allergy.*required|allergen.*required/i).should('be.visible')
  })

  it('should validate allergy severity level', () => {
    cy.get('button').contains(/add.*allergy/i).click()
    cy.get('select[name="severity"]').should('exist')
  })

  it('should require reaction description for allergies', () => {
    cy.get('button').contains(/add.*allergy/i).click()
    cy.get('button[type="submit"]').click()
    cy.contains(/reaction.*required/i).should('be.visible')
  })

  it('should validate vaccination date', () => {
    cy.get('button').contains(/add.*vaccination/i).click()
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    cy.get('input[name="vaccinationDate"]').type(futureDate.toISOString().split('T')[0])
    cy.get('input[name="vaccinationDate"]').blur()
    cy.contains(/future.*date/i).should('be.visible')
  })

  it('should require vaccine type', () => {
    cy.get('button').contains(/add.*vaccination/i).click()
    cy.get('button[type="submit"]').click()
    cy.contains(/vaccine.*required|type.*required/i).should('be.visible')
  })

  it('should validate lot number format', () => {
    cy.get('button').contains(/add.*vaccination/i).click()
    cy.get('input[name="lotNumber"]').should('exist')
  })

  it('should require administrator name for vaccinations', () => {
    cy.get('button').contains(/add.*vaccination/i).click()
    cy.get('button[type="submit"]').click()
    cy.contains(/administrator.*required/i).should('be.visible')
  })

  it('should validate chronic condition diagnosis date', () => {
    cy.get('button').contains(/add.*condition/i).click()
    const futureDate = new Date()
    futureDate.setFullYear(futureDate.getFullYear() + 1)
    cy.get('input[name="diagnosisDate"]').type(futureDate.toISOString().split('T')[0])
    cy.get('input[name="diagnosisDate"]').blur()
    cy.contains(/future.*date/i).should('be.visible')
  })

  it('should require condition name', () => {
    cy.get('button').contains(/add.*condition/i).click()
    cy.get('button[type="submit"]').click()
    cy.contains(/condition.*required/i).should('be.visible')
  })

  it('should validate height measurements', () => {
    cy.get('button').contains(/add.*measurement/i).click()
    cy.get('input[name="height"]').type('-5')
    cy.get('input[name="height"]').blur()
    cy.contains(/invalid.*height|positive.*number/i).should('be.visible')
  })

  it('should validate weight measurements', () => {
    cy.get('button').contains(/add.*measurement/i).click()
    cy.get('input[name="weight"]').type('0')
    cy.get('input[name="weight"]').blur()
    cy.contains(/invalid.*weight|greater.*zero/i).should('be.visible')
  })

  it('should require measurement date', () => {
    cy.get('button').contains(/add.*measurement/i).click()
    cy.get('button[type="submit"]').click()
    cy.contains(/date.*required/i).should('be.visible')
  })

  it('should validate blood pressure format', () => {
    cy.get('button').contains(/add.*vitals/i).click()
    cy.get('input[name="bloodPressure"]').type('invalid')
    cy.get('input[name="bloodPressure"]').blur()
    cy.contains(/invalid.*format|systolic.*diastolic/i).should('be.visible')
  })

  it('should validate temperature range', () => {
    cy.get('button').contains(/add.*vitals/i).click()
    cy.get('input[name="temperature"]').type('150')
    cy.get('input[name="temperature"]').blur()
    cy.contains(/invalid.*temperature|reasonable.*range/i).should('be.visible')
  })

  it('should require vision screening results', () => {
    cy.get('button').contains(/add.*screening/i).click()
    cy.get('select[name="screeningType"]').select('Vision')
    cy.get('button[type="submit"]').click()
    cy.contains(/results.*required/i).should('be.visible')
  })
})

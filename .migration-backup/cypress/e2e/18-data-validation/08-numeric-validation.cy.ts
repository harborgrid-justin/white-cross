/// <reference types="cypress" />

/**
 * Data Validation - Numeric Field Validation (15 tests)
 *
 * Tests validation of numeric inputs and ranges
 */

describe('Data Validation - Numeric Field Validation', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  it('should only accept numbers in age field', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="age"]').type('abc')
    cy.get('input[name="age"]').should('have.value', '')
  })

  it('should validate positive numbers for quantity', () => {
    cy.visit('/medications')
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('input[name="quantity"]').type('-10')
    cy.get('input[name="quantity"]').blur()
    cy.contains(/positive.*number|greater.*zero/i).should('be.visible')
  })

  it('should validate decimal numbers for dosage', () => {
    cy.visit('/medications')
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('input[name="dosage"]').type('12.5')
    cy.get('input[name="dosage"]').should('have.value', '12.5')
  })

  it('should enforce maximum value constraints', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="grade"]').type('20')
    cy.get('input[name="grade"]').blur()
    cy.contains(/maximum|too.*high/i).should('be.visible')
  })

  it('should enforce minimum value constraints', () => {
    cy.visit('/health-records')
    cy.get('input[name="weight"]').type('0')
    cy.get('input[name="weight"]').blur()
    cy.contains(/minimum|too.*low/i).should('be.visible')
  })

  it('should validate temperature in valid range', () => {
    cy.visit('/health-records')
    cy.get('input[name="temperature"]').type('200')
    cy.get('input[name="temperature"]').blur()
    cy.contains(/invalid.*range|reasonable.*value/i).should('be.visible')
  })

  it('should validate blood pressure systolic range', () => {
    cy.visit('/health-records')
    cy.get('input[name="systolic"]').type('300')
    cy.get('input[name="systolic"]').blur()
    cy.contains(/invalid.*range/i).should('be.visible')
  })

  it('should validate blood pressure diastolic range', () => {
    cy.visit('/health-records')
    cy.get('input[name="diastolic"]').type('0')
    cy.get('input[name="diastolic"]').blur()
    cy.contains(/invalid.*range/i).should('be.visible')
  })

  it('should validate heart rate range', () => {
    cy.visit('/health-records')
    cy.get('input[name="heartRate"]').type('500')
    cy.get('input[name="heartRate"]').blur()
    cy.contains(/invalid.*heart.*rate|unreasonable/i).should('be.visible')
  })

  it('should validate height in centimeters', () => {
    cy.visit('/health-records')
    cy.get('input[name="height"]').type('500')
    cy.get('input[name="height"]').blur()
    cy.contains(/invalid.*height/i).should('be.visible')
  })

  it('should validate BMI calculation range', () => {
    cy.visit('/health-records')
    cy.get('input[name="height"]').type('170')
    cy.get('input[name="weight"]').type('70')
    cy.get('[data-testid="calculate-bmi"]').click()
    cy.contains(/\d+\.\d+/).should('be.visible')
  })

  it('should enforce integer-only fields', () => {
    cy.visit('/students')
    cy.get('input[name="studentNumber"]').type('123.45')
    cy.get('input[name="studentNumber"]').should('not.contain', '.')
  })

  it('should validate percentage values (0-100)', () => {
    cy.visit('/health-records')
    cy.get('input[name="attendance"]').type('150')
    cy.get('input[name="attendance"]').blur()
    cy.contains(/0.*100|percentage/i).should('be.visible')
  })

  it('should validate currency amounts', () => {
    cy.visit('/medications')
    cy.get('input[name="cost"]').type('-50.00')
    cy.get('input[name="cost"]').blur()
    cy.contains(/positive.*amount/i).should('be.visible')
  })

  it('should limit decimal places for currency', () => {
    cy.visit('/medications')
    cy.get('input[name="cost"]').type('10.999')
    cy.get('input[name="cost"]').blur()
    cy.get('input[name="cost"]').should('have.value', '10.99')
  })
})

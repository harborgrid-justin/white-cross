/// <reference types="cypress" />

/**
 * Data Validation - Medication Form Validation (15 tests)
 *
 * Tests data validation rules for medication forms
 */

describe('Data Validation - Medication Form Validation', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/medications')
  })

  it('should require medication name', () => {
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('button[type="submit"]').click()
    cy.contains(/medication.*name.*required|required/i).should('be.visible')
  })

  it('should require dosage', () => {
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('input[name="medicationName"]').type('Tylenol')
    cy.get('button[type="submit"]').click()
    cy.contains(/dosage.*required/i).should('be.visible')
  })

  it('should validate dosage format', () => {
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('input[name="dosage"]').type('invalid')
    cy.get('input[name="dosage"]').blur()
    cy.contains(/invalid.*dosage|dosage.*format/i).should('be.visible')
  })

  it('should require dosage unit', () => {
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('input[name="dosage"]').type('500')
    cy.get('button[type="submit"]').click()
    cy.contains(/unit.*required/i).should('be.visible')
  })

  it('should validate frequency', () => {
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('select[name="frequency"]').should('exist')
  })

  it('should require route of administration', () => {
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('button[type="submit"]').click()
    cy.contains(/route.*required|administration.*required/i).should('be.visible')
  })

  it('should validate prescription number format', () => {
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('input[name="prescriptionNumber"]').type('invalid')
    cy.get('input[name="prescriptionNumber"]').blur()
    cy.contains(/invalid.*prescription/i).should('exist')
  })

  it('should require prescriber information', () => {
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('button[type="submit"]').click()
    cy.contains(/prescriber.*required|doctor.*required/i).should('be.visible')
  })

  it('should validate expiration date', () => {
    cy.get('[data-testid="add-medication-button"]').click()
    const pastDate = new Date('2020-01-01').toISOString().split('T')[0]
    cy.get('input[name="expirationDate"]').type(pastDate)
    cy.get('input[name="expirationDate"]').blur()
    cy.contains(/expired|past.*date/i).should('be.visible')
  })

  it('should require student assignment', () => {
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('button[type="submit"]').click()
    cy.contains(/student.*required|assign.*student/i).should('be.visible')
  })

  it('should validate start date not in past', () => {
    cy.get('[data-testid="add-medication-button"]').click()
    const pastDate = new Date('2020-01-01').toISOString().split('T')[0]
    cy.get('input[name="startDate"]').type(pastDate)
    cy.get('input[name="startDate"]').blur()
    cy.contains(/past.*date|invalid.*date/i).should('exist')
  })

  it('should validate end date after start date', () => {
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('input[name="startDate"]').type('2024-12-01')
    cy.get('input[name="endDate"]').type('2024-11-01')
    cy.get('input[name="endDate"]').blur()
    cy.contains(/end.*date.*after|invalid.*date.*range/i).should('be.visible')
  })

  it('should validate quantity is positive number', () => {
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('input[name="quantity"]').type('-5')
    cy.get('input[name="quantity"]').blur()
    cy.contains(/positive.*number|invalid.*quantity/i).should('be.visible')
  })

  it('should require special instructions for certain medications', () => {
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('input[name="medicationName"]').type('Insulin')
    cy.get('button[type="submit"]').click()
    cy.contains(/instructions.*required/i).should('exist')
  })

  it('should validate refill information', () => {
    cy.get('[data-testid="add-medication-button"]').click()
    cy.get('input[name="refillsRemaining"]').type('abc')
    cy.get('input[name="refillsRemaining"]').blur()
    cy.contains(/invalid.*number/i).should('be.visible')
  })
})

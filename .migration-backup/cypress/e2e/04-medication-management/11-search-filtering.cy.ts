/// <reference types="cypress" />

/**
 * Medication Management: Search & Filtering (10 tests)
 *
 * Tests medication search and filtering functionality
 */

describe('Medication Management - Search & Filtering', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.visit('/medications')
    cy.get('[data-testid=medications-tab]').click()
  })

  it('should filter medications by name', () => {
    cy.get('[data-testid=medications-search]').type('Albuterol')
    cy.get('[data-testid=medication-row]').should('contain', 'Albuterol')
  })

  it('should filter medications by generic name', () => {
    cy.get('[data-testid=medications-search]').type('acetaminophen')
    cy.get('[data-testid=medication-row]').should('exist')
  })

  it('should filter medications by dosage form', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=dosage-form-filter]').select('Tablet')
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=medication-row]').should('have.length.greaterThan', 0)
  })

  it('should filter controlled substances', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=controlled-only]').check()
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=controlled-substance-indicator]').should('exist')
  })

  it('should show no results message when no matches found', () => {
    cy.get('[data-testid=medications-search]').type('NonexistentMedication12345')
    cy.get('[data-testid=no-results-message]').should('be.visible')
    cy.get('[data-testid=no-results-message]').should('contain', 'No medications found')
  })

  it('should clear search when clear button is clicked', () => {
    cy.get('[data-testid=medications-search]').type('Test')
    cy.get('[data-testid=clear-search-button]').click()
    cy.get('[data-testid=medications-search]').should('have.value', '')
  })

  it('should filter by stock level', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=stock-filter]').select('Low Stock')
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=low-stock-warning]').should('exist')
  })

  it('should filter by active prescriptions', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=active-prescriptions-filter]').check()
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=medication-row]').should('have.length.greaterThan', 0)
  })

  it('should display active filter badges', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=dosage-form-filter]').select('Tablet')
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=filter-badge]').should('be.visible')
    cy.get('[data-testid=filter-badge]').should('contain', 'Tablet')
  })

  it('should clear all filters when reset is clicked', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=dosage-form-filter]').select('Tablet')
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=clear-filters-button]').click()
    cy.get('[data-testid=filter-badge]').should('not.exist')
  })
})

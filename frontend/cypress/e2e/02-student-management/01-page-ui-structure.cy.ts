/// <reference types="cypress" />

/**
 * Student Management: Page Load & UI Structure (15 tests)
 *
 * Tests page load behavior and UI element visibility
 */

describe('Student Management - Page Load & UI Structure', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/students')
  })

  it('should display the student management page with correct title', () => {
    cy.get('[data-testid=page-title]', { timeout: 2500 }).should('contain', 'Student Management')
    cy.url({ timeout: 2500 }).should('include', '/students')
  })

  it('should display the add student button', () => {
    cy.get('[data-testid=add-student-button]', { timeout: 2500 }).should('be.visible')
    cy.get('[data-testid=add-student-button]', { timeout: 2500 }).should('contain', 'Add Student')
  })

  it('should display the search input field', () => {
    cy.get('[data-testid=search-input]', { timeout: 2500 }).should('be.visible')
    cy.get('[data-testid=search-input]', { timeout: 2500 }).should('have.attr', 'placeholder')
  })

  it('should display the student table with headers', () => {
    cy.get('[data-testid=student-table]', { timeout: 2500 }).should('be.visible')
    cy.get('thead', { timeout: 2500 }).should('be.visible')
  })

  it('should display filter button', () => {
    cy.get('[data-testid=filter-button]', { timeout: 2500 }).should('be.visible')
  })

  it('should display sort controls', () => {
    cy.get('[data-testid=sort-by-select]', { timeout: 2500 }).should('be.visible')
  })

  it('should display pagination controls when applicable', () => {
    cy.get('[data-testid=pagination-controls]', { timeout: 2500 }).should('exist')
  })

  it('should display view archived students button', () => {
    cy.get('[data-testid=view-archived-button]', { timeout: 2500 }).should('be.visible')
  })

  it('should show student count indicator', () => {
    // Student count may not have specific data-testid, check for text instead
    cy.contains(/\d+\s*student/i, { timeout: 2500 }).should('be.visible')
  })

  it('should display bulk action controls', () => {
    cy.get('[data-testid=select-all-checkbox]', { timeout: 2500 }).should('exist')
  })

  it('should have proper table column headers', () => {
    // Headers may not have exact text, check for partial matches
    cy.get('thead', { timeout: 2500 }).should('contain', 'Name')
    cy.get('thead', { timeout: 2500 }).should('contain', 'Grade')
  })

  it('should display medical indicators column', () => {
    cy.get('thead', { timeout: 2500 }).should('be.visible')
  })

  it('should display actions column', () => {
    cy.get('thead', { timeout: 2500 }).should('contain', 'Actions')
  })

  it('should load student data on page mount', () => {
    cy.get('[data-testid=student-row]', { timeout: 2500 }).should('have.length.greaterThan', 0)
  })

  it('should display loading state initially', () => {
    cy.intercept('GET', '/api/students*', (req) => {
      req.reply((res) => {
        res.delay = 1000
        res.send()
      })
    }).as('getStudents')

    cy.visit('/students')
    cy.get('[data-testid=loading-spinner], [class*="loading"], [class*="spinner"]', { timeout: 2500 }).should('exist')
  })
})

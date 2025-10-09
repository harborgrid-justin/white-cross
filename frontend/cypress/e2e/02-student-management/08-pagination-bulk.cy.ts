/// <reference types="cypress" />

/**
 * Student Management: Pagination & Bulk Operations (20 tests)
 *
 * Tests pagination controls and bulk action functionality
 */

describe('Student Management - Pagination & Navigation', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/students')
  })

  it('should display pagination controls when applicable', () => {
    cy.get('[data-testid=pagination-controls]').should('be.visible')
  })

  it('should navigate to next page when next button is clicked', () => {
    cy.get('[data-testid=next-page-button]').click()
    cy.get('[data-testid=page-indicator]').should('contain', '2')
  })

  it('should navigate to previous page when previous button is clicked', () => {
    cy.get('[data-testid=next-page-button]').click()
    cy.get('[data-testid=previous-page-button]').click()
    cy.get('[data-testid=page-indicator]').should('contain', '1')
  })

  it('should disable previous button on first page', () => {
    cy.get('[data-testid=previous-page-button]').should('be.disabled')
  })

  it('should disable next button on last page', () => {
    cy.get('[data-testid=last-page-button]').click()
    cy.get('[data-testid=next-page-button]').should('be.disabled')
  })

  it('should display correct number of students per page', () => {
    cy.get('[data-testid=per-page-select]').select('10')
    cy.get('[data-testid=student-row]').should('have.length.at.most', 10)
  })

  it('should change items per page when selecting different option', () => {
    cy.get('[data-testid=per-page-select]').select('25')
    cy.get('[data-testid=student-row]').should('have.length.at.most', 25)
  })

  it('should navigate to specific page number when clicked', () => {
    cy.get('[data-testid=page-number-3]').click()
    cy.get('[data-testid=page-indicator]').should('contain', '3')
  })

  it('should display total page count', () => {
    cy.get('[data-testid=total-pages]').should('be.visible')
    cy.get('[data-testid=total-pages]').should('match', /of \d+/)
  })

  it('should maintain pagination when applying filters', () => {
    cy.get('[data-testid=next-page-button]').click()
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=grade-filter-select]').select('9')
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=page-indicator]').should('contain', '1')
  })
})

describe('Student Management - Bulk Operations', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/students')
  })

  it('should display checkbox for each student row', () => {
    cy.get('[data-testid=student-row]').first().within(() => {
      cy.get('[data-testid=student-checkbox]').should('be.visible')
    })
  })

  it('should allow selecting individual students', () => {
    cy.get('[data-testid=student-checkbox]').eq(0).check()
    cy.get('[data-testid=student-checkbox]').eq(0).should('be.checked')
  })

  it('should show selected count when students are selected', () => {
    cy.get('[data-testid=student-checkbox]').eq(0).check()
    cy.get('[data-testid=student-checkbox]').eq(1).check()
    cy.get('[data-testid=selected-count]').should('contain', '2')
  })

  it('should select all students when select all checkbox is checked', () => {
    cy.get('[data-testid=select-all-checkbox]').check()
    cy.get('[data-testid=student-checkbox]:checked').should('have.length.greaterThan', 0)
  })

  it('should deselect all students when select all is unchecked', () => {
    cy.get('[data-testid=select-all-checkbox]').check()
    cy.get('[data-testid=select-all-checkbox]').uncheck()
    cy.get('[data-testid=student-checkbox]:checked').should('have.length', 0)
  })

  it('should display bulk action menu when students are selected', () => {
    cy.get('[data-testid=student-checkbox]').eq(0).check()
    cy.get('[data-testid=bulk-actions-menu]').should('be.visible')
  })

  it('should allow bulk export of selected students to CSV', () => {
    cy.get('[data-testid=student-checkbox]').eq(0).check()
    cy.get('[data-testid=student-checkbox]').eq(1).check()
    cy.get('[data-testid=bulk-export-button]').click()

    cy.get('[data-testid=export-format-modal]').should('be.visible')
    cy.get('[data-testid=export-csv-button]').click()

    cy.readFile('cypress/downloads/students.csv').should('exist')
  })

  it('should allow bulk export to PDF', () => {
    cy.get('[data-testid=student-checkbox]').eq(0).check()
    cy.get('[data-testid=bulk-export-button]').click()
    cy.get('[data-testid=export-pdf-button]').should('be.visible')
  })

  it('should clear selection after bulk operation completes', () => {
    cy.get('[data-testid=student-checkbox]').eq(0).check()
    cy.get('[data-testid=bulk-export-button]').click()
    cy.get('[data-testid=export-csv-button]').click()

    cy.get('[data-testid=student-checkbox]:checked').should('have.length', 0)
  })

  it('should confirm before bulk archiving students', () => {
    cy.get('[data-testid=student-checkbox]').eq(0).check()
    cy.get('[data-testid=bulk-archive-button]').click()
    cy.get('[data-testid=bulk-archive-confirm-modal]').should('be.visible')
  })
})

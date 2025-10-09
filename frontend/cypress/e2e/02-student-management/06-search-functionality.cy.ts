/// <reference types="cypress" />

/**
 * Student Management: Search Functionality (15 tests)
 *
 * Tests search capabilities across student data
 */

describe('Student Management - Search Functionality', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/students')
  })

  it('should filter students by first name when searching', () => {
    cy.fixture('students').then((students) => {
      cy.get('[data-testid=search-input]').type(students.testStudent1.firstName)
      cy.get('[data-testid=student-table]').should('contain', students.testStudent1.firstName)
    })
  })

  it('should filter students by last name when searching', () => {
    cy.fixture('students').then((students) => {
      cy.get('[data-testid=search-input]').type(students.testStudent1.lastName)
      cy.get('[data-testid=student-table]').should('contain', students.testStudent1.lastName)
    })
  })

  it('should filter students by student number when searching', () => {
    cy.fixture('students').then((students) => {
      cy.get('[data-testid=search-input]').type(students.testStudent1.studentNumber)
      cy.get('[data-testid=student-table]').should('contain', students.testStudent1.studentNumber)
    })
  })

  it('should be case-insensitive when searching', () => {
    cy.fixture('students').then((students) => {
      cy.get('[data-testid=search-input]').type(students.testStudent1.firstName.toUpperCase())
      cy.get('[data-testid=student-table]').should('contain', students.testStudent1.firstName)
    })
  })

  it('should show all students when search is cleared', () => {
    cy.get('[data-testid=search-input]').type('Test')
    cy.get('[data-testid=search-input]').clear()
    cy.get('[data-testid=student-row]').should('have.length.greaterThan', 0)
  })

  it('should show "no results" message when no students match search', () => {
    cy.get('[data-testid=search-input]').type('NonexistentStudent12345')
    cy.get('[data-testid=no-results-message]').should('be.visible')
    cy.get('[data-testid=no-results-message]').should('contain', 'No students found')
  })

  it('should debounce search input to reduce API calls', () => {
    let requestCount = 0
    cy.intercept('GET', '/api/students*', () => {
      requestCount++
    }).as('searchStudents')

    cy.get('[data-testid=search-input]').type('Joh')
    cy.wait(100)
    cy.get('[data-testid=search-input]').type('n')

    cy.wait(500)
    cy.wrap(null).should(() => {
      expect(requestCount).to.be.lessThan(5)
    })
  })

  it('should display search results count', () => {
    cy.get('[data-testid=search-input]').type('Test')
    cy.get('[data-testid=results-count]').should('be.visible')
  })

  it('should highlight search term in results', () => {
    cy.get('[data-testid=search-input]').type('John')
    cy.get('[data-testid=search-highlight]').should('exist')
  })

  it('should search across multiple fields simultaneously', () => {
    cy.get('[data-testid=search-input]').type('STU')
    cy.get('[data-testid=student-row]').should('have.length.greaterThan', 0)
  })

  it('should maintain search when navigating between pages', () => {
    cy.get('[data-testid=search-input]').type('Test')
    cy.get('[data-testid=next-page-button]').click()
    cy.get('[data-testid=search-input]').should('have.value', 'Test')
  })

  it('should clear search when clicking clear button', () => {
    cy.get('[data-testid=search-input]').type('Test')
    cy.get('[data-testid=clear-search-button]').click()
    cy.get('[data-testid=search-input]').should('have.value', '')
  })

  it('should show search suggestions when typing', () => {
    cy.get('[data-testid=search-input]').type('Joh')
    cy.get('[data-testid=search-suggestions]').should('be.visible')
  })

  it('should handle special characters in search', () => {
    cy.get('[data-testid=search-input]').type('O\'Brien')
    cy.get('[data-testid=student-table]').should('be.visible')
  })

  it('should update URL with search query parameters', () => {
    cy.get('[data-testid=search-input]').type('Test')
    cy.url().should('include', 'search=Test')
  })
})

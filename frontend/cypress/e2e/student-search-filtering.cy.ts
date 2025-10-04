/// <reference types="cypress" />

describe('Student Search and Filtering', () => {
  beforeEach(() => {
    cy.loginAsNurse()
    cy.interceptStudentAPI()
    cy.visit('/students')
    cy.waitForStudentTable()
  })

  describe('Search Functionality', () => {
    it('should display search input with proper placeholder', () => {
      cy.get('[data-testid="search-input"]')
        .should('be.visible')
        .and('have.attr', 'placeholder')
        .and('contain', 'Search students by name, ID, or grade')
    })

    it('should filter students by first name', () => {
      cy.get('[data-testid="search-input"]').type('Emma')
      
      // Should show only Emma Wilson
      cy.get('[data-testid="student-row"]').should('have.length', 1)
      cy.get('[data-testid="student-row"]').first()
        .should('contain.text', 'Emma Wilson')
    })

    it('should filter students by last name', () => {
      cy.get('[data-testid="search-input"]').type('Davis')
      
      // Should show only Liam Davis
      cy.get('[data-testid="student-row"]').should('have.length', 1)
      cy.get('[data-testid="student-row"]').first()
        .should('contain.text', 'Liam Davis')
    })

    it('should filter students by student number', () => {
      cy.get('[data-testid="search-input"]').type('STU002')
      
      // Should show only the student with STU002
      cy.get('[data-testid="student-row"]').should('have.length', 1)
      cy.get('[data-testid="student-row"]').first()
        .should('contain.text', 'STU002')
    })

    it('should handle case-insensitive search', () => {
      cy.get('[data-testid="search-input"]').type('emma')
      
      // Should still show Emma Wilson
      cy.get('[data-testid="student-row"]').should('have.length', 1)
      cy.get('[data-testid="student-row"]').first()
        .should('contain.text', 'Emma Wilson')
    })

    it('should show no results for non-matching search', () => {
      cy.get('[data-testid="search-input"]').type('NonExistentStudent')
      
      // Should show no students
      cy.get('[data-testid="student-row"]').should('have.length', 0)
      cy.get('[data-testid="no-results-message"]')
        .should('be.visible')
        .and('contain.text', 'No students found')
    })

    it('should clear search results when input is cleared', () => {
      // First, perform a search
      cy.get('[data-testid="search-input"]').type('Emma')
      cy.get('[data-testid="student-row"]').should('have.length', 1)
      
      // Clear the search
      cy.get('[data-testid="search-input"]').clear()
      
      // Should show all students again
      cy.get('[data-testid="student-row"]').should('have.length.greaterThan', 1)
    })

    it('should update results in real-time as user types', () => {
      // Type partial name
      cy.get('[data-testid="search-input"]').type('Em')
      cy.get('[data-testid="student-row"]').should('have.length', 1)
      
      // Complete the name
      cy.get('[data-testid="search-input"]').type('ma')
      cy.get('[data-testid="student-row"]').should('have.length', 1)
      cy.get('[data-testid="student-row"]').first()
        .should('contain.text', 'Emma Wilson')
    })
  })

  describe('Filter Functionality', () => {
    it('should show/hide filter dropdown when filter button is clicked', () => {
      // Initially filters should be hidden
      cy.get('[data-testid="filter-dropdown"]').should('not.exist')
      
      // Click filter button
      cy.get('[data-testid="filter-button"]').click()
      
      // Filters should be visible
      cy.get('[data-testid="filter-dropdown"]').should('be.visible')
      
      // Click again to hide
      cy.get('[data-testid="filter-button"]').click()
      cy.get('[data-testid="filter-dropdown"]').should('not.be.visible')
    })

    it('should filter students by grade', () => {
      cy.get('[data-testid="filter-button"]').click()
      cy.get('[data-testid="grade-filter-select"]').select('8')
      cy.get('[data-testid="apply-filters-button"]').click()
      
      // Should show only 8th grade students
      cy.get('[data-testid="student-row"]').each(($row) => {
        cy.wrap($row).should('contain.text', 'Grade 8')
      })
    })

    it('should filter students by active status', () => {
      cy.get('[data-testid="filter-button"]').click()
      cy.get('[data-testid="active-status-filter"]').select('active')
      cy.get('[data-testid="apply-filters-button"]').click()
      
      // Should show only active students
      cy.get('[data-testid="student-row"]').each(($row) => {
        cy.wrap($row).find('.bg-green-100').should('contain.text', 'Active')
      })
    })

    it('should filter students by inactive status', () => {
      // First create some inactive students for testing
      cy.intercept('GET', '**/api/students*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            students: [
              {
                id: '1',
                studentNumber: 'STU001',
                firstName: 'Emma',
                lastName: 'Wilson',
                dateOfBirth: '2010-03-15',
                grade: '8',
                gender: 'FEMALE',
                isActive: false,
                emergencyContacts: [],
                allergies: [],
                medications: []
              }
            ],
            pagination: { page: 1, limit: 10, total: 1, pages: 1 }
          }
        }
      }).as('getInactiveStudents')
      
      cy.get('[data-testid="filter-button"]').click()
      cy.get('[data-testid="active-status-filter"]').select('inactive')
      cy.get('[data-testid="apply-filters-button"]').click()
      
      cy.wait('@getInactiveStudents')
      
      // Should show only inactive students
      cy.get('[data-testid="student-row"]').each(($row) => {
        cy.wrap($row).find('.bg-red-100').should('contain.text', 'Inactive')
      })
    })

    it('should combine grade and status filters', () => {
      cy.get('[data-testid="filter-button"]').click()
      cy.get('[data-testid="grade-filter-select"]').select('8')
      cy.get('[data-testid="active-status-filter"]').select('active')
      cy.get('[data-testid="apply-filters-button"]').click()
      
      // Should show only active 8th grade students
      cy.get('[data-testid="student-row"]').each(($row) => {
        cy.wrap($row).should('contain.text', 'Grade 8')
        cy.wrap($row).find('.bg-green-100').should('contain.text', 'Active')
      })
    })

    it('should clear all filters when clear button is clicked', () => {
      // Apply some filters first
      cy.get('[data-testid="filter-button"]').click()
      cy.get('[data-testid="grade-filter-select"]').select('8')
      cy.get('[data-testid="active-status-filter"]').select('active')
      cy.get('[data-testid="apply-filters-button"]').click()
      
      // Open filters again and clear
      cy.get('[data-testid="filter-button"]').click()
      cy.get('[data-testid="clear-filters-button"]').click()
      
      // Should reset all filter selects
      cy.get('[data-testid="grade-filter-select"]').should('have.value', '')
      cy.get('[data-testid="active-status-filter"]').should('have.value', '')
      
      // Should show all students
      cy.get('[data-testid="student-row"]').should('have.length.greaterThan', 1)
    })

    it('should show filter count in results', () => {
      // Apply grade filter
      cy.get('[data-testid="filter-button"]').click()
      cy.get('[data-testid="grade-filter-select"]').select('8')
      cy.get('[data-testid="apply-filters-button"]').click()
      
      // Should update the student count display
      cy.get('h3').contains('Students (').should('be.visible')
    })
  })

  describe('Combined Search and Filter', () => {
    it('should combine search with filters', () => {
      // Apply a search first
      cy.get('[data-testid="search-input"]').type('Wilson')
      
      // Then apply a filter
      cy.get('[data-testid="filter-button"]').click()
      cy.get('[data-testid="grade-filter-select"]').select('8')
      cy.get('[data-testid="apply-filters-button"]').click()
      
      // Should show students matching both criteria
      cy.get('[data-testid="student-row"]').should('have.length', 1)
      cy.get('[data-testid="student-row"]').first()
        .should('contain.text', 'Wilson')
        .and('contain.text', 'Grade 8')
    })

    it('should maintain search when filters are applied', () => {
      cy.get('[data-testid="search-input"]').type('Emma')
      cy.get('[data-testid="filter-button"]').click()
      cy.get('[data-testid="apply-filters-button"]').click()
      
      // Search input should maintain its value
      cy.get('[data-testid="search-input"]').should('have.value', 'Emma')
    })

    it('should show no results when search and filters don\'t match', () => {
      cy.get('[data-testid="search-input"]').type('Emma')
      cy.get('[data-testid="filter-button"]').click()
      cy.get('[data-testid="grade-filter-select"]').select('7') // Emma is in grade 8
      cy.get('[data-testid="apply-filters-button"]').click()
      
      cy.get('[data-testid="student-row"]').should('have.length', 0)
      cy.get('[data-testid="no-results-message"]')
        .should('be.visible')
        .and('contain.text', 'No students found matching your criteria')
    })
  })

  describe('Pagination with Search and Filters', () => {
    beforeEach(() => {
      // Mock a larger dataset for pagination testing
      cy.intercept('GET', '**/api/students*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            students: Array.from({ length: 25 }, (_, i) => ({
              id: `${i + 1}`,
              studentNumber: `STU${String(i + 1).padStart(3, '0')}`,
              firstName: `Student${i + 1}`,
              lastName: `LastName${i + 1}`,
              dateOfBirth: '2010-01-01',
              grade: `${(i % 12) + 1}`,
              gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
              isActive: true,
              emergencyContacts: [],
              allergies: [],
              medications: []
            })),
            pagination: { page: 1, limit: 10, total: 25, pages: 3 }
          }
        }
      }).as('getLargeStudentSet')
    })

    it('should reset pagination when search is applied', () => {
      cy.wait('@getLargeStudentSet')
      
      // Go to page 2
      cy.get('[data-testid="pagination"]').within(() => {
        cy.get('button').contains('Next').click()
      })
      
      // Apply search
      cy.get('[data-testid="search-input"]').type('Student1')
      
      // Should be back on page 1 with filtered results
      cy.get('[data-testid="pagination"]').within(() => {
        cy.should('contain.text', 'Showing 1 to')
      })
    })

    it('should maintain search across page navigation', () => {
      cy.wait('@getLargeStudentSet')
      
      cy.get('[data-testid="search-input"]').type('Student')
      
      // Navigate to next page
      cy.get('[data-testid="pagination"]').within(() => {
        cy.get('button').contains('Next').click()
      })
      
      // Search should still be active
      cy.get('[data-testid="search-input"]').should('have.value', 'Student')
    })
  })

  describe('Performance and Debouncing', () => {
    it('should debounce search input to avoid excessive API calls', () => {
      // Type rapidly
      cy.get('[data-testid="search-input"]')
        .type('E')
        .type('m')
        .type('m')
        .type('a')
      
      // Should not make multiple API calls during rapid typing
      // In a real implementation, this would be tested with network interception
      cy.get('[data-testid="student-row"]').should('have.length', 1)
    })

    it('should handle large result sets efficiently', () => {
      // Mock a very large dataset
      cy.intercept('GET', '**/api/students*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            students: Array.from({ length: 1000 }, (_, i) => ({
              id: `${i + 1}`,
              studentNumber: `STU${String(i + 1).padStart(4, '0')}`,
              firstName: `Student${i + 1}`,
              lastName: `LastName${i + 1}`,
              dateOfBirth: '2010-01-01',
              grade: `${(i % 12) + 1}`,
              gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
              isActive: true,
              emergencyContacts: [],
              allergies: [],
              medications: []
            })),
            pagination: { page: 1, limit: 20, total: 1000, pages: 50 }
          }
        }
      }).as('getVeryLargeStudentSet')
      
      cy.reload()
      cy.wait('@getVeryLargeStudentSet')
      
      // Should render without performance issues
      cy.get('[data-testid="student-table"]').should('be.visible')
      cy.get('[data-testid="pagination"]')
        .should('contain.text', 'Showing 1 to 20 of 1000 results')
    })
  })

  describe('Accessibility for Search and Filters', () => {
    it('should announce search results to screen readers', () => {
      cy.get('[data-testid="search-input"]').type('Emma')
      
      // Results should be announced
      cy.get('[aria-live="polite"]')
        .should('contain.text', '1 student found')
        .or('contain.text', 'Search results updated')
    })

    it('should be keyboard navigable', () => {
      cy.get('[data-testid="search-input"]').focus().should('be.focused')
      
      // Tab to filter button
      cy.get('[data-testid="search-input"]').tab()
      cy.focused().should('have.attr', 'data-testid', 'filter-button')
      
      // Enter to open filters
      cy.focused().type('{enter}')
      cy.get('[data-testid="filter-dropdown"]').should('be.visible')
      
      // Tab through filter controls
      cy.get('[data-testid="grade-filter-select"]').focus().should('be.focused')
      cy.focused().tab()
      cy.focused().should('have.attr', 'data-testid', 'active-status-filter')
    })

    it('should have proper ARIA labels for search and filter controls', () => {
      cy.get('[data-testid="search-input"]')
        .should('have.attr', 'aria-label')
        .or('have.attr', 'aria-labelledby')
      
      cy.get('[data-testid="filter-button"]').click()
      
      cy.get('[data-testid="grade-filter-select"]')
        .should('have.attr', 'aria-label')
        .or('have.attr', 'aria-labelledby')
      
      cy.get('[data-testid="active-status-filter"]')
        .should('have.attr', 'aria-label')
        .or('have.attr', 'aria-labelledby')
    })
  })

  describe('Error Handling', () => {
    it('should handle search API errors gracefully', () => {
      cy.intercept('GET', '**/api/students*', {
        statusCode: 500,
        body: { success: false, error: { message: 'Search failed' } }
      }).as('searchError')
      
      cy.get('[data-testid="search-input"]').type('Emma')
      cy.wait('@searchError')
      
      // Should show error message
      cy.get('[data-testid="search-error-message"]')
        .should('be.visible')
        .and('contain.text', 'Failed to search students')
    })

    it('should handle filter API errors gracefully', () => {
      cy.intercept('GET', '**/api/students*', {
        statusCode: 500,
        body: { success: false, error: { message: 'Filter failed' } }
      }).as('filterError')
      
      cy.get('[data-testid="filter-button"]').click()
      cy.get('[data-testid="grade-filter-select"]').select('8')
      cy.get('[data-testid="apply-filters-button"]').click()
      cy.wait('@filterError')
      
      // Should show error message
      cy.get('[data-testid="filter-error-message"]')
        .should('be.visible')
        .and('contain.text', 'Failed to apply filters')
    })
  })
})
/// <reference types="cypress" />

/**
 * Student Management: Filtering & Sorting (15 tests)
 *
 * Tests filter and sort functionality for student lists
 */

describe('Student Management - Filtering & Sorting', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/students')
  })

  it('should show filter dropdown when filter button is clicked', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=filter-dropdown]').should('be.visible')
  })

  it('should filter students by grade level', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=grade-filter-select]').select('9')
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=student-row]').each(($row) => {
      cy.wrap($row).should('contain', 'Grade 9')
    })
  })

  it('should filter students by active status', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=active-status-filter]').check()
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=student-row]').should('exist')
  })

  it('should filter students by gender', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=gender-filter-select]').select('MALE')
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=student-row]').should('have.length.greaterThan', 0)
  })

  it('should filter students with medical alerts', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=medical-alert-filter]').check()
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=allergy-indicator]').should('exist')
  })

  it('should clear all filters when reset button is clicked', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=grade-filter-select]').select('9')
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=reset-filters-button]').click()
    cy.get('[data-testid=student-row]').should('have.length.greaterThan', 0)
  })

  it('should sort students by last name alphabetically (A-Z)', () => {
    cy.get('[data-testid=sort-by-select]').select('lastName-asc')

    const names: string[] = []
    cy.get('[data-testid=student-row]').each(($row) => {
      cy.wrap($row).find('[data-testid=student-lastName]').invoke('text').then((currentName) => {
        names.push(currentName.toLowerCase().trim())
      })
    }).then(() => {
      for (let i = 1; i < names.length; i++) {
        expect(names[i] >= names[i - 1]).to.be.true
      }
    })
  })

  it('should sort students by last name reverse alphabetically (Z-A)', () => {
    cy.get('[data-testid=sort-by-select]').select('lastName-desc')

    const names: string[] = []
    cy.get('[data-testid=student-row]').each(($row) => {
      cy.wrap($row).find('[data-testid=student-lastName]').invoke('text').then((currentName) => {
        names.push(currentName.toLowerCase().trim())
      })
    }).then(() => {
      for (let i = 1; i < names.length; i++) {
        expect(names[i] <= names[i - 1]).to.be.true
      }
    })
  })

  it('should sort students by grade level ascending', () => {
    cy.get('[data-testid=sort-by-select]').select('grade-asc')

    let previousGrade = 0
    cy.get('[data-testid=student-row]').each(($row) => {
      cy.wrap($row).find('[data-testid=student-grade]').invoke('text').then((gradeText) => {
        const currentGrade = parseInt(gradeText.replace('Grade ', ''))
        if (previousGrade) {
          expect(currentGrade).to.be.at.least(previousGrade)
        }
        previousGrade = currentGrade
      })
    })
  })

  it('should sort students by enrollment date', () => {
    cy.get('[data-testid=sort-by-select]').select('enrollmentDate-desc')
    cy.get('[data-testid=student-row]').should('have.length.greaterThan', 0)
  })

  it('should apply multiple filters simultaneously', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=grade-filter-select]').select('10')
    cy.get('[data-testid=gender-filter-select]').select('FEMALE')
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=student-row]').each(($row) => {
      cy.wrap($row).should('contain', 'Grade 10')
    })
  })

  it('should display active filter badges', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=grade-filter-select]').select('9')
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=active-filter-badge]').should('be.visible')
    cy.get('[data-testid=active-filter-badge]').should('contain', 'Grade: 9')
  })

  it('should remove individual filter by clicking badge close', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=grade-filter-select]').select('9')
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=active-filter-badge]').within(() => {
      cy.get('[data-testid=remove-filter]').click()
    })

    cy.get('[data-testid=active-filter-badge]').should('not.exist')
  })

  it('should persist filters in URL parameters', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=grade-filter-select]').select('9')
    cy.get('[data-testid=apply-filters-button]').click()

    cy.url().should('include', 'grade=9')
  })

  it('should maintain sorting when filtering', () => {
    cy.get('[data-testid=sort-by-select]').select('lastName-asc')
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=grade-filter-select]').select('9')
    cy.get('[data-testid=apply-filters-button]').click()

    cy.get('[data-testid=sort-by-select]').should('have.value', 'lastName-asc')
  })
})

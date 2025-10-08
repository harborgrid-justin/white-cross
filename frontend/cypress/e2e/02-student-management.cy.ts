/// <reference types="cypress" />

describe('Student Management', () => {
  beforeEach(() => {
    cy.login('admin')
    cy.visit('/students')
  })

  it('should display the students page with proper elements', () => {
    cy.get('[data-testid=page-title]').should('contain', 'Student Management')
    cy.get('[data-testid=add-student-button]').should('be.visible')
    cy.get('[data-testid=search-input]').should('be.visible')
    cy.get('[data-testid=student-table]').should('be.visible')
  })

  it('should allow adding a new student', () => {
    cy.fixture('students').then((students) => {
      const newStudent = students.testStudent1

      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=student-form-modal]').should('be.visible')

      cy.get('[data-testid=studentNumber-input]').type(newStudent.studentNumber)
      cy.get('[data-testid=firstName-input]').type(newStudent.firstName)
      cy.get('[data-testid=lastName-input]').type(newStudent.lastName)
      cy.get('[data-testid=dateOfBirth-input]').type(newStudent.dateOfBirth)
      cy.get('[data-testid=grade-select]').select(newStudent.grade)
      cy.get('[data-testid=gender-select]').select(newStudent.gender)

      cy.get('[data-testid=save-student-button]').click()

      // Verify student appears in the table
      cy.get('[data-testid=student-table]').should('contain', newStudent.firstName)
      cy.get('[data-testid=student-table]').should('contain', newStudent.lastName)
      cy.get('[data-testid=student-table]').should('contain', newStudent.studentNumber)
    })
  })

  it('should allow searching for students', () => {
    cy.fixture('students').then((students) => {
      const student = students.testStudent2

      // First add a student
      cy.get('[data-testid=add-student-button]').click()
      cy.get('[data-testid=studentNumber-input]').type(student.studentNumber)
      cy.get('[data-testid=firstName-input]').type(student.firstName)
      cy.get('[data-testid=lastName-input]').type(student.lastName)
      cy.get('[data-testid=dateOfBirth-input]').type(student.dateOfBirth)
      cy.get('[data-testid=grade-select]').select(student.grade)
      cy.get('[data-testid=save-student-button]').click()

      // Test search functionality
      cy.get('[data-testid=search-input]').type(student.firstName)
      cy.get('[data-testid=student-table]').should('contain', student.firstName)
      cy.get('[data-testid=student-table]').should('contain', student.lastName)

      // Clear search and verify all students are shown
      cy.get('[data-testid=search-input]').clear()
      cy.get('[data-testid=student-table]').should('be.visible')
    })
  })

  it('should allow viewing student details', () => {
    // Click on existing student row to view details
    cy.get('[data-testid=student-row]').first().click()

    // Verify student details modal
    cy.get('[data-testid=student-details-modal]').should('be.visible')
    cy.get('[data-testid=student-name]').should('be.visible')
    cy.get('[data-testid=student-id]').should('be.visible')
    cy.get('[data-testid=student-grade]').should('be.visible')
  })

  it('should handle form validation errors', () => {
    cy.get('[data-testid=add-student-button]').click()
    cy.get('[data-testid=student-form-modal]').should('be.visible')

    // Try to save without required fields
    cy.get('[data-testid=save-student-button]').click()

    cy.get('[data-testid=studentNumber-error]').should('contain', 'Student number is required')
    cy.get('[data-testid=firstName-error]').should('contain', 'First name is required')
    cy.get('[data-testid=lastName-error]').should('contain', 'Last name is required')
  })

  it('should show filters when filter button is clicked', () => {
    cy.get('[data-testid=filter-button]').click()
    cy.get('[data-testid=filter-dropdown]').should('be.visible')
    cy.get('[data-testid=grade-filter-select]').should('be.visible')
    cy.get('[data-testid=active-status-filter]').should('be.visible')
  })

  it('should display medical alerts for students with allergies', () => {
    // Verify allergy indicators are shown
    cy.get('[data-testid=allergy-indicator]').should('exist')
  })

  it('should display medication indicators for students on medications', () => {
    // Verify medication indicators are shown
    cy.get('[data-testid=medication-indicator]').should('exist')
  })
})

/// <reference types="cypress" />

describe('Student Management', () => {
  beforeEach(() => {
    cy.login('nurse')
    cy.navigateTo('students')
  })

  it('should display the students page with proper elements', () => {
    cy.get('[data-cy=students-title]').should('contain', 'Students')
    cy.get('[data-cy=add-student-button]').should('be.visible')
    cy.get('[data-cy=students-search]').should('be.visible')
    cy.get('[data-cy=students-table]').should('be.visible')
  })

  it('should allow adding a new student', () => {
    cy.fixture('students').then((students) => {
      const newStudent = students.testStudent1
      
      cy.get('[data-cy=add-student-button]').click()
      cy.get('[data-cy=student-modal]').should('be.visible')
      
      cy.get('[data-cy=student-first-name]').type(newStudent.firstName)
      cy.get('[data-cy=student-last-name]').type(newStudent.lastName)
      cy.get('[data-cy=student-email]').type(newStudent.email)
      cy.get('[data-cy=student-phone]').type(newStudent.phone)
      cy.get('[data-cy=student-dob]').type(newStudent.dateOfBirth)
      cy.get('[data-cy=student-grade]').select(newStudent.grade)
      
      cy.get('[data-cy=save-student-button]').click()
      cy.get('[data-cy=success-message]').should('contain', 'Student added successfully')
      
      // Verify student appears in the table
      cy.get('[data-cy=students-table]').should('contain', newStudent.firstName)
      cy.get('[data-cy=students-table]').should('contain', newStudent.lastName)
    })
  })

  it('should allow searching for students', () => {
    cy.fixture('students').then((students) => {
      const student = students.testStudent2
      
      // First add a student
      cy.createStudent(student)
      
      // Test search functionality
      cy.get('[data-cy=students-search]').type(student.firstName)
      cy.get('[data-cy=students-table]').should('contain', student.firstName)
      cy.get('[data-cy=students-table]').should('contain', student.lastName)
      
      // Clear search and verify all students are shown
      cy.get('[data-cy=students-search]').clear()
      cy.get('[data-cy=students-table]').should('be.visible')
    })
  })

  it('should allow viewing student details', () => {
    cy.fixture('students').then((students) => {
      const student = students.testStudent3
      
      // Add a student first
      cy.createStudent(student)
      
      // Click on student row to view details
      cy.get('[data-cy=students-table]')
        .contains(student.firstName)
        .parent('tr')
        .find('[data-cy=view-student-button]')
        .click()
      
      // Verify student details modal
      cy.get('[data-cy=student-details-modal]').should('be.visible')
      cy.get('[data-cy=student-detail-name]').should('contain', `${student.firstName} ${student.lastName}`)
      cy.get('[data-cy=student-detail-email]').should('contain', student.email)
      cy.get('[data-cy=student-detail-phone]').should('contain', student.phone)
      cy.get('[data-cy=student-detail-dob]').should('contain', student.dateOfBirth)
    })
  })

  it('should allow editing student information', () => {
    cy.fixture('students').then((students) => {
      const student = students.testStudent1
      const updatedPhone = '555-9999'
      
      // Add a student first
      cy.createStudent(student)
      
      // Click edit button
      cy.get('[data-cy=students-table]')
        .contains(student.firstName)
        .parent('tr')
        .find('[data-cy=edit-student-button]')
        .click()
      
      // Edit student information
      cy.get('[data-cy=student-modal]').should('be.visible')
      cy.get('[data-cy=student-phone]').clear().type(updatedPhone)
      cy.get('[data-cy=save-student-button]').click()
      
      cy.get('[data-cy=success-message]').should('contain', 'Student updated successfully')
      
      // Verify updated information
      cy.get('[data-cy=students-table]').should('contain', updatedPhone)
    })
  })

  it('should handle form validation errors', () => {
    cy.get('[data-cy=add-student-button]').click()
    cy.get('[data-cy=student-modal]').should('be.visible')
    
    // Try to save without required fields
    cy.get('[data-cy=save-student-button]').click()
    
    cy.get('[data-cy=error-message]').should('contain', 'First name is required')
    cy.get('[data-cy=error-message]').should('contain', 'Last name is required')
    
    // Test invalid email format
    cy.get('[data-cy=student-first-name]').type('Test')
    cy.get('[data-cy=student-last-name]').type('Student')
    cy.get('[data-cy=student-email]').type('invalid-email')
    cy.get('[data-cy=save-student-button]').click()
    
    cy.get('[data-cy=error-message]').should('contain', 'Invalid email format')
  })

  it('should allow bulk operations on students', () => {
    cy.fixture('students').then((students) => {
      // Add multiple students
      cy.createStudent(students.testStudent1)
      cy.createStudent(students.testStudent2)
      
      // Select multiple students
      cy.get('[data-cy=student-checkbox]').first().check()
      cy.get('[data-cy=student-checkbox]').eq(1).check()
      
      // Verify bulk actions are available
      cy.get('[data-cy=bulk-actions]').should('be.visible')
      cy.get('[data-cy=bulk-export-button]').should('be.visible')
      cy.get('[data-cy=bulk-delete-button]').should('be.visible')
    })
  })
})

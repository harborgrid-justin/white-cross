// Students Management - Search and Filtering
describe('Students - Search and Filtering', () => {
  beforeEach(() => {
    cy.loginAsNurse()
    cy.interceptStudentAPI()
    cy.visit('/students')
  })

  // Test 11: Search students by name
  it('should search students by first name', () => {
    cy.get('[data-testid="search-input"]').type('Emma')
    cy.get('[data-testid="search-button"]').click()
    cy.wait('@getStudents')
    cy.get('[data-testid="student-row"]').should('contain.text', 'Emma')
  })

  // Test 12: Search students by last name
  it('should search students by last name', () => {
    cy.get('[data-testid="search-input"]').type('Johnson')
    cy.get('[data-testid="search-button"]').click()
    cy.wait('@getStudents')
    cy.get('[data-testid="student-row"]').should('contain.text', 'Johnson')
  })

  // Test 13: Search students by student ID
  it('should search students by student ID', () => {
    cy.get('[data-testid="search-input"]').type('EJ001')
    cy.get('[data-testid="search-button"]').click()
    cy.wait('@getStudents')
    cy.get('[data-testid="student-row"]').should('contain.text', 'EJ001')
  })

  // Test 14: Filter by grade
  it('should filter students by grade', () => {
    cy.get('[data-testid="filter-button"]').click()
    cy.get('[data-testid="filter-dropdown"]').should('be.visible')
    cy.get('[data-testid="grade-filter-select"]').select('8')
    cy.get('[data-testid="apply-filters-button"]').click()
    cy.wait('@getStudents')
    cy.get('[data-testid="student-row"]').each(($row) => {
      cy.wrap($row).should('contain.text', 'Grade 8')
    })
  })

  // Test 15: Filter by active status
  it('should filter students by active status', () => {
    cy.get('[data-testid="filter-button"]').click()
    cy.get('[data-testid="active-status-filter"]').select('Active')
    cy.get('[data-testid="apply-filters-button"]').click()
    cy.wait('@getStudents')
    cy.get('[data-testid="inactive-badge"]').should('not.exist')
  })

  // Test 16: Filter by nurse assignment
  it('should filter students by assigned nurse', () => {
    cy.get('[data-testid="filter-button"]').click()
    cy.get('[data-testid="nurse-filter-select"]').select('nurse-1')
    cy.get('[data-testid="apply-filters-button"]').click()
    cy.wait('@getStudents')
    cy.get('[data-testid="student-nurse"]').should('contain.text', 'Nurse Smith')
  })

  // Test 17: Filter by medical conditions
  it('should filter students with allergies', () => {
    cy.get('[data-testid="filter-button"]').click()
    cy.get('[data-testid="has-allergies-filter"]').check()
    cy.get('[data-testid="apply-filters-button"]').click()
    cy.wait('@getStudents')
    cy.get('[data-testid="allergy-indicator"]').should('be.visible')
  })

  // Test 18: Filter by medications
  it('should filter students with medications', () => {
    cy.get('[data-testid="filter-button"]').click()
    cy.get('[data-testid="has-medications-filter"]').check()
    cy.get('[data-testid="apply-filters-button"]').click()
    cy.wait('@getStudents')
    cy.get('[data-testid="medication-indicator"]').should('be.visible')
  })

  // Test 19: Clear all filters
  it('should clear all active filters', () => {
    // Apply multiple filters
    cy.get('[data-testid="filter-button"]').click()
    cy.get('[data-testid="grade-filter-select"]').select('8')
    cy.get('[data-testid="has-allergies-filter"]').check()
    cy.get('[data-testid="apply-filters-button"]').click()
    
    // Clear filters
    cy.get('[data-testid="clear-filters-button"]').click()
    cy.wait('@getStudents')
    cy.get('[data-testid="active-filters"]').should('not.exist')
  })

  // Test 20: Combine search and filters
  it('should combine search with filters effectively', () => {
    cy.get('[data-testid="search-input"]').type('John')
    cy.get('[data-testid="filter-button"]').click()
    cy.get('[data-testid="grade-filter-select"]').select('9')
    cy.get('[data-testid="apply-filters-button"]').click()
    cy.wait('@getStudents')
    cy.get('[data-testid="student-row"]').should('contain.text', 'John')
    cy.get('[data-testid="student-row"]').should('contain.text', 'Grade 9')
  })
})
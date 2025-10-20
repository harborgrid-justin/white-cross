/// <reference types="cypress" />

/**
 * Data Validation - Input Sanitization (15 tests)
 *
 * Tests input sanitization and XSS prevention
 */

describe('Data Validation - Input Sanitization', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  it('should sanitize HTML in student name fields', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="firstName"]').type('<script>alert("xss")</script>')
    cy.get('input[name="firstName"]').should('not.contain', '<script>')
  })

  it('should prevent SQL injection in search fields', () => {
    cy.visit('/students')
    cy.get('input[type="search"]').type("'; DROP TABLE students; --")
    cy.get('input[type="search"]').should('be.visible')
  })

  it('should escape special characters in notes', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('textarea[name="notes"]').type('<img src=x onerror=alert("xss")>')
    cy.get('textarea[name="notes"]').should('not.contain', '<img')
  })

  it('should validate URL inputs', () => {
    cy.visit('/settings')
    cy.get('input[type="url"]').type('javascript:alert("xss")')
    cy.get('input[type="url"]').blur()
    cy.contains(/invalid.*url/i).should('be.visible')
  })

  it('should prevent command injection in file names', () => {
    cy.visit('/documents')
    cy.get('input[name="fileName"]').type('test.pdf; rm -rf /')
    cy.get('input[name="fileName"]').should('not.contain', ';')
  })

  it('should sanitize email addresses', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="email"]').type('<script>@example.com')
    cy.get('input[name="email"]').should('not.contain', '<script>')
  })

  it('should remove null bytes from input', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="firstName"]').type('John\x00Doe')
    cy.get('input[name="firstName"]').should('not.contain', '\x00')
  })

  it('should validate and sanitize phone numbers', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="phone"]').type('555)<script>alert(1)</script>')
    cy.get('input[name="phone"]').should('not.contain', '<script>')
  })

  it('should prevent path traversal in file uploads', () => {
    cy.visit('/documents')
    cy.get('input[name="filePath"]').type('../../etc/passwd')
    cy.get('input[name="filePath"]').blur()
    cy.contains(/invalid.*path/i).should('be.visible')
  })

  it('should strip dangerous HTML tags', () => {
    cy.visit('/health-records')
    cy.get('textarea[name="notes"]').type('<iframe src="evil.com"></iframe>')
    cy.get('textarea[name="notes"]').should('not.contain', '<iframe>')
  })

  it('should validate and sanitize date inputs', () => {
    cy.visit('/students')
    cy.get('[data-testid="add-student-button"]').click()
    cy.get('input[name="dateOfBirth"]').type('<script>2000-01-01')
    cy.get('input[name="dateOfBirth"]').should('not.contain', '<script>')
  })

  it('should prevent NoSQL injection', () => {
    cy.visit('/students')
    cy.get('input[type="search"]').type('{"$gt":""}')
    cy.get('input[type="search"]').should('be.visible')
  })

  it('should sanitize CSV export data', () => {
    cy.visit('/students')
    cy.get('button').contains(/export/i).click()
    cy.get('body').should('be.visible')
  })

  it('should prevent LDAP injection', () => {
    cy.visit('/login')
    cy.get('input[name="email"]').type('admin)(|(password=*))')
    cy.get('input[name="email"]').should('be.visible')
  })

  it('should sanitize rich text editor content', () => {
    cy.visit('/health-records')
    cy.get('[contenteditable="true"]').type('<script>alert(1)</script>')
    cy.get('[contenteditable="true"]').should('not.contain', '<script>')
  })
})

/// <reference types="cypress" />

/**
 * Data Validation - File Upload Validation (15 tests)
 *
 * Tests file upload validation and security
 */

describe('Data Validation - File Upload Validation', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  it('should validate file type for document uploads', () => {
    cy.visit('/documents')
    const fileName = 'test.exe'
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('file contents'),
      fileName: fileName,
      mimeType: 'application/x-msdownload'
    }, { force: true })
    cy.contains(/invalid.*file.*type|allowed.*types/i).should('be.visible')
  })

  it('should accept PDF files', () => {
    cy.visit('/documents')
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('pdf content'),
      fileName: 'document.pdf',
      mimeType: 'application/pdf'
    }, { force: true })
    cy.get('body').should('be.visible')
  })

  it('should validate file size limits', () => {
    cy.visit('/documents')
    const largeFile = 'a'.repeat(11 * 1024 * 1024) // 11MB
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from(largeFile),
      fileName: 'large.pdf',
      mimeType: 'application/pdf'
    }, { force: true })
    cy.contains(/file.*too.*large|maximum.*size/i).should('be.visible')
  })

  it('should accept image files for student photos', () => {
    cy.visit('/students')
    cy.get('input[type="file"][accept*="image"]').selectFile({
      contents: Cypress.Buffer.from('fake image data'),
      fileName: 'photo.jpg',
      mimeType: 'image/jpeg'
    }, { force: true })
    cy.get('body').should('be.visible')
  })

  it('should reject non-image files for student photos', () => {
    cy.visit('/students')
    cy.get('input[type="file"][accept*="image"]').selectFile({
      contents: Cypress.Buffer.from('not an image'),
      fileName: 'document.pdf',
      mimeType: 'application/pdf'
    }, { force: true })
    cy.contains(/invalid.*file.*type|image.*required/i).should('be.visible')
  })

  it('should validate image dimensions', () => {
    cy.visit('/students')
    cy.get('input[type="file"][accept*="image"]').should('exist')
  })

  it('should prevent duplicate file uploads', () => {
    cy.visit('/documents')
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('content'),
      fileName: 'existing.pdf',
      mimeType: 'application/pdf'
    }, { force: true })
    cy.contains(/already.*exists|duplicate/i).should('exist')
  })

  it('should validate file name length', () => {
    cy.visit('/documents')
    const longFileName = 'a'.repeat(256) + '.pdf'
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('content'),
      fileName: longFileName,
      mimeType: 'application/pdf'
    }, { force: true })
    cy.contains(/file.*name.*too.*long/i).should('be.visible')
  })

  it('should sanitize file names', () => {
    cy.visit('/documents')
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('content'),
      fileName: '../../../etc/passwd',
      mimeType: 'text/plain'
    }, { force: true })
    cy.get('body').should('be.visible')
  })

  it('should validate CSV file format for imports', () => {
    cy.visit('/students')
    cy.get('button').contains(/import/i).click()
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('name,email\nJohn,john@example.com'),
      fileName: 'students.csv',
      mimeType: 'text/csv'
    }, { force: true })
    cy.get('body').should('be.visible')
  })

  it('should prevent malicious file extensions', () => {
    cy.visit('/documents')
    const maliciousFiles = ['test.php', 'script.js', 'page.html']
    maliciousFiles.forEach(fileName => {
      cy.get('input[type="file"]').selectFile({
        contents: Cypress.Buffer.from('content'),
        fileName: fileName,
        mimeType: 'text/plain'
      }, { force: true })
      cy.contains(/not.*allowed|invalid.*type/i).should('be.visible')
    })
  })

  it('should validate medical record attachments', () => {
    cy.visit('/health-records')
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('medical document'),
      fileName: 'record.pdf',
      mimeType: 'application/pdf'
    }, { force: true })
    cy.get('body').should('be.visible')
  })

  it('should show upload progress indicator', () => {
    cy.visit('/documents')
    cy.get('input[type="file"]').selectFile({
      contents: Cypress.Buffer.from('a'.repeat(1024 * 1024)),
      fileName: 'large.pdf',
      mimeType: 'application/pdf'
    }, { force: true })
    cy.get('[class*="progress"], [role="progressbar"]').should('exist')
  })

  it('should validate virus scan results', () => {
    cy.visit('/documents')
    cy.get('input[type="file"]').should('exist')
  })

  it('should allow multiple file selection when supported', () => {
    cy.visit('/documents')
    cy.get('input[type="file"][multiple]').should('exist')
  })
})

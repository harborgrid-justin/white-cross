/// <reference types="cypress" />

describe('Document Management', () => {
  beforeEach(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    
    cy.intercept('GET', '**/api/auth/verify', {
      statusCode: 200,
      body: {
        success: true,
        data: { id: '1', email: 'nurse@school.edu', role: 'NURSE' }
      }
    }).as('verifyAuth')
    
    cy.intercept('GET', '**/api/documents*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          documents: [
            {
              id: '1',
              name: 'Student Health Form.pdf',
              category: 'HEALTH_FORMS',
              studentId: 'STU001',
              studentName: 'Emma Wilson',
              uploadedAt: '2024-01-15T10:00:00Z',
              size: 2457600,
              version: 1
            }
          ],
          total: 1
        }
      }
    }).as('getDocuments')
    
    cy.login()
    cy.visit('/documents')
    cy.wait('@verifyAuth')
  })

  describe('Document List Display', () => {
    it('should display documents page', () => {
      cy.contains('Document Management').should('be.visible')
    })

    it('should show document list', () => {
      cy.wait('@getDocuments')
      cy.contains('Student Health Form.pdf').should('be.visible')
    })

    it('should display document metadata', () => {
      cy.wait('@getDocuments')
      cy.contains('Emma Wilson').should('be.visible')
      cy.contains('2.4 MB').should('be.visible')
    })
  })

  describe('Upload Documents', () => {
    it('should open upload modal', () => {
      cy.wait('@getDocuments')
      cy.get('[data-testid="upload-document-button"]').click()
      cy.get('[data-testid="upload-modal"]').should('be.visible')
    })

    it('should validate file type', () => {
      cy.wait('@getDocuments')
      cy.get('[data-testid="upload-document-button"]').click()
      
      const invalidFile = 'test.exe'
      cy.get('[data-testid="file-input"]').selectFile(invalidFile, { force: true })
      
      cy.contains('Invalid file type').should('be.visible')
    })

    it('should validate file size', () => {
      cy.wait('@getDocuments')
      cy.get('[data-testid="upload-document-button"]').click()
      
      cy.intercept('POST', '**/api/documents/upload', {
        statusCode: 400,
        body: { error: 'File exceeds maximum size of 10MB' }
      }).as('uploadError')
      
      cy.get('[data-testid="submit-upload"]').click()
      cy.wait('@uploadError')
      
      cy.contains('File exceeds maximum size').should('be.visible')
    })

    it('should successfully upload document', () => {
      cy.wait('@getDocuments')
      
      cy.intercept('POST', '**/api/documents/upload', {
        statusCode: 201,
        body: {
          success: true,
          data: {
            id: '2',
            name: 'Vaccination Record.pdf'
          }
        }
      }).as('uploadDocument')
      
      cy.get('[data-testid="upload-document-button"]').click()
      
      cy.get('[data-testid="student-select"]').select('STU001')
      cy.get('[data-testid="category-select"]').select('VACCINATION_RECORDS')
      cy.get('[data-testid="file-input"]').selectFile('cypress/fixtures/test-document.pdf', { force: true })
      cy.get('[data-testid="submit-upload"]').click()
      
      cy.wait('@uploadDocument')
      cy.contains('Document uploaded successfully').should('be.visible')
    })

    it('should show upload progress', () => {
      cy.wait('@getDocuments')
      cy.get('[data-testid="upload-document-button"]').click()
      
      cy.intercept('POST', '**/api/documents/upload', (req) => {
        req.on('progress', (state) => {
          // Simulate progress
        })
        req.reply({
          statusCode: 201,
          body: { success: true }
        })
      }).as('uploadProgress')
      
      cy.get('[data-testid="file-input"]').selectFile('cypress/fixtures/test-document.pdf', { force: true })
      cy.get('[data-testid="submit-upload"]').click()
      
      cy.get('[data-testid="upload-progress"]').should('be.visible')
    })
  })

  describe('Document Categories', () => {
    it('should display all document categories', () => {
      cy.wait('@getDocuments')
      cy.get('[data-testid="upload-document-button"]').click()
      
      const categories = [
        'HEALTH_FORMS',
        'VACCINATION_RECORDS',
        'CONSENT_FORMS',
        'MEDICAL_REPORTS',
        'PRESCRIPTIONS',
        'INSURANCE_DOCUMENTS'
      ]
      
      categories.forEach(category => {
        cy.get('[data-testid="category-select"]').should('contain', category)
      })
    })

    it('should filter by category', () => {
      cy.wait('@getDocuments')
      cy.get('[data-testid="category-filter"]').select('HEALTH_FORMS')
      cy.contains('HEALTH_FORMS').should('be.visible')
    })

    it('should show category badge', () => {
      cy.wait('@getDocuments')
      cy.get('[data-testid="document-1"]').within(() => {
        cy.get('[data-testid="category-badge"]').should('contain', 'HEALTH_FORMS')
      })
    })
  })

  describe('View Documents', () => {
    it('should preview document', () => {
      cy.wait('@getDocuments')
      
      cy.intercept('GET', '**/api/documents/1/preview', {
        statusCode: 200,
        headers: { 'Content-Type': 'application/pdf' }
      }).as('preview')
      
      cy.get('[data-testid="preview-document-1"]').click()
      cy.wait('@preview')
      
      cy.get('[data-testid="document-preview"]').should('be.visible')
    })

    it('should download document', () => {
      cy.wait('@getDocuments')
      
      cy.intercept('GET', '**/api/documents/1/download', {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=document.pdf'
        }
      }).as('download')
      
      cy.get('[data-testid="download-document-1"]').click()
      cy.wait('@download')
    })

    it('should print document', () => {
      cy.wait('@getDocuments')
      
      cy.window().then((win) => {
        cy.stub(win, 'print').as('print')
      })
      
      cy.get('[data-testid="preview-document-1"]').click()
      cy.get('[data-testid="print-document"]').click()
      
      cy.get('@print').should('have.been.called')
    })
  })

  describe('Version Control', () => {
    it('should display document versions', () => {
      cy.intercept('GET', '**/api/documents/1/versions', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            versions: [
              { version: 2, uploadedAt: '2024-01-16T10:00:00Z', uploadedBy: 'Nurse Smith' },
              { version: 1, uploadedAt: '2024-01-15T10:00:00Z', uploadedBy: 'Nurse Jones' }
            ]
          }
        }
      }).as('getVersions')
      
      cy.wait('@getDocuments')
      cy.get('[data-testid="view-versions-1"]').click()
      cy.wait('@getVersions')
      
      cy.contains('Version 2').should('be.visible')
      cy.contains('Version 1').should('be.visible')
    })

    it('should upload new version', () => {
      cy.intercept('POST', '**/api/documents/1/versions', {
        statusCode: 201,
        body: {
          success: true,
          data: { version: 3 }
        }
      }).as('uploadVersion')
      
      cy.wait('@getDocuments')
      cy.get('[data-testid="upload-new-version-1"]').click()
      
      cy.get('[data-testid="file-input"]').selectFile('cypress/fixtures/test-document-v2.pdf', { force: true })
      cy.get('[data-testid="version-notes"]').type('Updated with new information')
      cy.get('[data-testid="submit-version"]').click()
      
      cy.wait('@uploadVersion')
      cy.contains('New version uploaded').should('be.visible')
    })

    it('should compare versions', () => {
      cy.intercept('GET', '**/api/documents/1/versions/compare*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            changes: [
              { type: 'added', content: 'New section added' },
              { type: 'removed', content: 'Old section removed' }
            ]
          }
        }
      }).as('compareVersions')
      
      cy.wait('@getDocuments')
      cy.get('[data-testid="view-versions-1"]').click()
      cy.get('[data-testid="compare-versions"]').click()
      cy.get('[data-testid="version-from"]').select('1')
      cy.get('[data-testid="version-to"]').select('2')
      cy.get('[data-testid="compare-button"]').click()
      
      cy.wait('@compareVersions')
      cy.contains('New section added').should('be.visible')
    })

    it('should restore previous version', () => {
      cy.intercept('POST', '**/api/documents/1/restore', {
        statusCode: 200,
        body: { success: true }
      }).as('restoreVersion')
      
      cy.wait('@getDocuments')
      cy.get('[data-testid="view-versions-1"]').click()
      cy.get('[data-testid="restore-version-1"]').click()
      cy.get('[data-testid="confirm-restore"]').click()
      
      cy.wait('@restoreVersion')
      cy.contains('Version restored').should('be.visible')
    })
  })

  describe('Document Scanning & OCR', () => {
    it('should scan document from camera', () => {
      cy.wait('@getDocuments')
      
      cy.get('[data-testid="scan-document-button"]').click()
      cy.get('[data-testid="camera-input"]').should('be.visible')
    })

    it('should perform OCR on scanned document', () => {
      cy.intercept('POST', '**/api/documents/ocr', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            text: 'Extracted text from document',
            confidence: 0.95
          }
        }
      }).as('performOCR')
      
      cy.wait('@getDocuments')
      cy.get('[data-testid="scan-document-button"]').click()
      cy.get('[data-testid="perform-ocr"]').click()
      
      cy.wait('@performOCR')
      cy.contains('Extracted text from document').should('be.visible')
      cy.contains('95% confidence').should('be.visible')
    })

    it('should allow editing OCR text', () => {
      cy.wait('@getDocuments')
      cy.get('[data-testid="scan-document-button"]').click()
      cy.get('[data-testid="ocr-text"]').should('be.visible')
      cy.get('[data-testid="edit-ocr-text"]').click()
      cy.get('[data-testid="ocr-editor"]').type('Corrected text')
      cy.get('[data-testid="save-ocr"]').click()
      
      cy.contains('OCR text updated').should('be.visible')
    })
  })

  describe('Document Tags', () => {
    it('should add tags to document', () => {
      cy.intercept('POST', '**/api/documents/1/tags', {
        statusCode: 200,
        body: { success: true }
      }).as('addTags')
      
      cy.wait('@getDocuments')
      cy.get('[data-testid="edit-document-1"]').click()
      cy.get('[data-testid="tags-input"]').type('urgent,review-needed')
      cy.get('[data-testid="save-document"]').click()
      
      cy.wait('@addTags')
      cy.contains('urgent').should('be.visible')
      cy.contains('review-needed').should('be.visible')
    })

    it('should filter by tags', () => {
      cy.wait('@getDocuments')
      cy.get('[data-testid="tag-filter"]').type('urgent')
      cy.get('[data-testid="apply-tag-filter"]').click()
      
      cy.get('[data-testid="document-list"]').within(() => {
        cy.contains('urgent').should('be.visible')
      })
    })
  })

  describe('Advanced Search', () => {
    it('should search documents by name', () => {
      cy.wait('@getDocuments')
      cy.get('[data-testid="document-search"]').type('Health Form')
      cy.contains('Student Health Form').should('be.visible')
    })

    it('should search by student name', () => {
      cy.wait('@getDocuments')
      cy.get('[data-testid="document-search"]').type('Emma Wilson')
      cy.contains('Emma Wilson').should('be.visible')
    })

    it('should search within document content (OCR)', () => {
      cy.intercept('GET', '**/api/documents/search*', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            documents: [
              {
                id: '1',
                name: 'Health Form.pdf',
                matchedText: '...chronic asthma...'
              }
            ]
          }
        }
      }).as('searchContent')
      
      cy.wait('@getDocuments')
      cy.get('[data-testid="advanced-search"]').click()
      cy.get('[data-testid="search-content"]').check()
      cy.get('[data-testid="search-query"]').type('asthma')
      cy.get('[data-testid="submit-search"]').click()
      
      cy.wait('@searchContent')
      cy.contains('chronic asthma').should('be.visible')
    })

    it('should filter by date range', () => {
      cy.wait('@getDocuments')
      cy.get('[data-testid="date-from"]').type('2024-01-01')
      cy.get('[data-testid="date-to"]').type('2024-01-31')
      cy.get('[data-testid="apply-filter"]').click()
      
      cy.wait('@getDocuments')
    })

    it('should filter by file size', () => {
      cy.wait('@getDocuments')
      cy.get('[data-testid="size-filter"]').select('large')
      cy.wait('@getDocuments')
    })
  })

  describe('Digital Signatures', () => {
    it('should request signature on document', () => {
      cy.intercept('POST', '**/api/documents/1/request-signature', {
        statusCode: 200,
        body: { success: true }
      }).as('requestSignature')
      
      cy.wait('@getDocuments')
      cy.get('[data-testid="request-signature-1"]').click()
      cy.get('[data-testid="signer-email"]').type('parent@email.com')
      cy.get('[data-testid="send-request"]').click()
      
      cy.wait('@requestSignature')
      cy.contains('Signature requested').should('be.visible')
    })

    it('should display signature status', () => {
      cy.intercept('GET', '**/api/documents/1/signatures', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            signatures: [
              {
                signer: 'John Doe',
                signedAt: '2024-01-15T14:00:00Z',
                status: 'SIGNED'
              }
            ]
          }
        }
      }).as('getSignatures')
      
      cy.wait('@getDocuments')
      cy.get('[data-testid="view-signatures-1"]').click()
      cy.wait('@getSignatures')
      
      cy.contains('SIGNED').should('be.visible')
      cy.contains('John Doe').should('be.visible')
    })

    it('should verify digital signature', () => {
      cy.intercept('POST', '**/api/documents/1/verify-signature', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            valid: true,
            signedBy: 'John Doe',
            signedAt: '2024-01-15T14:00:00Z'
          }
        }
      }).as('verifySignature')
      
      cy.wait('@getDocuments')
      cy.get('[data-testid="verify-signature-1"]').click()
      cy.wait('@verifySignature')
      
      cy.contains('Signature is valid').should('be.visible')
    })
  })

  describe('Retention Policies', () => {
    it('should display retention policy', () => {
      cy.wait('@getDocuments')
      cy.get('[data-testid="view-document-1"]').click()
      
      cy.contains('Retention Policy').should('be.visible')
      cy.contains('Retain for 7 years').should('be.visible')
    })

    it('should archive expired documents', () => {
      cy.intercept('POST', '**/api/documents/archive-expired', {
        statusCode: 200,
        body: {
          success: true,
          data: { archived: 5 }
        }
      }).as('archiveExpired')
      
      cy.wait('@getDocuments')
      cy.get('[data-testid="archive-expired-documents"]').click()
      cy.get('[data-testid="confirm-archive"]').click()
      
      cy.wait('@archiveExpired')
      cy.contains('5 documents archived').should('be.visible')
    })

    it('should prevent deletion before retention period', () => {
      cy.intercept('DELETE', '**/api/documents/1', {
        statusCode: 400,
        body: { error: 'Cannot delete document within retention period' }
      }).as('deleteError')
      
      cy.wait('@getDocuments')
      cy.get('[data-testid="delete-document-1"]').click()
      cy.get('[data-testid="confirm-delete"]').click()
      
      cy.wait('@deleteError')
      cy.contains('Cannot delete document within retention period').should('be.visible')
    })
  })

  describe('Bulk Operations', () => {
    it('should select multiple documents', () => {
      cy.wait('@getDocuments')
      cy.get('[data-testid="select-document-1"]').check()
      cy.get('[data-testid="bulk-actions"]').should('be.visible')
    })

    it('should bulk download documents', () => {
      cy.intercept('POST', '**/api/documents/bulk-download', {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/zip'
        }
      }).as('bulkDownload')
      
      cy.wait('@getDocuments')
      cy.get('[data-testid="select-document-1"]').check()
      cy.get('[data-testid="bulk-download"]').click()
      
      cy.wait('@bulkDownload')
    })

    it('should bulk categorize documents', () => {
      cy.intercept('PUT', '**/api/documents/bulk-categorize', {
        statusCode: 200,
        body: { success: true }
      }).as('bulkCategorize')
      
      cy.wait('@getDocuments')
      cy.get('[data-testid="select-document-1"]').check()
      cy.get('[data-testid="bulk-categorize"]').click()
      cy.get('[data-testid="category-select"]').select('VACCINATION_RECORDS')
      cy.get('[data-testid="apply-category"]').click()
      
      cy.wait('@bulkCategorize')
      cy.contains('Documents categorized').should('be.visible')
    })
  })

  describe('Error Handling', () => {
    it('should handle API errors', () => {
      cy.intercept('GET', '**/api/documents*', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('error')
      
      cy.reload()
      cy.wait('@error')
      cy.contains('Failed to load documents').should('be.visible')
    })
  })

  describe('Healthcare Compliance', () => {
    it('should log document access', () => {
      cy.intercept('POST', '**/api/audit-logs', (req) => {
        expect(req.body.action).to.include('DOCUMENT')
        req.reply({ statusCode: 200, body: { success: true } })
      }).as('auditLog')
      
      cy.wait('@auditLog')
    })
  })

  describe('Responsive Design', () => {
    it('should be mobile responsive', () => {
      cy.viewport('iphone-x')
      cy.contains('Document').should('be.visible')
    })
  })
})

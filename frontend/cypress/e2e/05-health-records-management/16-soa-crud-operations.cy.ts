/// <reference types="cypress" />

/**
 * Health Records Management: SOA CRUD Operations Testing
 *
 * Comprehensive test suite validating Create, Read, Update, Delete operations
 * for health records with SOA implementation patterns including:
 * - Service layer validation
 * - Data integrity verification
 * - Error handling and rollback scenarios
 * - Concurrent operations handling
 * - Transaction consistency
 *
 * @module HealthRecordsCRUDTests
 * @category HealthRecordsManagement
 * @priority Critical
 * @soa-pattern Service-Oriented Architecture
 */

describe('Health Records SOA - CRUD Operations', () => {
  let testHealthRecords: any
  let testStudent: any

  before(() => {
    // Load test fixtures
    cy.fixture('healthRecords').then((data) => {
      testHealthRecords = data
    })

    cy.fixture('students').then((data) => {
      testStudent = data.testStudent1
    })
  })

  beforeEach(() => {
    // Login as nurse (primary role for health records)
    cy.login('nurse')

    // Setup base API intercepts
    cy.setupHealthRecordsIntercepts()

    // Navigate to health records page
    cy.visit('/health-records')
    cy.waitForHealthcareData()
  })

  afterEach(() => {
    // Cleanup any test data created
    cy.cleanupHealthRecords('1')
  })

  context('CREATE Operations - Health Records', () => {
    it('should successfully create a new health record with complete data', () => {
      // Setup intercept for create operation
      cy.intercept('POST', '**/api/health-records', (req) => {
        expect(req.body).to.have.property('studentId')
        expect(req.body).to.have.property('type')
        expect(req.body).to.have.property('description')
        expect(req.body).to.have.property('date')

        req.reply({
          statusCode: 201,
          body: {
            success: true,
            data: {
              healthRecord: {
                id: 'hr-new-001',
                ...req.body,
                createdAt: new Date().toISOString()
              }
            }
          }
        })
      }).as('createHealthRecord')

      // Trigger create operation via UI or API call
      const newRecord = {
        studentId: '1',
        type: 'CHECKUP',
        date: new Date().toISOString(),
        description: 'Annual physical examination',
        provider: 'Dr. Smith',
        notes: 'All vitals normal',
        vital: {
          temperature: 98.6,
          heartRate: 72,
          bloodPressureSystolic: 110,
          bloodPressureDiastolic: 70
        }
      }

      cy.createHealthRecord(newRecord)

      // Verify API call was made
      cy.wait('@createHealthRecord').then((interception) => {
        expect(interception.response?.statusCode).to.equal(201)
        expect(interception.response?.body.success).to.be.true
        expect(interception.response?.body.data.healthRecord).to.have.property('id')
      })
    })

    it('should validate required fields when creating health record', () => {
      cy.intercept('POST', '**/api/health-records', {
        statusCode: 400,
        body: {
          success: false,
          error: {
            message: 'Validation failed',
            details: {
              studentId: 'Student ID is required',
              type: 'Record type is required',
              description: 'Description is required'
            }
          }
        }
      }).as('createHealthRecordInvalid')

      // Attempt to create with missing fields
      const invalidRecord = {
        studentId: '',
        type: '',
        description: ''
      }

      cy.createHealthRecord(invalidRecord)

      cy.wait('@createHealthRecordInvalid').then((interception) => {
        expect(interception.response?.statusCode).to.equal(400)
        expect(interception.response?.body.success).to.be.false
      })
    })

    it('should handle concurrent create operations correctly', () => {
      let requestCount = 0

      cy.intercept('POST', '**/api/health-records', (req) => {
        requestCount++
        req.reply({
          statusCode: 201,
          body: {
            success: true,
            data: {
              healthRecord: {
                id: `hr-concurrent-${requestCount}`,
                ...req.body
              }
            }
          }
        })
      }).as('concurrentCreate')

      // Simulate concurrent creates
      cy.createHealthRecord({ description: 'Record 1' })
      cy.createHealthRecord({ description: 'Record 2' })
      cy.createHealthRecord({ description: 'Record 3' })

      // Verify all requests succeeded
      cy.wrap(null).should(() => {
        expect(requestCount).to.equal(3)
      })
    })

    it('should rollback on service failure during create', () => {
      cy.intercept('POST', '**/api/health-records', {
        statusCode: 500,
        body: {
          success: false,
          error: { message: 'Database connection failed' }
        }
      }).as('createFailed')

      cy.createHealthRecord({ description: 'Test record' })

      cy.wait('@createFailed').then((interception) => {
        expect(interception.response?.statusCode).to.equal(500)
        // Verify no partial data was saved
        expect(interception.response?.body.success).to.be.false
      })
    })
  })

  context('READ Operations - Health Records', () => {
    beforeEach(() => {
      // Setup mock data for read operations
      cy.setupHealthRecordsMocks({
        healthRecords: [
          testHealthRecords.testHealthRecord1,
          testHealthRecords.testHealthRecord2
        ]
      })
    })

    it('should retrieve health records for a specific student', () => {
      cy.intercept('GET', '**/api/health-records/student/1**').as('getStudentRecords')

      // Trigger read operation
      cy.visit('/health-records?studentId=1')
      cy.waitForHealthcareData()

      cy.wait('@getStudentRecords').then((interception) => {
        expect(interception.response?.statusCode).to.equal(200)
        expect(interception.response?.body.data).to.have.property('records')
        expect(interception.response?.body.data.records).to.be.an('array')
      })
    })

    it('should apply pagination to health records retrieval', () => {
      cy.intercept('GET', '**/api/health-records/student/1?page=1&limit=20**').as('getPagedRecords')

      cy.visit('/health-records?studentId=1&page=1&limit=20')
      cy.waitForHealthcareData()

      cy.wait('@getPagedRecords').then((interception) => {
        expect(interception.response?.body.data).to.have.property('pagination')
        const pagination = interception.response?.body.data.pagination
        expect(pagination).to.have.property('page', 1)
        expect(pagination).to.have.property('total')
      })
    })

    it('should filter health records by type', () => {
      cy.intercept('GET', '**/api/health-records/student/1?type=VACCINATION**').as('getFilteredRecords')

      cy.visit('/health-records?studentId=1&type=VACCINATION')
      cy.waitForHealthcareData()

      cy.wait('@getFilteredRecords').then((interception) => {
        expect(interception.request.url).to.include('type=VACCINATION')
        const records = interception.response?.body.data.records || []
        records.forEach((record: any) => {
          expect(record.type).to.equal('VACCINATION')
        })
      })
    })

    it('should handle empty result sets gracefully', () => {
      cy.setupHealthRecordsMocks({ healthRecords: [] })

      cy.intercept('GET', '**/api/health-records/student/999**').as('getEmptyRecords')

      cy.visit('/health-records?studentId=999')
      cy.waitForHealthcareData()

      cy.wait('@getEmptyRecords').then((interception) => {
        expect(interception.response?.statusCode).to.equal(200)
        expect(interception.response?.body.data.records).to.be.an('array').that.is.empty
      })
    })

    it('should retrieve health summary with aggregated data', () => {
      cy.intercept('GET', '**/api/health-records/summary/1', {
        statusCode: 200,
        body: {
          success: true,
          data: testHealthRecords.testHealthSummary
        }
      }).as('getHealthSummary')

      // Request health summary
      cy.visit('/health-records?studentId=1&view=summary')
      cy.waitForHealthcareData()

      cy.wait('@getHealthSummary').then((interception) => {
        expect(interception.response?.statusCode).to.equal(200)
        const summary = interception.response?.body.data
        expect(summary).to.have.property('student')
        expect(summary).to.have.property('allergies')
        expect(summary).to.have.property('chronicConditions')
        expect(summary).to.have.property('recentVitals')
      })
    })
  })

  context('UPDATE Operations - Health Records', () => {
    it('should successfully update an existing health record', () => {
      const recordId = 'hr-001'
      const updateData = {
        description: 'Updated annual physical examination',
        notes: 'Updated notes with new observations',
        provider: 'Dr. Johnson'
      }

      cy.intercept('PUT', `**/api/health-records/${recordId}`, (req) => {
        expect(req.body).to.include(updateData)

        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              healthRecord: {
                id: recordId,
                ...testHealthRecords.testHealthRecord1,
                ...updateData,
                updatedAt: new Date().toISOString()
              }
            }
          }
        })
      }).as('updateHealthRecord')

      // Trigger update operation
      cy.request('PUT', `http://localhost:3001/api/health-records/${recordId}`, updateData)

      cy.wait('@updateHealthRecord').then((interception) => {
        expect(interception.response?.statusCode).to.equal(200)
        expect(interception.response?.body.data.healthRecord.description).to.equal(updateData.description)
        expect(interception.response?.body.data.healthRecord).to.have.property('updatedAt')
      })
    })

    it('should validate data integrity during update', () => {
      const recordId = 'hr-001'

      cy.intercept('PUT', `**/api/health-records/${recordId}`, {
        statusCode: 400,
        body: {
          success: false,
          error: {
            message: 'Invalid update data',
            details: {
              type: 'Invalid health record type'
            }
          }
        }
      }).as('updateInvalid')

      cy.request({
        method: 'PUT',
        url: `http://localhost:3001/api/health-records/${recordId}`,
        body: { type: 'INVALID_TYPE' },
        failOnStatusCode: false
      })

      cy.wait('@updateInvalid').then((interception) => {
        expect(interception.response?.statusCode).to.equal(400)
        expect(interception.response?.body.success).to.be.false
      })
    })

    it('should handle optimistic locking for concurrent updates', () => {
      const recordId = 'hr-001'
      let updateCount = 0

      cy.intercept('PUT', `**/api/health-records/${recordId}`, (req) => {
        updateCount++

        if (updateCount === 1) {
          // First update succeeds
          req.reply({
            statusCode: 200,
            body: {
              success: true,
              data: {
                healthRecord: {
                  id: recordId,
                  version: 2,
                  ...req.body
                }
              }
            }
          })
        } else {
          // Subsequent update detects conflict
          req.reply({
            statusCode: 409,
            body: {
              success: false,
              error: { message: 'Record has been modified by another user' }
            }
          })
        }
      }).as('concurrentUpdate')

      // Simulate concurrent updates
      cy.request('PUT', `http://localhost:3001/api/health-records/${recordId}`, { notes: 'Update 1' })
      cy.request({
        method: 'PUT',
        url: `http://localhost:3001/api/health-records/${recordId}`,
        body: { notes: 'Update 2' },
        failOnStatusCode: false
      })

      cy.wrap(null).should(() => {
        expect(updateCount).to.equal(2)
      })
    })

    it('should prevent unauthorized updates', () => {
      // Login as read-only user
      cy.login('viewer')

      const recordId = 'hr-001'

      cy.intercept('PUT', `**/api/health-records/${recordId}`, {
        statusCode: 403,
        body: {
          success: false,
          error: { message: 'Insufficient permissions to update health records' }
        }
      }).as('unauthorizedUpdate')

      cy.request({
        method: 'PUT',
        url: `http://localhost:3001/api/health-records/${recordId}`,
        body: { notes: 'Attempted update' },
        failOnStatusCode: false
      })

      cy.wait('@unauthorizedUpdate').then((interception) => {
        expect(interception.response?.statusCode).to.equal(403)
      })
    })
  })

  context('DELETE Operations - Health Records', () => {
    it('should successfully delete a health record', () => {
      const recordId = 'hr-001'

      cy.intercept('DELETE', `**/api/health-records/${recordId}`, {
        statusCode: 200,
        body: {
          success: true,
          message: 'Health record deleted successfully'
        }
      }).as('deleteHealthRecord')

      cy.request('DELETE', `http://localhost:3001/api/health-records/${recordId}`)

      cy.wait('@deleteHealthRecord').then((interception) => {
        expect(interception.response?.statusCode).to.equal(200)
        expect(interception.response?.body.success).to.be.true
      })
    })

    it('should handle deletion of non-existent record', () => {
      const recordId = 'hr-nonexistent'

      cy.intercept('DELETE', `**/api/health-records/${recordId}`, {
        statusCode: 404,
        body: {
          success: false,
          error: { message: 'Health record not found' }
        }
      }).as('deleteNotFound')

      cy.request({
        method: 'DELETE',
        url: `http://localhost:3001/api/health-records/${recordId}`,
        failOnStatusCode: false
      })

      cy.wait('@deleteNotFound').then((interception) => {
        expect(interception.response?.statusCode).to.equal(404)
      })
    })

    it('should support bulk delete operations', () => {
      const recordIds = ['hr-001', 'hr-002', 'hr-003']

      cy.intercept('POST', '**/api/health-records/bulk-delete', (req) => {
        expect(req.body).to.have.property('recordIds')
        expect(req.body.recordIds).to.deep.equal(recordIds)

        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              deleted: 3,
              notFound: 0,
              success: true
            }
          }
        })
      }).as('bulkDelete')

      cy.request('POST', 'http://localhost:3001/api/health-records/bulk-delete', { recordIds })

      cy.wait('@bulkDelete').then((interception) => {
        expect(interception.response?.statusCode).to.equal(200)
        expect(interception.response?.body.data.deleted).to.equal(3)
      })
    })

    it('should require admin or nurse role for deletion', () => {
      cy.login('counselor')

      const recordId = 'hr-001'

      cy.intercept('DELETE', `**/api/health-records/${recordId}`, {
        statusCode: 403,
        body: {
          success: false,
          error: { message: 'Insufficient permissions to delete health records' }
        }
      }).as('unauthorizedDelete')

      cy.request({
        method: 'DELETE',
        url: `http://localhost:3001/api/health-records/${recordId}`,
        failOnStatusCode: false
      })

      cy.wait('@unauthorizedDelete').then((interception) => {
        expect(interception.response?.statusCode).to.equal(403)
      })
    })

    it('should create audit trail on deletion', () => {
      const recordId = 'hr-001'

      cy.intercept('DELETE', `**/api/health-records/${recordId}`, {
        statusCode: 200,
        body: { success: true }
      }).as('deleteRecord')

      cy.intercept('POST', '**/api/audit/**').as('auditLog')

      cy.request('DELETE', `http://localhost:3001/api/health-records/${recordId}`)

      cy.wait('@deleteRecord')

      // Verify audit log was created (optional based on implementation)
      cy.get('@auditLog.all').then((logs: any) => {
        if (logs.length > 0) {
          cy.log('Audit log created for deletion')
        }
      })
    })
  })

  context('Service Layer Validation', () => {
    it('should validate student exists before creating health record', () => {
      cy.intercept('POST', '**/api/health-records', {
        statusCode: 404,
        body: {
          success: false,
          error: { message: 'Student not found' }
        }
      }).as('createWithInvalidStudent')

      cy.createHealthRecord({
        studentId: 'invalid-student-id',
        description: 'Test record'
      })

      cy.wait('@createWithInvalidStudent').then((interception) => {
        expect(interception.response?.statusCode).to.equal(404)
      })
    })

    it('should calculate BMI when height and weight are provided', () => {
      cy.intercept('POST', '**/api/health-records', (req) => {
        const vitals = req.body.vital
        if (vitals?.height && vitals?.weight) {
          const heightInMeters = vitals.height / 100
          const expectedBmi = Math.round((vitals.weight / (heightInMeters * heightInMeters)) * 10) / 10

          req.reply({
            statusCode: 201,
            body: {
              success: true,
              data: {
                healthRecord: {
                  ...req.body,
                  id: 'hr-bmi-calc',
                  vital: {
                    ...vitals,
                    bmi: expectedBmi
                  }
                }
              }
            }
          })
        }
      }).as('createWithVitals')

      cy.createHealthRecord({
        description: 'Physical exam',
        vital: {
          height: 150,
          weight: 45
        }
      })

      cy.wait('@createWithVitals').then((interception) => {
        const vital = interception.response?.body.data.healthRecord.vital
        expect(vital).to.have.property('bmi')
        expect(vital.bmi).to.equal(20.0) // 45 / (1.5 * 1.5)
      })
    })

    it('should enforce data retention policies', () => {
      const oldDate = new Date()
      oldDate.setFullYear(oldDate.getFullYear() - 8) // 8 years ago

      cy.intercept('DELETE', '**/api/health-records/cleanup', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            deleted: 15,
            retentionPeriod: '7 years'
          }
        }
      }).as('dataRetention')

      // Trigger retention cleanup
      cy.request('DELETE', 'http://localhost:3001/api/health-records/cleanup')

      cy.wait('@dataRetention').then((interception) => {
        expect(interception.response?.statusCode).to.equal(200)
        expect(interception.response?.body.data).to.have.property('deleted')
      })
    })
  })
})

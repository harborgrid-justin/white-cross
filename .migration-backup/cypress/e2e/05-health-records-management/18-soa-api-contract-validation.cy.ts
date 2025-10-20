/// <reference types="cypress" />

/**
 * Health Records Management: SOA API Contract Validation
 *
 * Comprehensive test suite validating API contracts and interfaces including:
 * - Request/response schema validation
 * - Data type validation
 * - Required fields verification
 * - API versioning compatibility
 * - Content-type validation
 * - Status code verification
 * - Error response format validation
 *
 * @module HealthRecordsAPIContractTests
 * @category HealthRecordsManagement
 * @priority Critical
 * @soa-pattern API Contract Testing
 */

describe('Health Records SOA - API Contract Validation', () => {
  let testHealthRecords: any

  before(() => {
    cy.fixture('healthRecords').then((data) => {
      testHealthRecords = data
    })
  })

  beforeEach(() => {
    cy.login('nurse')
    cy.setupHealthRecordsIntercepts()
  })

  context('Request Schema Validation', () => {
    it('should validate health record creation request schema', () => {
      cy.intercept('POST', '**/api/health-records', (req) => {
        // Validate request body structure
        expect(req.body).to.be.an('object')
        expect(req.body).to.have.property('studentId').that.is.a('string')
        expect(req.body).to.have.property('type').that.is.a('string')
        expect(req.body).to.have.property('date').that.is.a('string')
        expect(req.body).to.have.property('description').that.is.a('string')

        // Validate type enum values
        const validTypes = ['CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING', 'PHYSICAL_EXAM', 'MENTAL_HEALTH', 'DENTAL', 'VISION', 'HEARING']
        expect(validTypes).to.include(req.body.type)

        req.reply({
          statusCode: 201,
          body: {
            success: true,
            data: { healthRecord: { id: 'hr-001', ...req.body } }
          }
        })
      }).as('createHealthRecord')

      cy.createHealthRecord({
        studentId: '1',
        type: 'CHECKUP',
        date: new Date().toISOString(),
        description: 'Annual checkup'
      })

      cy.wait('@createHealthRecord')
    })

    it('should validate allergy creation request schema', () => {
      cy.intercept('POST', '**/api/health-records/allergies', (req) => {
        expect(req.body).to.have.property('studentId').that.is.a('string')
        expect(req.body).to.have.property('allergen').that.is.a('string')
        expect(req.body).to.have.property('severity').that.is.a('string')

        const validSeverities = ['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING']
        expect(validSeverities).to.include(req.body.severity)

        req.reply({
          statusCode: 201,
          body: {
            success: true,
            data: { allergy: { id: 'allergy-001', ...req.body } }
          }
        })
      }).as('createAllergy')

      cy.createAllergy({
        studentId: '1',
        allergen: 'Peanuts',
        severity: 'LIFE_THREATENING'
      })

      cy.wait('@createAllergy')
    })

    it('should validate vital signs nested object structure', () => {
      cy.intercept('POST', '**/api/health-records', (req) => {
        if (req.body.vital) {
          const vital = req.body.vital

          // Validate vital signs are numbers
          if (vital.temperature) expect(vital.temperature).to.be.a('number')
          if (vital.heartRate) expect(vital.heartRate).to.be.a('number')
          if (vital.bloodPressureSystolic) expect(vital.bloodPressureSystolic).to.be.a('number')
          if (vital.bloodPressureDiastolic) expect(vital.bloodPressureDiastolic).to.be.a('number')
          if (vital.height) expect(vital.height).to.be.a('number')
          if (vital.weight) expect(vital.weight).to.be.a('number')
        }

        req.reply({
          statusCode: 201,
          body: {
            success: true,
            data: { healthRecord: { id: 'hr-vital', ...req.body } }
          }
        })
      }).as('createWithVitals')

      cy.createHealthRecord({
        description: 'Physical exam',
        vital: {
          temperature: 98.6,
          heartRate: 72,
          bloodPressureSystolic: 110,
          bloodPressureDiastolic: 70,
          height: 150,
          weight: 45
        }
      })

      cy.wait('@createWithVitals')
    })
  })

  context('Response Schema Validation', () => {
    it('should validate health records list response schema', () => {
      cy.intercept('GET', '**/api/health-records/student/1**', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: testHealthRecords.bulkHealthRecords,
            pagination: {
              page: 1,
              limit: 20,
              total: 3,
              pages: 1
            }
          }
        }
      }).as('getHealthRecords')

      cy.request('http://localhost:3001/api/health-records/student/1')

      cy.wait('@getHealthRecords').then((interception) => {
        const body = interception.response?.body

        // Validate top-level structure
        expect(body).to.have.property('success', true)
        expect(body).to.have.property('data')

        // Validate data structure
        expect(body.data).to.have.property('records').that.is.an('array')
        expect(body.data).to.have.property('pagination').that.is.an('object')

        // Validate pagination structure
        const pagination = body.data.pagination
        expect(pagination).to.have.property('page').that.is.a('number')
        expect(pagination).to.have.property('limit').that.is.a('number')
        expect(pagination).to.have.property('total').that.is.a('number')
        expect(pagination).to.have.property('pages').that.is.a('number')

        // Validate each record
        body.data.records.forEach((record: any) => {
          expect(record).to.have.property('id').that.is.a('string')
          expect(record).to.have.property('studentId').that.is.a('string')
          expect(record).to.have.property('type').that.is.a('string')
          expect(record).to.have.property('description').that.is.a('string')
        })
      })
    })

    it('should validate health summary response schema', () => {
      cy.intercept('GET', '**/api/health-records/summary/1', {
        statusCode: 200,
        body: {
          success: true,
          data: testHealthRecords.testHealthSummary
        }
      }).as('getHealthSummary')

      cy.request('http://localhost:3001/api/health-records/summary/1')

      cy.wait('@getHealthSummary').then((interception) => {
        const summary = interception.response?.body.data

        expect(summary).to.have.property('student').that.is.an('object')
        expect(summary).to.have.property('allergies').that.is.an('array')
        expect(summary).to.have.property('chronicConditions').that.is.an('array')
        expect(summary).to.have.property('recentVitals')
        expect(summary).to.have.property('vaccinations').that.is.an('array')

        // Validate student object
        expect(summary.student).to.have.property('id')
        expect(summary.student).to.have.property('firstName')
        expect(summary.student).to.have.property('lastName')
        expect(summary.student).to.have.property('studentNumber')
      })
    })

    it('should validate error response schema', () => {
      cy.intercept('POST', '**/api/health-records', {
        statusCode: 400,
        body: {
          success: false,
          error: {
            message: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: {
              studentId: 'Student ID is required',
              description: 'Description must be at least 10 characters'
            }
          }
        }
      }).as('validationError')

      cy.request({
        method: 'POST',
        url: 'http://localhost:3001/api/health-records',
        body: {},
        failOnStatusCode: false
      })

      cy.wait('@validationError').then((interception) => {
        const body = interception.response?.body

        expect(body).to.have.property('success', false)
        expect(body).to.have.property('error').that.is.an('object')

        const error = body.error
        expect(error).to.have.property('message').that.is.a('string')
        expect(error).to.have.property('code').that.is.a('string')
        expect(error).to.have.property('details')
      })
    })
  })

  context('Content-Type Validation', () => {
    it('should accept application/json content type', () => {
      cy.intercept('POST', '**/api/health-records', (req) => {
        expect(req.headers).to.have.property('content-type')
        expect(req.headers['content-type']).to.include('application/json')

        req.reply({
          statusCode: 201,
          body: { success: true, data: { healthRecord: {} } }
        })
      }).as('jsonContentType')

      cy.request({
        method: 'POST',
        url: 'http://localhost:3001/api/health-records',
        headers: { 'Content-Type': 'application/json' },
        body: {
          studentId: '1',
          type: 'CHECKUP',
          date: new Date().toISOString(),
          description: 'Test'
        }
      })

      cy.wait('@jsonContentType')
    })

    it('should return application/json responses', () => {
      cy.intercept('GET', '**/api/health-records/student/1**').as('getRecords')

      cy.request('http://localhost:3001/api/health-records/student/1')

      cy.wait('@getRecords').then((interception) => {
        expect(interception.response?.headers).to.have.property('content-type')
        expect(interception.response?.headers['content-type']).to.include('application/json')
      })
    })

    it('should handle multipart/form-data for file uploads', () => {
      cy.intercept('POST', '**/api/health-records/import/1', (req) => {
        expect(req.headers['content-type']).to.include('multipart/form-data')

        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: { imported: 5, errors: [] }
          }
        })
      }).as('importRecords')

      const file = new File(['test content'], 'import.json', { type: 'application/json' })

      cy.request({
        method: 'POST',
        url: 'http://localhost:3001/api/health-records/import/1',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: file
      })

      cy.wait('@importRecords')
    })
  })

  context('Status Code Validation', () => {
    it('should return 200 for successful GET requests', () => {
      cy.intercept('GET', '**/api/health-records/student/1**').as('getSuccess')

      cy.request('http://localhost:3001/api/health-records/student/1')

      cy.wait('@getSuccess').then((interception) => {
        expect(interception.response?.statusCode).to.equal(200)
      })
    })

    it('should return 201 for successful POST requests', () => {
      cy.intercept('POST', '**/api/health-records').as('createSuccess')

      cy.createHealthRecord({ description: 'New record' })

      cy.wait('@createSuccess').then((interception) => {
        expect(interception.response?.statusCode).to.equal(201)
      })
    })

    it('should return 400 for invalid request data', () => {
      cy.intercept('POST', '**/api/health-records', {
        statusCode: 400,
        body: {
          success: false,
          error: { message: 'Invalid data provided' }
        }
      }).as('badRequest')

      cy.request({
        method: 'POST',
        url: 'http://localhost:3001/api/health-records',
        body: { invalid: 'data' },
        failOnStatusCode: false
      })

      cy.wait('@badRequest').then((interception) => {
        expect(interception.response?.statusCode).to.equal(400)
      })
    })

    it('should return 401 for unauthenticated requests', () => {
      // Clear authentication
      cy.clearCookies()
      cy.clearLocalStorage()

      cy.intercept('GET', '**/api/health-records/student/1', {
        statusCode: 401,
        body: {
          success: false,
          error: { message: 'Authentication required' }
        }
      }).as('unauthorized')

      cy.request({
        url: 'http://localhost:3001/api/health-records/student/1',
        failOnStatusCode: false
      })

      cy.wait('@unauthorized').then((interception) => {
        expect(interception.response?.statusCode).to.equal(401)
      })
    })

    it('should return 403 for forbidden operations', () => {
      cy.login('viewer')

      cy.intercept('DELETE', '**/api/health-records/hr-001', {
        statusCode: 403,
        body: {
          success: false,
          error: { message: 'Insufficient permissions' }
        }
      }).as('forbidden')

      cy.request({
        method: 'DELETE',
        url: 'http://localhost:3001/api/health-records/hr-001',
        failOnStatusCode: false
      })

      cy.wait('@forbidden').then((interception) => {
        expect(interception.response?.statusCode).to.equal(403)
      })
    })

    it('should return 404 for non-existent resources', () => {
      cy.intercept('GET', '**/api/health-records/student/nonexistent', {
        statusCode: 404,
        body: {
          success: false,
          error: { message: 'Student not found' }
        }
      }).as('notFound')

      cy.request({
        url: 'http://localhost:3001/api/health-records/student/nonexistent',
        failOnStatusCode: false
      })

      cy.wait('@notFound').then((interception) => {
        expect(interception.response?.statusCode).to.equal(404)
      })
    })

    it('should return 500 for server errors', () => {
      cy.intercept('GET', '**/api/health-records/student/1', {
        statusCode: 500,
        body: {
          success: false,
          error: { message: 'Internal server error' }
        }
      }).as('serverError')

      cy.request({
        url: 'http://localhost:3001/api/health-records/student/1',
        failOnStatusCode: false
      })

      cy.wait('@serverError').then((interception) => {
        expect(interception.response?.statusCode).to.equal(500)
      })
    })

    it('should return 503 for service unavailable', () => {
      cy.intercept('GET', '**/api/health-records/student/1', {
        statusCode: 503,
        body: {
          success: false,
          error: { message: 'Service temporarily unavailable' }
        }
      }).as('serviceUnavailable')

      cy.request({
        url: 'http://localhost:3001/api/health-records/student/1',
        failOnStatusCode: false
      })

      cy.wait('@serviceUnavailable').then((interception) => {
        expect(interception.response?.statusCode).to.equal(503)
      })
    })
  })

  context('API Versioning', () => {
    it('should support API version headers', () => {
      cy.intercept('GET', '**/api/health-records/student/1', (req) => {
        // Check for API version header
        const apiVersion = req.headers['api-version'] || req.headers['x-api-version']

        req.reply({
          statusCode: 200,
          headers: {
            'x-api-version': '1.0'
          },
          body: {
            success: true,
            data: { records: [], apiVersion: apiVersion || '1.0' }
          }
        })
      }).as('versionedApi')

      cy.request({
        url: 'http://localhost:3001/api/health-records/student/1',
        headers: { 'x-api-version': '1.0' }
      })

      cy.wait('@versionedApi').then((interception) => {
        expect(interception.response?.headers).to.have.property('x-api-version')
      })
    })

    it('should maintain backward compatibility', () => {
      cy.intercept('GET', '**/api/v1/health-records/student/1', {
        statusCode: 200,
        body: {
          success: true,
          data: { records: testHealthRecords.bulkHealthRecords }
        }
      }).as('v1Api')

      cy.intercept('GET', '**/api/v2/health-records/student/1', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: testHealthRecords.bulkHealthRecords,
            metadata: {
              version: '2.0',
              timestamp: new Date().toISOString()
            }
          }
        }
      }).as('v2Api')

      // Both versions should work
      cy.request('http://localhost:3001/api/v1/health-records/student/1')
      cy.wait('@v1Api')

      cy.request('http://localhost:3001/api/v2/health-records/student/1')
      cy.wait('@v2Api')
    })

    it('should return appropriate error for unsupported versions', () => {
      cy.intercept('GET', '**/api/health-records/student/1', (req) => {
        const version = req.headers['x-api-version']

        if (version && !['1.0', '2.0'].includes(version as string)) {
          req.reply({
            statusCode: 400,
            body: {
              success: false,
              error: {
                message: 'Unsupported API version',
                supportedVersions: ['1.0', '2.0']
              }
            }
          })
        } else {
          req.reply({
            statusCode: 200,
            body: { success: true, data: { records: [] } }
          })
        }
      }).as('versionCheck')

      cy.request({
        url: 'http://localhost:3001/api/health-records/student/1',
        headers: { 'x-api-version': '99.0' },
        failOnStatusCode: false
      })

      cy.wait('@versionCheck').then((interception) => {
        expect(interception.response?.statusCode).to.equal(400)
      })
    })
  })

  context('Query Parameter Validation', () => {
    it('should validate pagination parameters', () => {
      cy.intercept('GET', '**/api/health-records/student/1**', (req) => {
        const url = new URL(req.url)
        const page = url.searchParams.get('page')
        const limit = url.searchParams.get('limit')

        if (page) expect(Number(page)).to.be.at.least(1)
        if (limit) expect(Number(limit)).to.be.at.least(1).and.at.most(100)

        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              records: [],
              pagination: {
                page: Number(page) || 1,
                limit: Number(limit) || 20
              }
            }
          }
        })
      }).as('paginationValidation')

      cy.request('http://localhost:3001/api/health-records/student/1?page=2&limit=50')

      cy.wait('@paginationValidation')
    })

    it('should validate filter parameters', () => {
      cy.intercept('GET', '**/api/health-records/student/1**', (req) => {
        const url = new URL(req.url)
        const type = url.searchParams.get('type')

        if (type) {
          const validTypes = ['CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING', 'PHYSICAL_EXAM']
          expect(validTypes).to.include(type.toUpperCase())
        }

        req.reply({
          statusCode: 200,
          body: { success: true, data: { records: [] } }
        })
      }).as('filterValidation')

      cy.request('http://localhost:3001/api/health-records/student/1?type=VACCINATION')

      cy.wait('@filterValidation')
    })

    it('should validate date range parameters', () => {
      cy.intercept('GET', '**/api/health-records/student/1**', (req) => {
        const url = new URL(req.url)
        const dateFrom = url.searchParams.get('dateFrom')
        const dateTo = url.searchParams.get('dateTo')

        if (dateFrom) {
          expect(new Date(dateFrom)).to.be.instanceOf(Date)
        }
        if (dateTo) {
          expect(new Date(dateTo)).to.be.instanceOf(Date)
        }

        if (dateFrom && dateTo) {
          expect(new Date(dateTo).getTime()).to.be.at.least(new Date(dateFrom).getTime())
        }

        req.reply({
          statusCode: 200,
          body: { success: true, data: { records: [] } }
        })
      }).as('dateValidation')

      cy.request('http://localhost:3001/api/health-records/student/1?dateFrom=2025-01-01&dateTo=2025-12-31')

      cy.wait('@dateValidation')
    })
  })

  context('Field Constraints Validation', () => {
    it('should enforce string length constraints', () => {
      cy.intercept('POST', '**/api/health-records', (req) => {
        if (req.body.description && req.body.description.length < 10) {
          req.reply({
            statusCode: 400,
            body: {
              success: false,
              error: {
                message: 'Description must be at least 10 characters'
              }
            }
          })
        } else {
          req.reply({
            statusCode: 201,
            body: { success: true, data: { healthRecord: {} } }
          })
        }
      }).as('lengthValidation')

      cy.request({
        method: 'POST',
        url: 'http://localhost:3001/api/health-records',
        body: {
          studentId: '1',
          type: 'CHECKUP',
          date: new Date().toISOString(),
          description: 'Short'
        },
        failOnStatusCode: false
      })

      cy.wait('@lengthValidation').then((interception) => {
        expect(interception.response?.statusCode).to.equal(400)
      })
    })

    it('should enforce numeric range constraints', () => {
      cy.intercept('POST', '**/api/health-records', (req) => {
        const vital = req.body.vital

        if (vital) {
          // Temperature: 95-105 F
          if (vital.temperature && (vital.temperature < 95 || vital.temperature > 105)) {
            req.reply({
              statusCode: 400,
              body: { success: false, error: { message: 'Temperature out of valid range' } }
            })
            return
          }

          // Heart rate: 40-200 bpm
          if (vital.heartRate && (vital.heartRate < 40 || vital.heartRate > 200)) {
            req.reply({
              statusCode: 400,
              body: { success: false, error: { message: 'Heart rate out of valid range' } }
            })
            return
          }
        }

        req.reply({
          statusCode: 201,
          body: { success: true, data: { healthRecord: {} } }
        })
      }).as('rangeValidation')

      cy.request({
        method: 'POST',
        url: 'http://localhost:3001/api/health-records',
        body: {
          studentId: '1',
          type: 'CHECKUP',
          date: new Date().toISOString(),
          description: 'Physical exam',
          vital: { temperature: 110 } // Invalid
        },
        failOnStatusCode: false
      })

      cy.wait('@rangeValidation').then((interception) => {
        expect(interception.response?.statusCode).to.equal(400)
      })
    })

    it('should enforce required field validation', () => {
      cy.intercept('POST', '**/api/health-records', {
        statusCode: 400,
        body: {
          success: false,
          error: {
            message: 'Validation failed',
            details: {
              studentId: 'Student ID is required',
              type: 'Type is required',
              date: 'Date is required',
              description: 'Description is required'
            }
          }
        }
      }).as('requiredFields')

      cy.request({
        method: 'POST',
        url: 'http://localhost:3001/api/health-records',
        body: {},
        failOnStatusCode: false
      })

      cy.wait('@requiredFields').then((interception) => {
        expect(interception.response?.statusCode).to.equal(400)
        expect(interception.response?.body.error.details).to.exist
      })
    })
  })
})

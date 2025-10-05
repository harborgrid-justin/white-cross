/// <reference types="cypress" />

/**
 * API Integration Testing E2E Tests
 * White Cross Healthcare Management System
 *
 * This test suite validates API endpoints, data flow, integration points,
 * and backend-frontend communication for healthcare data management.
 */

describe('API Integration Testing', () => {
  beforeEach(() => {
    cy.login('nurse')
  })

  context('API Endpoint Testing', () => {
    it('should test health records API endpoints', () => {
      // Test GET /api/health-records
      cy.request('GET', '/api/health-records').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('data')
        expect(response.body).to.have.property('pagination')
      })

      // Test POST /api/health-records
      cy.request('POST', '/api/health-records', {
        studentId: 'student-1',
        type: 'PHYSICAL_EXAM',
        date: '2024-10-01',
        description: 'API test record'
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('data')
      })

      // Test PUT /api/health-records/:id
      cy.request('PUT', '/api/health-records/record-1', {
        description: 'Updated via API test'
      }).then((response) => {
        expect(response.status).to.eq(200)
      })

      // Test DELETE /api/health-records/:id
      cy.request('DELETE', '/api/health-records/record-1').then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('should test medication API endpoints', () => {
      // Test GET /api/medications
      cy.request('GET', '/api/medications').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('medications')
        expect(response.body).to.have.property('pagination')
      })

      // Test POST /api/medications
      cy.request('POST', '/api/medications', {
        name: 'API Test Medication',
        dosage: '10mg',
        frequency: 'twice daily',
        studentId: 'student-1'
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('medication')
      })
    })

    it('should test student API endpoints', () => {
      // Test GET /api/students
      cy.request('GET', '/api/students').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.be.an('array')
      })

      // Test GET /api/students/:id
      cy.request('GET', '/api/students/student-1').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('student')
      })
    })

    it('should test appointment API endpoints', () => {
      // Test GET /api/appointments
      cy.request('GET', '/api/appointments').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('appointments')
      })

      // Test POST /api/appointments
      cy.request('POST', '/api/appointments', {
        studentId: 'student-1',
        type: 'CHECKUP',
        date: '2024-10-15',
        time: '10:00'
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('appointment')
      })
    })

    it('should test incident reports API endpoints', () => {
      // Test GET /api/incidents
      cy.request('GET', '/api/incidents').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('incidents')
      })

      // Test POST /api/incidents
      cy.request('POST', '/api/incidents', {
        studentId: 'student-1',
        type: 'MEDICAL',
        description: 'API test incident',
        severity: 'MINOR'
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('incident')
      })
    })
  })

  context('API Authentication and Authorization', () => {
    it('should require authentication for protected endpoints', () => {
      // Test without authentication token
      cy.request({
        url: '/api/health-records',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401)
        expect(response.body).to.have.property('error')
      })
    })

    it('should enforce role-based API access control', () => {
      // Test admin-only endpoint as regular user
      cy.request({
        url: '/api/admin/users',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(403)
        expect(response.body).to.have.property('error')
      })
    })

    it('should handle API token expiration', () => {
      // Simulate expired token
      cy.request({
        url: '/api/health-records',
        headers: {
          'Authorization': 'Bearer expired-token'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(401)
        expect(response.body).to.have.property('error')
      })
    })

    it('should support API rate limiting', () => {
      // Make multiple rapid requests
      for (let i = 0; i < 10; i++) {
        cy.request('GET', '/api/students')
      }

      // Next request should be rate limited
      cy.request({
        url: '/api/students',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(429)
        expect(response.headers).to.have.property('x-ratelimit-remaining')
      })
    })
  })

  context('API Data Flow and Integration', () => {
    it('should handle real-time data synchronization', () => {
      cy.visit('/dashboard')

      // Monitor WebSocket connection for real-time updates
      cy.window().then((win) => {
        const wsConnection = new WebSocket('ws://localhost:3000/ws')

        wsConnection.onopen = () => {
          expect(wsConnection.readyState).to.eq(WebSocket.OPEN)
        }

        wsConnection.onmessage = (event) => {
          const data = JSON.parse(event.data)
          expect(data).to.have.property('type')
          expect(data).to.have.property('data')
        }
      })
    })

    it('should handle API response caching', () => {
      // First request
      cy.request('GET', '/api/students?page=1&limit=10').then((response1) => {
        expect(response1.status).to.eq(200)
        expect(response1.headers).to.have.property('cache-control')
      })

      // Second identical request should use cache
      cy.request('GET', '/api/students?page=1&limit=10').then((response2) => {
        expect(response2.status).to.eq(200)
        expect(response2.headers).to.have.property('x-cache', 'HIT')
      })
    })

    it('should handle API pagination correctly', () => {
      // Test pagination parameters
      cy.request('GET', '/api/health-records?page=1&limit=5').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.data).to.have.length(5)
        expect(response.body.pagination).to.have.property('page', 1)
        expect(response.body.pagination).to.have.property('limit', 5)
        expect(response.body.pagination).to.have.property('total')
        expect(response.body.pagination).to.have.property('pages')
      })

      // Test next page
      cy.request('GET', '/api/health-records?page=2&limit=5').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.pagination).to.have.property('page', 2)
      })
    })

    it('should handle API filtering and sorting', () => {
      // Test filtering
      cy.request('GET', '/api/health-records?type=PHYSICAL_EXAM').then((response) => {
        expect(response.status).to.eq(200)
        response.body.data.forEach((record: any) => {
          expect(record.type).to.eq('PHYSICAL_EXAM')
        })
      })

      // Test sorting
      cy.request('GET', '/api/students?sort=lastName&order=asc').then((response) => {
        expect(response.status).to.eq(200)
        // Verify sorting order
        const students = response.body.data
        for (let i = 1; i < students.length; i++) {
          expect(students[i].lastName.localeCompare(students[i-1].lastName)).to.be.greaterThanOrEqual(0)
        }
      })
    })
  })

  context('API Error Handling', () => {
    it('should handle API validation errors', () => {
      cy.request({
        url: '/api/health-records',
        method: 'POST',
        body: {
          // Missing required fields
          description: 'Invalid record'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('errors')
        expect(response.body.errors).to.be.an('array')
      })
    })

    it('should handle API not found errors', () => {
      cy.request({
        url: '/api/health-records/non-existent-id',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body).to.have.property('error')
      })
    })

    it('should handle API server errors', () => {
      // Simulate server error
      cy.intercept('/api/medications', {
        statusCode: 500,
        body: { error: 'Internal server error' }
      })

      cy.request({
        url: '/api/medications',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(500)
        expect(response.body).to.have.property('error')
      })
    })

    it('should handle API timeout errors', () => {
      // Simulate slow API response
      cy.intercept('/api/reports/*', (req) => {
        req.reply({
          delay: 10000,
          statusCode: 408,
          body: { error: 'Request timeout' }
        })
      })

      cy.request({
        url: '/api/reports/health-summary',
        timeout: 5000,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(408)
      })
    })
  })

  context('API Data Consistency', () => {
    it('should maintain data consistency across API calls', () => {
      let createdRecordId: string

      // Create a record
      cy.request('POST', '/api/health-records', {
        studentId: 'student-1',
        type: 'PHYSICAL_EXAM',
        date: '2024-10-01',
        description: 'Consistency test record'
      }).then((createResponse) => {
        expect(createResponse.status).to.eq(201)
        createdRecordId = createResponse.body.data.id

        // Retrieve the same record
        cy.request('GET', `/api/health-records/${createdRecordId}`).then((getResponse) => {
          expect(getResponse.status).to.eq(200)
          expect(getResponse.body.student.id).to.eq('student-1')
          expect(getResponse.body.type).to.eq('PHYSICAL_EXAM')
        })
      })
    })

    it('should handle concurrent API operations', () => {
      const promises = []

      // Create multiple records concurrently
      for (let i = 0; i < 5; i++) {
        promises.push(
          cy.request('POST', '/api/health-records', {
            studentId: `student-${i}`,
            type: 'PHYSICAL_EXAM',
            date: '2024-10-01',
            description: `Concurrent test record ${i}`
          })
        )
      }

      cy.wrap(Promise.all(promises)).then((responses) => {
        responses.forEach((response) => {
          expect(response.status).to.eq(201)
        })
      })
    })

    it('should validate API response data structure', () => {
      cy.request('GET', '/api/students').then((response) => {
        expect(response.status).to.eq(200)

        // Validate response structure
        expect(response.body).to.have.property('data')
        expect(response.body).to.have.property('pagination')
        expect(response.body.data).to.be.an('array')
        expect(response.body.pagination).to.have.property('page')
        expect(response.body.pagination).to.have.property('limit')
        expect(response.body.pagination).to.have.property('total')
      })
    })
  })

  context('API Performance and Monitoring', () => {
    it('should monitor API response times', () => {
      const startTime = Date.now()

      cy.request('GET', '/api/health-records').then((response) => {
        const responseTime = Date.now() - startTime
        expect(responseTime).to.be.lessThan(2000) // API should respond within 2 seconds
        expect(response.status).to.eq(200)
      })
    })

    it('should handle API load testing', () => {
      const requests = []

      // Generate multiple concurrent requests
      for (let i = 0; i < 20; i++) {
        requests.push(cy.request('GET', '/api/students'))
      }

      cy.wrap(Promise.all(requests)).then((responses) => {
        responses.forEach((response) => {
          expect(response.status).to.eq(200)
        })
      })
    })

    it('should track API usage metrics', () => {
      cy.request('GET', '/api/admin/api-metrics').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('metrics')

        const metrics = response.body.metrics
        expect(metrics).to.have.property('totalRequests')
        expect(metrics).to.have.property('averageResponseTime')
        expect(metrics).to.have.property('errorRate')
      })
    })
  })

  context('API Security Testing', () => {
    it('should prevent SQL injection attacks', () => {
      const maliciousInput = "'; DROP TABLE health_records; --"

      cy.request({
        url: '/api/health-records',
        qs: { search: maliciousInput },
        failOnStatusCode: false
      }).then((response) => {
        // Should not execute malicious SQL
        expect(response.status).to.not.eq(500)
        expect(response.body).to.not.have.property('sqlError')
      })
    })

    it('should prevent XSS attacks via API', () => {
      const xssPayload = '<script>alert("xss")</script>'

      cy.request({
        url: '/api/health-records',
        method: 'POST',
        body: {
          studentId: 'student-1',
          type: 'PHYSICAL_EXAM',
          description: xssPayload
        },
        failOnStatusCode: false
      }).then((response) => {
        if (response.status === 201) {
          // If record is created, verify XSS is sanitized
          cy.request('GET', `/api/health-records/${response.body.data.id}`).then((getResponse) => {
            expect(getResponse.body.description).to.not.contain('<script>')
          })
        }
      })
    })

    it('should enforce API input validation', () => {
      cy.request({
        url: '/api/health-records',
        method: 'POST',
        body: {
          // Invalid data types
          studentId: 123, // Should be string
          type: 'INVALID_TYPE',
          date: 'invalid-date'
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('errors')
      })
    })

    it('should protect against API abuse', () => {
      // Test rapid API calls
      const rapidRequests = []
      for (let i = 0; i < 100; i++) {
        rapidRequests.push(cy.request('GET', '/api/students'))
      }

      cy.wrap(Promise.all(rapidRequests)).then((responses) => {
        const successResponses = responses.filter(r => r.status === 200)
        const rateLimitedResponses = responses.filter(r => r.status === 429)

        // Should have mostly successful responses
        expect(successResponses.length).to.be.greaterThan(rateLimitedResponses.length)
      })
    })
  })

  context('API Integration Points', () => {
    it('should integrate with external healthcare systems', () => {
      // Test EHR system integration
      cy.request('GET', '/api/integrations/ehr/status').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('connected')
        expect(response.body).to.have.property('lastSync')
      })

      // Test pharmacy system integration
      cy.request('GET', '/api/integrations/pharmacy/status').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('connected')
      })
    })

    it('should handle third-party API failures gracefully', () => {
      // Simulate external API failure
      cy.intercept('GET', '/api/external/ehr/patients', {
        statusCode: 503,
        body: { error: 'External service unavailable' }
      })

      cy.request({
        url: '/api/health-records/sync',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(200) // Should handle gracefully
        expect(response.body).to.have.property('syncStatus')
      })
    })

    it('should maintain API version compatibility', () => {
      // Test API versioning
      cy.request('GET', '/api/v1/health-records').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.headers).to.have.property('api-version', 'v1')
      })

      // Test version headers
      cy.request({
        url: '/api/health-records',
        headers: {
          'Accept': 'application/vnd.healthsystem.v2+json'
        }
      }).then((response) => {
        expect(response.headers).to.have.property('api-version', 'v2')
      })
    })
  })

  context('API Documentation and Testing', () => {
    it('should provide API documentation access', () => {
      cy.visit('/api-docs')

      cy.get('[data-cy=api-docs-container]').should('be.visible')
      cy.get('[data-cy=api-endpoint-list]').should('be.visible')
      cy.get('[data-cy=api-try-it-buttons]').should('be.visible')
    })

    it('should allow interactive API testing', () => {
      cy.visit('/api-docs')

      cy.get('[data-cy=api-try-it-button]').first().click()
      cy.get('[data-cy=api-test-interface]').should('be.visible')

      cy.get('[data-cy=api-request-body]').type('{"test": "data"}')
      cy.get('[data-cy=send-api-request]').click()
      cy.get('[data-cy=api-response]').should('be.visible')
    })

    it('should validate API schema compliance', () => {
      cy.request('GET', '/api/schema').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('openapi')
        expect(response.body).to.have.property('info')
        expect(response.body).to.have.property('paths')
      })
    })
  })

  context('Real-time API Communication', () => {
    it('should handle WebSocket API connections', () => {
      cy.visit('/dashboard')

      cy.window().then((win) => {
        const ws = new WebSocket('ws://localhost:3000/api/ws')

        ws.onopen = () => {
          expect(ws.readyState).to.eq(WebSocket.OPEN)

          // Send test message
          ws.send(JSON.stringify({
            type: 'subscribe',
            channel: 'health-updates'
          }))
        }

        ws.onmessage = (event) => {
          const message = JSON.parse(event.data)
          expect(message).to.have.property('type')
          expect(message).to.have.property('data')
        }
      })
    })

    it('should handle Server-Sent Events (SSE)', () => {
      cy.request('GET', '/api/events/stream').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.headers).to.have.property('content-type')
        expect(response.headers['content-type']).to.contain('text/event-stream')
      })
    })

    it('should manage real-time data synchronization', () => {
      cy.visit('/dashboard')

      // Monitor real-time updates
      cy.get('[data-cy=real-time-updates-indicator]').should('be.visible')
      cy.get('[data-cy=last-sync-timestamp]').should('be.visible')

      // Trigger data change
      cy.request('POST', '/api/test/trigger-update').then(() => {
        cy.get('[data-cy=real-time-update-received]').should('be.visible')
      })
    })
  })

  context('API Data Transformation', () => {
    it('should handle data format conversion', () => {
      // Request JSON format
      cy.request({
        url: '/api/health-records',
        headers: {
          'Accept': 'application/json'
        }
      }).then((response) => {
        expect(response.headers['content-type']).to.contain('application/json')
        expect(response.body).to.be.an('object')
      })

      // Request XML format
      cy.request({
        url: '/api/health-records',
        headers: {
          'Accept': 'application/xml'
        }
      }).then((response) => {
        expect(response.headers['content-type']).to.contain('application/xml')
      })
    })

    it('should handle API response pagination', () => {
      // Test pagination links
      cy.request('GET', '/api/health-records?page=1&limit=5').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.pagination).to.have.property('next')
        expect(response.body.pagination).to.have.property('prev')
        expect(response.body.pagination).to.have.property('first')
        expect(response.body.pagination).to.have.property('last')
      })
    })

    it('should handle API field filtering', () => {
      cy.request('GET', '/api/students?fields=id,firstName,lastName').then((response) => {
        expect(response.status).to.eq(200)

        response.body.data.forEach((student: any) => {
          expect(student).to.have.property('id')
          expect(student).to.have.property('firstName')
          expect(student).to.have.property('lastName')
          expect(student).to.not.have.property('email')
          expect(student).to.not.have.property('phone')
        })
      })
    })
  })

  context('API Monitoring and Analytics', () => {
    it('should track API usage statistics', () => {
      cy.request('GET', '/api/admin/api-analytics').then((response) => {
        expect(response.status).to.eq(200)

        const analytics = response.body
        expect(analytics).to.have.property('endpointUsage')
        expect(analytics).to.have.property('responseTimeMetrics')
        expect(analytics).to.have.property('errorRates')
        expect(analytics).to.have.property('userActivity')
      })
    })

    it('should monitor API health and performance', () => {
      cy.request('GET', '/api/admin/health').then((response) => {
        expect(response.status).to.eq(200)

        const health = response.body
        expect(health).to.have.property('status')
        expect(health).to.have.property('uptime')
        expect(health).to.have.property('responseTime')
        expect(health).to.have.property('database')
        expect(health).to.have.property('integrations')
      })
    })

    it('should provide API access logs', () => {
      cy.request('GET', '/api/admin/access-logs').then((response) => {
        expect(response.status).to.eq(200)

        const logs = response.body
        expect(logs).to.have.property('logs')
        expect(logs.logs).to.be.an('array')

        logs.logs.forEach((log: any) => {
          expect(log).to.have.property('timestamp')
          expect(log).to.have.property('endpoint')
          expect(log).to.have.property('method')
          expect(log).to.have.property('statusCode')
          expect(log).to.have.property('responseTime')
        })
      })
    })
  })

  context('Cross-Platform API Compatibility', () => {
    it('should support different API client libraries', () => {
      // Test with different content types
      cy.request({
        url: '/api/health-records',
        headers: {
          'User-Agent': 'TestClient/1.0',
          'Accept': 'application/json'
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('should handle different API versions gracefully', () => {
      // Test v1 API
      cy.request('GET', '/api/v1/health-records').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.headers).to.have.property('api-version', 'v1')
      })

      // Test v2 API
      cy.request('GET', '/api/v2/health-records').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.headers).to.have.property('api-version', 'v2')
      })
    })

    it('should support API internationalization', () => {
      cy.request({
        url: '/api/health-records',
        headers: {
          'Accept-Language': 'es-ES'
        }
      }).then((response) => {
        expect(response.status).to.eq(200)
        // Response should respect language preferences
      })
    })
  })

  context('API Error Recovery and Resilience', () => {
    it('should implement circuit breaker pattern', () => {
      // Simulate multiple API failures
      for (let i = 0; i < 5; i++) {
        cy.request({
          url: '/api/test/fail-endpoint',
          failOnStatusCode: false
        })
      }

      // Circuit should be open
      cy.request({
        url: '/api/test/fail-endpoint',
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(503) // Service unavailable
      })
    })

    it('should handle partial API failures gracefully', () => {
      // Test with partially failing external service
      cy.request('GET', '/api/test/partial-failure').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('partialData')
        expect(response.body).to.have.property('failedServices')
      })
    })

    it('should implement API retry mechanisms', () => {
      let attempts = 0

      cy.intercept('/api/test/flaky-endpoint', (req) => {
        attempts++
        if (attempts < 3) {
          req.reply({ statusCode: 500 })
        } else {
          req.reply({ statusCode: 200, body: { success: true } })
        }
      })

      cy.request('GET', '/api/test/flaky-endpoint').then((response) => {
        expect(response.status).to.eq(200)
        expect(attempts).to.be.greaterThan(1) // Should have retried
      })
    })
  })
})

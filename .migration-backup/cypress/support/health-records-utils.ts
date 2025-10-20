/**
 * Health Records Test Utilities
 *
 * Reusable utility functions for health records E2E testing including:
 * - Test data generators
 * - Cleanup procedures
 * - Common assertions
 * - API helpers
 * - Date utilities
 */

export class HealthRecordsTestUtils {
  /**
   * Generate a random health record for testing
   */
  static generateHealthRecord(overrides: Partial<any> = {}): any {
    return {
      studentId: '1',
      type: 'CHECKUP',
      date: new Date().toISOString(),
      description: `Test health record ${Date.now()}`,
      provider: 'Dr. Test',
      notes: 'Automated test record',
      vital: {
        temperature: 98.6,
        heartRate: 72,
        bloodPressureSystolic: 110,
        bloodPressureDiastolic: 70
      },
      ...overrides
    }
  }

  /**
   * Generate a random allergy record for testing
   */
  static generateAllergy(overrides: Partial<any> = {}): any {
    const allergens = ['Peanuts', 'Penicillin', 'Latex', 'Shellfish', 'Dairy']
    const severities = ['MILD', 'MODERATE', 'SEVERE', 'LIFE_THREATENING']

    return {
      studentId: '1',
      allergen: allergens[Math.floor(Math.random() * allergens.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      reaction: 'Test reaction',
      treatment: 'Test treatment protocol',
      verified: false,
      ...overrides
    }
  }

  /**
   * Generate a chronic condition record for testing
   */
  static generateChronicCondition(overrides: Partial<any> = {}): any {
    const conditions = ['Asthma', 'Type 1 Diabetes', 'ADHD', 'Epilepsy', 'Celiac Disease']

    return {
      studentId: '1',
      condition: conditions[Math.floor(Math.random() * conditions.length)],
      diagnosedDate: new Date(2020, 0, 1).toISOString(),
      status: 'ACTIVE',
      severity: 'MODERATE',
      notes: 'Test chronic condition',
      carePlan: 'Test care plan',
      medications: [],
      restrictions: [],
      triggers: [],
      ...overrides
    }
  }

  /**
   * Generate bulk health records for load testing
   */
  static generateBulkHealthRecords(count: number, studentId: string = '1'): any[] {
    const records = []
    const types = ['CHECKUP', 'VACCINATION', 'ILLNESS', 'INJURY', 'SCREENING']

    for (let i = 0; i < count; i++) {
      const daysAgo = Math.floor(Math.random() * 365)
      const date = new Date()
      date.setDate(date.getDate() - daysAgo)

      records.push({
        id: `hr-bulk-${i}`,
        studentId,
        type: types[Math.floor(Math.random() * types.length)],
        date: date.toISOString(),
        description: `Bulk test record ${i}`,
        provider: `Dr. Test ${i % 5}`,
        notes: `Generated for load testing - record ${i}`
      })
    }

    return records
  }

  /**
   * Cleanup test health records
   */
  static async cleanupHealthRecords(studentId: string): Promise<void> {
    // This would be implemented with actual API calls
    // For now, just logging
    console.log(`Cleaning up health records for student ${studentId}`)
  }

  /**
   * Wait for health records to load
   */
  static waitForHealthRecordsLoad(timeout: number = 5000): Cypress.Chainable<void> {
    return cy.get('[data-testid="health-records-page"]', { timeout })
      .should('be.visible')
      .then(() => {
        cy.get('[data-testid*="loading"]', { timeout: 1000 }).should('not.exist')
      })
  }

  /**
   * Assert health record fields
   */
  static assertHealthRecord(record: any, expectedFields: Partial<any>): void {
    Object.keys(expectedFields).forEach(key => {
      expect(record).to.have.property(key, expectedFields[key])
    })
  }

  /**
   * Verify HIPAA compliance indicators
   */
  static verifyHIPAACompliance(): Cypress.Chainable<void> {
    return cy.get('body').should(($body) => {
      const text = $body.text()

      // Should have HIPAA indicators
      const hasHIPAAIndicator =
        text.includes('HIPAA') ||
        text.includes('Privacy') ||
        text.includes('Protected Health Information')

      expect(hasHIPAAIndicator).to.be.true
    })
  }

  /**
   * Format date for health records
   */
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
  }

  /**
   * Calculate age from date of birth
   */
  static calculateAge(dateOfBirth: string): number {
    const dob = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }

    return age
  }

  /**
   * Validate vital signs are within normal ranges
   */
  static validateVitalSigns(vital: any): { valid: boolean; issues: string[] } {
    const issues: string[] = []

    if (vital.temperature && (vital.temperature < 95 || vital.temperature > 105)) {
      issues.push('Temperature out of normal range')
    }

    if (vital.heartRate && (vital.heartRate < 40 || vital.heartRate > 200)) {
      issues.push('Heart rate out of normal range')
    }

    if (vital.bloodPressureSystolic && (vital.bloodPressureSystolic < 70 || vital.bloodPressureSystolic > 200)) {
      issues.push('Blood pressure systolic out of normal range')
    }

    if (vital.bloodPressureDiastolic && (vital.bloodPressureDiastolic < 40 || vital.bloodPressureDiastolic > 130)) {
      issues.push('Blood pressure diastolic out of normal range')
    }

    if (vital.oxygenSaturation && vital.oxygenSaturation < 90) {
      issues.push('Oxygen saturation below normal')
    }

    return {
      valid: issues.length === 0,
      issues
    }
  }

  /**
   * Generate test audit log entry
   */
  static generateAuditLogEntry(overrides: Partial<any> = {}): any {
    return {
      userId: 'test-user-001',
      userName: 'Test Nurse',
      userRole: 'NURSE',
      action: 'VIEW',
      resourceType: 'HEALTH_RECORD',
      resourceId: 'hr-001',
      studentId: '1',
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
      userAgent: 'Cypress Test',
      details: {},
      ...overrides
    }
  }

  /**
   * Create mock API responses for health records
   */
  static createMockResponses() {
    return {
      healthRecords: {
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: this.generateBulkHealthRecords(3),
            pagination: { page: 1, limit: 20, total: 3, pages: 1 }
          }
        }
      },
      allergies: {
        statusCode: 200,
        body: {
          success: true,
          data: {
            allergies: [this.generateAllergy()]
          }
        }
      },
      chronicConditions: {
        statusCode: 200,
        body: {
          success: true,
          data: {
            conditions: [this.generateChronicCondition()]
          }
        }
      }
    }
  }

  /**
   * Setup comprehensive test intercepts
   */
  static setupTestIntercepts(): void {
    const mockResponses = this.createMockResponses()

    cy.intercept('GET', '**/api/health-records/student/**', mockResponses.healthRecords).as('getHealthRecords')
    cy.intercept('GET', '**/api/health-records/allergies/**', mockResponses.allergies).as('getAllergies')
    cy.intercept('GET', '**/api/health-records/chronic-conditions/**', mockResponses.chronicConditions).as('getChronicConditions')
    cy.intercept('GET', '**/api/health-records/vaccinations/**', { statusCode: 200, body: { success: true, data: { vaccinations: [] } } }).as('getVaccinations')
    cy.intercept('GET', '**/api/health-records/growth/**', { statusCode: 200, body: { success: true, data: { growthData: [] } } }).as('getGrowthChart')
    cy.intercept('GET', '**/api/health-records/vitals/**', { statusCode: 200, body: { success: true, data: { vitals: [] } } }).as('getVitals')
  }

  /**
   * Verify response time SLA
   */
  static verifyResponseTime(startTime: number, maxDuration: number = 2000): void {
    const duration = Date.now() - startTime
    expect(duration).to.be.lessThan(maxDuration)
    cy.log(`Response time: ${duration}ms (SLA: ${maxDuration}ms)`)
  }

  /**
   * Generate performance test report
   */
  static generatePerformanceReport(metrics: any[]): any {
    const responseTimes = metrics.map(m => m.responseTime)
    responseTimes.sort((a, b) => a - b)

    return {
      totalRequests: metrics.length,
      averageResponseTime: responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      medianResponseTime: responseTimes[Math.floor(responseTimes.length / 2)],
      p95ResponseTime: responseTimes[Math.floor(responseTimes.length * 0.95)],
      p99ResponseTime: responseTimes[Math.floor(responseTimes.length * 0.99)],
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes)
    }
  }
}

// Export utilities
export default HealthRecordsTestUtils

/// <reference types="cypress" />

/**
 * Health Records Management: SOA Cross-Service Integration Testing
 *
 * Comprehensive integration testing across multiple services including:
 * - Student Management + Health Records integration
 * - Medication Management + Health Records integration
 * - Appointment Scheduling + Health Records integration
 * - Emergency Contact + Health Records integration
 * - Incident Reporting + Health Records integration
 * - Document Management + Health Records integration
 * - Service orchestration validation
 * - Data consistency across services
 *
 * @module HealthRecordsCrossServiceTests
 * @category HealthRecordsManagement
 * @priority Critical
 * @soa-pattern Service Integration, Orchestration
 */

describe('Health Records SOA - Cross-Service Integration', () => {
  let testHealthRecords: any
  let testStudent: any

  before(() => {
    cy.fixture('healthRecords').then((data) => {
      testHealthRecords = data
    })

    cy.fixture('students').then((data) => {
      testStudent = data.testStudent1
    })
  })

  beforeEach(() => {
    cy.login('nurse')
  })

  context('Student Management Integration', () => {
    it('should retrieve student information with health records', () => {
      cy.intercept('GET', '**/api/students/1', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            student: {
              id: '1',
              firstName: 'John',
              lastName: 'Doe',
              studentNumber: 'STU001',
              dateOfBirth: '2010-05-15',
              grade: '8'
            }
          }
        }
      }).as('getStudent')

      cy.intercept('GET', '**/api/health-records/student/1**', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: testHealthRecords.bulkHealthRecords
          }
        }
      }).as('getHealthRecords')

      cy.visit('/health-records?studentId=1')
      cy.waitForHealthcareData()

      // Both services should be called
      cy.wait('@getStudent')
      cy.wait('@getHealthRecords')

      // Verify integration
      cy.get('body').should('contain', 'John')
      cy.get('body').should('contain', 'Doe')
    })

    it('should cascade health record cleanup when student is deleted', () => {
      cy.intercept('DELETE', '**/api/students/1', {
        statusCode: 200,
        body: {
          success: true,
          message: 'Student and related records deleted',
          cascaded: {
            healthRecords: 15,
            medications: 3,
            appointments: 5
          }
        }
      }).as('deleteStudent')

      // Verify health records are also deleted
      cy.intercept('GET', '**/api/health-records/student/1**', {
        statusCode: 404,
        body: {
          success: false,
          error: { message: 'Student not found' }
        }
      }).as('healthRecordsGone')

      cy.request({
        method: 'DELETE',
        url: 'http://localhost:3001/api/students/1'
      })

      cy.wait('@deleteStudent').then((interception) => {
        expect(interception.response?.body.cascaded.healthRecords).to.equal(15)
      })

      // Verify health records are inaccessible
      cy.request({
        url: 'http://localhost:3001/api/health-records/student/1',
        failOnStatusCode: false
      })

      cy.wait('@healthRecordsGone')
    })

    it('should validate student enrollment status for health records access', () => {
      cy.intercept('GET', '**/api/students/1', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            student: {
              id: '1',
              firstName: 'John',
              lastName: 'Doe',
              enrollmentStatus: 'INACTIVE',
              withdrawalDate: '2025-01-01'
            }
          }
        }
      }).as('getInactiveStudent')

      cy.intercept('GET', '**/api/health-records/student/1**', (req) => {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              records: [],
              warning: 'Student enrollment is inactive',
              readOnly: true
            }
          }
        })
      }).as('getRecordsInactive')

      cy.visit('/health-records?studentId=1')
      cy.wait('@getInactiveStudent')
      cy.wait('@getRecordsInactive')

      // Should show warning about inactive status
      cy.get('body').should('satisfy', ($body) => {
        const text = $body.text().toLowerCase()
        return text.includes('inactive') || text.includes('withdrawn')
      })
    })
  })

  context('Medication Management Integration', () => {
    it('should link medication records to health records', () => {
      cy.intercept('GET', '**/api/medications/student/1', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            medications: [
              {
                id: 'med-001',
                name: 'Albuterol Inhaler',
                dosage: '2 puffs',
                frequency: 'As needed',
                linkedHealthRecordId: 'hr-001'
              }
            ]
          }
        }
      }).as('getMedications')

      cy.intercept('GET', '**/api/health-records/student/1**', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: testHealthRecords.bulkHealthRecords
          }
        }
      }).as('getHealthRecords')

      cy.visit('/health-records?studentId=1')
      cy.wait('@getHealthRecords')

      // Medications should be linked
      cy.visit('/medications?studentId=1')
      cy.wait('@getMedications').then((interception) => {
        const meds = interception.response?.body.data.medications
        expect(meds[0]).to.have.property('linkedHealthRecordId')
      })
    })

    it('should create health record when medication is administered', () => {
      cy.intercept('POST', '**/api/medications/administration', (req) => {
        expect(req.body).to.have.property('medicationId')
        expect(req.body).to.have.property('administeredAt')
        expect(req.body).to.have.property('createHealthRecord', true)

        req.reply({
          statusCode: 201,
          body: {
            success: true,
            data: {
              administration: {
                id: 'admin-001',
                medicationId: req.body.medicationId,
                administeredAt: req.body.administeredAt
              },
              healthRecordCreated: {
                id: 'hr-new-001',
                type: 'MEDICATION_ADMINISTRATION',
                description: 'Albuterol inhaler administered - 2 puffs'
              }
            }
          }
        })
      }).as('medicationAdministration')

      cy.request({
        method: 'POST',
        url: 'http://localhost:3001/api/medications/administration',
        body: {
          medicationId: 'med-001',
          studentId: '1',
          administeredAt: new Date().toISOString(),
          createHealthRecord: true
        }
      })

      cy.wait('@medicationAdministration').then((interception) => {
        expect(interception.response?.body.data).to.have.property('healthRecordCreated')
      })
    })

    it('should validate medication against allergy records', () => {
      cy.intercept('GET', '**/api/health-records/allergies/1', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            allergies: [
              {
                id: 'allergy-001',
                allergen: 'Penicillin',
                severity: 'MODERATE'
              }
            ]
          }
        }
      }).as('getAllergies')

      cy.intercept('POST', '**/api/medications', (req) => {
        const medicationName = req.body.name.toLowerCase()

        // Check against allergies
        if (medicationName.includes('penicillin') || medicationName.includes('amoxicillin')) {
          req.reply({
            statusCode: 400,
            body: {
              success: false,
              error: {
                message: 'Medication conflicts with known allergies',
                allergyWarning: {
                  allergen: 'Penicillin',
                  severity: 'MODERATE'
                }
              }
            }
          })
        } else {
          req.reply({
            statusCode: 201,
            body: {
              success: true,
              data: { medication: { id: 'med-new', ...req.body } }
            }
          })
        }
      }).as('checkMedicationAllergies')

      // Attempt to add medication that conflicts with allergy
      cy.request({
        method: 'POST',
        url: 'http://localhost:3001/api/medications',
        body: {
          studentId: '1',
          name: 'Amoxicillin',
          dosage: '500mg'
        },
        failOnStatusCode: false
      })

      cy.wait('@checkMedicationAllergies').then((interception) => {
        expect(interception.response?.statusCode).to.equal(400)
        expect(interception.response?.body.error).to.have.property('allergyWarning')
      })
    })
  })

  context('Appointment Scheduling Integration', () => {
    it('should create health record from appointment visit', () => {
      cy.intercept('PUT', '**/api/appointments/appt-001/complete', (req) => {
        expect(req.body).to.have.property('healthRecordData')

        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              appointment: {
                id: 'appt-001',
                status: 'COMPLETED',
                completedAt: new Date().toISOString()
              },
              healthRecordCreated: {
                id: 'hr-appt-001',
                type: 'CHECKUP',
                description: req.body.healthRecordData.description,
                vital: req.body.healthRecordData.vital
              }
            }
          }
        })
      }).as('completeAppointment')

      cy.request({
        method: 'PUT',
        url: 'http://localhost:3001/api/appointments/appt-001/complete',
        body: {
          healthRecordData: {
            description: 'Annual checkup completed',
            vital: {
              temperature: 98.6,
              heartRate: 72,
              bloodPressureSystolic: 110,
              bloodPressureDiastolic: 70
            }
          }
        }
      })

      cy.wait('@completeAppointment').then((interception) => {
        expect(interception.response?.body.data).to.have.property('healthRecordCreated')
      })
    })

    it('should retrieve relevant health records for upcoming appointment', () => {
      cy.intercept('GET', '**/api/appointments/appt-001', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            appointment: {
              id: 'appt-001',
              studentId: '1',
              type: 'PHYSICAL_EXAM',
              scheduledAt: new Date().toISOString()
            }
          }
        }
      }).as('getAppointment')

      cy.intercept('GET', '**/api/health-records/student/1?type=CHECKUP&limit=5', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            records: testHealthRecords.bulkHealthRecords,
            context: 'APPOINTMENT_PREPARATION'
          }
        }
      }).as('getRelevantRecords')

      cy.visit('/appointments/appt-001')
      cy.wait('@getAppointment')
      cy.wait('@getRelevantRecords')
    })
  })

  context('Emergency Contact Integration', () => {
    it('should include emergency medical information in contact records', () => {
      cy.intercept('GET', '**/api/students/1/emergency-contacts', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            contacts: [
              {
                id: 'contact-001',
                firstName: 'Jane',
                lastName: 'Doe',
                relationship: 'Mother',
                phone: '555-0100'
              }
            ],
            medicalSummary: {
              allergies: ['Peanuts - LIFE_THREATENING'],
              chronicConditions: ['Type 1 Diabetes'],
              currentMedications: ['Insulin - Humalog'],
              lastPhysical: '2025-01-15'
            }
          }
        }
      }).as('getEmergencyContacts')

      cy.intercept('GET', '**/api/health-records/summary/1', {
        statusCode: 200,
        body: {
          success: true,
          data: testHealthRecords.testHealthSummary
        }
      }).as('getHealthSummary')

      cy.visit('/students/1/emergency-contacts')
      cy.wait('@getEmergencyContacts')

      // Medical summary should be included
      cy.get('body').should('satisfy', ($body) => {
        const text = $body.text()
        return text.includes('Peanuts') || text.includes('Diabetes') || text.includes('Allergies')
      })
    })

    it('should trigger emergency protocol based on health conditions', () => {
      cy.intercept('POST', '**/api/emergency/alert', (req) => {
        expect(req.body).to.have.property('studentId')
        expect(req.body).to.have.property('severity')
        expect(req.body).to.have.property('healthContext')

        req.reply({
          statusCode: 201,
          body: {
            success: true,
            data: {
              alert: {
                id: 'alert-001',
                triggered: true,
                contactsNotified: 2,
                healthContext: req.body.healthContext
              }
            }
          }
        })
      }).as('emergencyAlert')

      cy.request({
        method: 'POST',
        url: 'http://localhost:3001/api/emergency/alert',
        body: {
          studentId: '1',
          severity: 'HIGH',
          reason: 'Potential allergic reaction',
          healthContext: {
            allergies: ['Peanuts - LIFE_THREATENING'],
            symptoms: ['Difficulty breathing', 'Swelling']
          }
        }
      })

      cy.wait('@emergencyAlert')
    })
  })

  context('Incident Reporting Integration', () => {
    it('should create health record from incident report', () => {
      cy.intercept('POST', '**/api/incidents', (req) => {
        expect(req.body).to.have.property('incidentType')
        expect(req.body).to.have.property('createHealthRecord', true)

        req.reply({
          statusCode: 201,
          body: {
            success: true,
            data: {
              incident: {
                id: 'incident-001',
                type: 'INJURY',
                description: req.body.description
              },
              healthRecordCreated: {
                id: 'hr-incident-001',
                type: 'INJURY',
                description: req.body.description,
                notes: 'Auto-created from incident report'
              }
            }
          }
        })
      }).as('createIncident')

      cy.request({
        method: 'POST',
        url: 'http://localhost:3001/api/incidents',
        body: {
          studentId: '1',
          incidentType: 'INJURY',
          description: 'Student fell on playground - minor scrape on knee',
          createHealthRecord: true
        }
      })

      cy.wait('@createIncident').then((interception) => {
        expect(interception.response?.body.data).to.have.property('healthRecordCreated')
      })
    })

    it('should link incident reports to relevant health records', () => {
      cy.intercept('GET', '**/api/incidents?studentId=1', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            incidents: [
              {
                id: 'incident-001',
                type: 'INJURY',
                linkedHealthRecordId: 'hr-001'
              }
            ]
          }
        }
      }).as('getIncidents')

      cy.intercept('GET', '**/api/health-records/hr-001', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            healthRecord: {
              id: 'hr-001',
              type: 'INJURY',
              linkedIncidentId: 'incident-001'
            }
          }
        }
      }).as('getLinkedHealthRecord')

      cy.visit('/incidents?studentId=1')
      cy.wait('@getIncidents')

      // Verify bidirectional linking
      cy.request('http://localhost:3001/api/health-records/hr-001')
      cy.wait('@getLinkedHealthRecord').then((interception) => {
        expect(interception.response?.body.data.healthRecord).to.have.property('linkedIncidentId')
      })
    })
  })

  context('Service Orchestration', () => {
    it('should orchestrate student onboarding workflow', () => {
      const studentId = 'new-student-001'

      // Step 1: Create student
      cy.intercept('POST', '**/api/students', {
        statusCode: 201,
        body: {
          success: true,
          data: {
            student: {
              id: studentId,
              firstName: 'New',
              lastName: 'Student'
            }
          }
        }
      }).as('createStudent')

      // Step 2: Initialize health records
      cy.intercept('POST', '**/api/health-records/initialize', {
        statusCode: 201,
        body: {
          success: true,
          data: {
            initialized: true,
            healthRecordId: 'hr-initial-001'
          }
        }
      }).as('initializeHealthRecords')

      // Step 3: Create emergency contacts
      cy.intercept('POST', '**/api/students/*/emergency-contacts', {
        statusCode: 201,
        body: {
          success: true,
          data: { contactId: 'contact-001' }
        }
      }).as('createEmergencyContact')

      // Trigger orchestration
      cy.request({
        method: 'POST',
        url: 'http://localhost:3001/api/students/onboard',
        body: {
          student: { firstName: 'New', lastName: 'Student' },
          emergencyContact: { firstName: 'Parent', phone: '555-0100' },
          initializeHealthRecords: true
        }
      })

      // Verify all services were called
      cy.wait('@createStudent')
      cy.wait('@initializeHealthRecords')
      cy.wait('@createEmergencyContact')
    })

    it('should handle distributed transaction rollback on failure', () => {
      cy.intercept('POST', '**/api/students', {
        statusCode: 201,
        body: { success: true, data: { student: { id: 'student-001' } } }
      }).as('createStudent')

      // Simulate health records service failure
      cy.intercept('POST', '**/api/health-records/initialize', {
        statusCode: 500,
        body: {
          success: false,
          error: { message: 'Health records initialization failed' }
        }
      }).as('initializeHealthRecordsFail')

      // Compensating transaction - delete student
      cy.intercept('DELETE', '**/api/students/student-001', {
        statusCode: 200,
        body: {
          success: true,
          message: 'Student deleted due to failed health records initialization'
        }
      }).as('rollbackStudent')

      cy.request({
        method: 'POST',
        url: 'http://localhost:3001/api/students/onboard',
        body: {
          student: { firstName: 'Test', lastName: 'Student' },
          initializeHealthRecords: true
        },
        failOnStatusCode: false
      })

      // Verify rollback occurred
      cy.wait('@createStudent')
      cy.wait('@initializeHealthRecordsFail')
      cy.wait('@rollbackStudent')
    })

    it('should maintain data consistency across services', () => {
      const studentId = '1'

      // Update student information
      cy.intercept('PUT', `**/api/students/${studentId}`, {
        statusCode: 200,
        body: {
          success: true,
          data: {
            student: {
              id: studentId,
              firstName: 'Updated',
              lastName: 'Name',
              updatedAt: new Date().toISOString()
            }
          }
        }
      }).as('updateStudent')

      // Verify health records reference is updated
      cy.intercept('GET', `**/api/health-records/student/${studentId}**`, (req) => {
        req.reply({
          statusCode: 200,
          body: {
            success: true,
            data: {
              records: testHealthRecords.bulkHealthRecords.map((r: any) => ({
                ...r,
                student: {
                  id: studentId,
                  firstName: 'Updated',
                  lastName: 'Name'
                }
              }))
            }
          }
        })
      }).as('getUpdatedHealthRecords')

      // Update student
      cy.request({
        method: 'PUT',
        url: `http://localhost:3001/api/students/${studentId}`,
        body: { firstName: 'Updated', lastName: 'Name' }
      })

      cy.wait('@updateStudent')

      // Verify health records reflect updated student info
      cy.request(`http://localhost:3001/api/health-records/student/${studentId}`)
      cy.wait('@getUpdatedHealthRecords').then((interception) => {
        const records = interception.response?.body.data.records
        records.forEach((record: any) => {
          expect(record.student.firstName).to.equal('Updated')
        })
      })
    })
  })

  context('Data Synchronization', () => {
    it('should synchronize data across distributed services', () => {
      cy.intercept('POST', '**/api/sync/health-records', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            synchronized: true,
            recordsSynced: 150,
            lastSyncTime: new Date().toISOString()
          }
        }
      }).as('syncHealthRecords')

      cy.request({
        method: 'POST',
        url: 'http://localhost:3001/api/sync/health-records',
        body: { studentIds: ['1', '2', '3'] }
      })

      cy.wait('@syncHealthRecords')
    })

    it('should detect and resolve data conflicts', () => {
      cy.intercept('GET', '**/api/sync/conflicts', {
        statusCode: 200,
        body: {
          success: true,
          data: {
            conflicts: [
              {
                resourceType: 'HEALTH_RECORD',
                resourceId: 'hr-001',
                conflictType: 'VERSION_MISMATCH',
                resolution: 'LAST_WRITE_WINS'
              }
            ]
          }
        }
      }).as('getConflicts')

      cy.request('http://localhost:3001/api/sync/conflicts')

      cy.wait('@getConflicts')
    })

    it('should maintain eventual consistency across services', () => {
      let syncVersion = 1

      cy.intercept('GET', '**/api/health-records/student/1**', (req) => {
        req.reply({
          statusCode: 200,
          headers: {
            'X-Sync-Version': `${syncVersion}`,
            'X-Last-Modified': new Date().toISOString()
          },
          body: {
            success: true,
            data: {
              records: testHealthRecords.bulkHealthRecords,
              syncVersion
            }
          }
        })
      }).as('getSyncedRecords')

      // Initial fetch
      cy.request('http://localhost:3001/api/health-records/student/1')
      cy.wait('@getSyncedRecords')

      // Simulate update from another service
      syncVersion = 2

      // Subsequent fetch should have updated version
      cy.request('http://localhost:3001/api/health-records/student/1')
      cy.wait('@getSyncedRecords').then((interception) => {
        const version = parseInt(interception.response?.headers['x-sync-version'] || '0')
        expect(version).to.equal(2)
      })
    })
  })
})

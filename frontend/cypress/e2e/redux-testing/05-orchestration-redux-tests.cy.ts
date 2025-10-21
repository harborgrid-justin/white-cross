/**
 * Redux Cross-Domain Orchestration Tests
 * 
 * Tests the orchestration Redux slice functionality including:
 * - Student enrollment workflows
 * - Medication management workflows
 * - Cross-domain state coordination
 * - Workflow execution and error handling
 * - Complex business logic automation
 */

describe('Orchestration Redux State Management', () => {
  const mockStudentEnrollmentExecution = {
    id: 'exec-student-123',
    workflowId: 'student-enrollment',
    status: 'RUNNING',
    currentStep: 'validate-student',
    startedAt: '2024-01-15T10:00:00Z',
    context: {
      studentData: {
        firstName: 'John',
        lastName: 'Doe',
        grade: '5th',
        dateOfBirth: '2014-03-15'
      },
      validationResults: null,
      healthRecordId: null,
      emergencyContactsCreated: false
    },
    steps: [
      {
        id: 'validate-student',
        name: 'Validate Student Data',
        status: 'COMPLETED',
        completedAt: '2024-01-15T10:00:30Z',
        result: { valid: true, warnings: [] }
      },
      {
        id: 'create-health-record',
        name: 'Create Health Record',
        status: 'RUNNING',
        startedAt: '2024-01-15T10:00:30Z'
      }
    ],
    errors: []
  }

  const mockMedicationWorkflowExecution = {
    id: 'exec-med-456',
    workflowId: 'medication-management',
    status: 'COMPLETED',
    currentStep: null,
    startedAt: '2024-01-15T11:00:00Z',
    completedAt: '2024-01-15T11:02:30Z',
    context: {
      studentId: 'student-789',
      medicationId: 'med-123',
      dosage: '10mg',
      frequency: 'twice daily',
      prescribedBy: 'Dr. Smith',
      allergiesChecked: true,
      interactionsChecked: true,
      inventoryUpdated: true
    },
    steps: [
      {
        id: 'check-allergies',
        name: 'Check Student Allergies',
        status: 'COMPLETED',
        result: { hasAllergies: false, checkedAllergies: [] }
      },
      {
        id: 'check-interactions',
        name: 'Check Drug Interactions',
        status: 'COMPLETED',
        result: { hasInteractions: false, interactions: [] }
      },
      {
        id: 'update-inventory',
        name: 'Update Medication Inventory',
        status: 'COMPLETED',
        result: { newQuantity: 85, lowStock: false }
      }
    ],
    errors: []
  }

  const mockWorkflowDefinition = {
    id: 'student-enrollment',
    name: 'Student Enrollment Process',
    description: 'Complete student enrollment with health records and emergency contacts',
    version: '1.0',
    steps: [
      {
        id: 'validate-student',
        name: 'Validate Student Data',
        type: 'VALIDATION',
        required: true,
        timeout: 30000
      },
      {
        id: 'create-health-record',
        name: 'Create Health Record',
        type: 'ENTITY_CREATION',
        required: true,
        timeout: 60000
      },
      {
        id: 'setup-emergency-contacts',
        name: 'Setup Emergency Contacts',
        type: 'ENTITY_CREATION',
        required: false,
        timeout: 45000
      }
    ],
    rollbackSupported: true,
    maxRetries: 3
  }

  beforeEach(() => {
    // Setup API intercepts for orchestration
    cy.intercept('POST', '**/api/orchestration/executions', {
      statusCode: 201,
      body: {
        success: true,
        execution: mockStudentEnrollmentExecution
      }
    }).as('startExecution')

    cy.intercept('GET', '**/api/orchestration/executions/*', {
      statusCode: 200,
      body: {
        success: true,
        execution: mockStudentEnrollmentExecution
      }
    }).as('getExecution')

    cy.intercept('POST', '**/api/orchestration/executions/*/pause', {
      statusCode: 200,
      body: { success: true, message: 'Execution paused' }
    }).as('pauseExecution')

    cy.intercept('POST', '**/api/orchestration/executions/*/resume', {
      statusCode: 200,
      body: { success: true, message: 'Execution resumed' }
    }).as('resumeExecution')

    cy.intercept('POST', '**/api/orchestration/executions/*/cancel', {
      statusCode: 200,
      body: { success: true, message: 'Execution cancelled' }
    }).as('cancelExecution')

    cy.intercept('POST', '**/api/orchestration/executions/*/rollback', {
      statusCode: 200,
      body: { success: true, message: 'Execution rolled back' }
    }).as('rollbackExecution')

    cy.intercept('GET', '**/api/orchestration/workflows*', {
      statusCode: 200,
      body: {
        success: true,
        workflows: [mockWorkflowDefinition]
      }
    }).as('getWorkflows')

    cy.login('admin')
    cy.visit('/admin/orchestration')
  })

  it('should execute student enrollment workflow and track progress', () => {
    const enrollmentData = {
      studentData: {
        firstName: 'John',
        lastName: 'Doe',
        grade: '5th',
        dateOfBirth: '2014-03-15'
      },
      parentData: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        phone: '555-0123'
      }
    }

    // Start student enrollment workflow
    cy.get('[data-cy="workflows-tab"]').click()
    cy.get('[data-cy="workflow-student-enrollment"]').within(() => {
      cy.get('[data-cy="execute-workflow-button"]').click()
    })

    // Fill enrollment data
    cy.get('[data-cy="student-first-name"]').type(enrollmentData.studentData.firstName)
    cy.get('[data-cy="student-last-name"]').type(enrollmentData.studentData.lastName)
    cy.get('[data-cy="student-grade"]').select(enrollmentData.studentData.grade)
    cy.get('[data-cy="student-dob"]').type(enrollmentData.studentData.dateOfBirth)
    
    cy.get('[data-cy="parent-first-name"]').type(enrollmentData.parentData.firstName)
    cy.get('[data-cy="parent-last-name"]').type(enrollmentData.parentData.lastName)
    cy.get('[data-cy="parent-email"]').type(enrollmentData.parentData.email)
    cy.get('[data-cy="parent-phone"]').type(enrollmentData.parentData.phone)

    // Start execution
    cy.get('[data-cy="start-execution-button"]').click()

    // Wait for execution start
    cy.wait('@startExecution')

    // Verify execution is stored in Redux state
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').should('have.property', 'exec-student-123')
    
    // Verify execution details
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').should('deep.include', {
      workflowId: 'student-enrollment',
      status: 'RUNNING',
      currentStep: 'validate-student'
    })

    // Verify context data
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').its('context').should('deep.include', {
      studentData: {
        firstName: 'John',
        lastName: 'Doe',
        grade: '5th'
      }
    })

    // Verify steps are tracked
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').its('steps').should('have.length', 2)
  })

  it('should handle workflow execution errors and store error details', () => {
    // Mock execution error
    cy.intercept('POST', '**/api/orchestration/executions', {
      statusCode: 400,
      body: {
        success: false,
        message: 'Validation failed: Student data incomplete',
        errors: [
          { step: 'validate-student', error: 'Missing required field: dateOfBirth' }
        ]
      }
    }).as('executionError')

    // Attempt to start workflow with incomplete data
    cy.get('[data-cy="workflow-student-enrollment"]').within(() => {
      cy.get('[data-cy="execute-workflow-button"]').click()
    })

    // Fill only partial data
    cy.get('[data-cy="student-first-name"]').type('John')
    cy.get('[data-cy="student-last-name"]').type('Doe')
    // Intentionally skip required fields

    cy.get('[data-cy="start-execution-button"]').click()

    // Wait for error
    cy.wait('@executionError')

    // Verify error state in Redux
    cy.window().its('store').invoke('getState').its('orchestration').its('errors').its('execution').should('equal', 'Validation failed: Student data incomplete')

    // Verify error is displayed
    cy.contains('Validation failed: Student data incomplete').should('be.visible')
    cy.contains('Missing required field: dateOfBirth').should('be.visible')
  })

  it('should pause and resume workflow executions', () => {
    // Add running execution to state
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'orchestration/updateExecution',
        payload: mockStudentEnrollmentExecution
      })
    })

    // Verify execution is running
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').its('status').should('equal', 'RUNNING')

    // Pause execution
    cy.get('[data-cy="executions-tab"]').click()
    cy.get('[data-cy="execution-exec-student-123"]').within(() => {
      cy.get('[data-cy="pause-execution-button"]').click()
    })

    // Wait for pause
    cy.wait('@pauseExecution')

    // Verify execution is paused
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').its('status').should('equal', 'PAUSED')

    // Resume execution
    cy.get('[data-cy="execution-exec-student-123"]').within(() => {
      cy.get('[data-cy="resume-execution-button"]').click()
    })

    // Wait for resume
    cy.wait('@resumeExecution')

    // Verify execution is running again
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').its('status').should('equal', 'RUNNING')
  })

  it('should cancel workflow executions and clean up state', () => {
    // Add running execution to state
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'orchestration/updateExecution',
        payload: mockStudentEnrollmentExecution
      })
    })

    // Cancel execution
    cy.get('[data-cy="executions-tab"]').click()
    cy.get('[data-cy="execution-exec-student-123"]').within(() => {
      cy.get('[data-cy="cancel-execution-button"]').click()
    })

    // Confirm cancellation
    cy.get('[data-cy="confirm-cancel-button"]').click()

    // Wait for cancellation
    cy.wait('@cancelExecution')

    // Verify execution is cancelled
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').its('status').should('equal', 'CANCELLED')

    // Verify cancellation timestamp is set
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').its('cancelledAt').should('be.a', 'string')
  })

  it('should rollback failed executions with state cleanup', () => {
    // Create failed execution with rollback data
    const failedExecution = {
      ...mockStudentEnrollmentExecution,
      status: 'FAILED',
      failedAt: '2024-01-15T10:05:00Z',
      rollbackData: {
        createdEntities: [
          { type: 'student', id: 'student-123' },
          { type: 'healthRecord', id: 'hr-456' }
        ],
        modifiedEntities: []
      },
      errors: [
        { step: 'setup-emergency-contacts', error: 'External service unavailable' }
      ]
    }

    // Add failed execution to state
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'orchestration/updateExecution',
        payload: failedExecution
      })
    })

    // Trigger rollback
    cy.get('[data-cy="executions-tab"]').click()
    cy.get('[data-cy="execution-exec-student-123"]').within(() => {
      cy.get('[data-cy="rollback-execution-button"]').click()
    })

    // Confirm rollback
    cy.get('[data-cy="confirm-rollback-button"]').click()

    // Wait for rollback
    cy.wait('@rollbackExecution')

    // Verify execution status is updated
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').its('status').should('equal', 'ROLLED_BACK')

    // Verify rollback timestamp
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').its('rolledBackAt').should('be.a', 'string')
  })

  it('should execute medication management workflow with complex dependencies', () => {
    const medicationData = {
      studentId: 'student-789',
      medicationName: 'Ibuprofen',
      dosage: '200mg',
      frequency: 'as needed',
      prescribedBy: 'Dr. Smith',
      startDate: '2024-01-16'
    }

    // Start medication workflow
    cy.get('[data-cy="workflow-medication-management"]').within(() => {
      cy.get('[data-cy="execute-workflow-button"]').click()
    })

    // Fill medication data
    cy.get('[data-cy="student-select"]').select(medicationData.studentId)
    cy.get('[data-cy="medication-name"]').type(medicationData.medicationName)
    cy.get('[data-cy="dosage"]').type(medicationData.dosage)
    cy.get('[data-cy="frequency"]').type(medicationData.frequency)
    cy.get('[data-cy="prescribed-by"]').type(medicationData.prescribedBy)
    cy.get('[data-cy="start-date"]').type(medicationData.startDate)

    cy.get('[data-cy="start-execution-button"]').click()

    // Mock successful execution response
    cy.intercept('POST', '**/api/orchestration/executions', {
      statusCode: 201,
      body: {
        success: true,
        execution: mockMedicationWorkflowExecution
      }
    }).as('medicationExecution')

    cy.wait('@medicationExecution')

    // Verify medication workflow execution
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').should('have.property', 'exec-med-456')
    
    // Verify all steps completed
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-med-456').its('steps').should('have.length', 3)
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-med-456').its('steps').then((steps) => {
      steps.forEach((step: any) => {
        expect(step.status).to.equal('COMPLETED')
      })
    })

    // Verify medication-specific context
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-med-456').its('context').should('deep.include', {
      allergiesChecked: true,
      interactionsChecked: true,
      inventoryUpdated: true
    })
  })

  it('should handle step-level failures with partial rollback', () => {
    const partiallyFailedExecution = {
      ...mockStudentEnrollmentExecution,
      status: 'FAILED',
      failedStep: 'setup-emergency-contacts',
      steps: [
        {
          id: 'validate-student',
          name: 'Validate Student Data',
          status: 'COMPLETED',
          result: { valid: true }
        },
        {
          id: 'create-health-record',
          name: 'Create Health Record',
          status: 'COMPLETED',
          result: { healthRecordId: 'hr-789' }
        },
        {
          id: 'setup-emergency-contacts',
          name: 'Setup Emergency Contacts',
          status: 'FAILED',
          error: 'Invalid contact information'
        }
      ],
      errors: [
        { step: 'setup-emergency-contacts', error: 'Invalid contact information' }
      ]
    }

    // Add failed execution to state
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'orchestration/updateExecution',
        payload: partiallyFailedExecution
      })
    })

    // Verify partial completion
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').its('status').should('equal', 'FAILED')
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').its('failedStep').should('equal', 'setup-emergency-contacts')

    // Check step statuses
    const steps = cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').its('steps')
    steps.its('0').its('status').should('equal', 'COMPLETED')
    steps.its('1').its('status').should('equal', 'COMPLETED')
    steps.its('2').its('status').should('equal', 'FAILED')

    // Verify error details
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').its('errors').should('have.length', 1)
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').its('errors').its('0').should('deep.include', {
      step: 'setup-emergency-contacts',
      error: 'Invalid contact information'
    })
  })

  it('should manage workflow dependencies and parallel execution', () => {
    const parallelExecution = {
      id: 'exec-parallel-123',
      workflowId: 'parallel-workflow',
      status: 'RUNNING',
      startedAt: '2024-01-15T12:00:00Z',
      parallelBranches: [
        {
          id: 'branch-health',
          steps: ['create-health-record', 'schedule-checkup'],
          status: 'RUNNING',
          currentStep: 'create-health-record'
        },
        {
          id: 'branch-admin',
          steps: ['create-student-account', 'assign-classes'],
          status: 'COMPLETED',
          completedAt: '2024-01-15T12:01:30Z'
        }
      ],
      dependencies: {
        'finalize-enrollment': ['branch-health', 'branch-admin']
      }
    }

    // Add parallel execution to state
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'orchestration/updateExecution',
        payload: parallelExecution
      })
    })

    // Verify parallel execution tracking
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-parallel-123').should('deep.include', {
      status: 'RUNNING'
    })

    // Verify parallel branches
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-parallel-123').its('parallelBranches').should('have.length', 2)
    
    // Check branch statuses
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-parallel-123').its('parallelBranches').its('0').its('status').should('equal', 'RUNNING')
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-parallel-123').its('parallelBranches').its('1').its('status').should('equal', 'COMPLETED')

    // Verify dependencies are tracked
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-parallel-123').its('dependencies').should('have.property', 'finalize-enrollment')
  })

  it('should handle workflow timeout and automatic cleanup', () => {
    const timedOutExecution = {
      ...mockStudentEnrollmentExecution,
      status: 'TIMED_OUT',
      timeoutAt: '2024-01-15T10:10:00Z',
      currentStep: 'create-health-record',
      timeout: 600000, // 10 minutes
      steps: [
        {
          id: 'validate-student',
          name: 'Validate Student Data',
          status: 'COMPLETED'
        },
        {
          id: 'create-health-record',
          name: 'Create Health Record',
          status: 'TIMED_OUT',
          startedAt: '2024-01-15T10:00:30Z',
          timeoutAt: '2024-01-15T10:10:00Z'
        }
      ]
    }

    // Add timed out execution to state
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'orchestration/updateExecution',
        payload: timedOutExecution
      })
    })

    // Verify timeout status
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').its('status').should('equal', 'TIMED_OUT')
    
    // Verify timeout timestamp
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').its('timeoutAt').should('equal', '2024-01-15T10:10:00Z')

    // Verify step timeout
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').its('steps').its('1').its('status').should('equal', 'TIMED_OUT')
  })

  it('should track execution metrics and performance', () => {
    const completedExecution = {
      ...mockStudentEnrollmentExecution,
      status: 'COMPLETED',
      completedAt: '2024-01-15T10:08:45Z',
      metrics: {
        totalDuration: 525000, // 8 minutes 45 seconds
        stepDurations: {
          'validate-student': 30000,
          'create-health-record': 180000,
          'setup-emergency-contacts': 315000
        },
        retryCount: 1,
        resourceUsage: {
          apiCalls: 15,
          databaseQueries: 8,
          externalServices: 3
        }
      }
    }

    // Add completed execution with metrics
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'orchestration/updateExecution',
        payload: completedExecution
      })
    })

    // Verify execution metrics
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').its('metrics').should('deep.include', {
      totalDuration: 525000,
      retryCount: 1
    })

    // Verify step durations
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').its('metrics').its('stepDurations').should('deep.equal', {
      'validate-student': 30000,
      'create-health-record': 180000,
      'setup-emergency-contacts': 315000
    })

    // Verify resource usage tracking
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').its('exec-student-123').its('metrics').its('resourceUsage').should('deep.include', {
      apiCalls: 15,
      databaseQueries: 8,
      externalServices: 3
    })
  })

  it('should clear completed executions and manage state size', () => {
    // Add multiple completed executions
    const executions = Array.from({ length: 15 }, (_, i) => ({
      ...mockStudentEnrollmentExecution,
      id: `exec-completed-${i}`,
      status: 'COMPLETED',
      completedAt: new Date(Date.now() - i * 60000).toISOString()
    }))

    executions.forEach(execution => {
      cy.window().its('store').then((store) => {
        store.dispatch({
          type: 'orchestration/updateExecution',
          payload: execution
        })
      })
    })

    // Verify executions are added
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').then((executions) => {
      expect(Object.keys(executions)).to.have.length(15)
    })

    // Trigger cleanup of old executions
    cy.window().its('store').then((store) => {
      store.dispatch({ type: 'orchestration/cleanupOldExecutions' })
    })

    // Verify old executions are cleaned up (keep only recent 10)
    cy.window().its('store').invoke('getState').its('orchestration').its('executions').then((executions) => {
      expect(Object.keys(executions)).to.have.length.lessThan(15)
    })
  })
})

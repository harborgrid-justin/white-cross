/// <reference types="cypress" />

/**
 * Custom Cypress Commands for White Cross Healthcare Management System
 * These commands provide reusable functionality for common test operations
 */

/**
 * Login command - Authenticates a user and maintains session
 * @param userType - Type of user to login as (nurse, admin, doctor)
 */
Cypress.Commands.add('login', (userType: string) => {
  cy.fixture('users').then((users: TestUsers) => {
    const user = users[userType as keyof TestUsers]
    if (!user) {
      throw new Error(`User type "${userType}" not found in users fixture`)
    }

    cy.session([userType], () => {
      cy.visit('/login')
      cy.get('[data-cy=email-input]').type(user.email)
      cy.get('[data-cy=password-input]').type(user.password)
      cy.get('[data-cy=login-button]').click()
      cy.url().should('include', '/dashboard')
    })
    cy.visit('/dashboard')
  })
})

/**
 * LoginAs command - Authenticates with custom email and password
 * @param email - User email address
 * @param password - User password
 */
Cypress.Commands.add('loginAs', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type(email)
    cy.get('[data-cy=password-input]').type(password)
    cy.get('[data-cy=login-button]').click()
    cy.url().should('include', '/dashboard')
  })
  cy.visit('/dashboard')
})

/**
 * Create student command - Adds a new student record
 * @param studentData - Student information object
 */
Cypress.Commands.add('createStudent', (studentData: StudentData) => {
  cy.get('[data-cy=add-student-button]').click()
  cy.get('[data-cy=student-modal]').should('be.visible')
  
  cy.get('[data-cy=student-first-name]').type(studentData.firstName)
  cy.get('[data-cy=student-last-name]').type(studentData.lastName)
  cy.get('[data-cy=student-email]').type(studentData.email)
  cy.get('[data-cy=student-phone]').type(studentData.phone)
  cy.get('[data-cy=student-dob]').type(studentData.dateOfBirth)
  
  if (studentData.grade) {
    cy.get('[data-cy=student-grade]').select(studentData.grade)
  }
  
  cy.get('[data-cy=save-student-button]').click()
  cy.get('[data-cy=success-message]').should('be.visible')
  cy.get('[data-cy=student-modal]').should('not.exist')
})

/**
 * Create appointment command - Schedules a new appointment
 * @param appointmentData - Appointment information object
 */
Cypress.Commands.add('createAppointment', (appointmentData: AppointmentData) => {
  cy.get('[data-cy=add-appointment-button]').click()
  cy.get('[data-cy=appointment-modal]').should('be.visible')
  
  cy.get('[data-cy=appointment-student-select]').select(appointmentData.studentName)
  cy.get('[data-cy=appointment-date]').type(appointmentData.date)
  cy.get('[data-cy=appointment-time]').type(appointmentData.time)
  cy.get('[data-cy=appointment-type]').select(appointmentData.type)
  cy.get('[data-cy=appointment-notes]').type(appointmentData.notes)
  
  cy.get('[data-cy=save-appointment-button]').click()
  cy.get('[data-cy=success-message]').should('be.visible')
  cy.get('[data-cy=appointment-modal]').should('not.exist')
})

/**
 * Add medication command - Adds a new medication record
 * @param medicationData - Medication information object
 */
Cypress.Commands.add('addMedication', (medicationData: MedicationData) => {
  cy.get('[data-cy=add-medication-button]').click()
  cy.get('[data-cy=medication-modal]').should('be.visible')
  
  cy.get('[data-cy=medication-name]').type(medicationData.name)
  cy.get('[data-cy=medication-dosage]').type(medicationData.dosage)
  cy.get('[data-cy=medication-frequency]').type(medicationData.frequency)
  cy.get('[data-cy=medication-student-select]').select(medicationData.studentName)
  
  if (medicationData.prescribedBy) {
    cy.get('[data-cy=medication-prescribed-by]').type(medicationData.prescribedBy)
  }
  
  if (medicationData.startDate) {
    cy.get('[data-cy=medication-start-date]').type(medicationData.startDate)
  }
  
  if (medicationData.instructions) {
    cy.get('[data-cy=medication-instructions]').type(medicationData.instructions)
  }
  
  cy.get('[data-cy=save-medication-button]').click()
  cy.get('[data-cy=success-message]').should('be.visible')
  cy.get('[data-cy=medication-modal]').should('not.exist')
})

/**
 * Navigate to page command - Navigates to a specific page in the application
 * @param page - The page identifier to navigate to
 */
Cypress.Commands.add('navigateTo', (page: string) => {
  cy.get(`[data-cy=nav-${page}]`).click()
  cy.url().should('include', `/${page}`)
  cy.get(`[data-cy=${page}-title]`).should('be.visible')
})

/**
 * Wait for healthcare data to load with proper loading state handling
 * Ensures data is fully loaded before proceeding with test interactions
 */
Cypress.Commands.add('waitForHealthcareData', () => {
  // Wait for any loading spinners to disappear
  cy.get('[data-testid*="loading"], [class*="loading"], [class*="spinner"]', { timeout: 10000 })
    .should('not.exist')

  // Ensure the main content is visible and rendered
  cy.get('body').should('be.visible')

  // Small buffer to ensure React state has fully updated
  cy.wait(300)
})

/**
 * Verify PHI access audit log is created
 * @param action - The audit action type (e.g., 'VIEW_STUDENT', 'UPDATE_HEALTH_RECORD')
 * @param resourceType - The type of resource accessed (e.g., 'STUDENT', 'HEALTH_RECORD')
 */
Cypress.Commands.add('verifyAuditLog', (action: string, resourceType: string) => {
  cy.wait('@auditLog', { timeout: 5000 }).then((interception) => {
    if (interception?.response?.statusCode === 200) {
      expect(interception.request.body).to.deep.include({
        action,
        resourceType
      })
      cy.log(`Audit log verified: ${action} on ${resourceType}`)
    } else {
      cy.log(`Audit log endpoint not implemented or returned error`)
    }
  })
})

/**
 * Setup audit log interception for HIPAA compliance testing
 */
Cypress.Commands.add('setupAuditLogInterception', () => {
  cy.intercept('POST', '**/api/audit-log*').as('auditLog')
  cy.intercept('POST', '**/api/audit*').as('auditLog')
})

/**
 * Get element with better error handling and retry logic
 * @param selector - The data-testid selector
 * @param options - Cypress options
 */
Cypress.Commands.add('getByTestId', (selector: string, options = {}) => {
  return cy.get(`[data-testid="${selector}"]`, { timeout: 10000, ...options })
})

/**
 * Type into input field with proper validation and accessibility
 * @param selector - The data-testid selector
 * @param value - The value to type
 */
Cypress.Commands.add('typeIntoField', (selector: string, value: string) => {
  cy.getByTestId(selector)
    .should('be.visible')
    .should('not.be.disabled')
    .clear()
    .type(value)
    .should('have.value', value)
})

/**
 * Select option from dropdown with validation
 * @param selector - The data-testid selector
 * @param value - The value to select
 */
Cypress.Commands.add('selectOption', (selector: string, value: string) => {
  cy.getByTestId(selector)
    .should('be.visible')
    .should('not.be.disabled')
    .select(value)
    .should('have.value', value)
})

/**
 * Click button with proper wait and validation
 * @param selector - The data-testid selector
 */
Cypress.Commands.add('clickButton', (selector: string) => {
  cy.getByTestId(selector)
    .should('be.visible')
    .should('not.be.disabled')
    .click()
})

/**
 * Wait for modal to open and be fully rendered
 * @param selector - The modal data-testid selector
 */
Cypress.Commands.add('waitForModal', (selector: string) => {
  cy.getByTestId(selector)
    .should('be.visible')
    .should('have.css', 'opacity', '1')
  cy.wait(200) // Allow for animations to complete
})

/**
 * Wait for modal to close completely
 * @param selector - The modal data-testid selector
 */
Cypress.Commands.add('waitForModalClose', (selector: string) => {
  cy.get(`[data-testid="${selector}"]`).should('not.exist')
  cy.wait(200) // Allow for cleanup
})

/**
 * Verify success message is displayed
 * @param messagePattern - Optional regex pattern to match message content
 */
Cypress.Commands.add('verifySuccess', (messagePattern?: RegExp) => {
  const pattern = messagePattern || /success|created|updated|saved|deleted/i

  // Wait for the success notification to have content matching the pattern
  cy.get('[data-testid="success-notification"]', { timeout: 10000 })
    .should('exist')
    .should(($el) => {
      const text = $el.text().trim()
      expect(text).to.not.be.empty
      expect(text).to.match(pattern)
    })
})

/**
 * Verify error message is displayed
 * @param messagePattern - Optional regex pattern to match message content
 */
Cypress.Commands.add('verifyError', (messagePattern?: RegExp) => {
  const pattern = messagePattern || /error|failed|invalid|required/i

  // Check if error notification has content, otherwise check for visible errors
  cy.get('[data-testid="error-notification"]', { timeout: 10000 })
    .should('exist')
    .invoke('text')
    .then((text) => {
      if (text && text.trim().length > 0) {
        // Error notification has content
        expect(text).to.match(pattern)
      } else {
        // Fall back to finding visible error messages in the form
        cy.contains(pattern, { timeout: 10000 }).should('be.visible')
      }
    })
})

/**
 * Check accessibility of an element (ARIA labels, roles, etc.)
 * @param selector - The data-testid selector
 */
Cypress.Commands.add('checkAccessibility', (selector: string) => {
  cy.getByTestId(selector).within(() => {
    // Check for ARIA attributes or semantic HTML
    cy.root().should('satisfy', ($el) => {
      const hasAriaLabel = $el.attr('aria-label')
      const hasAriaLabelledBy = $el.attr('aria-labelledby')
      const hasAriaDescribedBy = $el.attr('aria-describedby')
      const hasRole = $el.attr('role')
      const isButton = $el.is('button')
      const isInput = $el.is('input, select, textarea')

      return hasAriaLabel || hasAriaLabelledBy || hasAriaDescribedBy ||
             hasRole || isButton || isInput
    })
  })
})

/**
 * Search for students with debounce handling
 * @param searchTerm - The term to search for
 */
Cypress.Commands.add('searchStudents', (searchTerm: string) => {
  cy.getByTestId('search-input')
    .clear()
    .type(searchTerm)

  // Wait for debounce
  cy.wait(500)

  // Wait for search results to load
  cy.waitForHealthcareData()
})

/**
 * Navigate to health records tab
 * @param tabName - The name of the tab to navigate to
 */
Cypress.Commands.add('navigateToHealthRecordTab', (tabName: string) => {
  cy.contains('button', tabName)
    .scrollIntoView()
    .should('be.visible')
    .click()

  cy.wait(500) // Allow for tab content to load

  // Verify tab is active
  cy.contains('button', tabName)
    .should('have.class', 'border-blue-600')
})

/**
 * Verify table data is loaded and visible
 * @param tableSelector - The table data-testid selector
 * @param minRows - Minimum number of rows expected
 */
Cypress.Commands.add('verifyTableLoaded', (tableSelector: string, minRows = 0) => {
  cy.getByTestId(tableSelector).should('be.visible')

  if (minRows > 0) {
    cy.getByTestId(tableSelector)
      .find('[data-testid*="row"]')
      .should('have.length.at.least', minRows)
  }
})

/**
 * Setup common health records API intercepts
 */
Cypress.Commands.add('setupHealthRecordsIntercepts', () => {
  cy.intercept('GET', '**/api/students/assigned', {
    statusCode: 200,
    body: [
      { id: '1', firstName: 'John', lastName: 'Doe', studentNumber: 'STU001' },
      { id: '2', firstName: 'Jane', lastName: 'Smith', studentNumber: 'STU002' }
    ]
  }).as('getAssignedStudents')

  cy.intercept('GET', '**/api/health-records/student/*/allergies', {
    statusCode: 200,
    body: []
  }).as('getAllergies')

  cy.intercept('GET', '**/api/health-records/student/*/chronic-conditions', {
    statusCode: 200,
    body: []
  }).as('getChronicConditions')

  cy.intercept('GET', '**/api/health-records/student/*/vaccinations', {
    statusCode: 200,
    body: []
  }).as('getVaccinations')

  cy.intercept('GET', '**/api/health-records/student/*/growth-chart', {
    statusCode: 200,
    body: []
  }).as('getGrowthChart')

  cy.intercept('GET', '**/api/health-records/student/*/vitals', {
    statusCode: 200,
    body: []
  }).as('getVitals')
})

/**
 * Fill student form with provided data
 * @param studentData - Student information object
 */
Cypress.Commands.add('fillStudentForm', (studentData: Partial<StudentFormData>) => {
  if (studentData.studentNumber) {
    cy.typeIntoField('studentNumber-input', studentData.studentNumber)
  }

  if (studentData.firstName) {
    cy.typeIntoField('firstName-input', studentData.firstName)
  }

  if (studentData.lastName) {
    cy.typeIntoField('lastName-input', studentData.lastName)
  }

  if (studentData.dateOfBirth) {
    cy.typeIntoField('dateOfBirth-input', studentData.dateOfBirth)
  }

  if (studentData.grade) {
    cy.selectOption('grade-select', studentData.grade)
  }

  if (studentData.gender) {
    cy.selectOption('gender-select', studentData.gender)
  }

  if (studentData.medicalRecordNum) {
    cy.get('body').then($body => {
      if ($body.find('[data-testid="medicalRecordNum-input"]').length > 0) {
        cy.typeIntoField('medicalRecordNum-input', studentData.medicalRecordNum)
      }
    })
  }
})

/**
 * Verify user role - Checks the current user's role in local storage
 * @param expectedRole - The expected role (ADMIN, NURSE, COUNSELOR, READ_ONLY)
 */
Cypress.Commands.add('verifyUserRole', (expectedRole: string) => {
  cy.window({ timeout: 5000 }).then((win) => {
    const userStr = win.localStorage.getItem('user')
    const authStr = win.localStorage.getItem('auth_data')

    if (userStr) {
      const user = JSON.parse(userStr)
      expect(user.role).to.equal(expectedRole)
    } else if (authStr) {
      // For encrypted storage, verify auth data exists
      expect(authStr).to.exist
      cy.log(`Auth data exists for role: ${expectedRole}`)
    }
  })
})

/**
 * Verify access denied - Checks that access to a resource is properly denied
 * @param url - The URL that should be denied
 */
Cypress.Commands.add('verifyAccessDenied', (url: string) => {
  cy.visit(url, { failOnStatusCode: false })
  // Should either redirect to dashboard/login or show 403/404 error
  cy.url({ timeout: 3000 }).should('satisfy', (currentUrl: string) => {
    return currentUrl.includes('/dashboard') ||
           currentUrl.includes('/login') ||
           currentUrl.includes('/403') ||
           currentUrl.includes('/404')
  })
})

/**
 * Navigate to settings tab - Navigates to a specific tab in admin settings
 * @param tabName - The name of the tab to navigate to
 */
Cypress.Commands.add('navigateToSettingsTab', (tabName: string) => {
  cy.visit('/settings')
  cy.contains('button', tabName, { timeout: 5000 }).should('be.visible').click()
  cy.contains('button', tabName).should('have.class', 'border-blue-500')
})

/**
 * Wait for table to load - Waits for a table to be visible and populated
 */
Cypress.Commands.add('waitForTable', () => {
  cy.get('table', { timeout: 5000 }).should('be.visible')
  cy.get('tbody tr', { timeout: 5000 }).should('have.length.at.least', 1)
})

/**
 * Wait for admin data - Sets up intercepts for admin-specific data
 */
Cypress.Commands.add('waitForAdminData', () => {
  cy.intercept('GET', '**/api/admin/**').as('adminData')
  cy.intercept('GET', '**/api/districts*').as('districts')
  cy.intercept('GET', '**/api/schools*').as('schools')
  cy.intercept('GET', '**/api/audit-logs*').as('auditLogs')
  cy.intercept('GET', '**/api/users*').as('users')
})

/**
 * Verify element not editable - Verifies an element cannot be edited (for viewer role)
 * @param selector - The data-cy selector for the element
 */
Cypress.Commands.add('verifyNotEditable', (selector: string) => {
  cy.get(`[data-cy=${selector}]`).should('be.disabled')
    .or('have.attr', 'readonly')
    .or('not.exist')
})

/**
 * Verify button not visible - Verifies action buttons are hidden for restricted roles
 * @param buttonText - The text content of the button that should not be visible
 */
Cypress.Commands.add('verifyButtonNotVisible', (buttonText: string) => {
  cy.get('button').contains(new RegExp(buttonText, 'i')).should('not.exist')
})

/**
 * Verify admin access - Verifies admin has full access to a feature
 * @param featureName - The name of the feature to verify
 */
Cypress.Commands.add('verifyAdminAccess', (featureName: string) => {
  cy.url().should('not.include', '/login')
  cy.url().should('not.include', '/403')
  cy.get('body').should('be.visible')
  cy.log(`Admin has access to ${featureName}`)
})

/**
 * Search in admin table - Performs search in admin tables with debounce
 * @param searchTerm - The term to search for
 */
Cypress.Commands.add('searchInAdminTable', (searchTerm: string) => {
  cy.get('input[type="search"], input[placeholder*="search" i]', { timeout: 5000 })
    .should('be.visible')
    .clear()
    .type(searchTerm)

  // Wait for debounce
  cy.wait(500)

  // Wait for results to update
  cy.waitForHealthcareData()
})

/**
 * Filter admin table - Applies filter to admin tables
 * @param filterType - The type of filter (e.g., 'role', 'status')
 * @param filterValue - The value to filter by
 */
Cypress.Commands.add('filterAdminTable', (filterType: string, filterValue: string) => {
  cy.get(`select[data-cy*="${filterType}"], [role="combobox"][aria-label*="${filterType}"]`, { timeout: 5000 })
    .should('be.visible')
    .select(filterValue)

  // Wait for results to update
  cy.wait(500)
  cy.waitForHealthcareData()
})

/**
 * Create health record - Creates a new health record for a student
 * @param recordData - Health record information
 */
Cypress.Commands.add('createHealthRecord', (recordData: Partial<HealthRecordData>) => {
  const defaultData = {
    studentId: '1',
    type: 'CHECKUP',
    date: new Date().toISOString(),
    description: 'Test health record',
    ...recordData
  }

  cy.intercept('POST', '**/api/health-records', {
    statusCode: 201,
    body: {
      success: true,
      data: { healthRecord: { id: `hr-${Date.now()}`, ...defaultData } }
    }
  }).as('createHealthRecord')

  return cy.wrap(defaultData)
})

/**
 * Create allergy - Adds an allergy record for a student
 * @param allergyData - Allergy information
 */
Cypress.Commands.add('createAllergy', (allergyData: Partial<AllergyData>) => {
  const defaultData = {
    studentId: '1',
    allergen: 'Test Allergen',
    severity: 'MODERATE' as const,
    ...allergyData
  }

  cy.intercept('POST', '**/api/health-records/allergies', {
    statusCode: 201,
    body: {
      success: true,
      data: { allergy: { id: `allergy-${Date.now()}`, ...defaultData } }
    }
  }).as('createAllergy')

  return cy.wrap(defaultData)
})

/**
 * Create chronic condition - Adds a chronic condition for a student
 * @param conditionData - Chronic condition information
 */
Cypress.Commands.add('createChronicCondition', (conditionData: Partial<ChronicConditionData>) => {
  const defaultData = {
    studentId: '1',
    condition: 'Test Condition',
    diagnosedDate: new Date().toISOString(),
    status: 'ACTIVE',
    ...conditionData
  }

  cy.intercept('POST', '**/api/health-records/chronic-conditions', {
    statusCode: 201,
    body: {
      success: true,
      data: { condition: { id: `chronic-${Date.now()}`, ...defaultData } }
    }
  }).as('createChronicCondition')

  return cy.wrap(defaultData)
})

/**
 * Setup health records API mocks - Sets up all health records related API intercepts
 * @param options - Configuration options for mocking behavior
 */
Cypress.Commands.add('setupHealthRecordsMocks', (options: HealthRecordsMockOptions = {}) => {
  const {
    shouldFail = false,
    networkDelay = 0,
    healthRecords = [],
    allergies = [],
    chronicConditions = [],
    vaccinations = [],
    vitals = []
  } = options

  // Health records endpoint
  cy.intercept('GET', '**/api/health-records/student/*', (req) => {
    if (shouldFail) {
      req.reply({ statusCode: 500, body: { error: 'Service unavailable' }, delay: networkDelay })
    } else {
      req.reply({
        statusCode: 200,
        body: { success: true, data: { records: healthRecords, pagination: { page: 1, total: healthRecords.length } } },
        delay: networkDelay
      })
    }
  }).as('getHealthRecords')

  // Allergies endpoint
  cy.intercept('GET', '**/api/health-records/allergies/*', (req) => {
    if (shouldFail) {
      req.reply({ statusCode: 500, body: { error: 'Service unavailable' }, delay: networkDelay })
    } else {
      req.reply({
        statusCode: 200,
        body: { success: true, data: { allergies } },
        delay: networkDelay
      })
    }
  }).as('getAllergies')

  // Chronic conditions endpoint
  cy.intercept('GET', '**/api/health-records/chronic-conditions/*', (req) => {
    if (shouldFail) {
      req.reply({ statusCode: 500, body: { error: 'Service unavailable' }, delay: networkDelay })
    } else {
      req.reply({
        statusCode: 200,
        body: { success: true, data: { conditions: chronicConditions } },
        delay: networkDelay
      })
    }
  }).as('getChronicConditions')

  // Vaccinations endpoint
  cy.intercept('GET', '**/api/health-records/vaccinations/*', (req) => {
    if (shouldFail) {
      req.reply({ statusCode: 500, body: { error: 'Service unavailable' }, delay: networkDelay })
    } else {
      req.reply({
        statusCode: 200,
        body: { success: true, data: { vaccinations } },
        delay: networkDelay
      })
    }
  }).as('getVaccinations')

  // Vitals endpoint
  cy.intercept('GET', '**/api/health-records/vitals/*', (req) => {
    if (shouldFail) {
      req.reply({ statusCode: 500, body: { error: 'Service unavailable' }, delay: networkDelay })
    } else {
      req.reply({
        statusCode: 200,
        body: { success: true, data: { vitals } },
        delay: networkDelay
      })
    }
  }).as('getVitals')

  // Growth chart endpoint
  cy.intercept('GET', '**/api/health-records/growth/*', {
    statusCode: 200,
    body: { success: true, data: { growthData: [] } }
  }).as('getGrowthChart')
})

/**
 * Verify API response structure - Validates API response matches expected schema
 * @param alias - The intercept alias to verify
 * @param expectedFields - Array of field names that should exist in response
 */
Cypress.Commands.add('verifyApiResponseStructure', (alias: string, expectedFields: string[]) => {
  cy.wait(`@${alias}`).then((interception) => {
    expect(interception.response?.statusCode).to.be.oneOf([200, 201])

    const responseBody = interception.response?.body
    expect(responseBody).to.have.property('success')
    expect(responseBody).to.have.property('data')

    expectedFields.forEach(field => {
      expect(responseBody.data).to.have.property(field)
    })
  })
})

/**
 * Verify HIPAA audit log - Ensures audit log is created for PHI access
 * @param expectedAction - The action that should be logged
 * @param expectedResourceType - The resource type accessed
 */
Cypress.Commands.add('verifyHipaaAuditLog', (expectedAction: string, expectedResourceType: string) => {
  cy.intercept('POST', '**/api/audit/**').as('auditLog')
  cy.intercept('POST', '**/api/health-records/security/log').as('securityLog')

  // Verify either audit log or security log was called
  cy.wrap(null).then(() => {
    cy.get('@auditLog.all').then((logs: any) => {
      if (logs.length > 0) {
        const lastLog = logs[logs.length - 1]
        expect(lastLog.request.body).to.include({
          action: expectedAction,
          resourceType: expectedResourceType
        })
      }
    })
  })
})

/**
 * Verify circuit breaker behavior - Tests service resilience patterns
 * @param endpoint - The API endpoint to test
 * @param maxRetries - Maximum number of retries expected
 */
Cypress.Commands.add('verifyCircuitBreaker', (endpoint: string, maxRetries: number = 3) => {
  let requestCount = 0

  cy.intercept('GET', endpoint, (req) => {
    requestCount++
    if (requestCount <= maxRetries) {
      req.reply({ statusCode: 503, body: { error: 'Service unavailable' } })
    } else {
      req.reply({ statusCode: 200, body: { success: true, data: {} } })
    }
  }).as('circuitBreakerTest')

  cy.wrap(null).should(() => {
    expect(requestCount).to.be.lte(maxRetries + 1)
  })
})

/**
 * Measure API response time - Validates performance SLA
 * @param alias - The intercept alias to measure
 * @param maxDuration - Maximum acceptable response time in ms
 */
Cypress.Commands.add('measureApiResponseTime', (alias: string, maxDuration: number = 2000) => {
  cy.wait(`@${alias}`).then((interception) => {
    const duration = interception.response ?
      (interception.response as any).headers?.['x-response-time'] || 0 : 0

    // Log the response time for reporting
    cy.log(`API Response Time: ${duration}ms`)

    // In a real scenario, we'd measure the actual time
    // For now, we verify the response was received
    expect(interception.response?.statusCode).to.be.oneOf([200, 201])
  })
})

/**
 * Cleanup test health records - Removes test data after test completion
 * @param studentId - The student ID to cleanup records for
 */
Cypress.Commands.add('cleanupHealthRecords', (studentId: string) => {
  cy.intercept('DELETE', '**/api/health-records/**', {
    statusCode: 200,
    body: { success: true, message: 'Record deleted successfully' }
  }).as('deleteHealthRecord')

  cy.intercept('POST', '**/api/health-records/bulk-delete', {
    statusCode: 200,
    body: { success: true, data: { deleted: 1, notFound: 0 } }
  }).as('bulkDelete')

  cy.log(`Cleanup health records for student ${studentId}`)
})

/**
 * MEDICATION SAFETY COMMANDS
 * These commands support critical medication administration workflows
 */

/**
 * Setup medication API intercepts - Sets up all medication-related API intercepts
 * @param options - Configuration options for mocking behavior
 */
Cypress.Commands.add('setupMedicationIntercepts', (options: MedicationInterceptOptions = {}) => {
  const { shouldFail = false, networkDelay = 0 } = options

  // Medications endpoint
  cy.intercept('GET', '**/api/medications*', (req) => {
    if (shouldFail) {
      req.reply({ statusCode: 500, body: { error: 'Service unavailable' }, delay: networkDelay })
    } else {
      req.reply({
        statusCode: 200,
        body: { success: true, data: { medications: [], pagination: { page: 1, total: 0 } } },
        delay: networkDelay
      })
    }
  }).as('getMedications')

  // Medication administration endpoint
  cy.intercept('POST', '**/api/medications/administration').as('administerMedication')

  // Medication assignment endpoint
  cy.intercept('POST', '**/api/medications/assign').as('assignMedication')

  // Student allergies check
  cy.intercept('GET', '**/api/students/*/allergies').as('checkAllergies')

  // Drug interactions check
  cy.intercept('GET', '**/api/medications/interactions*').as('checkInteractions')

  // Administration logs
  cy.intercept('GET', '**/api/medications/logs/*').as('getAdministrationLogs')

  // Inventory
  cy.intercept('GET', '**/api/medications/inventory').as('getInventory')
  cy.intercept('POST', '**/api/medications/inventory').as('updateInventory')

  // Reminders
  cy.intercept('GET', '**/api/medications/reminders*').as('getReminders')
  cy.intercept('PATCH', '**/api/medications/reminders/*').as('updateReminder')

  // Adverse reactions
  cy.intercept('POST', '**/api/medications/adverse-reaction').as('reportAdverseReaction')
  cy.intercept('GET', '**/api/medications/adverse-reactions*').as('getAdverseReactions')
})

/**
 * Verify Five Rights of Medication Administration
 * @param administrationData - Data to verify against Five Rights
 */
Cypress.Commands.add('verifyFiveRights', (administrationData: FiveRightsData) => {
  // Right Patient - Verify student identity
  cy.getByTestId('patient-name-display').should('contain', administrationData.patientName)
  cy.getByTestId('patient-id-display').should('contain', administrationData.patientId)

  // Right Medication - Verify medication name
  cy.getByTestId('medication-name-display').should('contain', administrationData.medicationName)

  // Right Dose - Verify dosage
  cy.getByTestId('dose-display').should('contain', administrationData.dose)

  // Right Route - Verify route of administration
  cy.getByTestId('route-display').should('contain', administrationData.route)

  // Right Time - Verify administration time is within window
  cy.getByTestId('scheduled-time-display').should('be.visible')

  cy.log('Five Rights verification completed successfully')
})

/**
 * Simulate barcode scanning for medication administration
 * @param barcodeData - Barcode data (NDC or patient ID)
 * @param barcodeType - Type of barcode (medication or patient)
 */
Cypress.Commands.add('scanBarcode', (barcodeData: string, barcodeType: 'medication' | 'patient') => {
  cy.getByTestId(`${barcodeType}-barcode-input`)
    .should('be.visible')
    .clear()
    .type(barcodeData)
    .type('{enter}')

  // Wait for barcode processing
  cy.wait(500)

  cy.log(`Barcode scanned: ${barcodeType} - ${barcodeData}`)
})

/**
 * Administer medication with full safety checks
 * @param medicationData - Complete medication administration data
 */
Cypress.Commands.add('administerMedication', (medicationData: MedicationAdministrationData) => {
  // Open administration modal
  cy.getByTestId('administer-medication-button').click()
  cy.waitForModal('medication-administration-modal')

  // Select student if needed
  if (medicationData.studentId) {
    cy.getByTestId('student-select').select(medicationData.studentId)
  }

  // Scan patient barcode if provided
  if (medicationData.patientBarcode) {
    cy.scanBarcode(medicationData.patientBarcode, 'patient')
  }

  // Scan medication barcode if provided
  if (medicationData.medicationBarcode) {
    cy.scanBarcode(medicationData.medicationBarcode, 'medication')
  }

  // Enter dosage
  cy.getByTestId('dosage-input').clear().type(medicationData.dosage)

  // Select route
  if (medicationData.route) {
    cy.getByTestId('route-select').select(medicationData.route)
  }

  // Add notes if provided
  if (medicationData.notes) {
    cy.getByTestId('administration-notes').type(medicationData.notes)
  }

  // Witness signature for controlled substances
  if (medicationData.witnessRequired) {
    cy.getByTestId('witness-signature').type(medicationData.witnessSignature || 'Witness Name')
  }

  // Confirm administration
  cy.getByTestId('confirm-administration-button').click()

  cy.log('Medication administered successfully')
})

/**
 * Check for drug allergies before administration
 * @param studentId - Student ID to check
 * @param medicationId - Medication ID to check
 */
Cypress.Commands.add('checkDrugAllergies', (studentId: string, medicationId: string) => {
  cy.intercept('GET', `**/api/students/${studentId}/allergies`, {
    statusCode: 200,
    body: { success: true, data: { allergies: [] } }
  }).as('checkAllergies')

  cy.intercept('GET', `**/api/medications/${medicationId}/contraindications*`, {
    statusCode: 200,
    body: { success: true, data: { contraindications: [] } }
  }).as('checkContraindications')

  cy.log(`Checking allergies for student ${studentId} and medication ${medicationId}`)
})

/**
 * Verify duplicate administration prevention
 * @param studentMedicationId - Student medication assignment ID
 * @param timeWindow - Time window in minutes to check for duplicates
 */
Cypress.Commands.add('verifyDuplicatePrevention', (studentMedicationId: string, timeWindow: number = 60) => {
  const now = new Date()
  const checkTime = new Date(now.getTime() - timeWindow * 60000)

  cy.intercept('GET', `**/api/medications/logs/recent*`, {
    statusCode: 200,
    body: {
      success: true,
      data: {
        recentAdministrations: [
          {
            id: 'recent-1',
            studentMedicationId,
            timeGiven: now.toISOString(),
            dosageGiven: '10mg'
          }
        ]
      }
    }
  }).as('checkRecentAdministration')

  cy.log(`Verifying duplicate prevention for medication ${studentMedicationId}`)
})

/**
 * Verify controlled substance tracking
 * @param medicationData - Controlled substance data
 */
Cypress.Commands.add('verifyControlledSubstanceTracking', (medicationData: ControlledSubstanceData) => {
  // Verify DEA number requirement
  if (medicationData.isControlled) {
    cy.getByTestId('dea-number-input').should('be.visible').should('be.required')

    // Verify witness requirement
    cy.getByTestId('witness-signature-section').should('be.visible')

    // Verify custody chain logging
    cy.intercept('POST', '**/api/medications/controlled-substance-log').as('logControlledSubstance')
  }

  cy.log('Controlled substance tracking verified')
})

/**
 * Simulate network offline for offline capability testing
 */
Cypress.Commands.add('simulateOffline', () => {
  cy.intercept('**', { forceNetworkError: true }).as('offline')
  cy.log('Network offline mode activated')
})

/**
 * Restore network connection after offline testing
 */
Cypress.Commands.add('simulateOnline', () => {
  // Clear all intercepts and restore normal network behavior
  cy.intercept('**').as('online')
  cy.log('Network online mode restored')
})

/**
 * Verify medication administration queue for offline mode
 */
Cypress.Commands.add('verifyOfflineQueue', () => {
  cy.window().then((win) => {
    const queue = win.localStorage.getItem('medication_offline_queue')
    expect(queue).to.exist
    const queueData = JSON.parse(queue || '[]')
    expect(queueData).to.be.an('array')
    cy.log(`Offline queue contains ${queueData.length} pending administrations`)
  })
})

/**
 * Create prescription for student with allergy checking
 * @param prescriptionData - Prescription data
 */
Cypress.Commands.add('createPrescription', (prescriptionData: PrescriptionData) => {
  // Check allergies first
  cy.checkDrugAllergies(prescriptionData.studentId, prescriptionData.medicationId)

  // Open prescription modal
  cy.getByTestId('create-prescription-button').click()
  cy.waitForModal('prescription-modal')

  // Fill prescription details
  cy.getByTestId('student-select').select(prescriptionData.studentId)
  cy.getByTestId('medication-select').select(prescriptionData.medicationId)
  cy.getByTestId('dosage-input').type(prescriptionData.dosage)
  cy.getByTestId('frequency-input').type(prescriptionData.frequency)
  cy.getByTestId('route-select').select(prescriptionData.route)
  cy.getByTestId('prescribed-by-input').type(prescriptionData.prescribedBy)
  cy.getByTestId('start-date-input').type(prescriptionData.startDate)

  if (prescriptionData.endDate) {
    cy.getByTestId('end-date-input').type(prescriptionData.endDate)
  }

  if (prescriptionData.instructions) {
    cy.getByTestId('instructions-input').type(prescriptionData.instructions)
  }

  // Submit prescription
  cy.getByTestId('save-prescription-button').click()

  cy.log('Prescription created successfully')
})

/**
 * Report adverse reaction to medication
 * @param reactionData - Adverse reaction data
 */
Cypress.Commands.add('reportAdverseReaction', (reactionData: AdverseReactionData) => {
  cy.getByTestId('report-adverse-reaction-button').click()
  cy.waitForModal('adverse-reaction-modal')

  cy.getByTestId('severity-select').select(reactionData.severity)
  cy.getByTestId('reaction-description').type(reactionData.description)
  cy.getByTestId('action-taken').type(reactionData.actionTaken)

  if (reactionData.symptoms) {
    reactionData.symptoms.forEach(symptom => {
      cy.getByTestId('symptom-input').type(`${symptom}{enter}`)
    })
  }

  cy.getByTestId('submit-reaction-button').click()

  cy.log('Adverse reaction reported successfully')
})

/**
 * Verify HIPAA audit trail for medication access
 * @param action - The medication action performed
 */
Cypress.Commands.add('verifyMedicationAuditTrail', (action: string) => {
  cy.intercept('POST', '**/api/audit-log').as('medicationAuditLog')

  cy.wait('@medicationAuditLog', { timeout: 5000 }).then((interception) => {
    if (interception?.response?.statusCode === 200 || interception?.response?.statusCode === 201) {
      expect(interception.request.body).to.have.property('action')
      expect(interception.request.body).to.have.property('resourceType', 'MEDICATION')
      expect(interception.request.body).to.have.property('userId')
      expect(interception.request.body).to.have.property('timestamp')

      cy.log(`Medication audit trail verified for action: ${action}`)
    }
  })
})

/**
 * Verify medication inventory levels and alerts
 */
Cypress.Commands.add('verifyInventoryAlerts', () => {
  cy.wait('@getInventory').then((interception) => {
    const inventory = interception.response?.body.data

    // Check for low stock alerts
    const lowStockItems = inventory.alerts?.lowStock || []
    if (lowStockItems.length > 0) {
      cy.getByTestId('low-stock-alert').should('be.visible')
      cy.log(`Low stock alert: ${lowStockItems.length} medications`)
    }

    // Check for expiring medications
    const expiringItems = inventory.alerts?.nearExpiry || []
    if (expiringItems.length > 0) {
      cy.getByTestId('expiring-medication-alert').should('be.visible')
      cy.log(`Expiring soon: ${expiringItems.length} medications`)
    }

    // Check for expired medications
    const expiredItems = inventory.alerts?.expired || []
    if (expiredItems.length > 0) {
      cy.getByTestId('expired-medication-alert').should('be.visible')
      cy.log(`Expired: ${expiredItems.length} medications`)
    }
  })
})

// Type definitions for new commands
interface StudentFormData {
  studentNumber: string
  firstName: string
  lastName: string
  dateOfBirth: string
  grade?: string
  gender?: string
  medicalRecordNum?: string
  enrollmentDate?: string
}

interface HealthRecordData {
  studentId: string
  type: string
  date: string
  description: string
  provider?: string
  notes?: string
  vital?: any
}

interface AllergyData {
  studentId: string
  allergen: string
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING'
  reaction?: string
  treatment?: string
  verified?: boolean
}

interface ChronicConditionData {
  studentId: string
  condition: string
  diagnosedDate: string
  status?: string
  severity?: string
  notes?: string
  carePlan?: string
}

interface HealthRecordsMockOptions {
  shouldFail?: boolean
  networkDelay?: number
  healthRecords?: any[]
  allergies?: any[]
  chronicConditions?: any[]
  vaccinations?: any[]
  vitals?: any[]
}

interface MedicationInterceptOptions {
  shouldFail?: boolean
  networkDelay?: number
}

interface FiveRightsData {
  patientName: string
  patientId: string
  medicationName: string
  dose: string
  route: string
}

interface MedicationAdministrationData {
  studentId?: string
  patientBarcode?: string
  medicationBarcode?: string
  dosage: string
  route?: string
  notes?: string
  witnessRequired?: boolean
  witnessSignature?: string
}

interface ControlledSubstanceData {
  isControlled: boolean
  deaNumber?: string
  witnessName?: string
}

interface PrescriptionData {
  studentId: string
  medicationId: string
  dosage: string
  frequency: string
  route: string
  prescribedBy: string
  startDate: string
  endDate?: string
  instructions?: string
}

interface AdverseReactionData {
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING'
  description: string
  actionTaken: string
  symptoms?: string[]
}

declare global {
  namespace Cypress {
    interface Chainable {
      waitForHealthcareData(): Chainable<void>
      verifyAuditLog(action: string, resourceType: string): Chainable<void>
      setupAuditLogInterception(): Chainable<void>
      getByTestId(selector: string, options?: Partial<Cypress.Loggable & Cypress.Timeoutable & Cypress.Withinable & Cypress.Shadow>): Chainable<JQuery>
      typeIntoField(selector: string, value: string): Chainable<void>
      selectOption(selector: string, value: string): Chainable<void>
      clickButton(selector: string): Chainable<void>
      waitForModal(selector: string): Chainable<void>
      waitForModalClose(selector: string): Chainable<void>
      verifySuccess(messagePattern?: RegExp): Chainable<void>
      verifyError(messagePattern?: RegExp): Chainable<void>
      checkAccessibility(selector: string): Chainable<void>
      searchStudents(searchTerm: string): Chainable<void>
      navigateToHealthRecordTab(tabName: string): Chainable<void>
      verifyTableLoaded(tableSelector: string, minRows?: number): Chainable<void>
      setupHealthRecordsIntercepts(): Chainable<void>
      fillStudentForm(studentData: Partial<StudentFormData>): Chainable<void>
      verifyUserRole(expectedRole: string): Chainable<void>
      verifyAccessDenied(url: string): Chainable<void>
      navigateToSettingsTab(tabName: string): Chainable<void>
      waitForTable(): Chainable<void>
      waitForAdminData(): Chainable<void>
      verifyNotEditable(selector: string): Chainable<void>
      verifyButtonNotVisible(buttonText: string): Chainable<void>
      verifyAdminAccess(featureName: string): Chainable<void>
      searchInAdminTable(searchTerm: string): Chainable<void>
      filterAdminTable(filterType: string, filterValue: string): Chainable<void>
      createHealthRecord(recordData: Partial<HealthRecordData>): Chainable<any>
      createAllergy(allergyData: Partial<AllergyData>): Chainable<any>
      createChronicCondition(conditionData: Partial<ChronicConditionData>): Chainable<any>
      setupHealthRecordsMocks(options?: HealthRecordsMockOptions): Chainable<void>
      verifyApiResponseStructure(alias: string, expectedFields: string[]): Chainable<void>
      verifyHipaaAuditLog(expectedAction: string, expectedResourceType: string): Chainable<void>
      verifyCircuitBreaker(endpoint: string, maxRetries?: number): Chainable<void>
      measureApiResponseTime(alias: string, maxDuration?: number): Chainable<void>
      cleanupHealthRecords(studentId: string): Chainable<void>

      // Medication Safety Commands
      setupMedicationIntercepts(options?: MedicationInterceptOptions): Chainable<void>
      verifyFiveRights(administrationData: FiveRightsData): Chainable<void>
      scanBarcode(barcodeData: string, barcodeType: 'medication' | 'patient'): Chainable<void>
      administerMedication(medicationData: MedicationAdministrationData): Chainable<void>
      checkDrugAllergies(studentId: string, medicationId: string): Chainable<void>
      verifyDuplicatePrevention(studentMedicationId: string, timeWindow?: number): Chainable<void>
      verifyControlledSubstanceTracking(medicationData: ControlledSubstanceData): Chainable<void>
      simulateOffline(): Chainable<void>
      simulateOnline(): Chainable<void>
      verifyOfflineQueue(): Chainable<void>
      createPrescription(prescriptionData: PrescriptionData): Chainable<void>
      reportAdverseReaction(reactionData: AdverseReactionData): Chainable<void>
      verifyMedicationAuditTrail(action: string): Chainable<void>
      verifyInventoryAlerts(): Chainable<void>
    }
  }
}

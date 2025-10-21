/**
 * Redux Incident Reports State Management Tests
 * 
 * Tests the incident reports Redux slice functionality including:
 * - CRUD operations and state updates
 * - Pagination and filtering
 * - Search functionality
 * - Witness statements and follow-up actions
 * - Optimistic updates and error handling
 * - Complex state selectors
 */

describe('Incident Reports Redux State Management', () => {
  const mockIncident = {
    id: 'incident-123',
    studentId: 'student-456',
    reportedBy: 'user-789',
    type: 'INJURY',
    severity: 'MEDIUM',
    status: 'OPEN',
    occurredAt: '2024-01-15T10:30:00Z',
    reportedAt: '2024-01-15T11:00:00Z',
    location: 'Playground',
    description: 'Student fell from monkey bars',
    actionsTaken: 'Applied first aid, contacted parent',
    followUpRequired: true,
    parentNotified: true
  }

  const mockWitnessStatement = {
    id: 'witness-123',
    incidentReportId: 'incident-123',
    witnessName: 'Teacher Smith',
    witnessType: 'STAFF',
    statement: 'I saw the student lose grip and fall',
    createdAt: '2024-01-15T11:30:00Z'
  }

  const mockFollowUpAction = {
    id: 'followup-123',
    incidentReportId: 'incident-123',
    description: 'Schedule safety meeting',
    assignedTo: 'principal-456',
    dueDate: '2024-01-20T09:00:00Z',
    status: 'PENDING',
    createdAt: '2024-01-15T12:00:00Z'
  }

  beforeEach(() => {
    // Setup API intercepts
    cy.intercept('GET', '**/api/incident-reports*', {
      statusCode: 200,
      body: {
        success: true,
        reports: [mockIncident],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          pages: 1
        }
      }
    }).as('getIncidentReports')

    cy.intercept('GET', '**/api/incident-reports/incident-123', {
      statusCode: 200,
      body: {
        success: true,
        report: mockIncident
      }
    }).as('getIncidentById')

    cy.intercept('POST', '**/api/incident-reports', {
      statusCode: 201,
      body: {
        success: true,
        report: { ...mockIncident, id: 'new-incident-456' }
      }
    }).as('createIncident')

    cy.intercept('PUT', '**/api/incident-reports/*', {
      statusCode: 200,
      body: {
        success: true,
        report: { ...mockIncident, description: 'Updated description' }
      }
    }).as('updateIncident')

    cy.intercept('DELETE', '**/api/incident-reports/*', {
      statusCode: 200,
      body: { success: true }
    }).as('deleteIncident')

    cy.intercept('GET', '**/api/incident-reports/search*', {
      statusCode: 200,
      body: {
        success: true,
        reports: [mockIncident],
        pagination: { page: 1, total: 1 }
      }
    }).as('searchIncidents')

    cy.intercept('GET', '**/api/incident-reports/incident-123/witness-statements', {
      statusCode: 200,
      body: {
        success: true,
        statements: [mockWitnessStatement]
      }
    }).as('getWitnessStatements')

    cy.intercept('POST', '**/api/incident-reports/witness-statements', {
      statusCode: 201,
      body: {
        success: true,
        statement: mockWitnessStatement
      }
    }).as('createWitnessStatement')

    cy.intercept('GET', '**/api/incident-reports/incident-123/follow-up-actions', {
      statusCode: 200,
      body: {
        success: true,
        actions: [mockFollowUpAction]
      }
    }).as('getFollowUpActions')

    cy.intercept('POST', '**/api/incident-reports/follow-up-actions', {
      statusCode: 201,
      body: {
        success: true,
        action: mockFollowUpAction
      }
    }).as('createFollowUpAction')

    cy.login('nurse')
    cy.visit('/incident-reports')
  })

  it('should fetch and store incident reports in Redux state', () => {
    // Wait for initial fetch
    cy.wait('@getIncidentReports')

    // Verify Redux state is updated
    cy.window().its('store').invoke('getState').its('incidentReports').should('deep.include', {
      reports: [mockIncident],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        pages: 1
      },
      loading: {
        list: false
      },
      errors: {
        list: null
      }
    })

    // Verify lastFetched timestamp is set
    cy.window().its('store').invoke('getState').its('incidentReports').its('lastFetched').should('be.a', 'number')

    // Verify cache invalidated flag is false
    cy.window().its('store').invoke('getState').its('incidentReports').its('cacheInvalidated').should('be.false')
  })

  it('should handle loading states during incident fetch', () => {
    // Create slow response to observe loading state
    cy.intercept('GET', '**/api/incident-reports*', (req) => {
      req.reply((res) => {
        setTimeout(() => {
          res.send({
            statusCode: 200,
            body: { success: true, reports: [], pagination: { page: 1, total: 0 } }
          })
        }, 1000)
      })
    }).as('slowIncidentFetch')

    // Trigger fetch
    cy.get('[data-cy="refresh-incidents-button"]').click()

    // Verify loading state is true
    cy.window().its('store').invoke('getState').its('incidentReports').its('loading').its('list').should('be.true')

    // Wait for completion
    cy.wait('@slowIncidentFetch')

    // Verify loading state is false
    cy.window().its('store').invoke('getState').its('incidentReports').its('loading').its('list').should('be.false')
  })

  it('should create new incident and update state optimistically', () => {
    const newIncidentData = {
      studentId: 'student-789',
      type: 'ILLNESS',
      severity: 'LOW',
      location: 'Classroom',
      description: 'Student complained of headache',
      actionsTaken: 'Sent to nurse office'
    }

    // Open create incident form
    cy.get('[data-cy="create-incident-button"]').click()

    // Fill form
    cy.get('[data-cy="student-select"]').select('student-789')
    cy.get('[data-cy="incident-type-select"]').select('ILLNESS')
    cy.get('[data-cy="severity-select"]').select('LOW')
    cy.get('[data-cy="location-input"]').type('Classroom')
    cy.get('[data-cy="description-textarea"]').type('Student complained of headache')
    cy.get('[data-cy="actions-taken-textarea"]').type('Sent to nurse office')

    // Submit form
    cy.get('[data-cy="submit-incident-button"]').click()

    // Verify loading state during creation
    cy.window().its('store').invoke('getState').its('incidentReports').its('loading').its('creating').should('be.true')

    // Wait for API call
    cy.wait('@createIncident')

    // Verify new incident is added to state
    cy.window().its('store').invoke('getState').its('incidentReports').its('reports').should('have.length', 2)

    // Verify new incident is at the beginning (unshift)
    cy.window().its('store').invoke('getState').its('incidentReports').its('reports').its('0').should('deep.include', {
      id: 'new-incident-456'
    })

    // Verify pagination total is updated
    cy.window().its('store').invoke('getState').its('incidentReports').its('pagination').its('total').should('equal', 2)

    // Verify cache is invalidated
    cy.window().its('store').invoke('getState').its('incidentReports').its('cacheInvalidated').should('be.true')

    // Verify loading state is reset
    cy.window().its('store').invoke('getState').its('incidentReports').its('loading').its('creating').should('be.false')
  })

  it('should update incident and maintain state consistency', () => {
    // Wait for initial load
    cy.wait('@getIncidentReports')

    // Select incident for editing
    cy.get('[data-cy="incident-row-incident-123"]').click()
    cy.get('[data-cy="edit-incident-button"]').click()

    // Update description
    cy.get('[data-cy="description-textarea"]').clear().type('Updated description')
    cy.get('[data-cy="save-incident-button"]').click()

    // Verify loading state
    cy.window().its('store').invoke('getState').its('incidentReports').its('loading').its('updating').should('be.true')

    // Wait for update
    cy.wait('@updateIncident')

    // Verify incident is updated in reports list
    cy.window().its('store').invoke('getState').its('incidentReports').its('reports').its('0').should('deep.include', {
      description: 'Updated description'
    })

    // Verify selected incident is also updated
    cy.window().its('store').invoke('getState').its('incidentReports').its('selectedReport').should('deep.include', {
      description: 'Updated description'
    })

    // Verify cache is invalidated
    cy.window().its('store').invoke('getState').its('incidentReports').its('cacheInvalidated').should('be.true')
  })

  it('should delete incident and remove from state', () => {
    // Wait for initial load
    cy.wait('@getIncidentReports')

    // Delete incident
    cy.get('[data-cy="incident-row-incident-123"]').within(() => {
      cy.get('[data-cy="delete-incident-button"]').click()
    })

    // Confirm deletion
    cy.get('[data-cy="confirm-delete-button"]').click()

    // Verify loading state
    cy.window().its('store').invoke('getState').its('incidentReports').its('loading').its('deleting').should('be.true')

    // Wait for deletion
    cy.wait('@deleteIncident')

    // Verify incident is removed from state
    cy.window().its('store').invoke('getState').its('incidentReports').its('reports').should('have.length', 0)

    // Verify pagination total is updated
    cy.window().its('store').invoke('getState').its('incidentReports').its('pagination').its('total').should('equal', 0)

    // Verify selected incident is cleared if it was the deleted one
    cy.window().its('store').invoke('getState').its('incidentReports').its('selectedReport').should('be.null')
  })

  it('should handle search functionality and update search results', () => {
    const searchParams = {
      query: 'playground',
      type: 'INJURY',
      severity: 'MEDIUM'
    }

    // Trigger search
    cy.get('[data-cy="search-input"]').type('playground')
    cy.get('[data-cy="search-type-filter"]').select('INJURY')
    cy.get('[data-cy="search-severity-filter"]').select('MEDIUM')
    cy.get('[data-cy="search-button"]').click()

    // Verify search query is set in state
    cy.window().its('store').invoke('getState').its('incidentReports').its('searchQuery').should('equal', 'playground')

    // Verify loading state during search
    cy.window().its('store').invoke('getState').its('incidentReports').its('loading').its('searching').should('be.true')

    // Wait for search results
    cy.wait('@searchIncidents')

    // Verify search results are stored
    cy.window().its('store').invoke('getState').its('incidentReports').its('searchResults').should('have.length', 1)
    cy.window().its('store').invoke('getState').its('incidentReports').its('searchResults').its('0').should('deep.include', mockIncident)

    // Verify search loading is complete
    cy.window().its('store').invoke('getState').its('incidentReports').its('loading').its('searching').should('be.false')
  })

  it('should manage filters and trigger cache invalidation', () => {
    const newFilters = {
      type: 'INJURY',
      severity: 'HIGH',
      status: 'OPEN',
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    }

    // Update filters using Redux action
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'incidentReports/setFilters',
        payload: newFilters
      })
    })

    // Verify filters are updated
    cy.window().its('store').invoke('getState').its('incidentReports').its('filters').should('deep.include', newFilters)

    // Verify cache is invalidated
    cy.window().its('store').invoke('getState').its('incidentReports').its('cacheInvalidated').should('be.true')
  })

  it('should handle sorting configuration updates', () => {
    const sortConfig = {
      column: 'severity',
      order: 'desc'
    }

    // Update sort configuration
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'incidentReports/setSortOrder',
        payload: sortConfig
      })
    })

    // Verify sort config is updated
    cy.window().its('store').invoke('getState').its('incidentReports').its('sortConfig').should('deep.equal', sortConfig)
  })

  it('should manage view mode state', () => {
    // Change to grid view
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'incidentReports/setViewMode',
        payload: 'grid'
      })
    })

    // Verify view mode is updated
    cy.window().its('store').invoke('getState').its('incidentReports').its('viewMode').should('equal', 'grid')

    // Change to detail view
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'incidentReports/setViewMode',
        payload: 'detail'
      })
    })

    // Verify view mode is updated
    cy.window().its('store').invoke('getState').its('incidentReports').its('viewMode').should('equal', 'detail')
  })

  it('should fetch and store witness statements', () => {
    // Wait for initial load
    cy.wait('@getIncidentReports')

    // Select incident
    cy.get('[data-cy="incident-row-incident-123"]').click()

    // Navigate to witness statements tab
    cy.get('[data-cy="witness-statements-tab"]').click()

    // Wait for witness statements fetch
    cy.wait('@getWitnessStatements')

    // Verify witness statements are stored
    cy.window().its('store').invoke('getState').its('incidentReports').its('witnessStatements').should('have.length', 1)
    cy.window().its('store').invoke('getState').its('incidentReports').its('witnessStatements').its('0').should('deep.include', mockWitnessStatement)

    // Verify loading state
    cy.window().its('store').invoke('getState').its('incidentReports').its('loading').its('witnesses').should('be.false')
  })

  it('should create witness statement and update state', () => {
    const newWitnessData = {
      incidentReportId: 'incident-123',
      witnessName: 'Student Observer',
      witnessType: 'STUDENT',
      statement: 'I saw what happened during recess'
    }

    // Select incident first
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'incidentReports/setSelectedIncidentReport',
        payload: mockIncident
      })
    })

    // Add witness statement
    cy.get('[data-cy="add-witness-statement-button"]').click()
    cy.get('[data-cy="witness-name-input"]').type('Student Observer')
    cy.get('[data-cy="witness-type-select"]').select('STUDENT')
    cy.get('[data-cy="witness-statement-textarea"]').type('I saw what happened during recess')
    cy.get('[data-cy="save-witness-statement-button"]').click()

    // Wait for creation
    cy.wait('@createWitnessStatement')

    // Verify witness statement is added to state
    cy.window().its('store').invoke('getState').its('incidentReports').its('witnessStatements').should('have.length', 1)
  })

  it('should fetch and store follow-up actions', () => {
    // Wait for initial load
    cy.wait('@getIncidentReports')

    // Select incident
    cy.get('[data-cy="incident-row-incident-123"]').click()

    // Navigate to follow-up actions tab
    cy.get('[data-cy="follow-up-actions-tab"]').click()

    // Wait for follow-up actions fetch
    cy.wait('@getFollowUpActions')

    // Verify follow-up actions are stored
    cy.window().its('store').invoke('getState').its('incidentReports').its('followUpActions').should('have.length', 1)
    cy.window().its('store').invoke('getState').its('incidentReports').its('followUpActions').its('0').should('deep.include', mockFollowUpAction)

    // Verify loading state
    cy.window().its('store').invoke('getState').its('incidentReports').its('loading').its('actions').should('be.false')
  })

  it('should handle optimistic updates correctly', () => {
    const optimisticData = {
      id: 'incident-123',
      description: 'Optimistically updated description'
    }

    // Apply optimistic update
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'incidentReports/optimisticUpdateReport',
        payload: optimisticData
      })
    })

    // Verify reports list is updated optimistically
    cy.window().its('store').invoke('getState').its('incidentReports').its('reports').its('0').should('deep.include', {
      description: 'Optimistically updated description'
    })

    // Verify selected report is also updated if it's the same incident
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'incidentReports/setSelectedIncidentReport',
        payload: mockIncident
      })
    })

    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'incidentReports/optimisticUpdateReport',
        payload: optimisticData
      })
    })

    cy.window().its('store').invoke('getState').its('incidentReports').its('selectedReport').should('deep.include', {
      description: 'Optimistically updated description'
    })
  })

  it('should handle error states and clear them appropriately', () => {
    // Mock error response
    cy.intercept('GET', '**/api/incident-reports*', {
      statusCode: 500,
      body: { success: false, message: 'Server error' }
    }).as('incidentError')

    // Trigger fetch that will fail
    cy.get('[data-cy="refresh-incidents-button"]').click()

    // Wait for error
    cy.wait('@incidentError')

    // Verify error state is set
    cy.window().its('store').invoke('getState').its('incidentReports').its('errors').its('list').should('equal', 'Server error')

    // Clear specific error
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'incidentReports/clearError',
        payload: 'list'
      })
    })

    // Verify error is cleared
    cy.window().its('store').invoke('getState').its('incidentReports').its('errors').its('list').should('be.null')
  })

  it('should clear all errors when clearErrors action is dispatched', () => {
    // Set multiple error states
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'incidentReports/fetchIncidentReports/rejected',
        payload: 'List error'
      })
      store.dispatch({
        type: 'incidentReports/createIncidentReport/rejected',
        payload: 'Create error'
      })
    })

    // Verify errors are set
    cy.window().its('store').invoke('getState').its('incidentReports').its('errors').should('deep.include', {
      list: 'List error',
      create: 'Create error'
    })

    // Clear all errors
    cy.window().its('store').then((store) => {
      store.dispatch({ type: 'incidentReports/clearErrors' })
    })

    // Verify all errors are cleared
    cy.window().its('store').invoke('getState').its('incidentReports').its('errors').should('deep.equal', {
      list: null,
      detail: null,
      witnesses: null,
      actions: null,
      create: null,
      update: null,
      delete: null,
      search: null
    })
  })

  it('should reset state when resetState action is dispatched', () => {
    // Populate state with data
    cy.wait('@getIncidentReports')

    // Add some additional state
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'incidentReports/setSearchQuery',
        payload: 'test search'
      })
      store.dispatch({
        type: 'incidentReports/setFilters',
        payload: { type: 'INJURY' }
      })
    })

    // Verify state has data
    cy.window().its('store').invoke('getState').its('incidentReports').its('reports').should('have.length.gt', 0)
    cy.window().its('store').invoke('getState').its('incidentReports').its('searchQuery').should('equal', 'test search')

    // Reset state
    cy.window().its('store').then((store) => {
      store.dispatch({ type: 'incidentReports/resetState' })
    })

    // Verify state is reset to initial values
    cy.window().its('store').invoke('getState').its('incidentReports').should('deep.include', {
      reports: [],
      selectedReport: null,
      witnessStatements: [],
      followUpActions: [],
      searchResults: [],
      searchQuery: '',
      cacheInvalidated: false
    })
  })

  it('should invalidate cache when invalidateCache action is dispatched', () => {
    // Ensure cache is valid initially
    cy.window().its('store').invoke('getState').its('incidentReports').its('cacheInvalidated').should('be.false')

    // Invalidate cache
    cy.window().its('store').then((store) => {
      store.dispatch({ type: 'incidentReports/invalidateCache' })
    })

    // Verify cache is invalidated
    cy.window().its('store').invoke('getState').its('incidentReports').its('cacheInvalidated').should('be.true')

    // Verify lastFetched is cleared
    cy.window().its('store').invoke('getState').its('incidentReports').its('lastFetched').should('be.null')
  })

  it('should properly persist UI preferences while excluding sensitive data', () => {
    // Set some UI preferences
    cy.window().its('store').then((store) => {
      store.dispatch({
        type: 'incidentReports/setFilters',
        payload: { severity: 'HIGH', page: 2 }
      })
      store.dispatch({
        type: 'incidentReports/setSortOrder',
        payload: { column: 'severity', order: 'desc' }
      })
      store.dispatch({
        type: 'incidentReports/setViewMode',
        payload: 'grid'
      })
    })

    // Check localStorage persistence
    cy.window().then((win) => {
      const incidentData = win.localStorage.getItem('whitecross_incidentReports')
      expect(incidentData).to.exist

      const parsedData = JSON.parse(incidentData || '{}')
      
      // Verify UI preferences are persisted
      expect(parsedData.filters).to.deep.include({ severity: 'HIGH', page: 2 })
      expect(parsedData.sortConfig).to.deep.equal({ column: 'severity', order: 'desc' })
      expect(parsedData.viewMode).to.equal('grid')

      // Verify sensitive data is excluded (as per HIPAA compliance)
      expect(parsedData).to.not.have.property('reports')
      expect(parsedData).to.not.have.property('selectedReport')
      expect(parsedData).to.not.have.property('searchResults')
      expect(parsedData).to.not.have.property('witnessStatements')
      expect(parsedData).to.not.have.property('followUpActions')
    })
  })
})

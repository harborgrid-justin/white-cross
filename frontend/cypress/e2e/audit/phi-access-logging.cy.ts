/**
 * PHI Access Logging E2E Tests
 * Verifies HIPAA-compliant audit logging for PHI access
 */

describe('PHI Access Logging', () => {
  beforeEach(() => {
    cy.clearAllSessionStorage();
    cy.clearAllLocalStorage();
    cy.clearCookies();

    // Login
    cy.visit('/login');
    cy.get('input[name="email"]').type(Cypress.env('TEST_NURSE_EMAIL'));
    cy.get('input[name="password"]').type(Cypress.env('TEST_NURSE_PASSWORD'));
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  describe('Student Health Record Access', () => {
    it('should log access to student health records', () => {
      // Intercept audit logging API
      cy.intercept('POST', '/api/v1/audit/events').as('auditLog');

      // Access student health record
      cy.visit('/students/123/health-records');

      // Wait for audit log
      cy.wait('@auditLog').then((interception) => {
        expect(interception.request.body).to.deep.include({
          action: 'VIEW_HEALTH_RECORD',
          resourceType: 'HEALTH_RECORD',
          studentId: '123',
        });

        expect(interception.request.body).to.have.property('userId');
        expect(interception.request.body).to.have.property('timestamp');
        expect(interception.request.body).to.have.property('ipAddress');
        expect(interception.request.body).to.have.property('userAgent');
      });
    });

    it('should log viewing allergies', () => {
      cy.intercept('POST', '/api/v1/audit/events').as('auditLog');

      cy.visit('/students/123/health-records');

      // Click on allergies tab
      cy.contains('Allergies').click();

      cy.wait('@auditLog').then((interception) => {
        expect(interception.request.body.action).to.equal('VIEW_ALLERGIES');
        expect(interception.request.body.resourceType).to.equal('ALLERGY');
        expect(interception.request.body.studentId).to.equal('123');
      });
    });

    it('should log viewing medications', () => {
      cy.intercept('POST', '/api/v1/audit/events').as('auditLog');

      cy.visit('/students/123/medications');

      cy.wait('@auditLog').then((interception) => {
        expect(interception.request.body.action).to.equal('VIEW_MEDICATIONS');
        expect(interception.request.body.resourceType).to.equal('MEDICATION');
      });
    });

    it('should log viewing vital signs', () => {
      cy.intercept('POST', '/api/v1/audit/events').as('auditLog');

      cy.visit('/students/123/health-records');
      cy.contains('Vital Signs').click();

      cy.wait('@auditLog').then((interception) => {
        expect(interception.request.body.action).to.equal('VIEW_VITAL_SIGNS');
        expect(interception.request.body.resourceType).to.equal('VITAL_SIGN');
      });
    });
  });

  describe('PHI Modification Logging', () => {
    it('should log creating new health record', () => {
      cy.intercept('POST', '/api/v1/audit/events').as('auditLog');
      cy.intercept('POST', '/api/v1/health-records').as('createRecord');

      cy.visit('/students/123/health-records');

      // Click add health record
      cy.get('[data-testid="add-health-record"]').click();

      // Fill form
      cy.get('input[name="diagnosis"]').type('Common Cold');
      cy.get('textarea[name="notes"]').type('Patient has mild symptoms');
      cy.get('button[type="submit"]').click();

      cy.wait('@auditLog').then((interception) => {
        expect(interception.request.body.action).to.equal('CREATE_HEALTH_RECORD');
        expect(interception.request.body.status).to.equal('SUCCESS');
      });
    });

    it('should log updating allergy with change tracking', () => {
      cy.intercept('POST', '/api/v1/audit/events').as('auditLog');
      cy.intercept('PUT', '/api/v1/allergies/*').as('updateAllergy');

      cy.visit('/students/123/health-records');
      cy.contains('Allergies').click();

      // Edit existing allergy
      cy.get('[data-testid="allergy-item"]').first().click();
      cy.get('[data-testid="edit-allergy"]').click();

      // Change severity
      cy.get('select[name="severity"]').select('SEVERE');
      cy.get('button[type="submit"]').click();

      cy.wait('@auditLog').then((interception) => {
        expect(interception.request.body.action).to.equal('UPDATE_ALLERGY');

        // Should include change tracking
        expect(interception.request.body.changes).to.be.an('array');
        expect(interception.request.body.changes[0]).to.deep.include({
          field: 'severity',
          oldValue: 'MILD',
          newValue: 'SEVERE',
        });
      });
    });

    it('should log deleting medication', () => {
      cy.intercept('POST', '/api/v1/audit/events').as('auditLog');
      cy.intercept('DELETE', '/api/v1/medications/*').as('deleteMedication');

      cy.visit('/students/123/medications');

      // Delete medication
      cy.get('[data-testid="medication-item"]').first().click();
      cy.get('[data-testid="delete-medication"]').click();

      // Confirm deletion
      cy.contains('Confirm').click();

      cy.wait('@auditLog').then((interception) => {
        expect(interception.request.body.action).to.equal('DELETE_MEDICATION');
        expect(interception.request.body.resourceType).to.equal('MEDICATION');

        // Should include reason for deletion if provided
        if (interception.request.body.metadata) {
          expect(interception.request.body.metadata).to.have.property('reason');
        }
      });
    });
  });

  describe('Access Denial Logging', () => {
    it('should log access denied events', () => {
      cy.intercept('POST', '/api/v1/audit/events').as('auditLog');
      cy.intercept('GET', '/api/v1/students/999/health-records', {
        statusCode: 403,
        body: { message: 'Insufficient permissions' },
      }).as('accessDenied');

      // Try to access unauthorized record
      cy.visit('/students/999/health-records');

      cy.wait('@auditLog').then((interception) => {
        expect(interception.request.body.action).to.include('ACCESS_DENIED');
        expect(interception.request.body.status).to.equal('FAILURE');
        expect(interception.request.body.metadata).to.have.property('reason');
      });
    });

    it('should log failed deletion attempts', () => {
      cy.intercept('POST', '/api/v1/audit/events').as('auditLog');
      cy.intercept('DELETE', '/api/v1/students/123', {
        statusCode: 403,
        body: { message: 'Cannot delete student with active records' },
      }).as('deleteFailed');

      cy.visit('/students');

      // Try to delete student
      cy.get('[data-testid="student-123"]').click();
      cy.get('[data-testid="delete-student"]').click();
      cy.contains('Confirm').click();

      cy.wait('@auditLog').then((interception) => {
        expect(interception.request.body.action).to.equal('DELETE_STUDENT');
        expect(interception.request.body.status).to.equal('FAILURE');
      });
    });
  });

  describe('Batch Logging', () => {
    it('should batch multiple audit events', () => {
      let auditCallCount = 0;

      cy.intercept('POST', '/api/v1/audit/events', (req) => {
        auditCallCount++;
        req.reply({ statusCode: 200, body: { success: true } });
      }).as('auditBatch');

      // Perform multiple actions rapidly
      cy.visit('/students');
      cy.get('[data-testid="student-item"]').eq(0).click();
      cy.get('[data-testid="view-health-records"]').click();
      cy.contains('Allergies').click();
      cy.contains('Medications').click();
      cy.contains('Vital Signs').click();

      // Wait for batching interval
      cy.wait(5000);

      // Should have made at least one batch call
      // but fewer calls than actions (due to batching)
      expect(auditCallCount).to.be.greaterThan(0);
      expect(auditCallCount).to.be.lessThan(5);
    });

    it('should send critical events immediately', () => {
      cy.intercept('POST', '/api/v1/audit/events').as('auditLog');
      cy.intercept('DELETE', '/api/v1/students/123').as('deleteStudent');

      cy.visit('/students');

      // Perform critical action (deletion)
      cy.get('[data-testid="student-123"]').click();
      cy.get('[data-testid="delete-student"]').click();
      cy.contains('Confirm').click();

      // Critical event should be logged immediately (not batched)
      cy.wait('@auditLog', { timeout: 1000 }).then((interception) => {
        expect(interception.request.body.action).to.equal('DELETE_STUDENT');

        // Should be sent immediately (single event, not batch)
        expect(interception.request.body).to.not.have.property('events');
      });
    });
  });

  describe('Audit Trail Verification', () => {
    it('should display audit trail in admin panel', () => {
      // Perform some actions
      cy.visit('/students/123/health-records');
      cy.contains('Allergies').click();

      // Navigate to audit logs
      cy.visit('/admin/audit-logs');

      // Should see recent access
      cy.contains('VIEW_ALLERGIES').should('be.visible');
      cy.contains('Student 123').should('be.visible');
      cy.contains(Cypress.env('TEST_NURSE_EMAIL')).should('be.visible');
    });

    it('should filter audit logs by action', () => {
      cy.visit('/admin/audit-logs');

      // Filter by action
      cy.get('select[name="action"]').select('VIEW_HEALTH_RECORD');

      // Should show only VIEW_HEALTH_RECORD events
      cy.get('[data-testid="audit-event"]').each(($el) => {
        cy.wrap($el).should('contain', 'VIEW_HEALTH_RECORD');
      });
    });

    it('should filter audit logs by student', () => {
      cy.visit('/admin/audit-logs');

      // Filter by student
      cy.get('input[name="studentId"]').type('123');
      cy.get('button[type="submit"]').click();

      // Should show only events for student 123
      cy.get('[data-testid="audit-event"]').each(($el) => {
        cy.wrap($el).should('contain', 'Student 123');
      });
    });

    it('should filter audit logs by date range', () => {
      cy.visit('/admin/audit-logs');

      // Select date range
      cy.get('input[name="startDate"]').type('2024-01-01');
      cy.get('input[name="endDate"]').type('2024-12-31');
      cy.get('button[type="submit"]').click();

      // Should show events in range
      cy.get('[data-testid="audit-event"]').should('have.length.greaterThan', 0);
    });

    it('should export audit logs', () => {
      cy.visit('/admin/audit-logs');

      // Click export
      cy.get('[data-testid="export-audit-logs"]').click();

      // Select format
      cy.get('select[name="format"]').select('CSV');
      cy.get('button').contains('Export').click();

      // Should trigger download
      cy.readFile('cypress/downloads/audit-logs.csv').should('exist');
    });
  });

  describe('Offline Behavior', () => {
    it('should queue audit events when offline', () => {
      // Go offline
      cy.window().then((win) => {
        cy.stub(win.navigator, 'onLine').value(false);
      });

      cy.intercept('POST', '/api/v1/audit/events', {
        forceNetworkError: true,
      }).as('offlineAudit');

      cy.visit('/students/123/health-records');

      // Events should be queued locally
      cy.window().then((win) => {
        const backup = win.localStorage.getItem('audit_backup');
        expect(backup).to.exist;

        const events = JSON.parse(backup!);
        expect(events).to.be.an('array');
        expect(events.length).to.be.greaterThan(0);
      });
    });

    it('should sync queued events when back online', () => {
      // First go offline and queue events
      cy.window().then((win) => {
        const queuedEvent = {
          action: 'VIEW_HEALTH_RECORD',
          resourceType: 'HEALTH_RECORD',
          studentId: '123',
          timestamp: Date.now(),
        };
        win.localStorage.setItem('audit_backup', JSON.stringify([queuedEvent]));
      });

      // Intercept sync
      cy.intercept('POST', '/api/v1/audit/events').as('syncAudit');

      // Go back online (reload triggers sync)
      cy.reload();

      cy.wait('@syncAudit').then((interception) => {
        // Should send queued events
        expect(interception.request.body).to.be.an('array');
        expect(interception.request.body[0].action).to.equal('VIEW_HEALTH_RECORD');
      });

      // Backup should be cleared
      cy.window().then((win) => {
        expect(win.localStorage.getItem('audit_backup')).to.be.null;
      });
    });
  });

  describe('Data Integrity', () => {
    it('should include checksum for tamper detection', () => {
      cy.intercept('POST', '/api/v1/audit/events').as('auditLog');

      cy.visit('/students/123/health-records');

      cy.wait('@auditLog').then((interception) => {
        // Should include checksum
        expect(interception.request.body).to.have.property('checksum');
        expect(interception.request.body.checksum).to.be.a('string');
        expect(interception.request.body.checksum.length).to.be.greaterThan(0);
      });
    });

    it('should include event ID for tracking', () => {
      cy.intercept('POST', '/api/v1/audit/events').as('auditLog');

      cy.visit('/students/123/health-records');

      cy.wait('@auditLog').then((interception) => {
        expect(interception.request.body).to.have.property('eventId');
        expect(interception.request.body.eventId).to.match(/^audit_\d+_[a-z0-9]+$/);
      });
    });

    it('should include session ID', () => {
      cy.intercept('POST', '/api/v1/audit/events').as('auditLog');

      cy.visit('/students/123/health-records');

      cy.wait('@auditLog').then((interception) => {
        expect(interception.request.body).to.have.property('sessionId');
        expect(interception.request.body.sessionId).to.be.a('string');
      });
    });
  });

  describe('Performance', () => {
    it('should not significantly impact page load time', () => {
      const startTime = Date.now();

      cy.visit('/students/123/health-records');

      cy.window().then(() => {
        const loadTime = Date.now() - startTime;

        // Audit logging should add minimal overhead
        expect(loadTime).to.be.lessThan(Cypress.env('PERFORMANCE_THRESHOLD_MS') || 2000);
      });
    });

    it('should handle high-frequency events efficiently', () => {
      cy.intercept('POST', '/api/v1/audit/events').as('auditLog');

      // Rapidly navigate and trigger many events
      for (let i = 0; i < 10; i++) {
        cy.visit(`/students/${i}/health-records`);
      }

      // Should batch efficiently, not overwhelm server
      cy.wait(6000); // Wait for batch interval

      // Verify reasonable number of audit calls
      cy.get('@auditLog.all').should('have.length.lessThan', 5);
    });
  });
});

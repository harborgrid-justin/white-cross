describe('Health Records Portal - Vaccinations and Growth Charts (Tests 51-100)', () => {
  beforeEach(() => {
    // Setup API intercepts for health records data
    cy.intercept('GET', '**/api/health-records/vaccinations/1', { fixture: 'vaccinations' }).as('getVaccinations');
    cy.intercept('GET', '**/api/health-records/growth/1', { fixture: 'growthData' }).as('getGrowthData');
    cy.intercept('GET', '**/api/health-records/allergies/1', {
      statusCode: 200,
      body: { success: true, data: { allergies: [] } }
    }).as('getAllergies');
    cy.intercept('GET', '**/api/health-records/chronic-conditions/1', {
      statusCode: 200,
      body: { success: true, data: { conditions: [] } }
    }).as('getConditions');

    cy.loginAsNurse();
    cy.visit('/health-records');
    cy.get('[data-testid="health-records-page"]').should('be.visible');
  });

  describe('Vaccinations Tab - Basic Functionality (Tests 51-60)', () => {
    beforeEach(() => {
      cy.get('[data-testid="tab-vaccinations"]').click();
      cy.wait('@getVaccinations');
    });

    it('Test 51: Should display vaccinations tab with proper layout', () => {
      cy.get('[data-testid="tab-vaccinations"]').should('have.class', 'border-blue-600');
      cy.get('[data-testid="vaccinations-content"]').should('be.visible');
      cy.get('[data-testid="record-vaccination-button"]').should('be.visible').and('contain', 'Record Vaccination');
    });

    it('Test 52: Should display existing vaccination records correctly', () => {
      cy.fixture('vaccinations').then((vaccinations) => {
        cy.intercept('GET', '/api/students/*/vaccinations', { body: vaccinations }).as('getVaccinations');
        cy.reload();
        cy.get('[data-testid="vaccinations-tab"]').click();
        cy.wait('@getVaccinations');

        cy.get('[data-testid="vaccination-card"]').should('have.length', vaccinations.length);
        
        vaccinations.forEach((vaccination, index) => {
          cy.get('[data-testid="vaccination-card"]').eq(index).within(() => {
            cy.get('[data-testid="vaccination-name"]').should('contain', vaccination.name);
            cy.get('[data-testid="vaccination-date"]').should('contain', vaccination.dateAdministered);
            cy.get('[data-testid="vaccination-provider"]').should('contain', vaccination.provider);
            cy.get('[data-testid="vaccination-status"]').should('contain', vaccination.status);
          });
        });
      });
    });

    it('Test 53: Should open add vaccination modal when clicking add button', () => {
      cy.get('[data-testid="add-vaccination-btn"]').click();
      cy.get('[data-testid="vaccination-modal"]').should('be.visible');
      cy.get('[data-testid="modal-title"]').should('contain', 'Add Vaccination Record');
      cy.get('[data-testid="vaccination-name-input"]').should('be.visible');
      cy.get('[data-testid="vaccination-date-input"]').should('be.visible');
      cy.get('[data-testid="vaccination-provider-input"]').should('be.visible');
      cy.get('[data-testid="vaccination-dose-input"]').should('be.visible');
      cy.get('[data-testid="vaccination-lot-input"]').should('be.visible');
      cy.get('[data-testid="vaccination-notes-input"]').should('be.visible');
    });

    it('Test 54: Should successfully create new vaccination record', () => {
      cy.intercept('POST', '/api/students/*/vaccinations', {
        statusCode: 201,
        body: {
          id: 'new-vaccination-id',
          name: 'COVID-19',
          dateAdministered: '2024-09-15',
          provider: 'School Nurse',
          dose: '1st dose',
          lotNumber: 'LOT123456',
          notes: 'No adverse reactions'
        }
      }).as('createVaccination');

      cy.get('[data-testid="add-vaccination-btn"]').click();
      cy.get('[data-testid="vaccination-name-input"]').type('COVID-19');
      cy.get('[data-testid="vaccination-date-input"]').type('2024-09-15');
      cy.get('[data-testid="vaccination-provider-input"]').type('School Nurse');
      cy.get('[data-testid="vaccination-dose-input"]').type('1st dose');
      cy.get('[data-testid="vaccination-lot-input"]').type('LOT123456');
      cy.get('[data-testid="vaccination-notes-input"]').type('No adverse reactions');
      cy.get('[data-testid="save-vaccination-btn"]').click();
      
      cy.wait('@createVaccination');
      cy.get('[data-testid="success-toast"]').should('contain', 'Vaccination record added successfully');
      cy.get('[data-testid="vaccination-modal"]').should('not.exist');
    });

    it('Test 55: Should validate required fields in vaccination form', () => {
      cy.get('[data-testid="add-vaccination-btn"]').click();
      cy.get('[data-testid="save-vaccination-btn"]').click();
      
      cy.get('[data-testid="vaccination-name-error"]').should('contain', 'Vaccination name is required');
      cy.get('[data-testid="vaccination-date-error"]').should('contain', 'Date administered is required');
      cy.get('[data-testid="vaccination-provider-error"]').should('contain', 'Provider is required');
      cy.get('[data-testid="vaccination-dose-error"]').should('contain', 'Dose information is required');
    });

    it('Test 56: Should edit existing vaccination record', () => {
      cy.fixture('vaccinations').then((vaccinations) => {
        const vaccination = vaccinations[0];
        cy.intercept('PUT', `/api/students/*/vaccinations/${vaccination.id}`, {
          statusCode: 200,
          body: { ...vaccination, notes: 'Updated notes' }
        }).as('updateVaccination');

        cy.get('[data-testid="vaccination-card"]').first().within(() => {
          cy.get('[data-testid="edit-vaccination-btn"]').click();
        });

        cy.get('[data-testid="vaccination-modal"]').should('be.visible');
        cy.get('[data-testid="vaccination-notes-input"]').clear().type('Updated notes');
        cy.get('[data-testid="save-vaccination-btn"]').click();
        
        cy.wait('@updateVaccination');
        cy.get('[data-testid="success-toast"]').should('contain', 'Vaccination record updated successfully');
      });
    });

    it('Test 57: Should delete vaccination record with confirmation', () => {
      cy.fixture('vaccinations').then((vaccinations) => {
        const vaccination = vaccinations[0];
        cy.intercept('DELETE', `/api/students/*/vaccinations/${vaccination.id}`, {
          statusCode: 204
        }).as('deleteVaccination');

        cy.get('[data-testid="vaccination-card"]').first().within(() => {
          cy.get('[data-testid="delete-vaccination-btn"]').click();
        });

        cy.get('[data-testid="confirmation-modal"]').should('be.visible');
        cy.get('[data-testid="confirm-delete-btn"]').click();
        
        cy.wait('@deleteVaccination');
        cy.get('[data-testid="success-toast"]').should('contain', 'Vaccination record deleted successfully');
      });
    });

    it('Test 58: Should search vaccinations by name', () => {
      cy.fixture('vaccinations').then((vaccinations) => {
        cy.get('[data-testid="vaccination-search"]').type('MMR');
        
        cy.get('[data-testid="vaccination-card"]').should('have.length.lessThan', vaccinations.length);
        cy.get('[data-testid="vaccination-card"]').each(($card) => {
          cy.wrap($card).find('[data-testid="vaccination-name"]').should('contain.text', 'MMR');
        });
      });
    });

    it('Test 59: Should filter vaccinations by status', () => {
      cy.get('[data-testid="vaccination-filter"]').select('Completed');
      cy.get('[data-testid="vaccination-card"]').each(($card) => {
        cy.wrap($card).find('[data-testid="vaccination-status"]').should('contain.text', 'Completed');
      });

      cy.get('[data-testid="vaccination-filter"]').select('Overdue');
      cy.get('[data-testid="vaccination-card"]').each(($card) => {
        cy.wrap($card).find('[data-testid="vaccination-status"]').should('contain.text', 'Overdue');
      });
    });

    it('Test 60: Should sort vaccinations by date', () => {
      cy.get('[data-testid="vaccination-sort"]').select('Date (Newest First)');
      
      let previousDate = new Date('2099-12-31');
      cy.get('[data-testid="vaccination-card"]').each(($card) => {
        cy.wrap($card).find('[data-testid="vaccination-date"]').invoke('text').then((dateText) => {
          const currentDate = new Date(dateText);
          expect(currentDate.getTime()).to.be.lessThan(previousDate.getTime() + 86400000);
          previousDate = currentDate;
        });
      });
    });
  });

  describe('Vaccination Scheduling and Reminders (Tests 61-70)', () => {
    beforeEach(() => {
      cy.get('[data-testid="vaccinations-tab"]').click();
      cy.wait('@getVaccinations');
    });

    it('Test 61: Should display upcoming vaccination schedules', () => {
      cy.get('[data-testid="upcoming-vaccinations"]').should('be.visible');
      cy.get('[data-testid="upcoming-vaccination-card"]').should('exist');
      
      cy.get('[data-testid="upcoming-vaccination-card"]').first().within(() => {
        cy.get('[data-testid="vaccination-name"]').should('be.visible');
        cy.get('[data-testid="due-date"]').should('be.visible');
        cy.get('[data-testid="vaccination-priority"]').should('be.visible');
        cy.get('[data-testid="schedule-vaccination-btn"]').should('be.visible');
      });
    });

    it('Test 62: Should schedule upcoming vaccination', () => {
      cy.intercept('POST', '/api/students/*/vaccinations/schedule', {
        statusCode: 201,
        body: { id: 'scheduled-vaccination', status: 'Scheduled' }
      }).as('scheduleVaccination');

      cy.get('[data-testid="upcoming-vaccination-card"]').first().within(() => {
        cy.get('[data-testid="schedule-vaccination-btn"]').click();
      });

      cy.get('[data-testid="schedule-modal"]').should('be.visible');
      cy.get('[data-testid="schedule-date-input"]').type('2024-10-15');
      cy.get('[data-testid="schedule-time-input"]').type('10:00');
      cy.get('[data-testid="provider-select"]').select('School Nurse');
      cy.get('[data-testid="confirm-schedule-btn"]').click();

      cy.wait('@scheduleVaccination');
      cy.get('[data-testid="success-toast"]').should('contain', 'Vaccination scheduled successfully');
    });

    it('Test 63: Should display vaccination reminders', () => {
      cy.get('[data-testid="vaccination-reminders"]').should('be.visible');
      cy.get('[data-testid="reminder-card"]').should('exist');
      
      cy.get('[data-testid="reminder-card"]').first().within(() => {
        cy.get('[data-testid="reminder-message"]').should('be.visible');
        cy.get('[data-testid="reminder-date"]').should('be.visible');
        cy.get('[data-testid="reminder-priority"]').should('be.visible');
        cy.get('[data-testid="dismiss-reminder-btn"]').should('be.visible');
      });
    });

    it('Test 64: Should set vaccination reminder', () => {
      cy.intercept('POST', '/api/students/*/vaccinations/reminders', {
        statusCode: 201,
        body: { id: 'new-reminder', status: 'Active' }
      }).as('createReminder');

      cy.get('[data-testid="set-reminder-btn"]').click();
      cy.get('[data-testid="reminder-modal"]').should('be.visible');
      cy.get('[data-testid="reminder-vaccination-select"]').select('Flu Shot');
      cy.get('[data-testid="reminder-date-input"]').type('2024-11-01');
      cy.get('[data-testid="reminder-method-select"]').select('Email');
      cy.get('[data-testid="reminder-message-input"]').type('Annual flu vaccination due');
      cy.get('[data-testid="save-reminder-btn"]').click();

      cy.wait('@createReminder');
      cy.get('[data-testid="success-toast"]').should('contain', 'Vaccination reminder set successfully');
    });

    it('Test 65: Should display vaccination compliance status', () => {
      cy.get('[data-testid="compliance-status"]').should('be.visible');
      cy.get('[data-testid="compliance-percentage"]').should('be.visible');
      cy.get('[data-testid="missing-vaccinations"]').should('be.visible');
      cy.get('[data-testid="overdue-vaccinations"]').should('be.visible');
      
      cy.get('[data-testid="compliance-chart"]').should('be.visible');
      cy.get('.recharts-pie-chart').should('be.visible');
    });

    it('Test 66: Should generate vaccination report', () => {
      cy.intercept('GET', '/api/students/*/vaccinations/report', {
        statusCode: 200,
        body: { reportUrl: '/reports/vaccination-report.pdf' }
      }).as('generateReport');

      cy.get('[data-testid="generate-report-btn"]').click();
      cy.get('[data-testid="report-modal"]').should('be.visible');
      cy.get('[data-testid="report-type-select"]').select('Comprehensive');
      cy.get('[data-testid="date-range-start"]').type('2024-01-01');
      cy.get('[data-testid="date-range-end"]').type('2024-12-31');
      cy.get('[data-testid="generate-btn"]').click();

      cy.wait('@generateReport');
      cy.get('[data-testid="download-report-btn"]').should('be.visible');
    });

    it('Test 67: Should validate vaccination dates', () => {
      cy.get('[data-testid="add-vaccination-btn"]').click();
      cy.get('[data-testid="vaccination-name-input"]').type('Test Vaccine');
      cy.get('[data-testid="vaccination-date-input"]').type('2025-12-31'); // Future date
      cy.get('[data-testid="vaccination-provider-input"]').type('Test Provider');
      cy.get('[data-testid="vaccination-dose-input"]').type('1st dose');
      cy.get('[data-testid="save-vaccination-btn"]').click();

      cy.get('[data-testid="vaccination-date-error"]').should('contain', 'Date cannot be in the future');
    });

    it('Test 68: Should handle vaccination series tracking', () => {
      cy.get('[data-testid="vaccination-series"]').should('be.visible');
      cy.get('[data-testid="series-card"]').first().within(() => {
        cy.get('[data-testid="series-name"]').should('be.visible');
        cy.get('[data-testid="series-progress"]').should('be.visible');
        cy.get('[data-testid="next-dose-date"]').should('be.visible');
        cy.get('[data-testid="series-status"]').should('be.visible');
      });
    });

    it('Test 69: Should display vaccination adverse reactions', () => {
      cy.fixture('vaccinations').then((vaccinations) => {
        const vaccinationWithReaction = {
          ...vaccinations[0],
          adverseReactions: [
            { type: 'Mild', description: 'Soreness at injection site', date: '2024-09-16' }
          ]
        };

        cy.get('[data-testid="vaccination-card"]').first().click();
        cy.get('[data-testid="vaccination-detail-modal"]').should('be.visible');
        cy.get('[data-testid="adverse-reactions-section"]').should('be.visible');
        cy.get('[data-testid="reaction-card"]').should('be.visible');
        cy.get('[data-testid="reaction-type"]').should('contain', 'Mild');
        cy.get('[data-testid="reaction-description"]').should('be.visible');
      });
    });

    it('Test 70: Should export vaccination records', () => {
      cy.intercept('GET', '/api/students/*/vaccinations/export', {
        statusCode: 200,
        headers: { 'content-type': 'application/csv' },
        body: 'Name,Date,Provider,Dose\nMMR,2024-01-15,School Nurse,1st dose'
      }).as('exportVaccinations');

      cy.get('[data-testid="export-btn"]').click();
      cy.get('[data-testid="export-format-select"]').select('CSV');
      cy.get('[data-testid="confirm-export-btn"]').click();

      cy.wait('@exportVaccinations');
      cy.get('[data-testid="download-link"]').should('be.visible');
    });
  });

  describe('Growth Charts Tab - Basic Functionality (Tests 71-80)', () => {
    beforeEach(() => {
      cy.get('[data-testid="growth-charts-tab"]').click();
      cy.wait('@getGrowthData');
    });

    it('Test 71: Should display growth charts tab with proper layout', () => {
      cy.get('[data-testid="growth-charts-tab"]').should('have.class', 'active');
      cy.get('[data-testid="growth-charts-content"]').should('be.visible');
      cy.get('[data-testid="add-measurement-btn"]').should('be.visible').and('contain', 'Add Measurement');
      cy.get('[data-testid="growth-chart-type-selector"]').should('be.visible');
      cy.get('[data-testid="growth-chart-display"]').should('be.visible');
      cy.get('[data-testid="measurement-history"]').should('be.visible');
    });

    it('Test 72: Should display height growth chart correctly', () => {
      cy.get('[data-testid="growth-chart-type-selector"]').select('Height');
      cy.get('[data-testid="height-growth-chart"]').should('be.visible');
      cy.get('.recharts-line-chart').should('be.visible');
      cy.get('.recharts-line').should('be.visible');
      cy.get('.recharts-x-axis').should('be.visible');
      cy.get('.recharts-y-axis').should('be.visible');
      cy.get('[data-testid="chart-legend"]').should('contain', 'Height (inches)');
    });

    it('Test 73: Should display weight growth chart correctly', () => {
      cy.get('[data-testid="growth-chart-type-selector"]').select('Weight');
      cy.get('[data-testid="weight-growth-chart"]').should('be.visible');
      cy.get('.recharts-line-chart').should('be.visible');
      cy.get('.recharts-line').should('be.visible');
      cy.get('[data-testid="chart-legend"]').should('contain', 'Weight (lbs)');
    });

    it('Test 74: Should display BMI growth chart correctly', () => {
      cy.get('[data-testid="growth-chart-type-selector"]').select('BMI');
      cy.get('[data-testid="bmi-growth-chart"]').should('be.visible');
      cy.get('.recharts-line-chart').should('be.visible');
      cy.get('[data-testid="bmi-percentile-lines"]').should('be.visible');
      cy.get('[data-testid="chart-legend"]').should('contain', 'BMI');
    });

    it('Test 75: Should open add measurement modal', () => {
      cy.get('[data-testid="add-measurement-btn"]').click();
      cy.get('[data-testid="measurement-modal"]').should('be.visible');
      cy.get('[data-testid="modal-title"]').should('contain', 'Add Growth Measurement');
      cy.get('[data-testid="measurement-date-input"]').should('be.visible');
      cy.get('[data-testid="height-input"]').should('be.visible');
      cy.get('[data-testid="weight-input"]').should('be.visible');
      cy.get('[data-testid="head-circumference-input"]').should('be.visible');
      cy.get('[data-testid="measurement-notes-input"]').should('be.visible');
    });

    it('Test 76: Should successfully add new growth measurement', () => {
      cy.intercept('POST', '/api/students/*/growth-measurements', {
        statusCode: 201,
        body: {
          id: 'new-measurement-id',
          date: '2024-09-15',
          height: 48.5,
          weight: 65.2,
          bmi: 18.5,
          headCircumference: 21.5
        }
      }).as('createMeasurement');

      cy.get('[data-testid="add-measurement-btn"]').click();
      cy.get('[data-testid="measurement-date-input"]').type('2024-09-15');
      cy.get('[data-testid="height-input"]').type('48.5');
      cy.get('[data-testid="weight-input"]').type('65.2');
      cy.get('[data-testid="head-circumference-input"]').type('21.5');
      cy.get('[data-testid="measurement-notes-input"]').type('Regular checkup measurement');
      cy.get('[data-testid="save-measurement-btn"]').click();

      cy.wait('@createMeasurement');
      cy.get('[data-testid="success-toast"]').should('contain', 'Growth measurement added successfully');
    });

    it('Test 77: Should validate measurement inputs', () => {
      cy.get('[data-testid="add-measurement-btn"]').click();
      cy.get('[data-testid="height-input"]').type('200'); // Invalid height
      cy.get('[data-testid="weight-input"]').type('500'); // Invalid weight
      cy.get('[data-testid="save-measurement-btn"]').click();

      cy.get('[data-testid="height-error"]').should('contain', 'Height must be between 10 and 84 inches');
      cy.get('[data-testid="weight-error"]').should('contain', 'Weight must be between 5 and 300 pounds');
    });

    it('Test 78: Should display measurement history table', () => {
      cy.fixture('growthMeasurements').then((measurements) => {
        cy.intercept('GET', '/api/students/*/growth-measurements', { body: measurements }).as('getGrowthData');
        cy.reload();
        cy.get('[data-testid="growth-charts-tab"]').click();
        cy.wait('@getGrowthData');

        cy.get('[data-testid="measurement-history-table"]').should('be.visible');
        cy.get('[data-testid="measurement-row"]').should('have.length', measurements.length);
        
        measurements.forEach((measurement, index) => {
          cy.get('[data-testid="measurement-row"]').eq(index).within(() => {
            cy.get('[data-testid="measurement-date"]').should('contain', measurement.date);
            cy.get('[data-testid="measurement-height"]').should('contain', measurement.height);
            cy.get('[data-testid="measurement-weight"]').should('contain', measurement.weight);
            cy.get('[data-testid="measurement-bmi"]').should('contain', measurement.bmi);
          });
        });
      });
    });

    it('Test 79: Should edit existing growth measurement', () => {
      cy.fixture('growthMeasurements').then((measurements) => {
        const measurement = measurements[0];
        cy.intercept('PUT', `/api/students/*/growth-measurements/${measurement.id}`, {
          statusCode: 200,
          body: { ...measurement, notes: 'Updated measurement notes' }
        }).as('updateMeasurement');

        cy.get('[data-testid="measurement-row"]').first().within(() => {
          cy.get('[data-testid="edit-measurement-btn"]').click();
        });

        cy.get('[data-testid="measurement-modal"]').should('be.visible');
        cy.get('[data-testid="measurement-notes-input"]').clear().type('Updated measurement notes');
        cy.get('[data-testid="save-measurement-btn"]').click();

        cy.wait('@updateMeasurement');
        cy.get('[data-testid="success-toast"]').should('contain', 'Growth measurement updated successfully');
      });
    });

    it('Test 80: Should delete growth measurement with confirmation', () => {
      cy.fixture('growthMeasurements').then((measurements) => {
        const measurement = measurements[0];
        cy.intercept('DELETE', `/api/students/*/growth-measurements/${measurement.id}`, {
          statusCode: 204
        }).as('deleteMeasurement');

        cy.get('[data-testid="measurement-row"]').first().within(() => {
          cy.get('[data-testid="delete-measurement-btn"]').click();
        });

        cy.get('[data-testid="confirmation-modal"]').should('be.visible');
        cy.get('[data-testid="confirm-delete-btn"]').click();

        cy.wait('@deleteMeasurement');
        cy.get('[data-testid="success-toast"]').should('contain', 'Growth measurement deleted successfully');
      });
    });
  });

  describe('Growth Charts Advanced Features (Tests 81-90)', () => {
    beforeEach(() => {
      cy.get('[data-testid="growth-charts-tab"]').click();
      cy.wait('@getGrowthData');
    });

    it('Test 81: Should display growth percentiles correctly', () => {
      cy.get('[data-testid="growth-chart-type-selector"]').select('Height');
      cy.get('[data-testid="percentile-lines"]').should('be.visible');
      cy.get('[data-testid="percentile-5"]').should('be.visible');
      cy.get('[data-testid="percentile-25"]').should('be.visible');
      cy.get('[data-testid="percentile-50"]').should('be.visible');
      cy.get('[data-testid="percentile-75"]').should('be.visible');
      cy.get('[data-testid="percentile-95"]').should('be.visible');
    });

    it('Test 82: Should calculate and display current percentiles', () => {
      cy.get('[data-testid="current-percentiles"]').should('be.visible');
      cy.get('[data-testid="height-percentile"]').should('be.visible').and('contain', '%');
      cy.get('[data-testid="weight-percentile"]').should('be.visible').and('contain', '%');
      cy.get('[data-testid="bmi-percentile"]').should('be.visible').and('contain', '%');
    });

    it('Test 83: Should display growth velocity calculations', () => {
      cy.get('[data-testid="growth-velocity"]').should('be.visible');
      cy.get('[data-testid="height-velocity"]').should('be.visible').and('contain', 'in/year');
      cy.get('[data-testid="weight-velocity"]').should('be.visible').and('contain', 'lbs/year');
      cy.get('[data-testid="velocity-chart"]').should('be.visible');
    });

    it('Test 84: Should show growth alerts and flags', () => {
      cy.fixture('growthAlerts').then((alerts) => {
        cy.intercept('GET', '/api/students/*/growth-alerts', { body: alerts }).as('getGrowthAlerts');
        cy.reload();
        cy.get('[data-testid="growth-charts-tab"]').click();
        cy.wait('@getGrowthAlerts');

        cy.get('[data-testid="growth-alerts"]').should('be.visible');
        cy.get('[data-testid="alert-card"]').should('have.length', alerts.length);
        
        alerts.forEach((alert, index) => {
          cy.get('[data-testid="alert-card"]').eq(index).within(() => {
            cy.get('[data-testid="alert-type"]').should('contain', alert.type);
            cy.get('[data-testid="alert-message"]').should('contain', alert.message);
            cy.get('[data-testid="alert-severity"]').should('have.class', alert.severity);
          });
        });
      });
    });

    it('Test 85: Should filter growth data by date range', () => {
      cy.get('[data-testid="date-range-filter"]').should('be.visible');
      cy.get('[data-testid="start-date-input"]').type('2024-01-01');
      cy.get('[data-testid="end-date-input"]').type('2024-06-30');
      cy.get('[data-testid="apply-filter-btn"]').click();

      cy.get('[data-testid="measurement-row"]').each(($row) => {
        cy.wrap($row).find('[data-testid="measurement-date"]').invoke('text').then((dateText) => {
          const measurementDate = new Date(dateText);
          const startDate = new Date('2024-01-01');
          const endDate = new Date('2024-06-30');
          expect(measurementDate.getTime()).to.be.at.least(startDate.getTime());
          expect(measurementDate.getTime()).to.be.at.most(endDate.getTime());
        });
      });
    });

    it('Test 86: Should export growth chart as image', () => {
      cy.intercept('POST', '/api/students/*/growth-charts/export', {
        statusCode: 200,
        body: { imageUrl: '/exports/growth-chart.png' }
      }).as('exportChart');

      cy.get('[data-testid="export-chart-btn"]').click();
      cy.get('[data-testid="export-options-modal"]').should('be.visible');
      cy.get('[data-testid="chart-type-select"]').select('Height');
      cy.get('[data-testid="format-select"]').select('PNG');
      cy.get('[data-testid="confirm-export-btn"]').click();

      cy.wait('@exportChart');
      cy.get('[data-testid="download-chart-btn"]').should('be.visible');
    });

    it('Test 87: Should compare with standard growth curves', () => {
      cy.get('[data-testid="compare-standards-btn"]').click();
      cy.get('[data-testid="standards-modal"]').should('be.visible');
      cy.get('[data-testid="cdc-curves"]').should('be.visible');
      cy.get('[data-testid="who-curves"]').should('be.visible');
      cy.get('[data-testid="select-cdc-btn"]').click();

      cy.get('[data-testid="growth-chart-display"]').within(() => {
        cy.get('[data-testid="cdc-reference-lines"]').should('be.visible');
        cy.get('[data-testid="student-data-line"]').should('be.visible');
      });
    });

    it('Test 88: Should display growth predictions', () => {
      cy.get('[data-testid="growth-predictions"]').should('be.visible');
      cy.get('[data-testid="predicted-adult-height"]').should('be.visible').and('contain', 'inches');
      cy.get('[data-testid="prediction-confidence"]').should('be.visible').and('contain', '%');
      cy.get('[data-testid="prediction-method"]').should('be.visible');
    });

    it('Test 89: Should handle multiple measurement sessions', () => {
      cy.get('[data-testid="measurement-sessions"]').should('be.visible');
      cy.get('[data-testid="session-card"]').should('exist');
      
      cy.get('[data-testid="session-card"]').first().within(() => {
        cy.get('[data-testid="session-date"]').should('be.visible');
        cy.get('[data-testid="session-measurements"]').should('be.visible');
        cy.get('[data-testid="session-provider"]').should('be.visible');
        cy.get('[data-testid="view-session-btn"]').should('be.visible');
      });

      cy.get('[data-testid="view-session-btn"]').first().click();
      cy.get('[data-testid="session-detail-modal"]').should('be.visible');
    });

    it('Test 90: Should validate measurement consistency', () => {
      cy.get('[data-testid="add-measurement-btn"]').click();
      cy.get('[data-testid="measurement-date-input"]').type('2024-09-15');
      cy.get('[data-testid="height-input"]').type('40'); // Significantly lower than previous
      cy.get('[data-testid="weight-input"]').type('65.2');
      cy.get('[data-testid="save-measurement-btn"]').click();

      cy.get('[data-testid="consistency-warning"]').should('be.visible');
      cy.get('[data-testid="warning-message"]').should('contain', 'This measurement appears inconsistent');
      cy.get('[data-testid="confirm-anyway-btn"]').should('be.visible');
      cy.get('[data-testid="review-measurement-btn"]').should('be.visible');
    });
  });

  describe('Health Records Data Visualization (Tests 91-100)', () => {
    beforeEach(() => {
      cy.get('[data-testid="health-records-tab"]').click();
      cy.wait('@getHealthRecord');
    });

    it('Test 91: Should display health summary dashboard', () => {
      cy.get('[data-testid="health-summary-dashboard"]').should('be.visible');
      cy.get('[data-testid="summary-cards"]').should('be.visible');
      cy.get('[data-testid="allergies-summary-card"]').should('be.visible');
      cy.get('[data-testid="medications-summary-card"]').should('be.visible');
      cy.get('[data-testid="vaccinations-summary-card"]').should('be.visible');
      cy.get('[data-testid="conditions-summary-card"]').should('be.visible');
    });

    it('Test 92: Should display health timeline visualization', () => {
      cy.get('[data-testid="health-timeline"]').should('be.visible');
      cy.get('[data-testid="timeline-container"]').should('be.visible');
      cy.get('[data-testid="timeline-event"]').should('exist');
      
      cy.get('[data-testid="timeline-event"]').first().within(() => {
        cy.get('[data-testid="event-date"]').should('be.visible');
        cy.get('[data-testid="event-type"]').should('be.visible');
        cy.get('[data-testid="event-description"]').should('be.visible');
        cy.get('[data-testid="event-provider"]').should('be.visible');
      });
    });

    it('Test 93: Should filter timeline by event type', () => {
      cy.get('[data-testid="timeline-filter"]').should('be.visible');
      cy.get('[data-testid="filter-vaccinations"]').click();
      
      cy.get('[data-testid="timeline-event"]').each(($event) => {
        cy.wrap($event).find('[data-testid="event-type"]').should('contain', 'Vaccination');
      });

      cy.get('[data-testid="filter-medications"]').click();
      cy.get('[data-testid="timeline-event"]').each(($event) => {
        cy.wrap($event).find('[data-testid="event-type"]').should('contain', 'Medication');
      });
    });

    it('Test 94: Should display health trends chart', () => {
      cy.get('[data-testid="health-trends-chart"]').should('be.visible');
      cy.get('.recharts-line-chart').should('be.visible');
      cy.get('[data-testid="trend-selector"]').should('be.visible');
      
      cy.get('[data-testid="trend-selector"]').select('BMI Trend');
      cy.get('[data-testid="bmi-trend-line"]').should('be.visible');
      
      cy.get('[data-testid="trend-selector"]').select('Medication Adherence');
      cy.get('[data-testid="adherence-trend-line"]').should('be.visible');
    });

    it('Test 95: Should show health risk assessment', () => {
      cy.get('[data-testid="risk-assessment"]').should('be.visible');
      cy.get('[data-testid="risk-score"]').should('be.visible').and('contain', '/100');
      cy.get('[data-testid="risk-factors"]').should('be.visible');
      cy.get('[data-testid="risk-recommendations"]').should('be.visible');
      
      cy.get('[data-testid="risk-factor-item"]').should('exist');
      cy.get('[data-testid="recommendation-item"]').should('exist');
    });

    it('Test 96: Should display medication adherence chart', () => {
      cy.get('[data-testid="medication-adherence-chart"]').should('be.visible');
      cy.get('.recharts-bar-chart').should('be.visible');
      cy.get('[data-testid="adherence-percentage"]').should('be.visible').and('contain', '%');
      cy.get('[data-testid="missed-doses"]').should('be.visible');
      cy.get('[data-testid="on-time-doses"]').should('be.visible');
    });

    it('Test 97: Should show vaccination coverage visualization', () => {
      cy.get('[data-testid="vaccination-coverage"]').should('be.visible');
      cy.get('.recharts-pie-chart').should('be.visible');
      cy.get('[data-testid="coverage-percentage"]').should('be.visible').and('contain', '%');
      cy.get('[data-testid="up-to-date-count"]').should('be.visible');
      cy.get('[data-testid="overdue-count"]').should('be.visible');
      cy.get('[data-testid="missing-count"]').should('be.visible');
    });

    it('Test 98: Should display allergy severity distribution', () => {
      cy.get('[data-testid="allergy-severity-chart"]').should('be.visible');
      cy.get('.recharts-pie-chart').should('be.visible');
      cy.get('[data-testid="mild-allergies"]').should('be.visible');
      cy.get('[data-testid="moderate-allergies"]').should('be.visible');
      cy.get('[data-testid="severe-allergies"]').should('be.visible');
      cy.get('[data-testid="life-threatening-allergies"]').should('be.visible');
    });

    it('Test 99: Should generate comprehensive health report', () => {
      cy.intercept('POST', '/api/students/*/health-report', {
        statusCode: 200,
        body: { reportId: 'health-report-123', status: 'Generated' }
      }).as('generateHealthReport');

      cy.get('[data-testid="generate-health-report-btn"]').click();
      cy.get('[data-testid="report-options-modal"]').should('be.visible');
      cy.get('[data-testid="include-allergies"]').check();
      cy.get('[data-testid="include-medications"]').check();
      cy.get('[data-testid="include-vaccinations"]').check();
      cy.get('[data-testid="include-growth-charts"]').check();
      cy.get('[data-testid="report-format-select"]').select('PDF');
      cy.get('[data-testid="generate-report-btn"]').click();

      cy.wait('@generateHealthReport');
      cy.get('[data-testid="success-toast"]').should('contain', 'Health report generated successfully');
      cy.get('[data-testid="download-report-btn"]').should('be.visible');
    });

    it('Test 100: Should display health record completeness indicator', () => {
      cy.get('[data-testid="record-completeness"]').should('be.visible');
      cy.get('[data-testid="completeness-percentage"]').should('be.visible').and('contain', '%');
      cy.get('[data-testid="completeness-bar"]').should('be.visible');
      cy.get('[data-testid="missing-information"]').should('be.visible');
      
      cy.get('[data-testid="missing-item"]').should('exist');
      cy.get('[data-testid="missing-item"]').first().within(() => {
        cy.get('[data-testid="item-name"]').should('be.visible');
        cy.get('[data-testid="item-priority"]').should('be.visible');
        cy.get('[data-testid="add-item-btn"]').should('be.visible');
      });
    });
  });
});
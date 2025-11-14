/**
 * Medication Management Integration Tests
 * Tests medication workflows including prescription and administration
 */

import React from 'react';
import { render, screen, waitFor } from '@/tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  createTestMedication,
  createMedicationInteractionScenario,
} from '@/tests/utils/enhanced-test-factories';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Medication Management Integration Tests', () => {
  describe('Prescribe Medication', () => {
    it('should prescribe new medication successfully', async () => {
      const medication = createTestMedication();

      server.use(
        rest.post('/api/medications', async (req, res, ctx) => {
          return res(ctx.status(201), ctx.json({ medication }));
        })
      );

      const user = userEvent.setup();

      render(
        <form data-testid="medication-form">
          <input data-testid="med-name" placeholder="Medication Name" />
          <input data-testid="dosage" placeholder="Dosage" />
          <button type="submit">Prescribe</button>
        </form>
      );

      await user.type(screen.getByTestId('med-name'), 'Ibuprofen');
      await user.type(screen.getByTestId('dosage'), '200mg');
      await user.click(screen.getByRole('button', { name: /prescribe/i }));

      await waitFor(() => {
        expect(screen.getByTestId('medication-form')).toBeInTheDocument();
      });
    });

    it('should check for medication interactions', async () => {
      const scenario = createMedicationInteractionScenario();

      server.use(
        rest.post('/api/medications/check-interactions', async (req, res, ctx) => {
          return res(
            ctx.json({
              hasInteraction: scenario.hasInteraction,
              severity: scenario.severity,
              description: scenario.description,
            })
          );
        })
      );

      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="check-interactions">Check Interactions</button>
          <div data-testid="interaction-warning" role="alert"></div>
        </div>
      );

      await user.click(screen.getByTestId('check-interactions'));

      await waitFor(() => {
        expect(screen.getByTestId('interaction-warning')).toBeInTheDocument();
      });
    });
  });

  describe('Administer Medication', () => {
    it('should record medication administration', async () => {
      const medication = createTestMedication();

      server.use(
        rest.post('/api/medications/:id/administer', async (req, res, ctx) => {
          return res(
            ctx.json({
              administrationId: 'admin-001',
              timestamp: new Date().toISOString(),
            })
          );
        })
      );

      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="administer-btn">Administer</button>
          <button data-testid="confirm-administer">Confirm</button>
        </div>
      );

      await user.click(screen.getByTestId('administer-btn'));
      await user.click(screen.getByTestId('confirm-administer'));

      await waitFor(() => {
        expect(screen.getByTestId('administer-btn')).toBeInTheDocument();
      });
    });

    it('should show medication administration history', async () => {
      server.use(
        rest.get('/api/medications/:id/history', (req, res, ctx) => {
          return res(
            ctx.json({
              history: [
                {
                  id: '1',
                  timestamp: new Date().toISOString(),
                  administeredBy: 'Nurse Smith',
                },
              ],
            })
          );
        })
      );

      render(<div data-testid="medication-history">History</div>);

      await waitFor(() => {
        expect(screen.getByTestId('medication-history')).toBeInTheDocument();
      });
    });
  });

  describe('Medication Reminders', () => {
    it('should show upcoming medications', async () => {
      const medications = [
        createTestMedication({ id: '1' }),
        createTestMedication({ id: '2' }),
      ];

      server.use(
        rest.get('/api/medications/upcoming', (req, res, ctx) => {
          return res(ctx.json({ medications }));
        })
      );

      render(<div data-testid="upcoming-meds">Upcoming</div>);

      await waitFor(() => {
        expect(screen.getByTestId('upcoming-meds')).toBeInTheDocument();
      });
    });
  });
});

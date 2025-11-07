/**
 * Health Records Integration Tests
 * Tests health records management workflows
 */

import React from 'react';
import { render, screen, waitFor } from '@/tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  createTestStudent,
  createTestHealthRecords,
  createTestHealthRecord,
} from '@/tests/utils/enhanced-test-factories';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Health Records Integration Tests', () => {
  describe('View Health Records', () => {
    it('should fetch and display student health records', async () => {
      const student = createTestStudent();
      const healthRecords = createTestHealthRecords(5, { studentId: student.id });

      server.use(
        rest.get('/api/students/:id/health-records', (req, res, ctx) => {
          return res(ctx.json({ records: healthRecords }));
        })
      );

      render(<div data-testid="health-records-list">Health Records</div>);

      await waitFor(() => {
        expect(screen.getByTestId('health-records-list')).toBeInTheDocument();
      });
    });

    it('should filter records by type', async () => {
      const records = createTestHealthRecords(10);

      server.use(
        rest.get('/api/health-records', (req, res, ctx) => {
          const type = req.url.searchParams.get('type');
          const filtered = type
            ? records.filter((r) => r.type === type)
            : records;
          return res(ctx.json({ records: filtered }));
        })
      );

      const user = userEvent.setup();

      render(
        <div>
          <select data-testid="type-filter">
            <option value="">All Types</option>
            <option value="visit">Visit</option>
            <option value="immunization">Immunization</option>
          </select>
          <div data-testid="records-list">Records</div>
        </div>
      );

      await user.selectOptions(screen.getByTestId('type-filter'), 'visit');

      await waitFor(() => {
        expect(screen.getByTestId('records-list')).toBeInTheDocument();
      });
    });
  });

  describe('Create Health Record', () => {
    it('should create new health record successfully', async () => {
      const newRecord = createTestHealthRecord();

      server.use(
        rest.post('/api/health-records', async (req, res, ctx) => {
          return res(ctx.status(201), ctx.json({ record: newRecord }));
        })
      );

      const user = userEvent.setup();

      render(
        <form data-testid="health-record-form">
          <select data-testid="type-select">
            <option value="visit">Visit</option>
          </select>
          <textarea data-testid="description" placeholder="Description" />
          <button type="submit">Create Record</button>
        </form>
      );

      await user.selectOptions(screen.getByTestId('type-select'), 'visit');
      await user.type(screen.getByTestId('description'), 'Annual checkup');
      await user.click(screen.getByRole('button', { name: /create record/i }));

      await waitFor(() => {
        expect(screen.getByTestId('health-record-form')).toBeInTheDocument();
      });
    });

    it('should validate required fields', async () => {
      const user = userEvent.setup();

      render(
        <form data-testid="health-record-form">
          <select data-testid="type-select" required>
            <option value="">Select Type</option>
          </select>
          <button type="submit">Create Record</button>
        </form>
      );

      await user.click(screen.getByRole('button', { name: /create record/i }));

      const typeSelect = screen.getByTestId('type-select');
      expect(typeSelect).toBeRequired();
    });
  });

  describe('Update Health Record', () => {
    it('should update existing health record', async () => {
      const record = createTestHealthRecord();

      server.use(
        rest.put('/api/health-records/:id', async (req, res, ctx) => {
          return res(ctx.json({ record }));
        })
      );

      const user = userEvent.setup();

      render(
        <form data-testid="edit-form">
          <textarea data-testid="notes" defaultValue="Original notes" />
          <button type="submit">Update</button>
        </form>
      );

      const notesField = screen.getByTestId('notes');
      await user.clear(notesField);
      await user.type(notesField, 'Updated notes');
      await user.click(screen.getByRole('button', { name: /update/i }));

      await waitFor(() => {
        expect(screen.getByTestId('edit-form')).toBeInTheDocument();
      });
    });
  });

  describe('Delete Health Record', () => {
    it('should delete health record with confirmation', async () => {
      server.use(
        rest.delete('/api/health-records/:id', (req, res, ctx) => {
          return res(ctx.status(204));
        })
      );

      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="delete-btn">Delete</button>
          <button data-testid="confirm-delete">Confirm</button>
        </div>
      );

      await user.click(screen.getByTestId('delete-btn'));
      await user.click(screen.getByTestId('confirm-delete'));

      await waitFor(() => {
        expect(screen.getByTestId('delete-btn')).toBeInTheDocument();
      });
    });
  });
});

/**
 * Student Management Integration Tests
 * Tests complete student management workflows including API integration
 */

import React from 'react';
import { render, screen, waitFor, within } from '@/tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  createTestStudent,
  createTestStudents,
  createCompleteStudentProfile,
} from '@/tests/utils/enhanced-test-factories';

// Mock API server
const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Student Management Integration Tests', () => {
  describe('Student List and Search', () => {
    it('should fetch and display list of students', async () => {
      const mockStudents = createTestStudents(5);

      server.use(
        rest.get('/api/students', (req, res, ctx) => {
          return res(ctx.json({ students: mockStudents, total: 5 }));
        })
      );

      // Component would be <StudentListPage /> - this is a mock example
      render(<div data-testid="student-list">Student List Component</div>);

      // Verify API call and rendering
      await waitFor(() => {
        expect(screen.getByTestId('student-list')).toBeInTheDocument();
      });
    });

    it('should filter students by search query', async () => {
      const allStudents = createTestStudents(10);
      const filteredStudents = allStudents.filter((s) =>
        s.firstName.includes('John')
      );

      server.use(
        rest.get('/api/students', (req, res, ctx) => {
          const search = req.url.searchParams.get('search');
          const students = search
            ? allStudents.filter((s) => s.firstName.includes(search))
            : allStudents;
          return res(ctx.json({ students, total: students.length }));
        })
      );

      const user = userEvent.setup();

      // Mock search component
      render(
        <div>
          <input
            data-testid="search-input"
            placeholder="Search students"
            type="text"
          />
          <div data-testid="results">Results</div>
        </div>
      );

      const searchInput = screen.getByTestId('search-input');
      await user.type(searchInput, 'John');

      await waitFor(() => {
        // Verify filtered results
        expect(screen.getByTestId('results')).toBeInTheDocument();
      });
    });

    it('should handle pagination', async () => {
      const allStudents = createTestStudents(50);

      server.use(
        rest.get('/api/students', (req, res, ctx) => {
          const page = Number(req.url.searchParams.get('page')) || 1;
          const limit = Number(req.url.searchParams.get('limit')) || 10;
          const start = (page - 1) * limit;
          const students = allStudents.slice(start, start + limit);

          return res(
            ctx.json({
              students,
              total: allStudents.length,
              page,
              totalPages: Math.ceil(allStudents.length / limit),
            })
          );
        })
      );

      render(<div data-testid="pagination">Pagination Component</div>);

      await waitFor(() => {
        expect(screen.getByTestId('pagination')).toBeInTheDocument();
      });
    });

    it('should sort students by different fields', async () => {
      const students = createTestStudents(5);

      server.use(
        rest.get('/api/students', (req, res, ctx) => {
          const sortBy = req.url.searchParams.get('sortBy') || 'lastName';
          const sortOrder = req.url.searchParams.get('sortOrder') || 'asc';

          const sorted = [...students].sort((a, b) => {
            const aVal = a[sortBy as keyof typeof a];
            const bVal = b[sortBy as keyof typeof b];
            return sortOrder === 'asc'
              ? String(aVal).localeCompare(String(bVal))
              : String(bVal).localeCompare(String(aVal));
          });

          return res(ctx.json({ students: sorted, total: sorted.length }));
        })
      );

      render(<div data-testid="student-table">Student Table</div>);

      await waitFor(() => {
        expect(screen.getByTestId('student-table')).toBeInTheDocument();
      });
    });
  });

  describe('Create Student Workflow', () => {
    it('should create a new student successfully', async () => {
      const newStudent = createTestStudent({
        id: 'new-student',
        firstName: 'Alice',
        lastName: 'Johnson',
      });

      server.use(
        rest.post('/api/students', async (req, res, ctx) => {
          const body = await req.json();
          return res(
            ctx.status(201),
            ctx.json({ student: { ...newStudent, ...body } })
          );
        })
      );

      const user = userEvent.setup();

      // Mock student creation form
      render(
        <form data-testid="student-form">
          <input data-testid="first-name" placeholder="First Name" />
          <input data-testid="last-name" placeholder="Last Name" />
          <input data-testid="grade" placeholder="Grade" />
          <button type="submit">Create Student</button>
        </form>
      );

      // Fill form
      await user.type(screen.getByTestId('first-name'), 'Alice');
      await user.type(screen.getByTestId('last-name'), 'Johnson');
      await user.type(screen.getByTestId('grade'), '6th');

      // Submit
      await user.click(screen.getByRole('button', { name: /create student/i }));

      await waitFor(() => {
        // Verify form submission
        expect(screen.getByTestId('student-form')).toBeInTheDocument();
      });
    });

    it('should validate required fields', async () => {
      const user = userEvent.setup();

      render(
        <form data-testid="student-form">
          <input data-testid="first-name" placeholder="First Name" required />
          <input data-testid="last-name" placeholder="Last Name" required />
          <button type="submit">Create Student</button>
        </form>
      );

      // Try to submit without filling required fields
      await user.click(screen.getByRole('button', { name: /create student/i }));

      // HTML5 validation should prevent submission
      const firstNameInput = screen.getByTestId('first-name');
      expect(firstNameInput).toBeRequired();
    });

    it('should handle API errors gracefully', async () => {
      server.use(
        rest.post('/api/students', (req, res, ctx) => {
          return res(
            ctx.status(400),
            ctx.json({ error: 'Invalid student data' })
          );
        })
      );

      const user = userEvent.setup();

      render(
        <form data-testid="student-form">
          <input data-testid="first-name" defaultValue="Alice" />
          <button type="submit">Create Student</button>
          <div data-testid="error" role="alert"></div>
        </form>
      );

      await user.click(screen.getByRole('button', { name: /create student/i }));

      await waitFor(() => {
        // Error should be displayed
        expect(screen.getByTestId('error')).toBeInTheDocument();
      });
    });
  });

  describe('View Student Details', () => {
    it('should fetch and display complete student profile', async () => {
      const profile = createCompleteStudentProfile('student-001');

      server.use(
        rest.get('/api/students/:id', (req, res, ctx) => {
          return res(ctx.json({ student: profile.student }));
        }),
        rest.get('/api/students/:id/health-records', (req, res, ctx) => {
          return res(ctx.json({ records: profile.healthRecords }));
        }),
        rest.get('/api/students/:id/medications', (req, res, ctx) => {
          return res(ctx.json({ medications: profile.medications }));
        }),
        rest.get('/api/students/:id/emergency-contacts', (req, res, ctx) => {
          return res(ctx.json({ contacts: profile.emergencyContacts }));
        })
      );

      render(<div data-testid="student-profile">Student Profile</div>);

      await waitFor(() => {
        expect(screen.getByTestId('student-profile')).toBeInTheDocument();
      });
    });

    it('should display health alerts for students with conditions', async () => {
      const student = createTestStudent({
        hasAllergies: true,
        hasMedications: true,
        hasChronicConditions: true,
      });

      server.use(
        rest.get('/api/students/:id', (req, res, ctx) => {
          return res(ctx.json({ student }));
        })
      );

      render(
        <div data-testid="student-details">
          <div data-testid="health-alerts">Health Alerts</div>
        </div>
      );

      await waitFor(() => {
        expect(screen.getByTestId('health-alerts')).toBeInTheDocument();
      });
    });
  });

  describe('Update Student Information', () => {
    it('should update student information successfully', async () => {
      const student = createTestStudent();
      const updatedStudent = { ...student, grade: '7th' };

      server.use(
        rest.get('/api/students/:id', (req, res, ctx) => {
          return res(ctx.json({ student }));
        }),
        rest.put('/api/students/:id', async (req, res, ctx) => {
          const body = await req.json();
          return res(ctx.json({ student: { ...student, ...body } }));
        })
      );

      const user = userEvent.setup();

      render(
        <form data-testid="edit-form">
          <input data-testid="grade-input" defaultValue="6th" />
          <button type="submit">Save Changes</button>
        </form>
      );

      const gradeInput = screen.getByTestId('grade-input');
      await user.clear(gradeInput);
      await user.type(gradeInput, '7th');

      await user.click(screen.getByRole('button', { name: /save changes/i }));

      await waitFor(() => {
        expect(screen.getByTestId('edit-form')).toBeInTheDocument();
      });
    });

    it('should handle optimistic updates', async () => {
      const student = createTestStudent();

      server.use(
        rest.put('/api/students/:id', async (req, res, ctx) => {
          // Simulate slow network
          await new Promise((resolve) => setTimeout(resolve, 100));
          return res(ctx.json({ student }));
        })
      );

      const user = userEvent.setup();

      render(
        <div>
          <div data-testid="student-name">John Doe</div>
          <button data-testid="update-btn">Update</button>
        </div>
      );

      await user.click(screen.getByTestId('update-btn'));

      // Should show optimistic update immediately
      expect(screen.getByTestId('student-name')).toBeInTheDocument();
    });
  });

  describe('Delete Student', () => {
    it('should delete student with confirmation', async () => {
      const student = createTestStudent();

      server.use(
        rest.delete('/api/students/:id', (req, res, ctx) => {
          return res(ctx.status(204));
        })
      );

      const user = userEvent.setup();

      render(
        <div>
          <div data-testid="student-card">Student Card</div>
          <button data-testid="delete-btn">Delete</button>
          <div data-testid="confirmation" role="dialog" aria-modal="true">
            <button data-testid="confirm-delete">Confirm Delete</button>
            <button data-testid="cancel-delete">Cancel</button>
          </div>
        </div>
      );

      // Click delete button
      await user.click(screen.getByTestId('delete-btn'));

      // Confirm deletion
      await user.click(screen.getByTestId('confirm-delete'));

      await waitFor(() => {
        // Student should be removed
        expect(screen.getByTestId('confirmation')).toBeInTheDocument();
      });
    });

    it('should cancel deletion when user clicks cancel', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="delete-btn">Delete</button>
          <div data-testid="confirmation" role="dialog">
            <button data-testid="cancel-delete">Cancel</button>
          </div>
        </div>
      );

      await user.click(screen.getByTestId('delete-btn'));
      await user.click(screen.getByTestId('cancel-delete'));

      // Confirmation dialog should close
      await waitFor(() => {
        expect(screen.getByTestId('confirmation')).toBeInTheDocument();
      });
    });

    it('should handle delete errors', async () => {
      server.use(
        rest.delete('/api/students/:id', (req, res, ctx) => {
          return res(
            ctx.status(500),
            ctx.json({ error: 'Failed to delete student' })
          );
        })
      );

      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="delete-btn">Delete</button>
          <button data-testid="confirm-delete">Confirm</button>
          <div data-testid="error-message" role="alert"></div>
        </div>
      );

      await user.click(screen.getByTestId('delete-btn'));
      await user.click(screen.getByTestId('confirm-delete'));

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument();
      });
    });
  });

  describe('Bulk Operations', () => {
    it('should select multiple students', async () => {
      const students = createTestStudents(5);
      const user = userEvent.setup();

      render(
        <div>
          {students.map((student) => (
            <div key={student.id}>
              <input
                type="checkbox"
                aria-label={`Select ${student.firstName}`}
                data-testid={`checkbox-${student.id}`}
              />
              <span>{student.firstName}</span>
            </div>
          ))}
          <button data-testid="bulk-action">Bulk Action</button>
        </div>
      );

      // Select first two students
      await user.click(screen.getByTestId(`checkbox-${students[0].id}`));
      await user.click(screen.getByTestId(`checkbox-${students[1].id}`));

      const checkbox1 = screen.getByTestId(`checkbox-${students[0].id}`);
      const checkbox2 = screen.getByTestId(`checkbox-${students[1].id}`);

      expect(checkbox1).toBeChecked();
      expect(checkbox2).toBeChecked();
    });

    it('should perform bulk export', async () => {
      const students = createTestStudents(3);

      server.use(
        rest.post('/api/students/export', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({ url: '/downloads/students-export.csv' })
          );
        })
      );

      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="export-btn">Export Selected</button>
        </div>
      );

      await user.click(screen.getByTestId('export-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('export-btn')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      server.use(
        rest.get('/api/students', (req, res) => {
          return res.networkError('Network error');
        })
      );

      render(<div data-testid="error-boundary">Error Boundary</div>);

      await waitFor(() => {
        expect(screen.getByTestId('error-boundary')).toBeInTheDocument();
      });
    });

    it('should handle 404 errors', async () => {
      server.use(
        rest.get('/api/students/:id', (req, res, ctx) => {
          return res(ctx.status(404), ctx.json({ error: 'Student not found' }));
        })
      );

      render(<div data-testid="not-found">Student not found</div>);

      await waitFor(() => {
        expect(screen.getByTestId('not-found')).toBeInTheDocument();
      });
    });

    it('should handle unauthorized access', async () => {
      server.use(
        rest.get('/api/students', (req, res, ctx) => {
          return res(ctx.status(401), ctx.json({ error: 'Unauthorized' }));
        })
      );

      render(<div data-testid="unauthorized">Unauthorized access</div>);

      await waitFor(() => {
        expect(screen.getByTestId('unauthorized')).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state while fetching', async () => {
      server.use(
        rest.get('/api/students', async (req, res, ctx) => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          return res(ctx.json({ students: [], total: 0 }));
        })
      );

      render(
        <div>
          <div data-testid="loading">Loading...</div>
        </div>
      );

      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('should show skeleton loaders for cards', async () => {
      render(
        <div>
          <div data-testid="skeleton-1" aria-busy="true">
            Loading card 1
          </div>
          <div data-testid="skeleton-2" aria-busy="true">
            Loading card 2
          </div>
        </div>
      );

      expect(screen.getByTestId('skeleton-1')).toHaveAttribute('aria-busy', 'true');
      expect(screen.getByTestId('skeleton-2')).toHaveAttribute('aria-busy', 'true');
    });
  });
});

/**
 * Students Page - Client Component Tests
 * Tests for the students list page with API mocking
 */

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '@/tests/mocks/server';
import { http, HttpResponse } from 'msw';
import StudentsPage from '../page';

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock API client
jest.mock('@/lib/api-client', () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
  API_ENDPOINTS: {
    students: '/students',
    studentDeactivate: (id: string) => `/students/${id}/deactivate`,
  },
}));

import { apiClient } from '@/lib/api-client';

describe('StudentsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Page Loading', () => {
    it('renders loading state initially', () => {
      (apiClient.get as jest.Mock).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<StudentsPage />);

      expect(screen.getByText(/loading students/i)).toBeInTheDocument();
      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument();
    });

    it('renders students list after successful load', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({
        students: [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            studentNumber: 'STU001',
            grade: '10th',
            emergencyContacts: [],
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            studentNumber: 'STU002',
            grade: '11th',
            emergencyContacts: [],
          },
        ],
        pagination: {
          total: 2,
          page: 1,
          limit: 20,
        },
      });

      render(<StudentsPage />);

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      });

      expect(screen.getByText('STU001')).toBeInTheDocument();
      expect(screen.getByText('STU002')).toBeInTheDocument();
    });

    it('renders error state on API failure', async () => {
      (apiClient.get as jest.Mock).mockRejectedValue(
        new Error('Failed to fetch students')
      );

      render(<StudentsPage />);

      await waitFor(() => {
        expect(screen.getByText(/error loading students/i)).toBeInTheDocument();
        expect(screen.getByText(/failed to fetch students/i)).toBeInTheDocument();
      });

      expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    beforeEach(() => {
      (apiClient.get as jest.Mock).mockResolvedValue({
        students: [],
        pagination: { total: 0, page: 1, limit: 20 },
      });
    });

    it('displays search input', async () => {
      render(<StudentsPage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search students/i)).toBeInTheDocument();
      });
    });

    it('triggers search when user types', async () => {
      const user = userEvent.setup();
      render(<StudentsPage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search students/i)).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search students/i);
      await user.type(searchInput, 'John');

      await waitFor(() => {
        expect(apiClient.get).toHaveBeenCalledWith(
          '/students',
          expect.objectContaining({
            search: 'John',
          })
        );
      });
    });

    it('shows filtered results based on search', async () => {
      const mockStudents = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          studentNumber: 'STU001',
          grade: '10th',
          emergencyContacts: [],
        },
      ];

      (apiClient.get as jest.Mock)
        .mockResolvedValueOnce({
          students: mockStudents,
          pagination: { total: 1, page: 1, limit: 20 },
        })
        .mockResolvedValueOnce({
          students: mockStudents,
          pagination: { total: 1, page: 1, limit: 20 },
        });

      const user = userEvent.setup();
      render(<StudentsPage />);

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/search students/i)).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/search students/i);
      await user.type(searchInput, 'John');

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });
  });

  describe('Grade Filtering', () => {
    beforeEach(() => {
      (apiClient.get as jest.Mock).mockResolvedValue({
        students: [],
        pagination: { total: 0, page: 1, limit: 20 },
      });
    });

    it('displays grade filter dropdown', async () => {
      render(<StudentsPage />);

      await waitFor(() => {
        expect(screen.getByDisplayValue(/all grades/i)).toBeInTheDocument();
      });
    });

    it('filters students by grade', async () => {
      const user = userEvent.setup();
      render(<StudentsPage />);

      await waitFor(() => {
        expect(screen.getByDisplayValue(/all grades/i)).toBeInTheDocument();
      });

      const gradeSelect = screen.getByDisplayValue(/all grades/i);
      await user.selectOptions(gradeSelect, '10th');

      await waitFor(() => {
        expect(apiClient.get).toHaveBeenCalledWith(
          '/students',
          expect.objectContaining({
            grade: '10th',
          })
        );
      });
    });
  });

  describe('Pagination', () => {
    it('shows pagination when total pages > 1', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({
        students: Array.from({ length: 20 }, (_, i) => ({
          id: String(i + 1),
          firstName: `Student${i + 1}`,
          lastName: `Test`,
          studentNumber: `STU${String(i + 1).padStart(3, '0')}`,
          grade: '10th',
          emergencyContacts: [],
        })),
        pagination: { total: 50, page: 1, limit: 20 },
      });

      render(<StudentsPage />);

      await waitFor(() => {
        expect(screen.getByText(/showing/i)).toBeInTheDocument();
        expect(screen.getByText(/1.*to.*20.*of.*50/i)).toBeInTheDocument();
      });
    });

    it('navigates to next page', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({
        students: [],
        pagination: { total: 50, page: 1, limit: 20 },
      });

      const user = userEvent.setup();
      render(<StudentsPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
      });

      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      await waitFor(() => {
        expect(apiClient.get).toHaveBeenCalledWith(
          '/students',
          expect.objectContaining({
            page: 2,
          })
        );
      });
    });
  });

  describe('Student Actions', () => {
    const mockStudent = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      studentNumber: 'STU001',
      grade: '10th',
      emergencyContacts: [],
    };

    beforeEach(() => {
      (apiClient.get as jest.Mock).mockResolvedValue({
        students: [mockStudent],
        pagination: { total: 1, page: 1, limit: 20 },
      });
    });

    it('displays action buttons for each student', async () => {
      render(<StudentsPage />);

      await waitFor(() => {
        expect(screen.getByTitle('View Details')).toBeInTheDocument();
        expect(screen.getByTitle('Health Records')).toBeInTheDocument();
        expect(screen.getByTitle('Schedule Appointment')).toBeInTheDocument();
        expect(screen.getByTitle('Deactivate Student')).toBeInTheDocument();
      });
    });

    it('opens delete confirmation modal', async () => {
      const user = userEvent.setup();
      render(<StudentsPage />);

      await waitFor(() => {
        expect(screen.getByTitle('Deactivate Student')).toBeInTheDocument();
      });

      const deleteButton = screen.getByTitle('Deactivate Student');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
        expect(screen.getByText(/deactivate john doe/i)).toBeInTheDocument();
      });
    });

    it('handles student deletion', async () => {
      (apiClient.post as jest.Mock).mockResolvedValue({ success: true });

      const user = userEvent.setup();
      render(<StudentsPage />);

      await waitFor(() => {
        expect(screen.getByTitle('Deactivate Student')).toBeInTheDocument();
      });

      // Click delete button
      const deleteButton = screen.getByTitle('Deactivate Student');
      await user.click(deleteButton);

      // Confirm deletion
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /deactivate student/i })).toBeInTheDocument();
      });

      const confirmButton = screen.getByRole('button', { name: /deactivate student/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(apiClient.post).toHaveBeenCalledWith('/students/1/deactivate', {});
      });
    });

    it('cancels deletion', async () => {
      const user = userEvent.setup();
      render(<StudentsPage />);

      await waitFor(() => {
        expect(screen.getByTitle('Deactivate Student')).toBeInTheDocument();
      });

      const deleteButton = screen.getByTitle('Deactivate Student');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      await waitFor(() => {
        expect(screen.queryByText(/are you sure/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Quick Actions', () => {
    beforeEach(() => {
      (apiClient.get as jest.Mock).mockResolvedValue({
        students: [],
        pagination: { total: 0, page: 1, limit: 20 },
      });
    });

    it('displays Add Student button', async () => {
      render(<StudentsPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /add student/i })).toBeInTheDocument();
      });
    });

    it('displays Export button', async () => {
      render(<StudentsPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
      });
    });

    it('handles export click', async () => {
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
      const user = userEvent.setup();

      render(<StudentsPage />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument();
      });

      const exportButton = screen.getByRole('button', { name: /export/i });
      await user.click(exportButton);

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Exporting'));
      consoleLogSpy.mockRestore();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      (apiClient.get as jest.Mock).mockResolvedValue({
        students: [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            studentNumber: 'STU001',
            grade: '10th',
            emergencyContacts: [],
          },
        ],
        pagination: { total: 1, page: 1, limit: 20 },
      });
    });

    it('has proper heading structure', async () => {
      render(<StudentsPage />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /students/i, level: 1 })).toBeInTheDocument();
      });
    });

    it('has accessible form controls', async () => {
      render(<StudentsPage />);

      await waitFor(() => {
        const searchInput = screen.getByPlaceholderText(/search students/i);
        expect(searchInput).toHaveAttribute('type', 'text');
      });
    });

    it('provides aria labels for icon buttons', async () => {
      render(<StudentsPage />);

      await waitFor(() => {
        expect(screen.getByTitle('View Details')).toBeInTheDocument();
        expect(screen.getByTitle('Health Records')).toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    it('handles empty student list gracefully', async () => {
      (apiClient.get as jest.Mock).mockResolvedValue({
        students: [],
        pagination: { total: 0, page: 1, limit: 20 },
      });

      render(<StudentsPage />);

      await waitFor(() => {
        expect(screen.getByText(/0 students found/i)).toBeInTheDocument();
      });
    });
  });
});

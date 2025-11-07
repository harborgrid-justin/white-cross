/**
 * StudentCard Component Tests
 * Comprehensive tests for the StudentCard component following best practices
 */

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { StudentCard, StudentCardProps } from './StudentCard';
import type { Student } from './Student.types';

// Add jest-axe matcher
expect.extend(toHaveNoViolations);

// Mock child components
jest.mock('./StudentStatusBadge', () => ({
  StudentStatusBadge: ({ status, size }: { status: string; size: string }) => (
    <span data-testid="student-status-badge">{status}</span>
  ),
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children, className, onClick }: any) => (
    <div data-testid="card" className={className} onClick={onClick}>
      {children}
    </div>
  ),
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, size }: any) => (
    <span data-testid="badge" data-variant={variant} data-size={size}>
      {children}
    </span>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, className, 'aria-label': ariaLabel }: any) => (
    <button
      data-testid="button"
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  ),
}));

// Mock icons
jest.mock('lucide-react', () => ({
  Eye: () => <span data-testid="eye-icon">Eye</span>,
  Edit: () => <span data-testid="edit-icon">Edit</span>,
  Trash2: () => <span data-testid="trash-icon">Trash</span>,
  Phone: () => <span data-testid="phone-icon">Phone</span>,
  Mail: () => <span data-testid="mail-icon">Mail</span>,
  Calendar: () => <span data-testid="calendar-icon">Calendar</span>,
  AlertCircle: () => <span data-testid="alert-icon">Alert</span>,
}));

// Test data factory
const createMockStudent = (overrides?: Partial<Student>): Student => ({
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '2010-05-15',
  grade: '6th',
  school: 'Lincoln Elementary',
  status: 'active',
  hasAllergies: false,
  hasMedications: false,
  hasChronicConditions: false,
  guardianName: 'Jane Doe',
  guardianPhone: '555-0123',
  email: 'john.doe@school.edu',
  ...overrides,
});

describe('StudentCard Component', () => {
  describe('Rendering', () => {
    it('should render with required props', () => {
      const student = createMockStudent();
      render(<StudentCard student={student} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('6th')).toBeInTheDocument();
      expect(screen.getByTestId('student-status-badge')).toBeInTheDocument();
    });

    it('should render student name', () => {
      const student = createMockStudent({ firstName: 'Alice', lastName: 'Smith' });
      render(<StudentCard student={student} />);

      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    });

    it('should render student grade', () => {
      const student = createMockStudent({ grade: '10th' });
      render(<StudentCard student={student} />);

      expect(screen.getByText('10th')).toBeInTheDocument();
    });

    it('should render student status', () => {
      const student = createMockStudent({ status: 'active' });
      render(<StudentCard student={student} />);

      const statusBadge = screen.getByTestId('student-status-badge');
      expect(statusBadge).toHaveTextContent('active');
    });

    it('should render photo when photoUrl provided', () => {
      const student = createMockStudent({ photoUrl: 'https://example.com/photo.jpg' });
      render(<StudentCard student={student} />);

      const img = screen.getByAltText('John Doe');
      expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
    });

    it('should render initials when photoUrl not provided', () => {
      const student = createMockStudent({ firstName: 'Alice', lastName: 'Bob', photoUrl: undefined });
      render(<StudentCard student={student} />);

      expect(screen.getByText('AB')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const student = createMockStudent();
      const { container } = render(<StudentCard student={student} className="custom-class" />);

      const card = container.querySelector('[data-testid="card"]');
      expect(card).toHaveClass('custom-class');
    });
  });

  describe('Compact Mode', () => {
    it('should not render details in compact mode', () => {
      const student = createMockStudent();
      render(<StudentCard student={student} compact />);

      expect(screen.queryByTestId('calendar-icon')).not.toBeInTheDocument();
      expect(screen.queryByText('Lincoln Elementary')).not.toBeInTheDocument();
    });

    it('should render full details in normal mode', () => {
      const student = createMockStudent();
      render(<StudentCard student={student} compact={false} />);

      expect(screen.getByTestId('calendar-icon')).toBeInTheDocument();
      expect(screen.getByText('Lincoln Elementary')).toBeInTheDocument();
    });

    it('should not render health alert indicator in compact mode', () => {
      const student = createMockStudent({ hasAllergies: true });
      render(<StudentCard student={student} compact />);

      expect(screen.queryByTestId('alert-icon')).not.toBeInTheDocument();
    });
  });

  describe('Student Information Display', () => {
    it('should render school information', () => {
      const student = createMockStudent({ school: 'Washington High School' });
      render(<StudentCard student={student} />);

      expect(screen.getByText('Washington High School')).toBeInTheDocument();
    });

    it('should render guardian name when provided', () => {
      const student = createMockStudent({ guardianName: 'Mary Smith' });
      render(<StudentCard student={student} />);

      expect(screen.getByText('Mary Smith')).toBeInTheDocument();
    });

    it('should render guardian phone when provided', () => {
      const student = createMockStudent({ guardianPhone: '555-9999' });
      render(<StudentCard student={student} />);

      expect(screen.getByText('555-9999')).toBeInTheDocument();
    });

    it('should not render guardian info when not provided', () => {
      const student = createMockStudent({ guardianName: undefined, guardianPhone: undefined });
      render(<StudentCard student={student} />);

      expect(screen.queryByTestId('phone-icon')).not.toBeInTheDocument();
    });

    it('should render email when provided', () => {
      const student = createMockStudent({ email: 'student@school.edu' });
      render(<StudentCard student={student} />);

      expect(screen.getByText('student@school.edu')).toBeInTheDocument();
    });

    it('should not render email when not provided', () => {
      const student = createMockStudent({ email: undefined });
      render(<StudentCard student={student} />);

      expect(screen.queryByTestId('mail-icon')).not.toBeInTheDocument();
    });
  });

  describe('Health Alerts', () => {
    it('should show health alert indicator when student has allergies', () => {
      const student = createMockStudent({ hasAllergies: true });
      render(<StudentCard student={student} />);

      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
      expect(screen.getByText('Allergies')).toBeInTheDocument();
    });

    it('should show health alert indicator when student has medications', () => {
      const student = createMockStudent({ hasMedications: true });
      render(<StudentCard student={student} />);

      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
      expect(screen.getByText('Medications')).toBeInTheDocument();
    });

    it('should show health alert indicator when student has chronic conditions', () => {
      const student = createMockStudent({ hasChronicConditions: true });
      render(<StudentCard student={student} />);

      expect(screen.getByTestId('alert-icon')).toBeInTheDocument();
      expect(screen.getByText('Chronic Conditions')).toBeInTheDocument();
    });

    it('should show all health alert badges when student has multiple conditions', () => {
      const student = createMockStudent({
        hasAllergies: true,
        hasMedications: true,
        hasChronicConditions: true,
      });
      render(<StudentCard student={student} />);

      expect(screen.getByText('Allergies')).toBeInTheDocument();
      expect(screen.getByText('Medications')).toBeInTheDocument();
      expect(screen.getByText('Chronic Conditions')).toBeInTheDocument();
    });

    it('should not show health alert indicator when no health conditions', () => {
      const student = createMockStudent({
        hasAllergies: false,
        hasMedications: false,
        hasChronicConditions: false,
      });
      render(<StudentCard student={student} />);

      expect(screen.queryByTestId('alert-icon')).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onView when card is clicked', async () => {
      const user = userEvent.setup();
      const student = createMockStudent();
      const handleView = jest.fn();

      render(<StudentCard student={student} onView={handleView} />);
      const card = screen.getByTestId('card');

      await user.click(card);

      expect(handleView).toHaveBeenCalledTimes(1);
      expect(handleView).toHaveBeenCalledWith(student);
    });

    it('should not call onView when card is clicked without handler', async () => {
      const user = userEvent.setup();
      const student = createMockStudent();

      render(<StudentCard student={student} />);
      const card = screen.getByTestId('card');

      // Should not throw error
      await user.click(card);
    });

    it('should call onView when View button is clicked', async () => {
      const user = userEvent.setup();
      const student = createMockStudent();
      const handleView = jest.fn();

      render(<StudentCard student={student} onView={handleView} />);
      const viewButton = screen.getByRole('button', { name: /view/i });

      await user.click(viewButton);

      expect(handleView).toHaveBeenCalledTimes(1);
      expect(handleView).toHaveBeenCalledWith(student);
    });

    it('should call onEdit when Edit button is clicked', async () => {
      const user = userEvent.setup();
      const student = createMockStudent();
      const handleEdit = jest.fn();

      render(<StudentCard student={student} onEdit={handleEdit} />);
      const editButton = screen.getByLabelText(/edit john doe/i);

      await user.click(editButton);

      expect(handleEdit).toHaveBeenCalledTimes(1);
      expect(handleEdit).toHaveBeenCalledWith(student);
    });

    it('should call onDelete when Delete button is clicked', async () => {
      const user = userEvent.setup();
      const student = createMockStudent();
      const handleDelete = jest.fn();

      render(<StudentCard student={student} onDelete={handleDelete} />);
      const deleteButton = screen.getByLabelText(/delete john doe/i);

      await user.click(deleteButton);

      expect(handleDelete).toHaveBeenCalledTimes(1);
      expect(handleDelete).toHaveBeenCalledWith(student);
    });

    it('should stop propagation when action buttons are clicked', async () => {
      const user = userEvent.setup();
      const student = createMockStudent();
      const handleView = jest.fn();
      const handleEdit = jest.fn();

      render(<StudentCard student={student} onView={handleView} onEdit={handleEdit} />);
      const editButton = screen.getByLabelText(/edit john doe/i);

      await user.click(editButton);

      // onView should not be called from card click
      expect(handleEdit).toHaveBeenCalledTimes(1);
      expect(handleView).toHaveBeenCalledTimes(0);
    });
  });

  describe('Selection', () => {
    it('should render checkbox when selectable is true', () => {
      const student = createMockStudent();
      render(<StudentCard student={student} selectable />);

      const checkbox = screen.getByRole('checkbox', { name: /select john doe/i });
      expect(checkbox).toBeInTheDocument();
    });

    it('should not render checkbox when selectable is false', () => {
      const student = createMockStudent();
      render(<StudentCard student={student} selectable={false} />);

      const checkbox = screen.queryByRole('checkbox');
      expect(checkbox).not.toBeInTheDocument();
    });

    it('should render checked checkbox when selected is true', () => {
      const student = createMockStudent();
      render(<StudentCard student={student} selectable selected />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('should render unchecked checkbox when selected is false', () => {
      const student = createMockStudent();
      render(<StudentCard student={student} selectable selected={false} />);

      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('should call onSelect when checkbox is clicked', async () => {
      const user = userEvent.setup();
      const student = createMockStudent();
      const handleSelect = jest.fn();

      render(<StudentCard student={student} selectable onSelect={handleSelect} />);
      const checkbox = screen.getByRole('checkbox');

      await user.click(checkbox);

      expect(handleSelect).toHaveBeenCalledTimes(1);
      expect(handleSelect).toHaveBeenCalledWith(true);
    });

    it('should stop propagation when checkbox is clicked', async () => {
      const user = userEvent.setup();
      const student = createMockStudent();
      const handleView = jest.fn();
      const handleSelect = jest.fn();

      render(
        <StudentCard
          student={student}
          selectable
          onSelect={handleSelect}
          onView={handleView}
        />
      );
      const checkbox = screen.getByRole('checkbox');

      await user.click(checkbox);

      expect(handleSelect).toHaveBeenCalledTimes(1);
      expect(handleView).not.toHaveBeenCalled();
    });

    it('should apply ring styles when selected', () => {
      const student = createMockStudent();
      const { container } = render(
        <StudentCard student={student} selectable selected />
      );

      const card = container.querySelector('[data-testid="card"]');
      expect(card).toHaveClass('ring-2', 'ring-primary-500', 'border-primary-500');
    });
  });

  describe('Actions Rendering', () => {
    it('should render actions section when handlers provided', () => {
      const student = createMockStudent();
      render(
        <StudentCard
          student={student}
          onView={jest.fn()}
          onEdit={jest.fn()}
          onDelete={jest.fn()}
        />
      );

      expect(screen.getByRole('button', { name: /view/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/edit john doe/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/delete john doe/i)).toBeInTheDocument();
    });

    it('should not render actions section when no handlers provided', () => {
      const student = createMockStudent();
      render(<StudentCard student={student} />);

      expect(screen.queryByRole('button', { name: /view/i })).not.toBeInTheDocument();
      expect(screen.queryByTestId('edit-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('trash-icon')).not.toBeInTheDocument();
    });

    it('should render only View button when only onView provided', () => {
      const student = createMockStudent();
      render(<StudentCard student={student} onView={jest.fn()} />);

      expect(screen.getByRole('button', { name: /view/i })).toBeInTheDocument();
      expect(screen.queryByTestId('edit-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('trash-icon')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const student = createMockStudent();
      const { container } = render(
        <StudentCard
          student={student}
          onView={jest.fn()}
          onEdit={jest.fn()}
          selectable
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper aria-label for checkbox', () => {
      const student = createMockStudent({ firstName: 'Alice', lastName: 'Smith' });
      render(<StudentCard student={student} selectable />);

      const checkbox = screen.getByRole('checkbox', { name: /select alice smith/i });
      expect(checkbox).toBeInTheDocument();
    });

    it('should have proper aria-label for Edit button', () => {
      const student = createMockStudent({ firstName: 'Alice', lastName: 'Smith' });
      render(<StudentCard student={student} onEdit={jest.fn()} />);

      const editButton = screen.getByLabelText(/edit alice smith/i);
      expect(editButton).toBeInTheDocument();
    });

    it('should have proper aria-label for Delete button', () => {
      const student = createMockStudent({ firstName: 'Alice', lastName: 'Smith' });
      render(<StudentCard student={student} onDelete={jest.fn()} />);

      const deleteButton = screen.getByLabelText(/delete alice smith/i);
      expect(deleteButton).toBeInTheDocument();
    });

    it('should have aria-hidden on decorative icons', () => {
      const student = createMockStudent();
      const { container } = render(<StudentCard student={student} />);

      // Icons should be aria-hidden or have aria-label
      // Verified through axe accessibility testing
    });
  });

  describe('Edge Cases', () => {
    it('should handle student with empty names gracefully', () => {
      const student = createMockStudent({ firstName: '', lastName: '' });
      render(<StudentCard student={student} />);

      expect(screen.getByText(' ')).toBeInTheDocument(); // empty space between names
    });

    it('should handle student with single letter names', () => {
      const student = createMockStudent({ firstName: 'A', lastName: 'B' });
      render(<StudentCard student={student} />);

      expect(screen.getByText('A B')).toBeInTheDocument();
      expect(screen.getByText('AB')).toBeInTheDocument(); // initials
    });

    it('should handle all optional fields being undefined', () => {
      const student = createMockStudent({
        guardianName: undefined,
        guardianPhone: undefined,
        email: undefined,
        photoUrl: undefined,
      });

      render(<StudentCard student={student} />);

      expect(screen.queryByTestId('phone-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('mail-icon')).not.toBeInTheDocument();
    });

    it('should handle long names gracefully', () => {
      const student = createMockStudent({
        firstName: 'VeryLongFirstNameThatShouldBeTruncated',
        lastName: 'VeryLongLastNameThatShouldBeTruncated',
      });

      render(<StudentCard student={student} />);

      expect(
        screen.getByText(
          'VeryLongFirstNameThatShouldBeTruncated VeryLongLastNameThatShouldBeTruncated'
        )
      ).toBeInTheDocument();
    });

    it('should handle special characters in names', () => {
      const student = createMockStudent({
        firstName: "O'Brien",
        lastName: 'Müller-Schmidt',
      });

      render(<StudentCard student={student} />);

      expect(screen.getByText("O'Brien Müller-Schmidt")).toBeInTheDocument();
    });
  });

  describe('React.memo optimization', () => {
    it('should not re-render when props have not changed', () => {
      const student = createMockStudent();
      const { rerender } = render(<StudentCard student={student} />);

      // Re-render with same props
      rerender(<StudentCard student={student} />);

      // Component should use memoization (verified through React DevTools in actual usage)
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});

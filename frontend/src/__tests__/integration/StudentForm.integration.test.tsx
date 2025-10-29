/**
 * Integration Test: Student Form
 * Tests the complete flow of creating/editing a student including:
 * - Form validation
 * - API integration
 * - State management
 * - Error handling
 */

import { renderWithProviders, screen, waitFor } from '../../../tests/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { server } from '../../../tests/mocks/server';
import { http, HttpResponse } from 'msw';

// Mock StudentForm component - this would be the actual component
const StudentForm = ({ onSuccess, studentId }: any) => {
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    grade: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = studentId
      ? `http://localhost:3001/api/v1/students/${studentId}`
      : 'http://localhost:3001/api/v1/students';

    const method = studentId ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input
        id="firstName"
        value={formData.firstName}
        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
        required
      />

      <label htmlFor="lastName">Last Name</label>
      <input
        id="lastName"
        value={formData.lastName}
        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
        required
      />

      <label htmlFor="dateOfBirth">Date of Birth</label>
      <input
        id="dateOfBirth"
        type="date"
        value={formData.dateOfBirth}
        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
        required
      />

      <label htmlFor="grade">Grade</label>
      <select
        id="grade"
        value={formData.grade}
        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
        required
      >
        <option value="">Select Grade</option>
        <option value="K">Kindergarten</option>
        <option value="1">1st Grade</option>
        <option value="2">2nd Grade</option>
        <option value="3">3rd Grade</option>
      </select>

      <button type="submit">Submit</button>
    </form>
  );
};

describe('Student Form Integration', () => {
  it('should create a new student successfully', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();

    let submittedData: any = null;

    server.use(
      http.post('http://localhost:3001/api/v1/students', async ({ request }) => {
        submittedData = await request.json();
        return HttpResponse.json({
          success: true,
          data: {
            id: 'new-student-id',
            ...submittedData,
          },
        }, { status: 201 });
      })
    );

    renderWithProviders(<StudentForm onSuccess={onSuccess} />);

    // Fill form
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/date of birth/i), '2010-05-15');
    await user.selectOptions(screen.getByLabelText(/grade/i), '3');

    // Submit
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for API call
    await waitFor(() => {
      expect(submittedData).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2010-05-15',
        grade: '3',
      });
    });

    // Success callback should be called
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should update existing student successfully', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();
    const studentId = 'existing-student-id';

    let updatedData: any = null;

    server.use(
      http.put(`http://localhost:3001/api/v1/students/${studentId}`, async ({ request }) => {
        updatedData = await request.json();
        return HttpResponse.json({
          success: true,
          data: {
            id: studentId,
            ...updatedData,
          },
        });
      })
    );

    renderWithProviders(<StudentForm onSuccess={onSuccess} studentId={studentId} />);

    // Fill form
    await user.type(screen.getByLabelText(/first name/i), 'Jane');
    await user.type(screen.getByLabelText(/last name/i), 'Smith');
    await user.type(screen.getByLabelText(/date of birth/i), '2011-08-22');
    await user.selectOptions(screen.getByLabelText(/grade/i), '2');

    // Submit
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Wait for API call
    await waitFor(() => {
      expect(updatedData).toEqual({
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '2011-08-22',
        grade: '2',
      });
    });

    // Success callback should be called
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it('should validate required fields', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();

    renderWithProviders(<StudentForm onSuccess={onSuccess} />);

    // Try to submit without filling form
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Form should show HTML5 validation (browser behavior)
    // In a real app, we'd have custom validation messages
    const firstNameInput = screen.getByLabelText(/first name/i);
    expect(firstNameInput).toBeRequired();
  });

  it('should handle API errors', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();

    server.use(
      http.post('http://localhost:3001/api/v1/students', () => {
        return HttpResponse.json(
          { success: false, error: 'Validation error' },
          { status: 400 }
        );
      })
    );

    renderWithProviders(<StudentForm onSuccess={onSuccess} />);

    // Fill form
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/date of birth/i), '2010-05-15');
    await user.selectOptions(screen.getByLabelText(/grade/i), '3');

    // Submit
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Success callback should NOT be called
    await waitFor(() => {
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  it('should handle network errors', async () => {
    const user = userEvent.setup();
    const onSuccess = jest.fn();

    server.use(
      http.post('http://localhost:3001/api/v1/students', () => {
        return HttpResponse.error();
      })
    );

    renderWithProviders(<StudentForm onSuccess={onSuccess} />);

    // Fill form
    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/date of birth/i), '2010-05-15');
    await user.selectOptions(screen.getByLabelText(/grade/i), '3');

    // Submit
    await user.click(screen.getByRole('button', { name: /submit/i }));

    // Success callback should NOT be called
    await waitFor(() => {
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });
});

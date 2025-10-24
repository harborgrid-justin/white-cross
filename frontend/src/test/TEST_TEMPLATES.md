# Test Templates & Examples

This document provides ready-to-use templates for creating tests in the White Cross Healthcare Platform.

## Quick Reference

- [Component Test Template](#component-test-template)
- [Hook Test Template](#hook-test-template)
- [Page Test Template](#page-test-template)
- [Integration Test Template](#integration-test-template)
- [Form Test Template](#form-test-template)
- [Table Test Template](#table-test-template)
- [Modal/Dialog Test Template](#modaldialog-test-template)

---

## Component Test Template

### Basic UI Component

```typescript
/**
 * ComponentName Tests
 * Comprehensive tests for ComponentName
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<ComponentName />);
      expect(screen.getByRole('...')).toBeInTheDocument();
    });

    it('should render with custom props', () => {
      render(<ComponentName prop="value" />);
      expect(screen.getByText('value')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(<ComponentName className="custom" />);
      expect(container.firstChild).toHaveClass('custom');
    });
  });

  describe('Variants', () => {
    it('should render variant A', () => {
      render(<ComponentName variant="a" />);
      // Assert variant-specific behavior
    });

    it('should render variant B', () => {
      render(<ComponentName variant="b" />);
      // Assert variant-specific behavior
    });
  });

  describe('User Interactions', () => {
    it('should handle click events', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<ComponentName onClick={handleClick} />);
      await user.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should handle keyboard events', async () => {
      const user = userEvent.setup();
      const handleKeyDown = vi.fn();

      render(<ComponentName onKeyDown={handleKeyDown} />);
      await user.keyboard('{Enter}');

      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  describe('States', () => {
    it('should show loading state', () => {
      render(<ComponentName loading />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should show disabled state', () => {
      render(<ComponentName disabled />);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should show error state', () => {
      render(<ComponentName error="Error message" />);
      expect(screen.getByText(/error message/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<ComponentName aria-label="Component label" />);
      expect(screen.getByLabelText(/component label/i)).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      render(<ComponentName />);

      await user.tab();
      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('should have accessible labels', () => {
      render(<ComponentName />);
      const element = screen.getByRole('button');
      expect(element).toHaveAccessibleName();
    });
  });

  describe('Ref Forwarding', () => {
    it('should forward ref', () => {
      const ref = vi.fn();
      render(<ComponentName ref={ref} />);
      expect(ref).toHaveBeenCalled();
    });
  });
});
```

---

## Hook Test Template

### Query Hook

```typescript
/**
 * useDataQuery Hook Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHookWithProviders } from '@/test/utils/test-utils';
import { waitFor } from '@testing-library/react';
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';
import { createMockApiResponse, createMockApiError } from '@/test/utils/test-factories';
import { useDataQuery } from './useDataQuery';

describe('useDataQuery', () => {
  describe('Successful Query', () => {
    it('should fetch data successfully', async () => {
      const { result } = renderHookWithProviders(() => useDataQuery());

      // Initial state
      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();

      // Wait for data to load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toBeDefined();
      expect(result.current.error).toBeNull();
    });

    it('should refetch data when refetch is called', async () => {
      const { result } = renderHookWithProviders(() => useDataQuery());

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const initialData = result.current.data;

      // Trigger refetch
      await act(async () => {
        await result.current.refetch();
      });

      await waitFor(() => {
        expect(result.current.data).not.toBe(initialData);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle fetch errors', async () => {
      // Override handler to return error
      server.use(
        http.get('/api/data', () => {
          return HttpResponse.json(
            createMockApiError({ message: 'Failed to fetch' }),
            { status: 500 }
          );
        })
      );

      const { result } = renderHookWithProviders(() => useDataQuery());

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
      expect(result.current.data).toBeUndefined();
    });
  });

  describe('Options', () => {
    it('should respect enabled option', () => {
      const { result } = renderHookWithProviders(() =>
        useDataQuery({ enabled: false })
      );

      expect(result.current.isLoading).toBe(false);
      expect(result.current.isFetching).toBe(false);
    });

    it('should use custom query key', async () => {
      const { result, queryClient } = renderHookWithProviders(() =>
        useDataQuery({ queryKey: ['custom', 'key'] })
      );

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      const cachedData = queryClient.getQueryData(['custom', 'key']);
      expect(cachedData).toBeDefined();
    });
  });
});
```

### Mutation Hook

```typescript
/**
 * useDataMutation Hook Tests
 */

import { describe, it, expect } from 'vitest';
import { renderHookWithProviders } from '@/test/utils/test-utils';
import { waitFor, act } from '@testing-library/react';
import { createMockData } from '@/test/utils/test-factories';
import { useDataMutation } from './useDataMutation';

describe('useDataMutation', () => {
  describe('Create Mutation', () => {
    it('should create data successfully', async () => {
      const { result } = renderHookWithProviders(() => useDataMutation());

      expect(result.current.createData.isIdle).toBe(true);

      await act(async () => {
        await result.current.createData.mutateAsync(
          createMockData({ name: 'Test' })
        );
      });

      await waitFor(() => {
        expect(result.current.createData.isSuccess).toBe(true);
      });

      expect(result.current.createData.data).toBeDefined();
    });

    it('should call onSuccess callback', async () => {
      const onSuccess = vi.fn();
      const { result } = renderHookWithProviders(() =>
        useDataMutation({ onSuccess })
      );

      await act(async () => {
        await result.current.createData.mutateAsync(createMockData());
      });

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('Update Mutation', () => {
    it('should update data successfully', async () => {
      const { result } = renderHookWithProviders(() => useDataMutation());

      await act(async () => {
        await result.current.updateData.mutateAsync({
          id: '123',
          data: { name: 'Updated' }
        });
      });

      await waitFor(() => {
        expect(result.current.updateData.isSuccess).toBe(true);
      });
    });
  });

  describe('Delete Mutation', () => {
    it('should delete data successfully', async () => {
      const { result } = renderHookWithProviders(() => useDataMutation());

      await act(async () => {
        await result.current.deleteData.mutateAsync('123');
      });

      await waitFor(() => {
        expect(result.current.deleteData.isSuccess).toBe(true);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle mutation errors', async () => {
      server.use(
        http.post('/api/data', () => {
          return HttpResponse.json(
            createMockApiError({ message: 'Creation failed' }),
            { status: 400 }
          );
        })
      );

      const { result } = renderHookWithProviders(() => useDataMutation());

      await act(async () => {
        try {
          await result.current.createData.mutateAsync(createMockData());
        } catch (error) {
          // Expected error
        }
      });

      await waitFor(() => {
        expect(result.current.createData.isError).toBe(true);
      });
    });
  });
});
```

---

## Page Test Template

```typescript
/**
 * PageName Tests
 * Integration tests for PageName
 */

import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { PageName } from './PageName';

describe('PageName', () => {
  describe('Page Load', () => {
    it('should load and display data', async () => {
      render(<PageName />);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      // Verify data is displayed
      expect(screen.getByText('Expected Content')).toBeInTheDocument();
    });

    it('should show loading state initially', () => {
      render(<PageName />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it('should handle load errors', async () => {
      server.use(
        http.get('/api/data', () => HttpResponse.error())
      );

      render(<PageName />);

      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });
  });

  describe('User Workflows', () => {
    it('should complete create workflow', async () => {
      const user = userEvent.setup();

      render(<PageName />);

      // Wait for page to load
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      // Click create button
      await user.click(screen.getByRole('button', { name: /create/i }));

      // Fill form
      await user.type(screen.getByLabelText(/name/i), 'Test Name');

      // Submit
      await user.click(screen.getByRole('button', { name: /save/i }));

      // Verify success
      await waitFor(() => {
        expect(screen.getByText(/created successfully/i)).toBeInTheDocument();
      });
    });

    it('should complete edit workflow', async () => {
      const user = userEvent.setup();

      render(<PageName />);

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      // Click edit on first item
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);

      // Update field
      const nameInput = screen.getByLabelText(/name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Name');

      // Save
      await user.click(screen.getByRole('button', { name: /save/i }));

      // Verify update
      await waitFor(() => {
        expect(screen.getByText('Updated Name')).toBeInTheDocument();
      });
    });

    it('should complete delete workflow', async () => {
      const user = userEvent.setup();

      render(<PageName />);

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      // Click delete
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      // Confirm deletion
      await user.click(screen.getByRole('button', { name: /confirm/i }));

      // Verify deletion
      await waitFor(() => {
        expect(screen.getByText(/deleted successfully/i)).toBeInTheDocument();
      });
    });
  });

  describe('Search and Filter', () => {
    it('should filter data by search query', async () => {
      const user = userEvent.setup();

      render(<PageName />);

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      // Type search query
      const searchInput = screen.getByRole('searchbox');
      await user.type(searchInput, 'John');

      // Verify filtered results
      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
        expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
      });
    });

    it('should apply filters', async () => {
      const user = userEvent.setup();

      render(<PageName />);

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      // Open filter dropdown
      await user.click(screen.getByRole('button', { name: /filter/i }));

      // Select filter option
      await user.click(screen.getByRole('option', { name: /active/i }));

      // Verify filtered results
      await waitFor(() => {
        const rows = screen.getAllByRole('row');
        expect(rows.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Pagination', () => {
    it('should navigate between pages', async () => {
      const user = userEvent.setup();

      render(<PageName />);

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });

      // Go to next page
      await user.click(screen.getByRole('button', { name: /next page/i }));

      // Verify new data loaded
      await waitFor(() => {
        expect(screen.getByText(/page 2/i)).toBeInTheDocument();
      });
    });
  });
});
```

---

## Form Test Template

```typescript
/**
 * FormName Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { FormName } from './FormName';

describe('FormName', () => {
  describe('Form Rendering', () => {
    it('should render all form fields', () => {
      render(<FormName />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should show required indicators', () => {
      render(<FormName />);

      const requiredFields = screen.getAllByText('*');
      expect(requiredFields.length).toBeGreaterThan(0);
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty required fields', async () => {
      const user = userEvent.setup();

      render(<FormName />);

      // Submit without filling fields
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Verify errors
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      const user = userEvent.setup();

      render(<FormName />);

      // Enter invalid email
      await user.type(screen.getByLabelText(/email/i), 'invalid-email');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Verify error
      await waitFor(() => {
        expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
      });
    });

    it('should clear errors when field is corrected', async () => {
      const user = userEvent.setup();

      render(<FormName />);

      // Trigger validation error
      await user.click(screen.getByRole('button', { name: /submit/i }));

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      });

      // Fix the error
      await user.type(screen.getByLabelText(/name/i), 'John Doe');

      // Error should clear
      await waitFor(() => {
        expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn();

      render(<FormName onSubmit={onSubmit} />);

      // Fill form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');

      // Submit
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Verify submission
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com'
        });
      });
    });

    it('should disable submit button while submitting', async () => {
      const user = userEvent.setup();

      render(<FormName />);

      // Fill and submit
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Button should be disabled
      expect(screen.getByRole('button', { name: /submitting/i })).toBeDisabled();
    });

    it('should show success message after submission', async () => {
      const user = userEvent.setup();

      render(<FormName />);

      // Fill and submit
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Verify success
      await waitFor(() => {
        expect(screen.getByText(/submitted successfully/i)).toBeInTheDocument();
      });
    });

    it('should handle submission errors', async () => {
      const user = userEvent.setup();

      server.use(
        http.post('/api/form', () => {
          return HttpResponse.json(
            createMockApiError({ message: 'Submission failed' }),
            { status: 500 }
          );
        })
      );

      render(<FormName />);

      // Fill and submit
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.click(screen.getByRole('button', { name: /submit/i }));

      // Verify error
      await waitFor(() => {
        expect(screen.getByText(/submission failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Reset', () => {
    it('should reset form to initial values', async () => {
      const user = userEvent.setup();

      render(<FormName />);

      // Fill form
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');

      // Reset
      await user.click(screen.getByRole('button', { name: /reset/i }));

      // Verify cleared
      expect(screen.getByLabelText(/name/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
    });
  });
});
```

---

## Table Test Template

```typescript
/**
 * DataTable Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { DataTable } from './DataTable';
import { createMockList, createMockData } from '@/test/utils/test-factories';

describe('DataTable', () => {
  const mockData = createMockList(createMockData, 10);

  describe('Rendering', () => {
    it('should render table with data', () => {
      render(<DataTable data={mockData} />);

      expect(screen.getByRole('table')).toBeInTheDocument();
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(11); // Header + 10 data rows
    });

    it('should render empty state when no data', () => {
      render(<DataTable data={[]} />);

      expect(screen.getByText(/no data/i)).toBeInTheDocument();
    });

    it('should render loading state', () => {
      render(<DataTable data={[]} loading />);

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('should sort by column', async () => {
      const user = userEvent.setup();

      render(<DataTable data={mockData} />);

      // Click sort button
      await user.click(screen.getByRole('button', { name: /sort by name/i }));

      // Verify sort order
      const rows = screen.getAllByRole('row');
      const firstDataRow = rows[1];
      expect(firstDataRow).toHaveTextContent('Alice'); // Assuming alphabetical sort
    });

    it('should toggle sort direction', async () => {
      const user = userEvent.setup();

      render(<DataTable data={mockData} />);

      const sortButton = screen.getByRole('button', { name: /sort by name/i });

      // Sort ascending
      await user.click(sortButton);
      // Sort descending
      await user.click(sortButton);

      // Verify reverse order
      const rows = screen.getAllByRole('row');
      const firstDataRow = rows[1];
      expect(firstDataRow).toHaveTextContent('Zack');
    });
  });

  describe('Selection', () => {
    it('should select single row', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(<DataTable data={mockData} onSelect={onSelect} />);

      // Click first row checkbox
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[1]); // Skip header checkbox

      expect(onSelect).toHaveBeenCalledWith([mockData[0]]);
    });

    it('should select all rows', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();

      render(<DataTable data={mockData} onSelect={onSelect} />);

      // Click header checkbox
      const checkboxes = screen.getAllByRole('checkbox');
      await user.click(checkboxes[0]); // Header checkbox

      expect(onSelect).toHaveBeenCalledWith(mockData);
    });
  });

  describe('Pagination', () => {
    it('should paginate data', async () => {
      const user = userEvent.setup();
      const largeDataset = createMockList(createMockData, 50);

      render(<DataTable data={largeDataset} pageSize={10} />);

      // Verify first page
      expect(screen.getByText(/showing 1-10 of 50/i)).toBeInTheDocument();

      // Go to next page
      await user.click(screen.getByRole('button', { name: /next page/i }));

      // Verify second page
      expect(screen.getByText(/showing 11-20 of 50/i)).toBeInTheDocument();
    });
  });

  describe('Row Actions', () => {
    it('should trigger edit action', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();

      render(<DataTable data={mockData} onEdit={onEdit} />);

      // Click edit on first row
      const editButtons = screen.getAllByRole('button', { name: /edit/i });
      await user.click(editButtons[0]);

      expect(onEdit).toHaveBeenCalledWith(mockData[0]);
    });

    it('should trigger delete action', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();

      render(<DataTable data={mockData} onDelete={onDelete} />);

      // Click delete on first row
      const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
      await user.click(deleteButtons[0]);

      expect(onDelete).toHaveBeenCalledWith(mockData[0]);
    });
  });
});
```

---

## Modal/Dialog Test Template

See the comprehensive Modal test in `/src/components/ui/overlays/Modal.test.tsx` for a complete example covering:

- Opening and closing
- Size variants
- Backdrop clicks
- Keyboard interactions (Escape)
- Focus management
- Body scroll lock
- Accessibility
- Subcomponents

---

## Integration Test Template

```typescript
/**
 * Full User Workflow Integration Test
 */

import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@/test/utils/test-utils';
import userEvent from '@testing-library/user-event';
import { App } from './App';

describe('Complete User Workflow', () => {
  it('should complete end-to-end workflow', async () => {
    const user = userEvent.setup();

    render(<App />);

    // Step 1: Login
    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /log in/i }));

    // Wait for dashboard
    await waitFor(() => {
      expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    });

    // Step 2: Navigate to students page
    await user.click(screen.getByRole('link', { name: /students/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /students/i })).toBeInTheDocument();
    });

    // Step 3: Create new student
    await user.click(screen.getByRole('button', { name: /add student/i }));

    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.click(screen.getByRole('button', { name: /save/i }));

    // Verify success
    await waitFor(() => {
      expect(screen.getByText(/student created/i)).toBeInTheDocument();
    });

    // Step 4: Search for created student
    await user.type(screen.getByRole('searchbox'), 'John Doe');

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Step 5: View student details
    await user.click(screen.getByText('John Doe'));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /john doe/i })).toBeInTheDocument();
    });
  });
});
```

---

## Quick Tips

### Use Factory Functions
```typescript
const student = createMockStudent({ grade: '5' });
const students = createMockList(createMockStudent, 10);
```

### Override MSW Handlers in Tests
```typescript
server.use(
  http.get('/api/data', () => HttpResponse.error())
);
```

### Wait for Async Operations
```typescript
await waitFor(() => {
  expect(screen.getByText('Success')).toBeInTheDocument();
});

// Or use findBy
const element = await screen.findByText('Success');
```

### Test User Events
```typescript
const user = userEvent.setup();
await user.type(input, 'text');
await user.click(button);
await user.keyboard('{Enter}');
await user.tab();
```

### Query Priorities
1. `getByRole` - Most accessible
2. `getByLabelText` - Form inputs
3. `getByPlaceholderText` - When no label
4. `getByText` - Non-interactive content
5. `getByTestId` - Last resort

---

## Resources

- [TESTING.md](/frontend/TESTING.md) - Comprehensive testing guide
- [Test Utilities](/frontend/src/test/utils/test-utils.tsx)
- [Mock Factories](/frontend/src/test/utils/test-factories.ts)
- [MSW Handlers](/frontend/src/test/mocks/handlers.ts)

---

**Last Updated**: 2025-10-24

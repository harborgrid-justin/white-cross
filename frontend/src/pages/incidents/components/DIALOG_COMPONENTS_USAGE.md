# Dialog Components Usage Guide

This guide demonstrates how to use the three production-grade dialog components for the incidents module.

## Components Overview

### 1. ConfirmationDialog
Reusable confirmation dialog with customizable variants (danger, warning, info).

### 2. DeleteConfirmDialog
Specialized delete confirmation with safety measures and optional type-to-confirm.

### 3. AddCommentDialog
Comment/note addition modal with character limit and importance marking.

---

## 1. ConfirmationDialog

### Basic Usage

```tsx
import { useState } from 'react';
import { ConfirmationDialog } from '@/pages/incidents/components';

function MyComponent() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = () => {
    // Perform action
    console.log('Confirmed!');
    setShowConfirm(false);
  };

  return (
    <>
      <button onClick={() => setShowConfirm(true)}>
        Submit Report
      </button>

      <ConfirmationDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleSubmit}
        title="Submit Incident Report"
        message="Are you sure you want to submit this incident report? This action will notify the appropriate staff members."
        variant="info"
        confirmText="Submit Report"
        cancelText="Cancel"
      />
    </>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | required | Whether the dialog is open |
| `onClose` | `() => void` | required | Callback when dialog should close |
| `onConfirm` | `() => void` | required | Callback when user confirms |
| `title` | `string` | required | Dialog title |
| `message` | `string` | required | Confirmation message |
| `confirmText` | `string` | `"Confirm"` | Text for confirm button |
| `cancelText` | `string` | `"Cancel"` | Text for cancel button |
| `variant` | `'danger' \| 'warning' \| 'info'` | `"info"` | Visual variant |
| `loading` | `boolean` | `false` | Show loading state |
| `className` | `string` | `""` | Additional CSS classes |

### Variant Examples

```tsx
// Info variant (blue) - default
<ConfirmationDialog
  variant="info"
  title="Confirm Submission"
  message="Submit this incident report?"
  {...otherProps}
/>

// Warning variant (yellow/orange)
<ConfirmationDialog
  variant="warning"
  title="Unsaved Changes"
  message="You have unsaved changes. Are you sure you want to leave?"
  {...otherProps}
/>

// Danger variant (red)
<ConfirmationDialog
  variant="danger"
  title="Discard Changes"
  message="This will permanently discard all your changes."
  {...otherProps}
/>
```

### With Loading State

```tsx
function MyComponent() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      await submitIncidentReport();
      setShowConfirm(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ConfirmationDialog
      isOpen={showConfirm}
      onClose={() => setShowConfirm(false)}
      onConfirm={handleConfirm}
      loading={isSubmitting}
      title="Submit Report"
      message="Confirm submission?"
      variant="info"
    />
  );
}
```

---

## 2. DeleteConfirmDialog

### Basic Usage

```tsx
import { useState } from 'react';
import { DeleteConfirmDialog } from '@/pages/incidents/components';

function MyComponent() {
  const [showDelete, setShowDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteIncidentReport(reportId);
      setShowDelete(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button onClick={() => setShowDelete(true)}>
        Delete Report
      </button>

      <DeleteConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        itemName="Incident Report #1234"
        itemType="incident report"
        loading={isDeleting}
      />
    </>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | required | Whether the dialog is open |
| `onClose` | `() => void` | required | Callback when dialog should close |
| `onConfirm` | `() => void` | required | Callback when user confirms deletion |
| `itemName` | `string` | required | Name of the item being deleted |
| `itemType` | `string` | required | Type of item (e.g., "incident report") |
| `loading` | `boolean` | `false` | Show loading state |
| `requireConfirmation` | `boolean` | `false` | Require typing item name to confirm |
| `warningMessage` | `string` | auto-generated | Custom warning message |
| `className` | `string` | `""` | Additional CSS classes |

### With Type-to-Confirm (Critical Items)

```tsx
<DeleteConfirmDialog
  isOpen={showDelete}
  onClose={() => setShowDelete(false)}
  onConfirm={handleDelete}
  itemName="Critical Incident Report"
  itemType="incident report"
  requireConfirmation={true}
  loading={isDeleting}
  warningMessage="This is a critical incident report. Deleting it will remove all associated evidence, witness statements, and follow-up actions. This action cannot be undone."
/>
```

### Different Item Types

```tsx
// Delete witness statement
<DeleteConfirmDialog
  itemName="John Doe's Statement"
  itemType="witness statement"
  {...otherProps}
/>

// Delete follow-up action
<DeleteConfirmDialog
  itemName="Follow-up Action: Schedule Parent Meeting"
  itemType="follow-up action"
  {...otherProps}
/>
```

---

## 3. AddCommentDialog

### Basic Usage

```tsx
import { useState } from 'react';
import { AddCommentDialog } from '@/pages/incidents/components';

function MyComponent() {
  const [showCommentDialog, setShowCommentDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddComment = async (comment: string, isImportant: boolean) => {
    setIsSubmitting(true);
    try {
      await addFollowUpNotes(incidentId, {
        notes: comment,
        important: isImportant
      });
      setShowCommentDialog(false);
      // Optionally refresh incident data
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button onClick={() => setShowCommentDialog(true)}>
        Add Comment
      </button>

      <AddCommentDialog
        isOpen={showCommentDialog}
        onClose={() => setShowCommentDialog(false)}
        incidentId="incident-123"
        onSuccess={handleAddComment}
        loading={isSubmitting}
      />
    </>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | `boolean` | required | Whether the dialog is open |
| `onClose` | `() => void` | required | Callback when dialog should close |
| `incidentId` | `string` | required | ID of the incident report |
| `onSuccess` | `(comment: string, isImportant: boolean) => void` | optional | Callback when comment is submitted |
| `loading` | `boolean` | `false` | Show loading state |
| `maxLength` | `number` | `1000` | Maximum character count |
| `showImportanceOption` | `boolean` | `true` | Show "Mark as Important" checkbox |
| `className` | `string` | `""` | Additional CSS classes |

### Without Importance Option

```tsx
<AddCommentDialog
  isOpen={showDialog}
  onClose={() => setShowDialog(false)}
  incidentId="incident-123"
  onSuccess={(comment) => handleAddComment(comment)}
  showImportanceOption={false}
/>
```

### Custom Character Limit

```tsx
<AddCommentDialog
  isOpen={showDialog}
  onClose={() => setShowDialog(false)}
  incidentId="incident-123"
  onSuccess={handleAddComment}
  maxLength={500}
/>
```

### Keyboard Shortcuts

The AddCommentDialog supports keyboard shortcuts:
- **Ctrl+Enter** or **Cmd+Enter**: Submit the comment quickly
- **ESC**: Close the dialog (when not loading)

---

## Integration with React Hook Form

### Example with Form Context

```tsx
import { useForm } from 'react-hook-form';
import { ConfirmationDialog } from '@/pages/incidents/components';

function IncidentForm() {
  const { handleSubmit, formState } = useForm();
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = (data: any) => {
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    // Submit form data
    const formData = getValues();
    await submitIncident(formData);
    setShowConfirm(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
      <button type="submit">Submit</button>

      <ConfirmationDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title="Submit Incident Report"
        message="Are you sure you want to submit this incident report?"
        variant="info"
      />
    </form>
  );
}
```

---

## Accessibility Features

All three dialog components include:

1. **Keyboard Navigation**
   - Tab key for focus management
   - ESC key to close (when not loading)
   - Enter key to confirm (where appropriate)

2. **Focus Management**
   - Auto-focus on primary action
   - Focus trap within dialog
   - Restore focus on close

3. **Screen Reader Support**
   - Proper ARIA labels
   - Role attributes
   - Descriptive text for all actions

4. **Visual Indicators**
   - Clear loading states
   - Disabled states during operations
   - Color-coded variants for context

---

## HIPAA Compliance Notes

- **AddCommentDialog** includes HIPAA compliance notice
- All comments are logged for audit purposes
- Loading states prevent duplicate submissions
- Confirmation prevents accidental data loss
- Type-to-confirm for critical deletions

---

## Best Practices

### 1. Always Handle Loading States

```tsx
const [isDeleting, setIsDeleting] = useState(false);

const handleDelete = async () => {
  setIsDeleting(true);
  try {
    await deleteItem();
  } finally {
    setIsDeleting(false);
  }
};
```

### 2. Provide Clear Messages

```tsx
// Good: Specific and clear
<ConfirmationDialog
  title="Submit Incident Report"
  message="This will create a permanent record and notify the school administrator. Are you sure you want to proceed?"
/>

// Bad: Vague
<ConfirmationDialog
  title="Confirm"
  message="Are you sure?"
/>
```

### 3. Use Appropriate Variants

- **info**: Normal confirmations, submissions
- **warning**: Actions that might cause issues
- **danger**: Destructive actions, deletions

### 4. Enable Type-to-Confirm for Critical Actions

```tsx
<DeleteConfirmDialog
  requireConfirmation={true}  // For critical items
  itemName="Student Health Record #1234"
  itemType="health record"
/>
```

### 5. Handle Errors Gracefully

```tsx
const handleConfirm = async () => {
  try {
    await submitData();
    setShowDialog(false);
  } catch (error) {
    // Show error toast/notification
    toast.error('Failed to submit. Please try again.');
    // Don't close dialog on error
  }
};
```

---

## Common Patterns

### Confirmation Before Navigation

```tsx
function UnsavedChangesGuard() {
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    if (hasUnsavedChanges) {
      setShowWarning(true);
      setPendingPath(path);
    } else {
      navigate(path);
    }
  };

  return (
    <ConfirmationDialog
      isOpen={showWarning}
      onClose={() => setShowWarning(false)}
      onConfirm={() => navigate(pendingPath)}
      variant="warning"
      title="Unsaved Changes"
      message="You have unsaved changes. Are you sure you want to leave?"
    />
  );
}
```

### Bulk Delete with Confirmation

```tsx
function BulkDeleteAction({ selectedItems }: { selectedItems: string[] }) {
  const [showDelete, setShowDelete] = useState(false);

  return (
    <DeleteConfirmDialog
      isOpen={showDelete}
      onClose={() => setShowDelete(false)}
      onConfirm={handleBulkDelete}
      itemName={`${selectedItems.length} incident reports`}
      itemType="incident reports"
      warningMessage={`This will permanently delete ${selectedItems.length} incident reports and all associated data.`}
    />
  );
}
```

---

## Testing

### Example Unit Test

```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmationDialog } from '@/pages/incidents/components';

describe('ConfirmationDialog', () => {
  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = jest.fn();
    const onClose = jest.fn();

    render(
      <ConfirmationDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Test"
        message="Test message"
      />
    );

    fireEvent.click(screen.getByText('Confirm'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
```

---

## Questions or Issues?

For questions or issues with these dialog components, please contact the development team or refer to the White Cross platform documentation.

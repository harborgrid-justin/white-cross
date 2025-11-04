/**
 * Custom hook for managing form actions
 *
 * This hook provides handlers for all form-related actions including
 * duplication, status toggling, archiving, and bulk operations.
 */

import { HealthcareForm, FormStatus, BulkAction } from '../types/formTypes';

/**
 * Return type for useFormActions hook
 */
export interface UseFormActionsReturn {
  /** Duplicates a form and adds it to the forms list */
  handleDuplicateForm: (formId: string) => void;

  /** Toggles a form's status (draft -> published -> paused -> published) */
  handleToggleStatus: (formId: string) => void;

  /** Archives a form (with confirmation) */
  handleArchiveForm: (formId: string) => void;

  /** Performs a bulk action on multiple forms */
  handleBulkAction: (action: BulkAction, selectedIds: string[]) => void;
}

/**
 * Custom hook for handling form actions
 *
 * @param forms - Current array of forms
 * @param setForms - Function to update forms array
 * @param clearSelection - Optional callback to clear form selection after bulk action
 * @returns Object containing action handler functions
 */
export function useFormActions(
  forms: HealthcareForm[],
  setForms: React.Dispatch<React.SetStateAction<HealthcareForm[]>>,
  clearSelection?: () => void
): UseFormActionsReturn {
  /**
   * Duplicates an existing form as a new draft
   */
  const handleDuplicateForm = (formId: string) => {
    const formToDuplicate = forms.find((f) => f.id === formId);
    if (formToDuplicate) {
      const newForm: HealthcareForm = {
        ...formToDuplicate,
        id: `form-${Date.now()}`,
        title: `${formToDuplicate.title} (Copy)`,
        status: 'draft',
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: undefined,
        analytics: {
          views: 0,
          submissions: 0,
          completionRate: 0,
          averageCompletionTime: 0,
          dropOffPoints: [],
        },
      };
      setForms((prev) => [newForm, ...prev]);
    }
  };

  /**
   * Toggles form status through workflow: draft -> published -> paused -> published
   */
  const handleToggleStatus = (formId: string) => {
    setForms((prev) =>
      prev.map((form) => {
        if (form.id === formId) {
          let newStatus: FormStatus;
          switch (form.status) {
            case 'draft':
              newStatus = 'published';
              break;
            case 'published':
              newStatus = 'paused';
              break;
            case 'paused':
              newStatus = 'published';
              break;
            case 'archived':
              newStatus = 'published';
              break;
            default:
              newStatus = form.status;
          }
          return {
            ...form,
            status: newStatus,
            updatedAt: new Date(),
            publishedAt: newStatus === 'published' ? new Date() : form.publishedAt,
          };
        }
        return form;
      })
    );
  };

  /**
   * Archives a form with user confirmation
   */
  const handleArchiveForm = (formId: string) => {
    if (
      window.confirm(
        'Are you sure you want to archive this form? It will stop accepting responses.'
      )
    ) {
      setForms((prev) =>
        prev.map((form) =>
          form.id === formId ? { ...form, status: 'archived' as FormStatus, updatedAt: new Date() } : form
        )
      );
    }
  };

  /**
   * Performs bulk action on multiple selected forms
   */
  const handleBulkAction = (action: BulkAction, selectedIds: string[]) => {
    // Confirmation prompts for destructive actions
    if (
      action === 'delete' &&
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} forms? This action cannot be undone.`
      )
    ) {
      return;
    }

    if (
      action === 'archive' &&
      !window.confirm(`Are you sure you want to archive ${selectedIds.length} forms?`)
    ) {
      return;
    }

    setForms((prev) => {
      // Delete removes forms from array
      if (action === 'delete') {
        return prev.filter((form) => !selectedIds.includes(form.id));
      }

      // Publish or archive updates form status
      return prev.map((form) => {
        if (!selectedIds.includes(form.id)) return form;

        switch (action) {
          case 'publish':
            return {
              ...form,
              status: 'published' as FormStatus,
              updatedAt: new Date(),
              publishedAt: new Date(),
            };
          case 'archive':
            return { ...form, status: 'archived' as FormStatus, updatedAt: new Date() };
          default:
            return form;
        }
      });
    });

    // Clear selection after bulk action
    if (clearSelection) {
      clearSelection();
    }
  };

  return {
    handleDuplicateForm,
    handleToggleStatus,
    handleArchiveForm,
    handleBulkAction,
  };
}

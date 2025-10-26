/**
 * WF-AC-COMP-001 | PermissionForm.tsx - Permission Form Component
 * Purpose: Form for creating and editing permissions
 * Upstream: React, Redux | Dependencies: react, react-router-dom, redux, lucide-react
 * Downstream: Access control routes | Called by: Route component
 * Related: Permission management, access control
 * Exports: PermissionForm component | Key Features: CRUD operations for permissions
 * Last Updated: 2025-10-24 | File Type: .tsx
 * Critical Path: Form render → User input → Validation → Submit → Redux action
 * LLM Context: Permission form component for access control system
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/shared/store-hooks-index';
import { createPermission, updateRole, selectPermissions } from '../store';
import { Shield, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Permission form data interface
 */
interface PermissionFormData {
  resource: string;
  action: string;
  description?: string;
}

/**
 * PermissionForm Component
 *
 * Provides form interface for:
 * - Creating new permissions
 * - Editing existing permissions
 * - Field validation
 * - Integration with Redux store
 * - User feedback via toast notifications
 *
 * @returns React component
 *
 * @example
 * ```tsx
 * // Create mode
 * <Route path="/permissions/new" element={<PermissionForm />} />
 *
 * // Edit mode
 * <Route path="/permissions/:id/edit" element={<PermissionForm />} />
 * ```
 */
const PermissionForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const permissions = useAppSelector(selectPermissions);

  const isEditMode = Boolean(id);
  const existingPermission = permissions.find(p => p.id === id);

  const [formData, setFormData] = useState<PermissionFormData>({
    resource: '',
    action: '',
    description: ''
  });

  const [errors, setErrors] = useState<Partial<PermissionFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing permission data in edit mode
  useEffect(() => {
    if (isEditMode && existingPermission) {
      setFormData({
        resource: existingPermission.resource || '',
        action: existingPermission.action || '',
        description: existingPermission.description || ''
      });
    }
  }, [isEditMode, existingPermission]);

  /**
   * Validates form data
   * @returns True if valid, false otherwise
   */
  const validateForm = (): boolean => {
    const newErrors: Partial<PermissionFormData> = {};

    if (!formData.resource.trim()) {
      newErrors.resource = 'Resource is required';
    }

    if (!formData.action.trim()) {
      newErrors.action = 'Action is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode && id) {
        // Update existing permission
        await dispatch(updateRole({ id, updates: formData })).unwrap();
        toast.success('Permission updated successfully');
      } else {
        // Create new permission
        await dispatch(createPermission(formData)).unwrap();
        toast.success('Permission created successfully');
      }
      navigate('/access-control/permissions');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save permission');
      console.error('Permission save error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handles form cancellation
   */
  const handleCancel = () => {
    navigate('/access-control/permissions');
  };

  /**
   * Handles input change
   */
  const handleInputChange = (field: keyof PermissionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditMode ? 'Edit Permission' : 'Create Permission'}
            </h1>
          </div>
          <p className="text-gray-600">
            {isEditMode
              ? 'Update permission details'
              : 'Define a new permission for resource access control'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6 space-y-6">
          {/* Resource Field */}
          <div>
            <label htmlFor="resource" className="block text-sm font-medium text-gray-700 mb-1">
              Resource <span className="text-red-500">*</span>
            </label>
            <input
              id="resource"
              type="text"
              value={formData.resource}
              onChange={(e) => handleInputChange('resource', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.resource ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., student, medication, appointment"
              aria-required="true"
              aria-invalid={!!errors.resource}
              aria-describedby={errors.resource ? 'resource-error' : undefined}
            />
            {errors.resource && (
              <p id="resource-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.resource}
              </p>
            )}
          </div>

          {/* Action Field */}
          <div>
            <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-1">
              Action <span className="text-red-500">*</span>
            </label>
            <input
              id="action"
              type="text"
              value={formData.action}
              onChange={(e) => handleInputChange('action', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.action ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., read, create, update, delete"
              aria-required="true"
              aria-invalid={!!errors.action}
              aria-describedby={errors.action ? 'action-error' : undefined}
            />
            {errors.action && (
              <p id="action-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.action}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Optional description of what this permission allows"
              rows={3}
              aria-label="Permission description"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
              disabled={isSubmitting}
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              <Save className="h-4 w-4" />
              <span>{isSubmitting ? 'Saving...' : isEditMode ? 'Update Permission' : 'Create Permission'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermissionForm;

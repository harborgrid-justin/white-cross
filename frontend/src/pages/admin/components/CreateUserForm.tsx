/**
 * CreateUserForm Component
 * 
 * Create User Form for admin module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface CreateUserFormProps {
  className?: string;
}

/**
 * CreateUserForm component - Create User Form
 */
const CreateUserForm: React.FC<CreateUserFormProps> = ({ className = '' }) => {
  return (
    <div className={`create-user-form ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create User Form</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Create User Form functionality</p>
          <p className="text-sm mt-2">Connected to admin Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default CreateUserForm;

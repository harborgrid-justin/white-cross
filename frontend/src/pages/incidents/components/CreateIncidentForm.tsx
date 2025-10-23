/**
 * CreateIncidentForm Component
 * 
 * Create Incident Form for incidents module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface CreateIncidentFormProps {
  className?: string;
}

/**
 * CreateIncidentForm component - Create Incident Form
 */
const CreateIncidentForm: React.FC<CreateIncidentFormProps> = ({ className = '' }) => {
  return (
    <div className={`create-incident-form ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Incident Form</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Create Incident Form functionality</p>
          <p className="text-sm mt-2">Connected to incidents Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default CreateIncidentForm;

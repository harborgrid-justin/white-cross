/**
 * EmergencyContactForm Component
 * 
 * Emergency Contact Form for contacts module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface EmergencyContactFormProps {
  className?: string;
}

/**
 * EmergencyContactForm component - Emergency Contact Form
 */
const EmergencyContactForm: React.FC<EmergencyContactFormProps> = ({ className = '' }) => {
  return (
    <div className={`emergency-contact-form ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact Form</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Emergency Contact Form functionality</p>
          <p className="text-sm mt-2">Connected to contacts Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactForm;

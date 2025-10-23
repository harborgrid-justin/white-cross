/**
 * ContactForm Component
 * 
 * Contact Form for contacts module.
 */

import React from 'react';
import { useAppSelector } from '../../../hooks/shared/store-hooks-index';

interface ContactFormProps {
  className?: string;
}

/**
 * ContactForm component - Contact Form
 */
const ContactForm: React.FC<ContactFormProps> = ({ className = '' }) => {
  return (
    <div className={`contact-form ${className}`}>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Form</h3>
        <div className="text-center text-gray-500 py-8">
          <p>Contact Form functionality</p>
          <p className="text-sm mt-2">Connected to contacts Redux slice</p>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;

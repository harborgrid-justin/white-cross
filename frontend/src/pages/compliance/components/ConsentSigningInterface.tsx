/**
 * ConsentSigningInterface Component
 * Interface for signing consent forms
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAppDispatch } from '../../../hooks/shared/store-hooks-index';
import { signConsentForm } from '../store';

const ConsentSigningInterface: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { formId } = useParams<{ formId: string }>();

  const handleSign = async () => {
    try {
      await dispatch(signConsentForm({ formId, signature: 'digital-signature' })).unwrap();
      navigate('/compliance/consent/forms');
    } catch (error) {
      console.error('Error signing consent:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sign Consent Form</h1>
        <p className="text-gray-600 mt-1">Review and sign the consent form</p>
      </div>

      <div className="card p-6">
        <div className="prose max-w-none">
          <p>Consent form content would be displayed here.</p>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t">
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleSign} className="btn btn-primary flex items-center">
            <Check className="h-4 w-4 mr-2" />
            Sign Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsentSigningInterface;

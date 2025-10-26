/**
 * PolicyAcknowledgmentInterface Component
 * Interface for acknowledging policies
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useAppDispatch } from '../../../hooks/shared/store-hooks-index';
import { acknowledgePolicy } from '../store';

const PolicyAcknowledgmentInterface: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  const handleAcknowledge = async () => {
    if (!id) return;
    try {
      await dispatch(acknowledgePolicy(id)).unwrap();
      navigate('/compliance/policies');
    } catch (error) {
      console.error('Error acknowledging policy:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Acknowledge Policy</h1>
        <p className="text-gray-600 mt-1">Review and acknowledge the policy</p>
      </div>

      <div className="card p-6">
        <div className="prose max-w-none">
          <p>Policy content would be displayed here.</p>
        </div>

        <div className="flex items-center space-x-3 pt-6 mt-6 border-t">
          <input type="checkbox" id="acknowledge" className="checkbox" />
          <label htmlFor="acknowledge" className="text-sm text-gray-700">
            I have read and understood this policy
          </label>
        </div>

        <div className="flex items-center justify-end space-x-3 pt-6 mt-6 border-t">
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleAcknowledge} className="btn btn-primary flex items-center">
            <Check className="h-4 w-4 mr-2" />
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyAcknowledgmentInterface;

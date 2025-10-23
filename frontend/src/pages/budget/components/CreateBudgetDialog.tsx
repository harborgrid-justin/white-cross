/**
 * CreateBudgetDialog Component - Modal dialog for creating budget categories
 */
import React from 'react';
import { X } from 'lucide-react';
import BudgetForm from './BudgetForm';

interface CreateBudgetDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const CreateBudgetDialog: React.FC<CreateBudgetDialogProps> = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Create Budget Category</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <BudgetForm onSubmit={onSubmit} onCancel={onClose} isEditing={false} />
        </div>
      </div>
    </div>
  );
};

export default CreateBudgetDialog;

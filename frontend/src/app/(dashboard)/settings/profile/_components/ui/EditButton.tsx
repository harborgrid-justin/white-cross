/**
 * @fileoverview Reusable edit button component
 * @module app/(dashboard)/profile/_components/ui/EditButton
 * @category Profile - UI Components
 */

'use client';

import { Edit3, X } from 'lucide-react';

interface EditButtonProps {
  isEditing: boolean;
  onClick: () => void;
  className?: string;
}

/**
 * Edit button that toggles between edit and cancel states
 */
export function EditButton({ isEditing, onClick, className = '' }: EditButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`text-blue-600 hover:text-blue-700 transition-colors ${className}`}
      aria-label={isEditing ? 'Cancel editing' : 'Edit'}
    >
      {isEditing ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
    </button>
  );
}

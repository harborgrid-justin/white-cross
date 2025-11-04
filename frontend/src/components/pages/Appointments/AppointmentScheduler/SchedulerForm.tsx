'use client';

import React from 'react';
import { Plus, X } from 'lucide-react';
import type { AppointmentType, AppointmentPriority } from './types';

/**
 * Props for the SchedulerForm component
 */
interface SchedulerFormProps {
  /** Appointment type */
  appointmentType: AppointmentType;
  /** Appointment priority */
  appointmentPriority: AppointmentPriority;
  /** Duration in minutes */
  duration: number;
  /** Reason for visit */
  reason: string;
  /** Additional notes */
  notes: string;
  /** Preparation instructions */
  preparationInstructions: string[];
  /** Minimum allowed duration */
  minDuration: number;
  /** Maximum allowed duration */
  maxDuration: number;
  /** Handler for appointment type change */
  onTypeChange: (type: AppointmentType) => void;
  /** Handler for priority change */
  onPriorityChange: (priority: AppointmentPriority) => void;
  /** Handler for duration change */
  onDurationChange: (duration: number) => void;
  /** Handler for reason change */
  onReasonChange: (reason: string) => void;
  /** Handler for notes change */
  onNotesChange: (notes: string) => void;
  /** Handler for preparation instructions change */
  onInstructionsChange: (instructions: string[]) => void;
  /** Custom CSS classes */
  className?: string;
}

/**
 * SchedulerForm Component
 *
 * Form for entering appointment details including type, priority,
 * duration, reason, notes, and preparation instructions.
 *
 * @param props - SchedulerForm component props
 * @returns JSX element representing the appointment details form
 */
const SchedulerForm: React.FC<SchedulerFormProps> = ({
  appointmentType,
  appointmentPriority,
  duration,
  reason,
  notes,
  preparationInstructions,
  minDuration,
  maxDuration,
  onTypeChange,
  onPriorityChange,
  onDurationChange,
  onReasonChange,
  onNotesChange,
  onInstructionsChange,
  className = ''
}) => {
  /**
   * Adds a new preparation instruction
   */
  const handleAddInstruction = (): void => {
    onInstructionsChange([...preparationInstructions, '']);
  };

  /**
   * Removes a preparation instruction at the specified index
   */
  const handleRemoveInstruction = (index: number): void => {
    const newInstructions = preparationInstructions.filter((_, i) => i !== index);
    onInstructionsChange(newInstructions);
  };

  /**
   * Updates a preparation instruction at the specified index
   */
  const handleUpdateInstruction = (index: number, value: string): void => {
    const newInstructions = [...preparationInstructions];
    newInstructions[index] = value;
    onInstructionsChange(newInstructions);
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Appointment Details</h3>

      <div className="space-y-4">
        {/* Appointment Type */}
        <div>
          <label htmlFor="appointment-type-select" className="text-sm font-medium text-gray-700 mb-2 block">
            Type
          </label>
          <select
            id="appointment-type-select"
            value={appointmentType}
            onChange={(e) => onTypeChange(e.target.value as AppointmentType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md
                     focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="consultation">Consultation</option>
            <option value="follow-up">Follow-up</option>
            <option value="procedure">Procedure</option>
            <option value="emergency">Emergency</option>
            <option value="screening">Screening</option>
            <option value="vaccination">Vaccination</option>
            <option value="therapy">Therapy</option>
            <option value="surgery">Surgery</option>
            <option value="diagnostic">Diagnostic</option>
            <option value="virtual">Virtual</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="appointment-priority-select" className="text-sm font-medium text-gray-700 mb-2 block">
            Priority
          </label>
          <select
            id="appointment-priority-select"
            value={appointmentPriority}
            onChange={(e) => onPriorityChange(e.target.value as AppointmentPriority)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md
                     focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        {/* Duration */}
        <div>
          <label htmlFor="appointment-duration-input" className="text-sm font-medium text-gray-700 mb-2 block">
            Duration (minutes)
          </label>
          <input
            type="number"
            id="appointment-duration-input"
            min={minDuration}
            max={maxDuration}
            step={15}
            value={duration}
            onChange={(e) => onDurationChange(parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md
                     focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Reason */}
        <div>
          <label htmlFor="appointment-reason-input" className="text-sm font-medium text-gray-700 mb-2 block">
            Reason for Visit *
          </label>
          <input
            type="text"
            id="appointment-reason-input"
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Enter reason for appointment..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md
                     focus:ring-blue-500 focus:border-blue-500 text-sm"
            required
            aria-required="true"
          />
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="appointment-notes-textarea" className="text-sm font-medium text-gray-700 mb-2 block">
            Notes
          </label>
          <textarea
            id="appointment-notes-textarea"
            value={notes}
            onChange={(e) => onNotesChange(e.target.value)}
            placeholder="Additional notes..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md
                     focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        {/* Preparation Instructions */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Preparation Instructions
          </label>
          <div className="space-y-2">
            {preparationInstructions.map((instruction, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={instruction}
                  onChange={(e) => handleUpdateInstruction(index, e.target.value)}
                  placeholder="Enter preparation instruction..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md
                           focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveInstruction(index)}
                  className="p-2 text-red-400 hover:text-red-600 focus:outline-none
                           focus:ring-2 focus:ring-red-500 rounded-md"
                  aria-label={`Remove preparation instruction ${index + 1}`}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddInstruction}
              className="flex items-center text-sm text-blue-600 hover:text-blue-700
                       focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
            >
              <Plus size={16} className="mr-1" aria-hidden="true" />
              Add instruction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulerForm;

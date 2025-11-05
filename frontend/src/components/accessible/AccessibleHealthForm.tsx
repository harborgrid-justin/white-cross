/**
 * Accessible Health Form Component
 *
 * ACCESSIBILITY FIX: Demonstrates proper form accessibility with:
 * - Proper label associations
 * - ARIA attributes
 * - Error announcements
 * - Required field indication
 *
 * @module components/accessible/AccessibleHealthForm
 * @since 2025-11-05
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface HealthFormData {
  studentId: string;
  bloodPressure: string;
  temperature: string;
  weight: string;
  notes: string;
}

export function AccessibleHealthForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<HealthFormData>();

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const onSubmit = async (data: HealthFormData) => {
    try {
      // API call here
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      aria-labelledby="health-form-title"
    >
      <h2 id="health-form-title" className="text-2xl font-bold">
        Health Assessment Form
      </h2>

      {/* Status announcement region */}
      {submitStatus !== 'idle' && (
        <div
          role="status"
          aria-live="polite"
          className={`p-4 rounded ${
            submitStatus === 'success' ? 'bg-green-50 text-green-900' : 'bg-red-50 text-red-900'
          }`}
        >
          {submitStatus === 'success'
            ? 'Health record saved successfully'
            : 'Error saving health record. Please try again.'}
        </div>
      )}

      {/* Blood Pressure Field */}
      <div>
        <label htmlFor="bloodPressure" className="block text-sm font-medium text-gray-700">
          Blood Pressure <span aria-label="required" className="text-red-600">*</span>
        </label>
        <input
          {...register('bloodPressure', {
            required: 'Blood pressure is required',
            pattern: {
              value: /^\d{2,3}\/\d{2,3}$/,
              message: 'Invalid format. Use format: 120/80',
            },
          })}
          id="bloodPressure"
          type="text"
          placeholder="120/80"
          aria-required="true"
          aria-invalid={errors.bloodPressure ? 'true' : 'false'}
          aria-describedby={errors.bloodPressure ? 'bloodPressure-error' : 'bloodPressure-hint'}
          className={`mt-1 block w-full rounded-md border ${
            errors.bloodPressure ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <p id="bloodPressure-hint" className="mt-1 text-sm text-gray-500">
          Enter blood pressure in format: 120/80
        </p>
        {errors.bloodPressure && (
          <p id="bloodPressure-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.bloodPressure.message}
          </p>
        )}
      </div>

      {/* Temperature Field */}
      <div>
        <label htmlFor="temperature" className="block text-sm font-medium text-gray-700">
          Temperature (°F) <span aria-label="required" className="text-red-600">*</span>
        </label>
        <input
          {...register('temperature', {
            required: 'Temperature is required',
            min: { value: 95, message: 'Temperature must be at least 95°F' },
            max: { value: 110, message: 'Temperature must be at most 110°F' },
          })}
          id="temperature"
          type="number"
          step="0.1"
          aria-required="true"
          aria-invalid={errors.temperature ? 'true' : 'false'}
          aria-describedby={errors.temperature ? 'temperature-error' : 'temperature-hint'}
          className={`mt-1 block w-full rounded-md border ${
            errors.temperature ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <p id="temperature-hint" className="mt-1 text-sm text-gray-500">
          Normal range: 97.0 - 99.5°F
        </p>
        {errors.temperature && (
          <p id="temperature-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.temperature.message}
          </p>
        )}
      </div>

      {/* Weight Field */}
      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
          Weight (lbs)
        </label>
        <input
          {...register('weight', {
            min: { value: 0, message: 'Weight must be positive' },
          })}
          id="weight"
          type="number"
          step="0.1"
          aria-invalid={errors.weight ? 'true' : 'false'}
          aria-describedby={errors.weight ? 'weight-error' : undefined}
          className={`mt-1 block w-full rounded-md border ${
            errors.weight ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        {errors.weight && (
          <p id="weight-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.weight.message}
          </p>
        )}
      </div>

      {/* Notes Field */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Additional Notes
        </label>
        <textarea
          {...register('notes')}
          id="notes"
          rows={4}
          aria-describedby="notes-hint"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p id="notes-hint" className="mt-1 text-sm text-gray-500">
          Add any additional observations or notes
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Health Record
        </button>
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

/**
 * KEY ACCESSIBILITY FEATURES:
 *
 * ✅ Proper label association (htmlFor + id)
 * ✅ aria-required for required fields
 * ✅ aria-invalid for error states
 * ✅ aria-describedby for hints and errors
 * ✅ role="alert" for error messages (announced immediately)
 * ✅ role="status" for success messages (announced politely)
 * ✅ aria-live for dynamic content
 * ✅ Visible focus indicators
 * ✅ Semantic HTML (form, label, input)
 */

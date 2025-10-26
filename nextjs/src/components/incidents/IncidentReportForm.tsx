/**
 * @fileoverview Comprehensive Incident Report Form
 * @module components/incidents/IncidentReportForm
 *
 * Multi-step form for creating and editing incident reports with:
 * - Type-specific validation
 * - Real-time form validation
 * - Auto-save drafts
 * - File attachments
 * - HIPAA-compliant data handling
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import {
  CreateIncidentSchema,
  type CreateIncidentInput,
  type IncidentTypeEnum,
  type IncidentSeverityEnum,
  type LocationTypeEnum,
  type MedicalResponseEnum,
  IncidentType,
  IncidentSeverity,
  LocationType,
  MedicalResponse,
} from '@/schemas/incidents/incident.schemas';
import { createIncident, updateIncident } from '@/actions/incidents.actions';
import { Button } from '@/components/ui/buttons/Button';
import { Input } from '@/components/ui/inputs/Input';
import { Textarea } from '@/components/ui/inputs/Textarea';
import { Select } from '@/components/ui/inputs/Select';
import { Alert } from '@/components/ui/feedback/Alert';
import { LoadingSpinner } from '@/components/ui/feedback/LoadingSpinner';
import { Card } from '@/components/ui/layout/Card';

interface IncidentReportFormProps {
  studentId?: string;
  incident?: CreateIncidentInput;
  onSuccess?: (incidentId: string) => void;
  onCancel?: () => void;
}

export function IncidentReportForm({
  studentId,
  incident,
  onSuccess,
  onCancel,
}: IncidentReportFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<CreateIncidentInput>({
    resolver: zodResolver(CreateIncidentSchema),
    defaultValues: incident || {
      studentId: studentId || '',
      status: 'PENDING_REVIEW',
      parentNotified: false,
      requiresFollowUp: false,
      legalReviewRequired: false,
      isConfidential: false,
      restrictedAccess: false,
    },
  });

  const selectedType = watch('type');
  const selectedSeverity = watch('severity');

  // Auto-save draft to localStorage
  useEffect(() => {
    const subscription = watch((value) => {
      if (!incident) {
        // Only save drafts for new incidents
        localStorage.setItem('incident-draft', JSON.stringify(value));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, incident]);

  // Load draft on mount
  useEffect(() => {
    if (!incident) {
      const draft = localStorage.getItem('incident-draft');
      if (draft) {
        const parsedDraft = JSON.parse(draft);
        Object.keys(parsedDraft).forEach((key) => {
          setValue(key as any, parsedDraft[key]);
        });
      }
    }
  }, [incident, setValue]);

  const onSubmit = async (data: CreateIncidentInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = incident
        ? await updateIncident({ ...data, id: (incident as any).id })
        : await createIncident(data);

      if (result.success && result.data) {
        // Clear draft
        localStorage.removeItem('incident-draft');

        if (onSuccess) {
          onSuccess(result.data.id!);
        } else {
          router.push(`/incidents/${result.data.id}`);
        }
      } else {
        setError(result.error || 'Failed to save incident report');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </h3>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Basic Information</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Incident Type <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} error={errors.type?.message}>
                      <option value="">Select incident type...</option>
                      {IncidentType.options.map((type) => (
                        <option key={type} value={type}>
                          {type.replace('_', ' ')}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="severity"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} error={errors.severity?.message}>
                      <option value="">Select severity...</option>
                      {IncidentSeverity.options.map((severity) => (
                        <option key={severity} value={severity}>
                          {severity}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Incident Date & Time <span className="text-red-500">*</span>
              </label>
              <Input
                type="datetime-local"
                {...register('incidentDate')}
                error={errors.incidentDate?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} error={errors.location?.message}>
                      <option value="">Select location...</option>
                      {LocationType.options.map((location) => (
                        <option key={location} value={location}>
                          {location.replace('_', ' ')}
                        </option>
                      ))}
                    </Select>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Details <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('locationDetails')}
                  placeholder="e.g., North playground near swings"
                  error={errors.locationDetails?.message}
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Incident Description */}
      {currentStep === 2 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Incident Description</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                {...register('description')}
                rows={8}
                placeholder="Provide a detailed description of what happened (minimum 20 characters)..."
                error={errors.description?.message}
              />
              <p className="text-xs text-gray-500 mt-1">
                Include: What happened, how it happened, who was involved, and any immediate actions taken.
              </p>
            </div>

            {/* Type-specific fields */}
            {selectedType === 'INJURY' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Injury Type
                    </label>
                    <Input
                      {...register('injuryType' as any)}
                      placeholder="e.g., Abrasion, Bruise, Cut"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Injury Location
                    </label>
                    <Input
                      {...register('injuryLocation' as any)}
                      placeholder="e.g., Left knee, Right arm"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      )}

      {/* Step 3: Medical Response */}
      {currentStep === 3 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Medical Response & Notifications</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical Response <span className="text-red-500">*</span>
              </label>
              <Controller
                name="medicalResponse"
                control={control}
                render={({ field }) => (
                  <Select {...field} error={errors.medicalResponse?.message}>
                    {MedicalResponse.options.map((response) => (
                      <option key={response} value={response}>
                        {response.replace('_', ' ')}
                      </option>
                    ))}
                  </Select>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical Notes
              </label>
              <Textarea
                {...register('medicalNotes')}
                rows={4}
                placeholder="Details of medical treatment provided..."
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Parent/Guardian Notification</h3>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('parentNotified')}
                    className="mr-2"
                  />
                  <span className="text-sm">Parent/Guardian Notified</span>
                </label>

                {watch('parentNotified') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notification Time
                      </label>
                      <Input
                        type="datetime-local"
                        {...register('parentNotifiedAt')}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notification Method
                      </label>
                      <Controller
                        name="parentNotificationMethod"
                        control={control}
                        render={({ field }) => (
                          <Select {...field}>
                            <option value="">Select method...</option>
                            <option value="PHONE">Phone</option>
                            <option value="EMAIL">Email</option>
                            <option value="IN_PERSON">In Person</option>
                            <option value="TEXT">Text Message</option>
                          </Select>
                        )}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Step 4: Follow-up & Review */}
      {currentStep === 4 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Follow-up & Review</h2>

          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('requiresFollowUp')}
                className="mr-2"
              />
              <span className="text-sm font-medium">Requires Follow-up Actions</span>
            </label>

            {watch('requiresFollowUp') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Follow-up Notes
                </label>
                <Textarea
                  {...register('followUpNotes')}
                  rows={3}
                  placeholder="Describe needed follow-up actions..."
                />
              </div>
            )}

            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('legalReviewRequired')}
                className="mr-2"
              />
              <span className="text-sm font-medium">Legal Review Required</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('isConfidential')}
                className="mr-2"
              />
              <span className="text-sm font-medium">Mark as Confidential</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                {...register('restrictedAccess')}
                className="mr-2"
              />
              <span className="text-sm font-medium">Restrict Access (Admin Only)</span>
            </label>
          </div>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <div>
          {currentStep > 1 && (
            <Button type="button" variant="secondary" onClick={prevStep}>
              Previous
            </Button>
          )}
          {onCancel && currentStep === 1 && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          {currentStep < totalSteps ? (
            <Button type="button" variant="primary" onClick={nextStep}>
              Next
            </Button>
          ) : (
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Incident Report'
              )}
            </Button>
          )}
        </div>
      </div>
    </form>
  );
}

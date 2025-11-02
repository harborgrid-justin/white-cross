'use client';

/**
 * @fileoverview Follow-Up Action Form
 * @module components/incidents/FollowUpForm
 */

'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateFollowUpActionSchema,
  type CreateFollowUpActionInput,
  FollowUpActionType,
  FollowUpPriority,
} from '@/schemas/incidents/follow-up.schemas';
import { createFollowUpAction } from '@/lib/actions/incidents.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

interface FollowUpFormProps {
  incidentId: string;
  onSuccess?: () => void;
}

export function FollowUpForm({ incidentId, onSuccess }: FollowUpFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, control, handleSubmit, formState: { errors } } = useForm<CreateFollowUpActionInput>({
    resolver: zodResolver(CreateFollowUpActionSchema),
    defaultValues: {
      incidentId,
      status: 'PENDING',
      percentComplete: 0,
      requiresVerification: false,
      isRecurring: false,
      isConfidential: false,
    },
  });

  const onSubmit = async (data: CreateFollowUpActionInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createFollowUpAction(data);
      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error || 'Failed to create follow-up action');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Create Follow-Up Action</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('title')}
              placeholder="Brief action title..."
              error={errors.title?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Action Type <span className="text-red-500">*</span>
              </label>
              <Controller
                name="actionType"
                control={control}
                render={({ field }) => (
                  <Select {...field} error={errors.actionType?.message}>
                    <option value="">Select type...</option>
                    {FollowUpActionType.options.map((type) => (
                      <option key={type} value={type}>
                        {type.replace('_', ' ')}
                      </option>
                    ))}
                  </Select>
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Priority <span className="text-red-500">*</span>
              </label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select {...field} error={errors.priority?.message}>
                    <option value="">Select priority...</option>
                    {FollowUpPriority.options.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </Select>
                )}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              {...register('description')}
              rows={4}
              placeholder="Detailed action description..."
              error={errors.description?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Assigned To (User ID) <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('assignedTo')}
                placeholder="User UUID..."
                error={errors.assignedTo?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Due Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="datetime-local"
                {...register('dueDate')}
                error={errors.dueDate?.message}
              />
            </div>
          </div>

          <label className="flex items-center">
            <input
              type="checkbox"
              {...register('requiresVerification')}
              className="mr-2"
            />
            <span className="text-sm">Requires verification upon completion</span>
          </label>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Follow-Up Action'}
        </Button>
      </div>
    </form>
  );
}

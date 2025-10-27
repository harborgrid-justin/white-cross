'use client';

/**
 * @fileoverview Witness Statement Collection Form
 * @module components/incidents/WitnessStatementForm
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateStatementSchema,
  type CreateStatementInput,
} from '@/schemas/incidents/witness.schemas';
import { submitWitnessStatement } from '@/actions/incidents.actions';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/feedback/Alert';
import { Card } from '@/components/ui/layout/Card';

interface WitnessStatementFormProps {
  incidentId: string;
  witnessId: string;
  onSuccess?: () => void;
}

export function WitnessStatementForm({
  incidentId,
  witnessId,
  onSuccess,
}: WitnessStatementFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<CreateStatementInput>({
    resolver: zodResolver(CreateStatementSchema),
    defaultValues: {
      incidentId,
      witnessId,
      status: 'DRAFT',
      verificationMethod: 'NONE',
    },
  });

  const onSubmit = async (data: CreateStatementInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await submitWitnessStatement(data);
      if (result.success) {
        onSuccess?.();
      } else {
        setError(result.error || 'Failed to submit statement');
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
        <h2 className="text-xl font-semibold mb-6">Witness Statement</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Time of Observation <span className="text-red-500">*</span>
            </label>
            <Input
              type="datetime-local"
              {...register('witnessedAt')}
              error={errors.witnessedAt?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Statement <span className="text-red-500">*</span>
            </label>
            <Textarea
              {...register('statement')}
              rows={8}
              placeholder="Provide your detailed statement (minimum 50 characters)..."
              error={errors.statement?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              What Did You Witness? <span className="text-red-500">*</span>
            </label>
            <Textarea
              {...register('whatWitnessed')}
              rows={4}
              placeholder="Describe what you saw or heard..."
              error={errors.whatWitnessed?.message}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Before Incident
              </label>
              <Textarea
                {...register('beforeIncident')}
                rows={3}
                placeholder="What happened before..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                During Incident
              </label>
              <Textarea
                {...register('duringIncident')}
                rows={3}
                placeholder="What happened during..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                After Incident
              </label>
              <Textarea
                {...register('afterIncident')}
                rows={3}
                placeholder="What happened after..."
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Legal Attestation</h3>
            <div className="space-y-2">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  {...register('attestation.truthfulnessAcknowledged')}
                  className="mt-1 mr-2"
                  required
                />
                <span className="text-sm">I attest that this statement is truthful and accurate to the best of my knowledge</span>
              </label>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  {...register('attestation.consequencesUnderstood')}
                  className="mt-1 mr-2"
                  required
                />
                <span className="text-sm">I understand the consequences of providing false information</span>
              </label>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  {...register('attestation.voluntaryStatement')}
                  className="mt-1 mr-2"
                  required
                />
                <span className="text-sm">I am providing this statement voluntarily</span>
              </label>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Statement'}
        </Button>
      </div>
    </form>
  );
}

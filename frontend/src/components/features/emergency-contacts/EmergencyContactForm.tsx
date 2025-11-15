/**
 * Emergency Contact Form Component
 * Form for adding and editing emergency contacts
 *
 * @module components/features/emergency-contacts/EmergencyContactForm
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Save, AlertCircle } from 'lucide-react';

/**
 * Emergency Contact Form Schema
 */
const emergencyContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long'),
  phoneNumber: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[\+]?[(]?[\d\s\-\(\)\.]{10,}$/, 'Invalid phone number format'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  relationship: z.enum(['parent', 'guardian', 'relative', 'emergency'], {
    message: 'Please select a relationship'
  }),
  priority: z.enum(['PRIMARY', 'SECONDARY', 'EMERGENCY'], {
    message: 'Please select a priority level'
  }),
  preferredContactMethod: z.enum(['phone', 'email', 'text'], {
    message: 'Please select a preferred contact method'
  }),
  canPickupStudent: z.boolean().default(false),
  canAuthorizeEmergencyTreatment: z.boolean().default(false),
  isActive: z.boolean().default(true)
});

type EmergencyContactFormData = z.infer<typeof emergencyContactSchema>;

/**
 * Emergency Contact Form Props
 */
export interface EmergencyContactFormProps {
  /** Student ID to associate contact with */
  studentId: string;
  /** Existing contact data for editing */
  initialData?: Partial<EmergencyContactFormData>;
  /** Form submission handler */
  onSubmit?: (data: EmergencyContactFormData) => Promise<void>;
  /** Custom className */
  className?: string;
}

/**
 * Emergency Contact Form Component
 */
export const EmergencyContactForm: React.FC<EmergencyContactFormProps> = ({
  studentId,
  initialData,
  onSubmit,
  className
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form setup
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<EmergencyContactFormData>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: {
      firstName: initialData?.firstName || '',
      lastName: initialData?.lastName || '',
      phoneNumber: initialData?.phoneNumber || '',
      email: initialData?.email || '',
      relationship: initialData?.relationship || undefined,
      priority: initialData?.priority || 'SECONDARY',
      preferredContactMethod: initialData?.preferredContactMethod || 'phone',
      canPickupStudent: initialData?.canPickupStudent || false,
      canAuthorizeEmergencyTreatment: initialData?.canAuthorizeEmergencyTreatment || false,
      isActive: initialData?.isActive !== false
    }
  });

  // Form submission
  const handleFormSubmit = async (data: EmergencyContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Default API call
        const response = await fetch(`/api/students/${studentId}/emergency-contacts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error('Failed to save emergency contact');
        }

        // Redirect on success
        router.push(`/students/${studentId}/emergency-contacts`);
      }
    } catch (error) {
      console.error('Error saving emergency contact:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to save emergency contact');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={className}>
      <div className="space-y-6">
        {/* Error Alert */}
        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              {...register('firstName')}
              placeholder="Enter first name"
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && (
              <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              {...register('lastName')}
              placeholder="Enter last name"
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && (
              <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              {...register('phoneNumber')}
              placeholder="(555) 123-4567"
              className={errors.phoneNumber ? 'border-red-500' : ''}
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-600 mt-1">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="email@example.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Relationship & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="relationship">Relationship *</Label>
            <Select onValueChange={(value) => setValue('relationship', value as any)}>
              <SelectTrigger className={errors.relationship ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="guardian">Guardian</SelectItem>
                <SelectItem value="relative">Relative</SelectItem>
                <SelectItem value="emergency">Emergency Contact</SelectItem>
              </SelectContent>
            </Select>
            {errors.relationship && (
              <p className="text-sm text-red-600 mt-1">{errors.relationship.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="priority">Priority *</Label>
            <Select onValueChange={(value) => setValue('priority', value as any)}>
              <SelectTrigger className={errors.priority ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PRIMARY">Primary</SelectItem>
                <SelectItem value="SECONDARY">Secondary</SelectItem>
                <SelectItem value="EMERGENCY">Emergency Only</SelectItem>
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="text-sm text-red-600 mt-1">{errors.priority.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="preferredContactMethod">Preferred Contact *</Label>
            <Select onValueChange={(value) => setValue('preferredContactMethod', value as any)}>
              <SelectTrigger className={errors.preferredContactMethod ? 'border-red-500' : ''}>
                <SelectValue placeholder="Contact method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone Call</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="text">Text Message</SelectItem>
              </SelectContent>
            </Select>
            {errors.preferredContactMethod && (
              <p className="text-sm text-red-600 mt-1">{errors.preferredContactMethod.message}</p>
            )}
          </div>
        </div>

        {/* Permissions */}
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
            Permissions
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="canPickupStudent"
                {...register('canPickupStudent')}
                onCheckedChange={(checked) => setValue('canPickupStudent', checked as boolean)}
              />
              <Label htmlFor="canPickupStudent" className="text-sm">
                Can pick up student from school
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="canAuthorizeEmergencyTreatment"
                {...register('canAuthorizeEmergencyTreatment')}
                onCheckedChange={(checked) => setValue('canAuthorizeEmergencyTreatment', checked as boolean)}
              />
              <Label htmlFor="canAuthorizeEmergencyTreatment" className="text-sm">
                Can authorize emergency medical treatment
              </Label>
            </div>
          </div>
        </Card>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isSubmitting ? 'Saving...' : 'Save Contact'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
};
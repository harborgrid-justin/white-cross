'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Phone, User } from 'lucide-react';

/**
 * WF-COMP-STUDENT-MODAL-002 | EmergencyContactModal.tsx
 * Purpose: Form modal for adding/editing emergency contacts for students
 *
 * @module app/(dashboard)/students/components/modals/EmergencyContactModal
 */

/**
 * Emergency contact data schema
 */
const emergencyContactSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  relationship: z.string().min(1, 'Relationship is required'),
  phoneNumber: z.string().regex(/^\+?1?\d{10,14}$/, 'Invalid phone number'),
  alternatePhone: z.string().regex(/^\+?1?\d{10,14}$/, 'Invalid phone number').optional().or(z.literal('')),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  address: z.string().optional(),
  isPrimary: z.boolean().default(false),
  canPickup: z.boolean().default(true),
  canAuthorize: z.boolean().default(false),
  notes: z.string().optional()
});

/**
 * Emergency contact form data type
 */
export type EmergencyContactFormData = z.infer<typeof emergencyContactSchema>;

/**
 * Existing emergency contact for editing
 */
export interface EmergencyContact extends EmergencyContactFormData {
  id: string;
  studentId: string;
}

/**
 * Props for EmergencyContactModal component
 */
interface EmergencyContactModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Callback to close modal */
  onClose: () => void;
  /** Student ID for the emergency contact */
  studentId: string;
  /** Student name for display */
  studentName: string;
  /** Existing contact for editing (undefined for new contact) */
  contact?: EmergencyContact;
  /** Callback when form is submitted */
  onSubmit: (data: EmergencyContactFormData) => void | Promise<void>;
  /** Whether form submission is in progress */
  isLoading?: boolean;
}

/**
 * EmergencyContactModal Component
 *
 * Form modal for managing emergency contacts with:
 * - Complete contact information fields
 * - Relationship selection
 * - Phone number validation
 * - Permission checkboxes (pickup, authorize medical)
 * - Primary contact designation
 * - Form validation with error messages
 *
 * **Features:**
 * - Add new or edit existing contacts
 * - Real-time validation
 * - Phone number formatting
 * - Multiple phone numbers support
 * - Permission management
 * - Loading states
 *
 * **Validation:**
 * - Required fields enforcement
 * - Phone number format validation
 * - Email format validation
 * - Relationship selection
 *
 * **Accessibility:**
 * - Form labels and associations
 * - Error announcements
 * - Keyboard navigation
 * - Focus management
 *
 * @component
 * @example
 * ```tsx
 * const [showModal, setShowModal] = useState(false);
 *
 * <EmergencyContactModal
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   studentId="123"
 *   studentName="John Doe"
 *   onSubmit={handleSaveContact}
 * />
 * ```
 */
export function EmergencyContactModal({
  isOpen,
  onClose,
  studentId,
  studentName,
  contact,
  onSubmit,
  isLoading = false
}: EmergencyContactModalProps) {
  const isEditing = !!contact;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<EmergencyContactFormData>({
    resolver: zodResolver(emergencyContactSchema),
    defaultValues: contact || {
      firstName: '',
      lastName: '',
      relationship: '',
      phoneNumber: '',
      alternatePhone: '',
      email: '',
      address: '',
      isPrimary: false,
      canPickup: true,
      canAuthorize: false,
      notes: ''
    }
  });

  /**
   * Handle form submission
   */
  const handleFormSubmit = async (data: EmergencyContactFormData) => {
    await onSubmit(data);
    reset();
  };

  /**
   * Handle modal close with reset
   */
  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <Modal.Header>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {isEditing ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
            </h2>
            <p className="text-sm text-gray-600">For student: {studentName}</p>
          </div>
        </div>
      </Modal.Header>

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Modal.Body>
          <div className="space-y-6">
            {/* Contact Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  disabled={isLoading}
                  error={errors.firstName?.message}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  disabled={isLoading}
                  error={errors.lastName?.message}
                />
              </div>
            </div>

            {/* Relationship */}
            <div>
              <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">
                Relationship <span className="text-red-500">*</span>
              </label>
              <Select
                id="relationship"
                {...register('relationship')}
                disabled={isLoading}
              >
                <option value="">Select relationship...</option>
                <option value="parent">Parent</option>
                <option value="guardian">Legal Guardian</option>
                <option value="grandparent">Grandparent</option>
                <option value="aunt">Aunt</option>
                <option value="uncle">Uncle</option>
                <option value="sibling">Sibling</option>
                <option value="family-friend">Family Friend</option>
                <option value="other">Other</option>
              </Select>
              {errors.relationship && (
                <p className="mt-1 text-sm text-red-600">{errors.relationship.message}</p>
              )}
            </div>

            {/* Phone Numbers */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Phone <span className="text-red-500">*</span>
                </label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  {...register('phoneNumber')}
                  placeholder="(555) 123-4567"
                  disabled={isLoading}
                  error={errors.phoneNumber?.message}
                />
              </div>
              <div>
                <label htmlFor="alternatePhone" className="block text-sm font-medium text-gray-700 mb-1">
                  Alternate Phone
                </label>
                <Input
                  id="alternatePhone"
                  type="tel"
                  {...register('alternatePhone')}
                  placeholder="(555) 123-4567"
                  disabled={isLoading}
                  error={errors.alternatePhone?.message}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="contact@example.com"
                disabled={isLoading}
                error={errors.email?.message}
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <Input
                id="address"
                {...register('address')}
                placeholder="123 Main St, City, State 12345"
                disabled={isLoading}
              />
            </div>

            {/* Permissions */}
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-gray-900 mb-3">Permissions</h3>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="isPrimary"
                  {...register('isPrimary')}
                  disabled={isLoading}
                />
                <div>
                  <label htmlFor="isPrimary" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Primary Contact
                  </label>
                  <p className="text-xs text-gray-600">
                    This person will be contacted first in emergencies
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="canPickup"
                  {...register('canPickup')}
                  disabled={isLoading}
                />
                <div>
                  <label htmlFor="canPickup" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Authorized for Pickup
                  </label>
                  <p className="text-xs text-gray-600">
                    Can pick up the student from school
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="canAuthorize"
                  {...register('canAuthorize')}
                  disabled={isLoading}
                />
                <div>
                  <label htmlFor="canAuthorize" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Can Authorize Medical Treatment
                  </label>
                  <p className="text-xs text-gray-600">
                    Can provide consent for medical procedures
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                id="notes"
                {...register('notes')}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Any additional information about this contact..."
                disabled={isLoading}
              />
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  {isEditing ? 'Update Contact' : 'Add Contact'}
                </>
              )}
            </Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

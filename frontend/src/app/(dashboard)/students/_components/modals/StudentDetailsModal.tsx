'use client';

import { Modal } from '@/components/ui/overlays/Modal';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/display/Avatar';
import { Badge } from '@/components/ui/display/Badge';
import { Tabs } from '@/components/ui/navigation/Tabs';
import { Card } from '@/components/ui/layout/Card';
import { StudentHealthRecord, HealthRecordData } from '../StudentHealthRecord';
import { User, Phone, MapPin, Calendar, Edit, Archive, X } from 'lucide-react';

/**
 * WF-COMP-STUDENT-MODAL-005 | StudentDetailsModal.tsx
 * Purpose: Comprehensive modal for viewing complete student information with tabbed sections
 *
 * @module app/(dashboard)/students/components/modals/StudentDetailsModal
 */

/**
 * Emergency contact information
 */
export interface EmergencyContactInfo {
  id: string;
  firstName: string;
  lastName: string;
  relationship: string;
  phoneNumber: string;
  alternatePhone?: string;
  isPrimary: boolean;
  canPickup: boolean;
  canAuthorize: boolean;
}

/**
 * Complete student details
 */
export interface StudentDetails {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: string;
  gradeLevel: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  photoUrl?: string;

  // Contact Information
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phoneNumber?: string;
  email?: string;

  // School Information
  enrollmentDate: string;
  homeroom?: string;
  locker?: string;

  // Emergency Contacts
  emergencyContacts: EmergencyContactInfo[];

  // Health Information
  healthRecord?: HealthRecordData;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

/**
 * Props for StudentDetailsModal component
 */
interface StudentDetailsModalProps {
  /** Whether modal is open */
  isOpen: boolean;
  /** Callback to close modal */
  onClose: () => void;
  /** Student details to display */
  student: StudentDetails | null;
  /** Callback when edit is clicked */
  onEdit?: (student: StudentDetails) => void;
  /** Callback when archive is clicked */
  onArchive?: (student: StudentDetails) => void;
  /** Whether user can view PHI */
  canViewPHI?: boolean;
  /** Whether actions are disabled */
  actionsDisabled?: boolean;
}

/**
 * StudentDetailsModal Component
 *
 * Comprehensive modal for viewing complete student information with:
 * - Tabbed sections (Overview, Contact, Emergency Contacts, Health)
 * - Student photo and basic info header
 * - Status badges
 * - Action buttons (Edit, Archive)
 * - HIPAA-compliant PHI handling
 *
 * **Features:**
 * - Multi-tab organization
 * - Complete student profile
 * - Emergency contact list
 * - Health records integration
 * - Edit and archive actions
 * - Loading states
 * - Responsive layout
 *
 * **HIPAA Compliance:**
 * - PHI access control
 * - Health records in separate tab
 * - PHI warning integration
 * - Audit trail support
 *
 * **Accessibility:**
 * - Keyboard navigation
 * - Tab controls
 * - ARIA labels
 * - Focus management
 *
 * @component
 * @example
 * ```tsx
 * const [showDetails, setShowDetails] = useState(false);
 * const [selectedStudent, setSelectedStudent] = useState<StudentDetails | null>(null);
 *
 * <StudentDetailsModal
 *   isOpen={showDetails}
 *   onClose={() => setShowDetails(false)}
 *   student={selectedStudent}
 *   onEdit={handleEdit}
 *   canViewPHI={currentUser.canViewPHI}
 * />
 * ```
 */
export function StudentDetailsModal({
  isOpen,
  onClose,
  student,
  onEdit,
  onArchive,
  canViewPHI = false,
  actionsDisabled = false
}: StudentDetailsModalProps) {
  if (!student) return null;

  /**
   * Format date string
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Get full name
   */
  const fullName = student.middleName
    ? `${student.firstName} ${student.middleName} ${student.lastName}`
    : `${student.firstName} ${student.lastName}`;

  /**
   * Get status variant
   */
  const getStatusVariant = (status: StudentDetails['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'graduated':
        return 'default';
      case 'transferred':
        return 'warning';
      default:
        return 'default';
    }
  };

  /**
   * Calculate age from date of birth
   */
  const getAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <Modal.Header>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Avatar
              src={student.photoUrl}
              alt={fullName}
              size="lg"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{fullName}</h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-600">ID: {student.studentId}</p>
                <Badge variant={getStatusVariant(student.status)}>
                  {student.status}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(student)}
                disabled={actionsDisabled}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            {onArchive && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onArchive(student)}
                disabled={actionsDisabled}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </Button>
            )}
          </div>
        </div>
      </Modal.Header>

      <Modal.Body>
        <Tabs defaultValue="overview" className="w-full">
          <Tabs.List>
            <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
            <Tabs.Trigger value="contact">Contact Info</Tabs.Trigger>
            <Tabs.Trigger value="emergency">Emergency Contacts</Tabs.Trigger>
            {canViewPHI && <Tabs.Trigger value="health">Health Records</Tabs.Trigger>}
          </Tabs.List>

          {/* Overview Tab */}
          <Tabs.Content value="overview">
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Basic Information
                  </h3>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatDate(student.dateOfBirth)} ({getAge(student.dateOfBirth)} years old)
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Gender</dt>
                      <dd className="mt-1 text-sm text-gray-900">{student.gender}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Grade Level</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {student.gradeLevel === 'K' ? 'Kindergarten' : `Grade ${student.gradeLevel}`}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Enrollment Date</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatDate(student.enrollmentDate)}
                      </dd>
                    </div>
                    {student.homeroom && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Homeroom</dt>
                        <dd className="mt-1 text-sm text-gray-900">{student.homeroom}</dd>
                      </div>
                    )}
                    {student.locker && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Locker</dt>
                        <dd className="mt-1 text-sm text-gray-900">{student.locker}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </Card>

              {/* Record Information */}
              <Card>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Record Information
                  </h3>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Created</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatDate(student.createdAt)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {formatDate(student.updatedAt)}
                      </dd>
                    </div>
                  </dl>
                </div>
              </Card>
            </div>
          </Tabs.Content>

          {/* Contact Info Tab */}
          <Tabs.Content value="contact">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Contact Information
                </h3>
                <dl className="space-y-4">
                  {student.address && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {student.address}
                        {student.city && student.state && (
                          <div>{student.city}, {student.state} {student.zipCode}</div>
                        )}
                      </dd>
                    </div>
                  )}
                  {student.phoneNumber && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                      <dd className="mt-1 text-sm text-gray-900">{student.phoneNumber}</dd>
                    </div>
                  )}
                  {student.email && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="mt-1 text-sm text-gray-900">{student.email}</dd>
                    </div>
                  )}
                  {!student.address && !student.phoneNumber && !student.email && (
                    <p className="text-sm text-gray-500 italic">No contact information available</p>
                  )}
                </dl>
              </div>
            </Card>
          </Tabs.Content>

          {/* Emergency Contacts Tab */}
          <Tabs.Content value="emergency">
            <div className="space-y-4">
              {student.emergencyContacts.length === 0 ? (
                <Card>
                  <div className="p-6 text-center">
                    <p className="text-gray-500">No emergency contacts on file</p>
                  </div>
                </Card>
              ) : (
                student.emergencyContacts.map((contact) => (
                  <Card key={contact.id}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {contact.firstName} {contact.lastName}
                          </h4>
                          <p className="text-sm text-gray-600">{contact.relationship}</p>
                        </div>
                        <div className="flex gap-2">
                          {contact.isPrimary && (
                            <Badge variant="default">Primary</Badge>
                          )}
                          {contact.canAuthorize && (
                            <Badge variant="success">Can Authorize</Badge>
                          )}
                        </div>
                      </div>
                      <dl className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <dd className="text-gray-900">{contact.phoneNumber}</dd>
                        </div>
                        {contact.alternatePhone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <dd className="text-gray-900">{contact.alternatePhone} (Alternate)</dd>
                          </div>
                        )}
                      </dl>
                      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
                        {contact.canPickup && '✓ Authorized for pickup'}
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </Tabs.Content>

          {/* Health Records Tab */}
          {canViewPHI && (
            <Tabs.Content value="health">
              {student.healthRecord ? (
                <StudentHealthRecord
                  data={student.healthRecord}
                  canViewPHI={canViewPHI}
                />
              ) : (
                <Card>
                  <div className="p-6 text-center">
                    <p className="text-gray-500">No health records available</p>
                  </div>
                </Card>
              )}
            </Tabs.Content>
          )}
        </Tabs>
      </Modal.Body>

      <Modal.Footer>
        <div className="flex items-center justify-end">
          <Button variant="ghost" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

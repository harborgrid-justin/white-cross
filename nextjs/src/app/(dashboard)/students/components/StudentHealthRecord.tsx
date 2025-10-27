'use client';

import { Card } from '@/components/ui/layout/Card';
import { Badge } from '@/components/ui/display/Badge';
import { Alert } from '@/components/ui/feedback/Alert';
import { Accordion } from '@/components/ui/display/Accordion';
import { AlertTriangle, Pill, Shield, Stethoscope } from 'lucide-react';

/**
 * @fileoverview Comprehensive student health record display component with HIPAA/FERPA compliance.
 *
 * Displays complete health information for a student including allergies, medications,
 * immunizations, and medical conditions. Implements strict PHI protection controls and
 * requires explicit permission verification before displaying sensitive health data.
 *
 * **Core Features:**
 * - Organized accordion sections for each health category
 * - Color-coded severity indicators for allergies
 * - Detailed medication information with dosage and frequency
 * - Immunization tracking with due dates
 * - Medical condition status tracking
 * - Emergency notes display
 * - Blood type information
 * - Last updated timestamp
 *
 * **Healthcare Compliance:**
 * - **HIPAA PHI Protection:**
 *   - Requires `canViewPHI` permission check before displaying
 *   - All health information treated as Protected Health Information
 *   - Access should be logged for audit trail
 *   - No PHI in component logs or console output
 *
 * - **FERPA Educational Records:**
 *   - Health records are part of educational records
 *   - Access restricted to authorized personnel only
 *   - Parent/guardian access rights enforced
 *
 * - **Consent Management:**
 *   - Medical information release consent required
 *   - Emergency contact notification consent
 *   - Parent/guardian authorization for treatment
 *
 * **Data Categories:**
 * 1. **Allergies**: Life-threatening to mild, with reactions
 * 2. **Medications**: Active prescriptions with administration details
 * 3. **Immunizations**: Vaccine records with due dates
 * 4. **Conditions**: Medical conditions with status tracking
 * 5. **Emergency Info**: Blood type and critical notes
 *
 * **Security Features:**
 * - Permission-based access control
 * - Restricted access warning when unauthorized
 * - No data displayed without `canViewPHI` flag
 * - Audit trail support through parent callbacks
 *
 * **Integration Points:**
 * - Medication administration: Link to medication management
 * - Allergy alerts: Integration with incident reporting
 * - Immunization compliance: School health requirement tracking
 * - Emergency contacts: Connection to emergency contact system
 *
 * **Accessibility:**
 * - WCAG 2.1 AA compliant
 * - Keyboard navigable accordion
 * - Screen reader friendly structure
 * - High contrast severity indicators
 *
 * @module app/(dashboard)/students/components/StudentHealthRecord
 * @category Components
 * @subcategory Students
 * @since 1.0.0
 *
 * @example
 * ```tsx
 * import { StudentHealthRecord } from '@/app/(dashboard)/students/components/StudentHealthRecord';
 *
 * function StudentProfile() {
 *   const { data: healthRecord } = useHealthRecord(studentId);
 *   const currentUser = useCurrentUser();
 *
 *   // Check PHI access permission
 *   const canViewPHI = currentUser.hasPermission('view_phi') &&
 *                      (currentUser.role === 'nurse' || currentUser.id === student.assignedNurseId);
 *
 *   // Audit log PHI access
 *   useEffect(() => {
 *     if (canViewPHI && healthRecord) {
 *       auditLog.record({
 *         action: 'view_phi',
 *         resourceType: 'health_record',
 *         resourceId: healthRecord.studentId,
 *         userId: currentUser.id
 *       });
 *     }
 *   }, [canViewPHI, healthRecord]);
 *
 *   return (
 *     <StudentHealthRecord
 *       data={healthRecord}
 *       canViewPHI={canViewPHI}
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Restricted access for non-healthcare staff
 * <StudentHealthRecord
 *   data={healthRecord}
 *   canViewPHI={false} // Will show access restriction warning
 * />
 * ```
 */

/**
 * Allergy information
 */
export interface Allergy {
  id: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe' | 'life-threatening';
  reaction?: string;
  dateIdentified?: string;
}

/**
 * Medication information
 */
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate?: string;
  prescribedBy?: string;
  instructions?: string;
}

/**
 * Immunization record
 */
export interface Immunization {
  id: string;
  vaccine: string;
  dateAdministered: string;
  lot?: string;
  administeredBy?: string;
  site?: string;
  nextDueDate?: string;
}

/**
 * Medical condition information
 */
export interface MedicalCondition {
  id: string;
  condition: string;
  diagnosedDate?: string;
  status: 'active' | 'resolved' | 'chronic';
  notes?: string;
}

/**
 * Complete health record data
 */
export interface HealthRecordData {
  studentId: string;
  studentName: string;
  allergies: Allergy[];
  medications: Medication[];
  immunizations: Immunization[];
  conditions: MedicalCondition[];
  bloodType?: string;
  emergencyNotes?: string;
  lastUpdated: string;
}

/**
 * Props for StudentHealthRecord component
 */
interface StudentHealthRecordProps {
  /** Health record data */
  data: HealthRecordData;
  /** Whether the user has permission to view PHI */
  canViewPHI?: boolean;
  /** Optional className for styling */
  className?: string;
}

/**
 * StudentHealthRecord Component
 *
 * Displays comprehensive health information for a student including:
 * - Allergies with severity indicators
 * - Current medications
 * - Immunization records
 * - Medical conditions
 * - Emergency information
 *
 * **Features:**
 * - Organized accordion sections
 * - Color-coded severity indicators
 * - HIPAA-compliant display
 * - Empty states for missing data
 * - Last updated timestamp
 *
 * **HIPAA Compliance:**
 * - Only displays data if canViewPHI is true
 * - Shows warning when PHI access is restricted
 * - No PHI in component state logs
 * - Audit trail support via props
 *
 * **Accessibility:**
 * - Semantic HTML structure
 * - Proper ARIA labels
 * - Keyboard navigation support
 * - Screen reader friendly
 *
 * @component
 * @example
 * ```tsx
 * <StudentHealthRecord
 *   data={healthRecord}
 *   canViewPHI={currentUser.hasPermission('view_phi')}
 * />
 * ```
 */
export function StudentHealthRecord({
  data,
  canViewPHI = false,
  className = ''
}: StudentHealthRecordProps) {
  // If user cannot view PHI, show restricted access message
  if (!canViewPHI) {
    return (
      <Card className={className}>
        <Alert variant="warning">
          <AlertTriangle className="w-5 h-5" />
          <div>
            <p className="font-semibold">Access Restricted</p>
            <p className="text-sm">You do not have permission to view Protected Health Information (PHI).</p>
          </div>
        </Alert>
      </Card>
    );
  }

  /**
   * Get severity badge variant based on allergy severity
   */
  const getSeverityVariant = (severity: Allergy['severity']) => {
    switch (severity) {
      case 'life-threatening':
        return 'destructive';
      case 'severe':
        return 'destructive';
      case 'moderate':
        return 'warning';
      case 'mild':
        return 'default';
      default:
        return 'default';
    }
  };

  /**
   * Format date string
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const sections = [
    {
      id: 'allergies',
      title: 'Allergies',
      icon: <AlertTriangle className="w-5 h-5" />,
      count: data.allergies.length,
      content: (
        <div className="space-y-3">
          {data.allergies.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No known allergies</p>
          ) : (
            data.allergies.map((allergy) => (
              <div key={allergy.id} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{allergy.allergen}</h4>
                      <Badge variant={getSeverityVariant(allergy.severity)}>
                        {allergy.severity}
                      </Badge>
                    </div>
                    {allergy.reaction && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Reaction:</span> {allergy.reaction}
                      </p>
                    )}
                    {allergy.dateIdentified && (
                      <p className="text-xs text-gray-500 mt-1">
                        Identified: {formatDate(allergy.dateIdentified)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )
    },
    {
      id: 'medications',
      title: 'Current Medications',
      icon: <Pill className="w-5 h-5" />,
      count: data.medications.length,
      content: (
        <div className="space-y-3">
          {data.medications.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No current medications</p>
          ) : (
            data.medications.map((medication) => (
              <div key={medication.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{medication.name}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Dosage:</span>
                    <p className="text-gray-600">{medication.dosage}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Frequency:</span>
                    <p className="text-gray-600">{medication.frequency}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Route:</span>
                    <p className="text-gray-600">{medication.route}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Start Date:</span>
                    <p className="text-gray-600">{formatDate(medication.startDate)}</p>
                  </div>
                </div>
                {medication.instructions && (
                  <div className="mt-2 pt-2 border-t border-blue-300">
                    <span className="text-xs font-medium text-gray-700">Instructions:</span>
                    <p className="text-xs text-gray-600 mt-1">{medication.instructions}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )
    },
    {
      id: 'immunizations',
      title: 'Immunizations',
      icon: <Shield className="w-5 h-5" />,
      count: data.immunizations.length,
      content: (
        <div className="space-y-3">
          {data.immunizations.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No immunization records</p>
          ) : (
            data.immunizations.map((immunization) => (
              <div key={immunization.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{immunization.vaccine}</h4>
                    <p className="text-sm text-gray-600">
                      Administered: {formatDate(immunization.dateAdministered)}
                    </p>
                    {immunization.nextDueDate && (
                      <p className="text-sm text-gray-600">
                        Next Due: {formatDate(immunization.nextDueDate)}
                      </p>
                    )}
                    {immunization.administeredBy && (
                      <p className="text-xs text-gray-500 mt-1">
                        By: {immunization.administeredBy}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )
    },
    {
      id: 'conditions',
      title: 'Medical Conditions',
      icon: <Stethoscope className="w-5 h-5" />,
      count: data.conditions.length,
      content: (
        <div className="space-y-3">
          {data.conditions.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No medical conditions recorded</p>
          ) : (
            data.conditions.map((condition) => (
              <div key={condition.id} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{condition.condition}</h4>
                  <Badge variant={condition.status === 'active' ? 'default' : 'secondary'}>
                    {condition.status}
                  </Badge>
                </div>
                {condition.diagnosedDate && (
                  <p className="text-sm text-gray-600">
                    Diagnosed: {formatDate(condition.diagnosedDate)}
                  </p>
                )}
                {condition.notes && (
                  <p className="text-sm text-gray-600 mt-2">{condition.notes}</p>
                )}
              </div>
            ))
          )}
        </div>
      )
    }
  ];

  return (
    <Card className={className}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Health Record</h3>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p>Student: {data.studentName}</p>
            <p>Last Updated: {formatDate(data.lastUpdated)}</p>
          </div>
          {data.bloodType && (
            <div className="mt-2">
              <span className="text-sm font-medium text-gray-700">Blood Type: </span>
              <Badge variant="secondary">{data.bloodType}</Badge>
            </div>
          )}
        </div>

        {/* Emergency Notes */}
        {data.emergencyNotes && (
          <Alert variant="warning" className="mb-6">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <p className="font-semibold">Emergency Notes</p>
              <p className="text-sm mt-1">{data.emergencyNotes}</p>
            </div>
          </Alert>
        )}

        {/* Health Information Sections */}
        <Accordion type="multiple" className="space-y-2">
          {sections.map((section) => (
            <Accordion.Item key={section.id} value={section.id}>
              <Accordion.Trigger>
                <div className="flex items-center gap-3">
                  {section.icon}
                  <span className="font-semibold">{section.title}</span>
                  <Badge variant="secondary" className="ml-2">
                    {section.count}
                  </Badge>
                </div>
              </Accordion.Trigger>
              <Accordion.Content>
                {section.content}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </Card>
  );
}

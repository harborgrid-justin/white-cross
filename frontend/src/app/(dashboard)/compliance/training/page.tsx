/**
 * @fileoverview Training Compliance Management Page
 *
 * Comprehensive staff training tracking system for HIPAA-required training,
 * certifications, and continuing education. Ensures all healthcare staff maintain
 * required competencies and certifications as mandated by regulatory requirements.
 *
 * @module compliance/training
 *
 * @description
 * This page manages the complete training compliance lifecycle:
 * - Required HIPAA training tracking (annual requirement)
 * - Medication administration certification management
 * - Emergency response training compliance
 * - Continuing education credit tracking
 * - Training deadline monitoring and notifications
 * - Certification expiration tracking
 * - Training assignment and scheduling
 *
 * @see {@link https://www.hhs.gov/hipaa/for-professionals/security/laws-regulations/index.html | HIPAA Security Rule}
 *
 * @remarks
 * **HIPAA Training Requirements:**
 * - All staff must receive HIPAA training upon hire (§ 164.530(b)(1))
 * - Annual HIPAA refresher training required
 * - Training documentation must be retained for 6 years
 * - Training must be appropriate to staff role and responsibilities
 * - Periodic security reminders required (§ 164.308(a)(5)(ii)(A))
 *
 * **Training Categories:**
 * - MANDATORY: Required for all staff (HIPAA, Emergency Response)
 * - REQUIRED: Required for specific roles (Medication Administration for nurses)
 * - RECOMMENDED: Optional but encouraged (Advanced First Aid)
 * - CONTINUING_EDUCATION: Professional development credits
 *
 * **Compliance Status:**
 * - COMPLIANT: All required training current
 * - IN_PROGRESS: Training partially complete
 * - OVERDUE: Training past deadline, immediate action required
 * - EXPIRED: Certification expired, re-training needed
 *
 * @since 1.0.0
 */

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Users, CheckCircle, AlertTriangle, Clock, Award } from 'lucide-react';

/**
 * Page metadata for SEO and browser display
 */
export const metadata: Metadata = {
  title: 'Training Compliance | White Cross',
  description: 'Track staff training completion, certifications, and deadlines',
};

/**
 * Force dynamic rendering for this route
 * Required for real-time training status and user-specific assignments
 */
export const dynamic = 'force-dynamic';

/**
 * Training Compliance Page Component
 *
 * React Server Component for managing staff training compliance, tracking
 * certification status, and monitoring training deadlines. Provides comprehensive
 * view of organizational training compliance status.
 *
 * @async
 * @returns {Promise<JSX.Element>} Rendered training compliance page
 *
 * @description
 * **Key Features:**
 * - Organization-wide training completion rate dashboard
 * - Individual staff training status tracking
 * - Course-level completion statistics
 * - Overdue training alerts and notifications
 * - Certification expiration monitoring
 * - Training assignment management
 * - Progress tracking for in-progress courses
 *
 * **Statistics Displayed:**
 * - Overall completion rate percentage
 * - Count of overdue training assignments
 * - Number of in-progress courses
 * - Active certifications count
 * - Certifications expiring soon
 *
 * **Training Courses Tracked:**
 * 1. HIPAA Privacy and Security Training (Annual, Mandatory)
 * 2. Medication Administration Certification (Role-specific, Mandatory)
 * 3. Emergency Response Procedures (Annual, Required)
 * 4. Bloodborne Pathogens Training (Annual, Mandatory)
 * 5. First Aid/CPR Certification (Biennial, Recommended)
 *
 * **User Training Status:**
 * - Completed training count vs required
 * - Overdue training list
 * - In-progress course progress
 * - Certification expiration dates
 * - Next deadline dates
 *
 * @example
 * ```tsx
 * // Rendered at route: /compliance/training
 * <TrainingCompliancePage />
 * ```
 *
 * @remarks
 * This is a Next.js 16 Server Component with dynamic rendering.
 * Training data aggregated from Learning Management System (LMS).
 * Automated notifications sent for upcoming deadlines and overdue training.
 *
 * @see {@link getTrainingData} for server-side data fetching
 */
export default async function TrainingCompliancePage() {
  // TODO: Replace with actual server action
  const { stats, users, courses } = await getTrainingData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Training Compliance</h1>
          <p className="text-muted-foreground mt-1">
            Track staff training completion, certifications, and deadlines
          </p>
        </div>
        <Button>
          Assign Training
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.completed} / {stats.total} courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Training</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Currently being completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Certifications</CardTitle>
            <Award className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.certifications}</div>
            <p className="text-xs text-muted-foreground">
              {stats.expiringSoon} expiring soon
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Training Courses */}
      <Card>
        <CardHeader>
          <CardTitle>Required Training Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{course.title}</h4>
                    <Badge variant={getCourseVariant(course.priority)}>
                      {course.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>{course.stats.completed} completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span>{course.stats.inProgress} in progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span>{course.stats.overdue} overdue</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Training Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Staff Training Status</CardTitle>
            <Button variant="outline" size="sm">
              View All Users
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{user.name}</h4>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <span>Completed: {user.training.completed}/{user.training.required}</span>
                      {user.training.overdue > 0 && (
                        <span className="text-red-600">
                          {user.training.overdue} overdue
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getUserStatusVariant(user.training.status)}>
                    {user.training.status}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Fetches comprehensive training compliance data
 *
 * Retrieves aggregated training statistics, course information, and individual
 * staff training status from the Learning Management System.
 *
 * @async
 * @returns {Promise<Object>} Training compliance data
 * @returns {Object} return.stats - Aggregated training statistics
 * @returns {Array<Object>} return.courses - Required training courses
 * @returns {Array<Object>} return.users - Individual staff training status
 *
 * @description
 * **Stats Structure:**
 * - total: Total training assignments
 * - completed: Completed training count
 * - inProgress: Currently in-progress count
 * - overdue: Past deadline count
 * - completionRate: Percentage (0-100)
 * - certifications: Active certification count
 * - expiringSoon: Certifications expiring within 30 days
 *
 * **Course Structure:**
 * - id: Unique course identifier
 * - title: Course display name
 * - description: Course content summary
 * - priority: Training priority level (MANDATORY, REQUIRED, RECOMMENDED)
 * - stats: Course-specific completion statistics
 *
 * **User Structure:**
 * - id: User identifier
 * - name: Full name
 * - role: Job role/title
 * - training: User's training status
 *   - required: Count of required courses
 *   - completed: Count of completed courses
 *   - overdue: Count of overdue assignments
 *   - status: Overall compliance status
 *
 * @example
 * ```typescript
 * const { stats, courses, users } = await getTrainingData();
 * console.log(`Completion rate: ${stats.completionRate}%`);
 * console.log(`Overdue users: ${users.filter(u => u.training.overdue > 0).length}`);
 * ```
 *
 * @todo Replace with actual LMS integration
 * @todo Implement caching with 15-minute TTL
 * @todo Add real-time progress tracking from LMS webhooks
 */
async function getTrainingData() {
  const mockStats = {
    total: 150,
    completed: 127,
    inProgress: 18,
    overdue: 5,
    completionRate: 85,
    certifications: 42,
    expiringSoon: 3,
  };

  const mockCourses = [
    {
      id: '1',
      title: 'HIPAA Privacy and Security Training',
      description: 'Annual HIPAA compliance training for all staff',
      priority: 'MANDATORY',
      stats: { completed: 42, inProgress: 3, overdue: 2 },
    },
    {
      id: '2',
      title: 'Medication Administration Certification',
      description: 'Required certification for medication administration',
      priority: 'MANDATORY',
      stats: { completed: 15, inProgress: 2, overdue: 1 },
    },
    {
      id: '3',
      title: 'Emergency Response Procedures',
      description: 'Emergency preparedness and response training',
      priority: 'REQUIRED',
      stats: { completed: 38, inProgress: 5, overdue: 2 },
    },
  ];

  const mockUsers = [
    {
      id: '1',
      name: 'Jane Smith',
      role: 'School Nurse',
      training: {
        required: 8,
        completed: 7,
        overdue: 1,
        status: 'OVERDUE',
      },
    },
    {
      id: '2',
      name: 'John Doe',
      role: 'Administrator',
      training: {
        required: 6,
        completed: 6,
        overdue: 0,
        status: 'COMPLIANT',
      },
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      role: 'School Nurse',
      training: {
        required: 8,
        completed: 6,
        overdue: 0,
        status: 'IN_PROGRESS',
      },
    },
  ];

  return { stats: mockStats, courses: mockCourses, users: mockUsers };
}

/**
 * Maps training priority to UI badge variant
 *
 * Determines the visual styling for training course priority badges.
 * Critical mandatory training is highlighted with destructive (red) variant.
 *
 * @param {string} priority - Training course priority level
 * @returns {'default' | 'destructive' | 'outline'} Badge variant for styling
 *
 * @description
 * **Priority Variant Mapping:**
 * - MANDATORY: Destructive (red) - Required by regulation, no exceptions
 * - REQUIRED: Default (blue) - Required for specific roles
 * - RECOMMENDED: Outline (bordered) - Optional but encouraged
 *
 * @example
 * ```tsx
 * <Badge variant={getCourseVariant('MANDATORY')}>MANDATORY</Badge>
 * // Renders: <Badge variant="destructive">MANDATORY</Badge>
 * ```
 */
function getCourseVariant(priority: string): 'default' | 'destructive' | 'outline' {
  return priority === 'MANDATORY' ? 'destructive' : 'default';
}

/**
 * Maps user training status to UI badge variant
 *
 * Determines the visual styling for user training compliance status badges.
 * Provides clear visual feedback on compliance status.
 *
 * @param {string} status - User training compliance status
 * @returns {'default' | 'destructive' | 'outline' | 'secondary'} Badge variant
 *
 * @description
 * **Status Variant Mapping:**
 * - COMPLIANT: Default (blue) - All training current
 * - IN_PROGRESS: Outline (bordered) - Training partially complete
 * - OVERDUE: Destructive (red) - Training past deadline
 * - EXPIRED: Destructive (red) - Certification expired
 *
 * @example
 * ```tsx
 * <Badge variant={getUserStatusVariant('OVERDUE')}>OVERDUE</Badge>
 * // Renders: <Badge variant="destructive">OVERDUE</Badge>
 * ```
 */
function getUserStatusVariant(status: string): 'default' | 'destructive' | 'outline' | 'secondary' {
  const variants = {
    COMPLIANT: 'default' as const,
    IN_PROGRESS: 'outline' as const,
    OVERDUE: 'destructive' as const,
  };
  return variants[status as keyof typeof variants] || 'secondary';
}

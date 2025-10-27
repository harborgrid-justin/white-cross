import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Users, CheckCircle, AlertTriangle, Clock, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Training Compliance | White Cross',
  description: 'Track staff training completion, certifications, and deadlines',
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

/**
 * Training Compliance Page
 *
 * Displays staff training status, certification tracking, and compliance deadlines.
 * Server Component for training compliance management.
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

function getCourseVariant(priority: string): 'default' | 'destructive' | 'outline' {
  return priority === 'MANDATORY' ? 'destructive' : 'default';
}

function getUserStatusVariant(status: string): 'default' | 'destructive' | 'outline' | 'secondary' {
  const variants = {
    COMPLIANT: 'default' as const,
    IN_PROGRESS: 'outline' as const,
    OVERDUE: 'destructive' as const,
  };
  return variants[status as keyof typeof variants] || 'secondary';
}

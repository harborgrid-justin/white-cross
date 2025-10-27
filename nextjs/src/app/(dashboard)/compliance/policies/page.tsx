import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FileText, CheckCircle, Clock, AlertTriangle, Plus } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Policy Management | Compliance | White Cross',
  description: 'HIPAA policy management, versioning, and acknowledgment tracking',
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

interface SearchParams {
  status?: string;
  category?: string;
}

interface PoliciesPageProps {
  searchParams: SearchParams;
}

/**
 * Policy Management Page
 *
 * Displays HIPAA policies, tracks acknowledgments, and manages policy versions.
 * Server Component with policy lifecycle management.
 */
export default async function PoliciesPage({ searchParams }: PoliciesPageProps) {
  const filters = {
    status: searchParams.status || 'ACTIVE',
    category: searchParams.category,
  };

  // TODO: Replace with actual server action
  const { policies, stats } = await getPolicies(filters);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Policy Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage HIPAA policies, track acknowledgments, and version control
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Policy
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total} total policies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acknowledgment Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.acknowledgmentRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.acknowledged} / {stats.required} users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Acknowledgments</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting user action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Review Due</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.reviewDue}</div>
            <p className="text-xs text-muted-foreground">
              Policies needing review
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Policies List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Policy Documents</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Filter by Category
              </Button>
              <Button variant="outline" size="sm">
                Filter by Status
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {policies.map((policy) => (
              <div
                key={policy.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{policy.title}</h3>
                        <Badge variant={getStatusVariant(policy.status)}>
                          {policy.status}
                        </Badge>
                        <Badge variant="outline">v{policy.version}</Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Category: {policy.category}</span>
                        <span>Effective: {formatDate(policy.effectiveDate)}</span>
                        {policy.reviewDate && (
                          <span>Review: {formatDate(policy.reviewDate)}</span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">
                            {policy.acknowledgments.completed} acknowledged
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-600" />
                          <span className="text-sm">
                            {policy.acknowledgments.pending} pending
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    Track Acknowledgments
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

// Temporary mock data functions
async function getPolicies(filters: any) {
  const mockPolicies = [
    {
      id: '1',
      title: 'HIPAA Privacy Rule Compliance Policy',
      category: 'HIPAA',
      status: 'ACTIVE',
      version: '2.1.0',
      effectiveDate: '2024-01-01T00:00:00Z',
      reviewDate: '2025-01-01T00:00:00Z',
      acknowledgments: {
        completed: 42,
        pending: 5,
        total: 47,
      },
    },
    {
      id: '2',
      title: 'Medication Administration Protocol',
      category: 'MEDICATION',
      status: 'ACTIVE',
      version: '1.5.0',
      effectiveDate: '2024-03-15T00:00:00Z',
      reviewDate: '2024-12-15T00:00:00Z',
      acknowledgments: {
        completed: 38,
        pending: 9,
        total: 47,
      },
    },
    {
      id: '3',
      title: 'Emergency Response Procedures',
      category: 'EMERGENCY',
      status: 'ACTIVE',
      version: '3.0.0',
      effectiveDate: '2024-02-01T00:00:00Z',
      reviewDate: '2025-02-01T00:00:00Z',
      acknowledgments: {
        completed: 45,
        pending: 2,
        total: 47,
      },
    },
  ];

  return {
    policies: mockPolicies,
    stats: {
      active: 12,
      total: 15,
      acknowledgmentRate: 89,
      acknowledged: 378,
      required: 423,
      pending: 45,
      reviewDue: 3,
    },
  };
}

function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants = {
    ACTIVE: 'default' as const,
    DRAFT: 'secondary' as const,
    UNDER_REVIEW: 'outline' as const,
    ARCHIVED: 'secondary' as const,
    SUPERSEDED: 'destructive' as const,
  };
  return variants[status as keyof typeof variants] || 'default';
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

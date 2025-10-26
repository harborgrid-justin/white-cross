import { Metadata } from 'next';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Shield,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  FileCheck
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Compliance Dashboard | White Cross',
  description: 'HIPAA compliance monitoring, audit logs, and policy management',
};

/**
 * Compliance Dashboard Page
 *
 * Displays compliance metrics, alerts, recent audit activity, and quick actions.
 * Server Component that fetches compliance data and displays comprehensive overview.
 */
export default async function ComplianceDashboardPage() {
  // TODO: Replace with actual server actions
  const metrics = await getComplianceMetrics();
  const alerts = await getRecentAlerts();
  const auditSummary = await getAuditSummary();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            HIPAA compliance monitoring and audit trail management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/compliance/reports">
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Link>
          </Button>
          <Button asChild>
            <Link href="/compliance/audits">
              <Shield className="mr-2 h-4 w-4" />
              View Audit Logs
            </Link>
          </Button>
        </div>
      </div>

      {/* Compliance Score Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.complianceScore}%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.riskScore}</div>
            <p className="text-xs text-muted-foreground">
              Low risk level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.alerts.active}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.alerts.critical} critical
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Audit Logs Today</CardTitle>
            <FileCheck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{auditSummary.todayCount}</div>
            <p className="text-xs text-muted-foreground">
              {auditSummary.phiAccessCount} PHI accesses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Compliance Alerts</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/compliance/audits?filter=alerts">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mb-2 text-green-600" />
              <p>No active compliance alerts</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${getSeverityColor(alert.severity)}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{alert.title}</h4>
                        <Badge variant={getSeverityVariant(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {alert.description}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatTimestamp(alert.timestamp)}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Review
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <Link href="/compliance/audits">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Audit Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View and search comprehensive audit trail with tamper-proof verification
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <Link href="/compliance/policies">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Policy Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Manage HIPAA policies, track acknowledgments, and version control
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <Link href="/compliance/training">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Training Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track staff training completion, certifications, and deadlines
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <Link href="/compliance/reports">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Compliance Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Generate HIPAA, FERPA, and custom compliance reports
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <Link href="/compliance/policies?status=pending">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Pending Acknowledgments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {metrics.policies.pending} policies awaiting acknowledgment
              </p>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
          <Link href="/compliance/training?filter=overdue">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Overdue Training
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {metrics.training.overdue} users with overdue training requirements
              </p>
            </CardContent>
          </Link>
        </Card>
      </div>

      {/* Recent Audit Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Audit Activity</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/compliance/audits">View All Logs</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {auditSummary.recentLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Badge variant={getSeverityVariant(log.severity)}>
                    {log.severity}
                  </Badge>
                  <div>
                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {log.userName} • {formatTimestamp(log.timestamp)}
                    </p>
                  </div>
                </div>
                {log.phiAccessed && (
                  <Badge variant="outline" className="bg-amber-50">
                    PHI
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Temporary mock data functions - will be replaced with real server actions
async function getComplianceMetrics() {
  return {
    complianceScore: 94,
    riskScore: 23,
    alerts: {
      active: 3,
      critical: 1,
    },
    policies: {
      pending: 5,
    },
    training: {
      overdue: 2,
    },
  };
}

async function getRecentAlerts() {
  return [
    {
      id: '1',
      severity: 'HIGH' as const,
      title: 'Bulk PHI Access Detected',
      description: 'User accessed more than 50 patient records in a single session',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      severity: 'MEDIUM' as const,
      title: 'Policy Acknowledgment Overdue',
      description: '3 users have not acknowledged the updated HIPAA privacy policy',
      timestamp: new Date().toISOString(),
    },
  ];
}

async function getAuditSummary() {
  return {
    todayCount: 127,
    phiAccessCount: 43,
    recentLogs: [
      {
        id: '1',
        action: 'PHI_VIEW',
        severity: 'INFO' as const,
        userName: 'Jane Smith',
        timestamp: new Date().toISOString(),
        phiAccessed: true,
      },
      {
        id: '2',
        action: 'POLICY_ACKNOWLEDGMENT',
        severity: 'INFO' as const,
        userName: 'John Doe',
        timestamp: new Date().toISOString(),
        phiAccessed: false,
      },
    ],
  };
}

function getSeverityColor(severity: string): string {
  const colors = {
    LOW: 'text-blue-600',
    MEDIUM: 'text-amber-600',
    HIGH: 'text-orange-600',
    CRITICAL: 'text-red-600',
  };
  return colors[severity as keyof typeof colors] || 'text-gray-600';
}

function getSeverityVariant(severity: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants = {
    LOW: 'secondary' as const,
    MEDIUM: 'outline' as const,
    HIGH: 'destructive' as const,
    CRITICAL: 'destructive' as const,
    INFO: 'default' as const,
    WARNING: 'outline' as const,
    ERROR: 'destructive' as const,
    SECURITY: 'destructive' as const,
  };
  return variants[severity as keyof typeof variants] || 'default';
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

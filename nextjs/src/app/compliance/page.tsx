import { Suspense } from 'react';
import { Metadata } from 'next';
import { Shield, FileText, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ComplianceDashboard } from '@/components/compliance';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Compliance Dashboard | White Cross',
  description: 'HIPAA compliance monitoring and audit management',
};

// Mock data - in production, fetch from API
const getMockMetrics = () => ({
  period: {
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString(),
  },
  auditLogs: {
    total: 15234,
    byAction: {
      PHI_VIEW: 8234,
      LOGIN: 2345,
      PHI_UPDATE: 1234,
      PHI_CREATE: 845,
      RECORD_DELETE: 234,
    },
    bySeverity: {
      INFO: 12000,
      WARNING: 2000,
      ERROR: 900,
      CRITICAL: 234,
      SECURITY: 100,
    },
    phiAccessCount: 10313,
    failedActions: 234,
  },
  violations: {
    total: 23,
    open: 5,
    resolved: 18,
    bySeverity: {
      LOW: 10,
      MEDIUM: 8,
      HIGH: 4,
      CRITICAL: 1,
    },
  },
  alerts: {
    total: 45,
    active: 12,
    resolved: 33,
    bySeverity: {
      LOW: 15,
      MEDIUM: 18,
      HIGH: 10,
      CRITICAL: 2,
    },
  },
  policies: {
    total: 24,
    active: 20,
    acknowledged: 185,
    pending: 15,
    acknowledgmentRate: 92.5,
  },
  training: {
    totalUsers: 100,
    completed: 85,
    overdue: 15,
    completionRate: 85,
  },
  dataRetention: {
    recordsTotal: 50000,
    recordsEligibleForArchival: 5000,
    recordsEligibleForDeletion: 500,
    storageUsed: '150 GB',
  },
  riskScore: 35,
  complianceScore: 88,
});

const quickLinks = [
  {
    title: 'Audit Logs',
    description: 'View and search audit trail',
    href: '/compliance/audit-logs',
    icon: FileText,
    color: 'text-blue-500',
  },
  {
    title: 'Policies',
    description: 'Manage compliance policies',
    href: '/compliance/policies',
    icon: Shield,
    color: 'text-green-500',
  },
  {
    title: 'Violations',
    description: 'Track compliance violations',
    href: '/compliance/violations',
    icon: AlertTriangle,
    color: 'text-red-500',
  },
  {
    title: 'Real-time Monitoring',
    description: 'Monitor system activity',
    href: '/compliance/monitoring',
    icon: Activity,
    color: 'text-purple-500',
  },
  {
    title: 'Reports',
    description: 'Generate compliance reports',
    href: '/compliance/reports',
    icon: TrendingUp,
    color: 'text-amber-500',
  },
  {
    title: 'Alerts',
    description: 'Review compliance alerts',
    href: '/compliance/alerts',
    icon: AlertTriangle,
    color: 'text-orange-500',
  },
];

export default function CompliancePage() {
  const metrics = getMockMetrics();

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-500" />
            HIPAA Compliance Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive compliance monitoring and audit management system
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/compliance/reports/hipaa">
            <Button variant="outline">Generate HIPAA Report</Button>
          </Link>
          <Link href="/compliance/audit-logs/export">
            <Button>Export Audit Logs</Button>
          </Link>
        </div>
      </div>

      {/* Main Dashboard */}
      <Suspense fallback={<div>Loading metrics...</div>}>
        <ComplianceDashboard metrics={metrics} />
      </Suspense>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <link.icon className={`h-6 w-6 ${link.color}`} />
                    {link.title}
                  </CardTitle>
                  <CardDescription>{link.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Compliance Activity</CardTitle>
          <CardDescription>Last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="font-medium">Policy Updated</div>
                  <div className="text-sm text-gray-600">HIPAA Privacy Policy v2.1 published</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">2 hours ago</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <div>
                  <div className="font-medium">Compliance Alert</div>
                  <div className="text-sm text-gray-600">Unusual after-hours access detected</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">5 hours ago</div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-500" />
                <div>
                  <div className="font-medium">Audit Complete</div>
                  <div className="text-sm text-gray-600">Monthly security assessment completed</div>
                </div>
              </div>
              <div className="text-sm text-gray-500">1 day ago</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  FileText,
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import type { ComplianceMetrics } from '@/schemas/compliance/compliance.schemas';

interface ComplianceDashboardProps {
  metrics: ComplianceMetrics;
  isLoading?: boolean;
}

export function ComplianceDashboard({ metrics, isLoading = false }: ComplianceDashboardProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'Excellent', className: 'bg-green-100 text-green-800' };
    if (score >= 70) return { label: 'Good', className: 'bg-yellow-100 text-yellow-800' };
    if (score >= 50) return { label: 'Fair', className: 'bg-orange-100 text-orange-800' };
    return { label: 'Poor', className: 'bg-red-100 text-red-800' };
  };

  const complianceBadge = getScoreBadge(metrics.complianceScore);
  const riskBadge = getScoreBadge(100 - metrics.riskScore);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Compliance Score */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Compliance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-4xl font-bold ${getScoreColor(metrics.complianceScore)}`}>
                {metrics.complianceScore}
              </div>
              <Badge className={complianceBadge.className}>{complianceBadge.label}</Badge>
              <Progress value={metrics.complianceScore} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Risk Score */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Risk Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-4xl font-bold ${getScoreColor(100 - metrics.riskScore)}`}>
                {metrics.riskScore}
              </div>
              <Badge className={riskBadge.className}>
                {metrics.riskScore > 50 ? 'High Risk' : 'Low Risk'}
              </Badge>
              <Progress value={metrics.riskScore} className="h-2 bg-red-100" />
            </div>
          </CardContent>
        </Card>

        {/* Active Violations */}
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Open Violations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold">{metrics.violations.open}</div>
              <div className="text-sm text-gray-500">
                {metrics.violations.resolved} resolved
              </div>
              <div className="flex gap-1 mt-2">
                {Object.entries(metrics.violations.bySeverity).map(([severity, count]) => (
                  <Badge
                    key={severity}
                    variant="outline"
                    className="text-xs"
                  >
                    {severity}: {count}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-4xl font-bold">{metrics.alerts.active}</div>
              <div className="text-sm text-gray-500">
                {metrics.alerts.resolved} resolved
              </div>
              <div className="flex gap-1 mt-2">
                {Object.entries(metrics.alerts.bySeverity).map(([severity, count]) => (
                  <Badge
                    key={severity}
                    variant="outline"
                    className="text-xs"
                  >
                    {severity}: {count}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Audit Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Audit Logs
            </CardTitle>
            <CardDescription>
              Period: {new Date(metrics.period.start).toLocaleDateString()} -{' '}
              {new Date(metrics.period.end).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Events</span>
                <span className="font-semibold">{metrics.auditLogs.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">PHI Access</span>
                <span className="font-semibold text-red-600">
                  {metrics.auditLogs.phiAccessCount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Failed Actions</span>
                <span className="font-semibold text-amber-600">
                  {metrics.auditLogs.failedActions.toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="text-xs text-gray-500 mb-2">By Severity</div>
                <div className="space-y-1">
                  {Object.entries(metrics.auditLogs.bySeverity).map(([severity, count]) => (
                    <div key={severity} className="flex justify-between text-sm">
                      <span className="capitalize">{severity.toLowerCase()}</span>
                      <span>{count.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Policies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Policy Compliance
            </CardTitle>
            <CardDescription>Policy acknowledgment tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Acknowledgment Rate</span>
                  <span className="font-semibold">
                    {metrics.policies.acknowledgmentRate.toFixed(1)}%
                  </span>
                </div>
                <Progress value={metrics.policies.acknowledgmentRate} className="h-2" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Policies</span>
                <span className="font-semibold">{metrics.policies.active}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Acknowledged</span>
                <span className="font-semibold text-green-600">
                  {metrics.policies.acknowledged}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="font-semibold text-amber-600">
                  {metrics.policies.pending}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Training */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Training Compliance
            </CardTitle>
            <CardDescription>Staff training completion status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="font-semibold">
                    {metrics.training.completionRate.toFixed(1)}%
                  </span>
                </div>
                <Progress value={metrics.training.completionRate} className="h-2" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Users</span>
                <span className="font-semibold">{metrics.training.totalUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-semibold text-green-600">
                  {metrics.training.completed}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Overdue</span>
                <span className="font-semibold text-red-600">
                  {metrics.training.overdue}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Retention */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Data Retention Status
          </CardTitle>
          <CardDescription>Records eligible for archival and deletion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{metrics.dataRetention.recordsTotal.toLocaleString()}</div>
              <div className="text-sm text-gray-600 mt-1">Total Records</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {metrics.dataRetention.recordsEligibleForArchival.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">Eligible for Archival</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">
                {metrics.dataRetention.recordsEligibleForDeletion.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 mt-1">Eligible for Deletion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{metrics.dataRetention.storageUsed}</div>
              <div className="text-sm text-gray-600 mt-1">Storage Used</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

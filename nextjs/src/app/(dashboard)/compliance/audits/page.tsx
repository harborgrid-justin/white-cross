import { Metadata } from 'next';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Shield,
  Download,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Audit Logs | Compliance | White Cross',
  description: 'Comprehensive HIPAA-compliant audit trail with tamper-proof verification',
};

interface SearchParams {
  page?: string;
  action?: string;
  severity?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
  phiOnly?: string;
}

interface AuditLogsPageProps {
  searchParams: SearchParams;
}

/**
 * Audit Logs Page
 *
 * Displays comprehensive audit trail with filtering, search, and export capabilities.
 * Server Component that implements HIPAA-compliant tamper-proof audit logging.
 */
export default async function AuditLogsPage({ searchParams }: AuditLogsPageProps) {
  const page = parseInt(searchParams.page || '1');
  const filters = {
    action: searchParams.action,
    severity: searchParams.severity,
    startDate: searchParams.startDate,
    endDate: searchParams.endDate,
    userId: searchParams.userId,
    phiOnly: searchParams.phiOnly === 'true',
  };

  // TODO: Replace with actual server action
  const { logs, pagination, chainStatus } = await getAuditLogs(page, filters);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive audit trail with cryptographic verification
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Chain Integrity Status */}
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {chainStatus.valid ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
              <div>
                <h3 className="font-semibold">
                  {chainStatus.valid ? 'Audit Chain Verified' : 'Audit Chain Compromised'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {chainStatus.valid
                    ? `All ${chainStatus.verifiedCount} logs verified with SHA-256 hash chain`
                    : `Tampering detected at log entry #${chainStatus.firstInvalidIndex}`}
                </p>
              </div>
            </div>
            <Badge variant={chainStatus.valid ? 'default' : 'destructive'} className="gap-2">
              <Shield className="h-3 w-3" />
              {chainStatus.valid ? 'Tamper-Proof' : 'Compromised'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Filter Summary */}
      {(filters.action || filters.severity || filters.phiOnly) && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">Active Filters:</span>
              {filters.action && (
                <Badge variant="secondary">
                  Action: {filters.action}
                  <button className="ml-2">×</button>
                </Badge>
              )}
              {filters.severity && (
                <Badge variant="secondary">
                  Severity: {filters.severity}
                  <button className="ml-2">×</button>
                </Badge>
              )}
              {filters.phiOnly && (
                <Badge variant="secondary">
                  PHI Access Only
                  <button className="ml-2">×</button>
                </Badge>
              )}
              <Button variant="ghost" size="sm">
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Audit Logs Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Audit Log Entries</CardTitle>
            <div className="text-sm text-muted-foreground">
              Showing {pagination.start}-{pagination.end} of {pagination.total}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {logs.map((log, index) => (
              <div
                key={log.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Verification Status */}
                  <div className="flex flex-col items-center gap-1">
                    {log.verified ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-xs text-muted-foreground">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Log Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={getSeverityVariant(log.severity)}>
                        {log.severity}
                      </Badge>
                      <span className="font-semibold text-sm">{log.action}</span>
                      {log.phiAccessed && (
                        <Badge variant="outline" className="bg-amber-50 border-amber-200">
                          PHI
                        </Badge>
                      )}
                      {log.complianceFlags && log.complianceFlags.length > 0 && (
                        <Badge variant="outline" className="bg-red-50 border-red-200">
                          {log.complianceFlags[0]}
                        </Badge>
                      )}
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <div>
                        <span className="text-muted-foreground">User:</span>{' '}
                        <span className="font-medium">{log.userName}</span>
                        <span className="text-muted-foreground ml-1">({log.userRole})</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Timestamp:</span>{' '}
                        <span>{formatTimestamp(log.timestamp)}</span>
                      </div>
                      {log.resourceType && (
                        <div>
                          <span className="text-muted-foreground">Resource:</span>{' '}
                          <span>{log.resourceType}</span>
                          {log.resourceId && (
                            <span className="text-muted-foreground ml-1">#{log.resourceId.slice(0, 8)}</span>
                          )}
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">IP:</span>{' '}
                        <span className="font-mono text-xs">{log.ipAddress}</span>
                      </div>
                    </div>

                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span>Details:</span>{' '}
                        <span className="font-mono">{JSON.stringify(log.details).slice(0, 100)}...</span>
                      </div>
                    )}

                    <div className="mt-2 text-xs text-muted-foreground font-mono">
                      Hash: {log.verificationHash.slice(0, 16)}...
                      {log.previousHash && (
                        <span className="ml-2">
                          Prev: {log.previousHash.slice(0, 16)}...
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="text-right">
                    <Badge variant={log.status === 'SUCCESS' ? 'default' : 'destructive'}>
                      {log.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.pages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                asChild={page > 1}
              >
                {page > 1 ? (
                  <Link href={`/compliance/audits?page=${page - 1}`}>Previous</Link>
                ) : (
                  <span>Previous</span>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.pages}
                asChild={page < pagination.pages}
              >
                {page < pagination.pages ? (
                  <Link href={`/compliance/audits?page=${page + 1}`}>Next</Link>
                ) : (
                  <span>Next</span>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Temporary mock data function - will be replaced with real server action
async function getAuditLogs(page: number, filters: any) {
  const mockLogs = [
    {
      id: '1',
      timestamp: new Date().toISOString(),
      action: 'PHI_VIEW',
      severity: 'INFO',
      userId: 'user-1',
      userName: 'Jane Smith',
      userRole: 'School Nurse',
      resourceType: 'HEALTH_RECORD',
      resourceId: '123e4567-e89b-12d3-a456-426614174000',
      ipAddress: '192.168.1.100',
      status: 'SUCCESS',
      phiAccessed: true,
      verificationHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
      previousHash: 'z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1',
      verified: true,
      complianceFlags: [],
      details: { recordType: 'Medical History' },
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      action: 'POLICY_ACKNOWLEDGMENT',
      severity: 'INFO',
      userId: 'user-2',
      userName: 'John Doe',
      userRole: 'Administrator',
      resourceType: 'POLICY',
      resourceId: '987f6543-c21b-43d2-a765-876543210987',
      ipAddress: '192.168.1.101',
      status: 'SUCCESS',
      phiAccessed: false,
      verificationHash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7',
      previousHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
      verified: true,
      complianceFlags: [],
      details: { policyId: 'HIPAA-2024-001' },
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      action: 'PHI_BULK_ACCESS',
      severity: 'CRITICAL',
      userId: 'user-1',
      userName: 'Jane Smith',
      userRole: 'School Nurse',
      resourceType: 'HEALTH_RECORD',
      ipAddress: '192.168.1.100',
      status: 'SUCCESS',
      phiAccessed: true,
      verificationHash: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8',
      previousHash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7',
      verified: true,
      complianceFlags: ['BULK_OPERATION', 'AFTER_HOURS_ACCESS'],
      details: { recordCount: 75 },
    },
  ];

  return {
    logs: mockLogs,
    pagination: {
      page,
      pages: 10,
      total: 127,
      start: (page - 1) * 20 + 1,
      end: Math.min(page * 20, 127),
    },
    chainStatus: {
      valid: true,
      verifiedCount: 127,
      firstInvalidIndex: null,
    },
  };
}

function getSeverityVariant(severity: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  const variants = {
    INFO: 'default' as const,
    WARNING: 'outline' as const,
    ERROR: 'destructive' as const,
    CRITICAL: 'destructive' as const,
    SECURITY: 'destructive' as const,
  };
  return variants[severity as keyof typeof variants] || 'default';
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

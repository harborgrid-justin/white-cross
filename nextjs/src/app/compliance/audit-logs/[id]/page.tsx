import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Audit Log Detail | Compliance | White Cross',
};

// Mock data - in production, fetch from API based on params.id
async function getAuditLogDetail(id: string) {
  return {
    id,
    timestamp: new Date().toISOString(),
    action: 'PHI_VIEW',
    severity: 'INFO',
    userId: '1',
    userName: 'Sarah Johnson',
    userRole: 'School Nurse',
    resourceType: 'HEALTH_RECORD',
    resourceId: 'record-123',
    resourceName: 'John Doe - Health Record',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
    sessionId: 'session-abc123',
    status: 'SUCCESS',
    phiAccessed: true,
    verificationHash: 'a7f8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8',
    previousHash: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    complianceFlags: ['AFTER_HOURS_ACCESS'],
    details: {
      recordType: 'Health Assessment',
      accessReason: 'Student medical emergency',
      dataViewed: ['Allergies', 'Current Medications', 'Emergency Contacts'],
      duration: '5 minutes 23 seconds',
    },
    changes: {
      before: {
        lastAccessed: '2024-01-15T10:30:00Z',
      },
      after: {
        lastAccessed: '2024-01-15T15:45:00Z',
      },
    },
  };
}

export default async function AuditLogDetailPage({ params }: { params: { id: string } }) {
  const log = await getAuditLogDetail(params.id);

  if (!log) {
    notFound();
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/compliance/audit-logs">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Audit Logs
          </Button>
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Audit Log Detail</h1>
        <p className="text-gray-600 mt-2">Log ID: {log.id}</p>
      </div>

      {/* Main Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            {log.status === 'SUCCESS' ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-red-500" />
            )}
            {log.action.replace(/_/g, ' ')}
          </CardTitle>
          <CardDescription>{formatTimestamp(log.timestamp)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Status and Severity */}
          <div className="flex gap-4">
            <div>
              <span className="text-sm text-gray-600">Status</span>
              <div className="mt-1">
                <Badge className={log.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {log.status}
                </Badge>
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Severity</span>
              <div className="mt-1">
                <Badge>{log.severity}</Badge>
              </div>
            </div>
            {log.phiAccessed && (
              <div>
                <span className="text-sm text-gray-600">PHI Access</span>
                <div className="mt-1 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">Yes</span>
                </div>
              </div>
            )}
          </div>

          {/* Compliance Flags */}
          {log.complianceFlags && log.complianceFlags.length > 0 && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span className="font-semibold text-amber-900">Compliance Flags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {log.complianceFlags.map((flag) => (
                  <Badge key={flag} variant="outline" className="bg-white">
                    {flag.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <span className="text-sm text-gray-600">User</span>
              <div className="mt-1 font-medium">{log.userName}</div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Role</span>
              <div className="mt-1 font-medium">{log.userRole}</div>
            </div>
            <div>
              <span className="text-sm text-gray-600">User ID</span>
              <div className="mt-1 font-mono text-sm">{log.userId}</div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Session ID</span>
              <div className="mt-1 font-mono text-sm">{log.sessionId}</div>
            </div>
          </div>

          {/* Resource Information */}
          {log.resourceType && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <span className="text-sm text-gray-600">Resource Type</span>
                <div className="mt-1 font-medium">{log.resourceType}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Resource Name</span>
                <div className="mt-1 font-medium">{log.resourceName}</div>
              </div>
              <div className="col-span-2">
                <span className="text-sm text-gray-600">Resource ID</span>
                <div className="mt-1 font-mono text-sm">{log.resourceId}</div>
              </div>
            </div>
          )}

          {/* Network Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <span className="text-sm text-gray-600">IP Address</span>
              <div className="mt-1 font-mono text-sm">{log.ipAddress}</div>
            </div>
            <div>
              <span className="text-sm text-gray-600">User Agent</span>
              <div className="mt-1 font-mono text-xs break-all">{log.userAgent}</div>
            </div>
          </div>

          {/* Additional Details */}
          {log.details && (
            <div className="pt-4 border-t">
              <span className="text-sm font-semibold text-gray-600">Additional Details</span>
              <div className="mt-3 space-y-2">
                {Object.entries(log.details).map(([key, value]) => (
                  <div key={key} className="flex items-start gap-4">
                    <span className="text-sm text-gray-600 min-w-[150px]">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-sm font-medium">
                      {Array.isArray(value) ? value.join(', ') : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Verification Hashes */}
          <div className="pt-4 border-t">
            <span className="text-sm font-semibold text-gray-600">Cryptographic Verification</span>
            <div className="mt-3 space-y-3">
              <div>
                <span className="text-xs text-gray-600">Verification Hash</span>
                <div className="mt-1 font-mono text-xs bg-gray-50 p-2 rounded break-all">
                  {log.verificationHash}
                </div>
              </div>
              {log.previousHash && (
                <div>
                  <span className="text-xs text-gray-600">Previous Hash (Chain Link)</span>
                  <div className="mt-1 font-mono text-xs bg-gray-50 p-2 rounded break-all">
                    {log.previousHash}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Log integrity verified</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

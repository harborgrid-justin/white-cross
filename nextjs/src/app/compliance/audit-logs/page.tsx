import { Suspense } from 'react';
import { Metadata } from 'next';
import { FileText, Shield, Download, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuditLogViewer } from '@/components/compliance';
import Link from 'next/link';
import type { AuditLog } from '@/schemas/compliance/compliance.schemas';

export const metadata: Metadata = {
  title: 'Audit Logs | Compliance | White Cross',
  description: 'View and search comprehensive audit trail',
};

// Mock data - in production, fetch from API
const getMockAuditLogs = (): AuditLog[] => {
  const actions = ['PHI_VIEW', 'LOGIN', 'PHI_UPDATE', 'PHI_CREATE', 'LOGOUT', 'RECORD_DELETE'] as const;
  const severities = ['INFO', 'WARNING', 'ERROR', 'CRITICAL', 'SECURITY'] as const;
  const users = [
    { id: '1', name: 'Sarah Johnson', role: 'School Nurse' },
    { id: '2', name: 'Michael Chen', role: 'Administrator' },
    { id: '3', name: 'Emily Davis', role: 'Health Assistant' },
  ];

  return Array.from({ length: 150 }, (_, i) => {
    const user = users[i % users.length];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const timestamp = new Date(Date.now() - i * 3600000).toISOString();

    return {
      id: `log-${i + 1}`,
      timestamp,
      action,
      severity,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      resourceType: action.includes('PHI') ? 'HEALTH_RECORD' : 'USER',
      resourceId: `resource-${Math.floor(Math.random() * 1000)}`,
      resourceName: `Student Record ${Math.floor(Math.random() * 1000)}`,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
      sessionId: `session-${Math.floor(Math.random() * 10000)}`,
      status: Math.random() > 0.1 ? 'SUCCESS' : 'FAILURE',
      phiAccessed: action.includes('PHI'),
      verificationHash: `hash-${i + 1}-abc123def456`,
      previousHash: i > 0 ? `hash-${i}-abc123def456` : undefined,
      complianceFlags: Math.random() > 0.9 ? ['AFTER_HOURS_ACCESS'] : undefined,
    } as AuditLog;
  });
};

export default function AuditLogsPage() {
  const logs = getMockAuditLogs();

  const handleExport = (format: 'CSV' | 'PDF' | 'JSON') => {
    console.log(`Exporting audit logs as ${format}`);
    // In production, this would trigger an API call to export logs
  };

  const handleViewDetails = (log: AuditLog) => {
    console.log('Viewing log details:', log);
    // In production, this would navigate to the detail page
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="h-8 w-8 text-blue-500" />
            Audit Logs
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive audit trail with tamper-proof verification
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/compliance/audit-logs/phi-access">
            <Button variant="outline" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              PHI Access
            </Button>
          </Link>
          <Link href="/compliance/audit-logs/user-activity">
            <Button variant="outline">User Activity</Button>
          </Link>
          <Link href="/compliance/audit-logs/export">
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </Link>
        </div>
      </div>

      {/* Audit Log Viewer */}
      <Suspense fallback={<div>Loading audit logs...</div>}>
        <AuditLogViewer
          logs={logs}
          onExport={handleExport}
          onViewDetails={handleViewDetails}
        />
      </Suspense>
    </div>
  );
}

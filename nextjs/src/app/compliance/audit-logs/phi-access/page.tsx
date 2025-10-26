import { Metadata } from 'next';
import { Shield, AlertTriangle } from 'lucide-react';
import { AuditLogViewer } from '@/components/compliance';
import { Card, CardContent } from '@/components/ui/card';
import type { AuditLog } from '@/schemas/compliance/compliance.schemas';

export const metadata: Metadata = {
  title: 'PHI Access Logs | Compliance | White Cross',
};

// Mock data - only PHI access events
const getPhiAccessLogs = (): AuditLog[] => {
  return Array.from({ length: 80 }, (_, i) => ({
    id: `phi-log-${i + 1}`,
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    action: ['PHI_VIEW', 'PHI_UPDATE', 'PHI_CREATE', 'PHI_EXPORT'][Math.floor(Math.random() * 4)] as any,
    severity: ['INFO', 'WARNING'][Math.floor(Math.random() * 2)] as any,
    userId: `user-${Math.floor(Math.random() * 10) + 1}`,
    userName: ['Sarah Johnson', 'Michael Chen', 'Emily Davis'][Math.floor(Math.random() * 3)],
    userRole: ['School Nurse', 'Health Assistant', 'Administrator'][Math.floor(Math.random() * 3)],
    resourceType: 'HEALTH_RECORD' as any,
    resourceId: `record-${Math.floor(Math.random() * 1000)}`,
    resourceName: `Student Health Record ${Math.floor(Math.random() * 1000)}`,
    ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
    userAgent: 'Mozilla/5.0 Chrome/120.0.0.0',
    sessionId: `session-${Math.floor(Math.random() * 10000)}`,
    status: 'SUCCESS' as any,
    phiAccessed: true,
    verificationHash: `hash-${i + 1}`,
    previousHash: i > 0 ? `hash-${i}` : undefined,
  }));
};

export default function PhiAccessLogsPage() {
  const logs = getPhiAccessLogs();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Shield className="h-8 w-8 text-red-500" />
          PHI Access Logs
        </h1>
        <p className="text-gray-600 mt-2">
          Protected Health Information (PHI) access audit trail
        </p>
      </div>

      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="text-sm text-red-800">
              <p className="font-semibold mb-1">HIPAA Protected Information</p>
              <p>
                This log contains records of all PHI access events. These logs are immutable
                and cryptographically verified. Access to PHI must have a legitimate business
                purpose and is monitored for compliance.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <AuditLogViewer logs={logs} onViewDetails={(log) => console.log(log)} />
    </div>
  );
}

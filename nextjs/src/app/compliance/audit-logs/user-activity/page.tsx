import { Metadata } from 'next';
import { Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AuditLogViewer } from '@/components/compliance';
import type { AuditLog } from '@/schemas/compliance/compliance.schemas';

export const metadata: Metadata = {
  title: 'User Activity | Compliance | White Cross',
};

const getUserActivityLogs = (): AuditLog[] => {
  return Array.from({ length: 100 }, (_, i) => ({
    id: `activity-${i + 1}`,
    timestamp: new Date(Date.now() - i * 1800000).toISOString(),
    action: ['LOGIN', 'LOGOUT', 'PASSWORD_CHANGE', 'PERMISSION_CHANGE', 'SETTING_CHANGE'][Math.floor(Math.random() * 5)] as any,
    severity: ['INFO', 'SECURITY'][Math.floor(Math.random() * 2)] as any,
    userId: `user-${Math.floor(Math.random() * 10) + 1}`,
    userName: ['Sarah Johnson', 'Michael Chen', 'Emily Davis', 'John Smith'][Math.floor(Math.random() * 4)],
    userRole: ['School Nurse', 'Administrator', 'Health Assistant'][Math.floor(Math.random() * 3)],
    ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
    userAgent: 'Mozilla/5.0 Chrome/120.0.0.0',
    sessionId: `session-${Math.floor(Math.random() * 10000)}`,
    status: Math.random() > 0.05 ? 'SUCCESS' : 'FAILURE' as any,
    phiAccessed: false,
    verificationHash: `hash-${i + 1}`,
    previousHash: i > 0 ? `hash-${i}` : undefined,
  }));
};

const getUserStats = () => [
  { user: 'Sarah Johnson', logins: 145, phiAccess: 89, failedAttempts: 2, lastActive: '2 hours ago' },
  { user: 'Michael Chen', logins: 98, phiAccess: 45, failedAttempts: 0, lastActive: '30 minutes ago' },
  { user: 'Emily Davis', logins: 67, phiAccess: 34, failedAttempts: 1, lastActive: '5 hours ago' },
  { user: 'John Smith', logins: 23, phiAccess: 12, failedAttempts: 5, lastActive: '1 day ago' },
];

export default function UserActivityPage() {
  const logs = getUserActivityLogs();
  const userStats = getUserStats();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Users className="h-8 w-8 text-purple-500" />
          User Activity
        </h1>
        <p className="text-gray-600 mt-2">
          Monitor user authentication and access patterns
        </p>
      </div>

      {/* User Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>User Activity Summary</CardTitle>
          <CardDescription>Last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">User</th>
                  <th className="text-right py-3 px-4 font-medium">Logins</th>
                  <th className="text-right py-3 px-4 font-medium">PHI Access</th>
                  <th className="text-right py-3 px-4 font-medium">Failed Attempts</th>
                  <th className="text-right py-3 px-4 font-medium">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {userStats.map((stat) => (
                  <tr key={stat.user} className="border-b">
                    <td className="py-3 px-4 font-medium">{stat.user}</td>
                    <td className="text-right py-3 px-4">{stat.logins}</td>
                    <td className="text-right py-3 px-4">{stat.phiAccess}</td>
                    <td className="text-right py-3 px-4">
                      <span className={stat.failedAttempts > 3 ? 'text-red-600 font-semibold' : ''}>
                        {stat.failedAttempts}
                      </span>
                    </td>
                    <td className="text-right py-3 px-4 text-gray-600">{stat.lastActive}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <AuditLogViewer logs={logs} />
    </div>
  );
}

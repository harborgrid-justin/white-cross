import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Access Control Report | White Cross',
};

export default function AccessControlReportPage() {
  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-3"><Lock className="h-8 w-8 text-green-500" />Access Control Report</h1>
      <Card>
        <CardHeader><CardTitle>User Access Patterns</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full">
            <thead><tr className="border-b"><th className="text-left py-2">User</th><th className="text-right py-2">Total Access</th><th className="text-right py-2">PHI Access</th><th className="text-right py-2">Failed Attempts</th><th className="text-right py-2">Risk Level</th></tr></thead>
            <tbody>
              {[
                { user: 'Sarah Johnson', total: 145, phi: 89, failed: 2, risk: 'LOW' },
                { user: 'Michael Chen', total: 98, phi: 45, failed: 0, risk: 'LOW' },
                { user: 'Emily Davis', total: 67, phi: 34, failed: 1, risk: 'LOW' },
                { user: 'John Smith', total: 23, phi: 12, failed: 5, risk: 'MEDIUM' },
              ].map((row, i) => (
                <tr key={i} className="border-b"><td className="py-2">{row.user}</td><td className="text-right">{row.total}</td><td className="text-right">{row.phi}</td><td className="text-right">{row.failed}</td><td className="text-right"><Badge variant="outline" className={row.risk === 'MEDIUM' ? 'bg-yellow-100' : 'bg-green-100'}>{row.risk}</Badge></td></tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

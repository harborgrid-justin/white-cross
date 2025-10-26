import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compliance Alerts | White Cross',
};

const alerts = [
  { id: '1', type: 'SUSPICIOUS_ACTIVITY', severity: 'HIGH', title: 'Unusual after-hours PHI access', description: '15 PHI records accessed between 2-4 AM', status: 'NEW', time: '2 hours ago' },
  { id: '2', type: 'POLICY_EXPIRING', severity: 'MEDIUM', title: 'Policy review deadline approaching', description: 'HIPAA Security Policy review due in 7 days', status: 'ACKNOWLEDGED', time: '1 day ago' },
  { id: '3', type: 'TRAINING_OVERDUE', severity: 'MEDIUM', title: 'Training deadline missed', description: '15 users have overdue HIPAA training', status: 'NEW', time: '3 days ago' },
  { id: '4', type: 'EXCESSIVE_LOGIN_FAILURES', severity: 'CRITICAL', title: 'Multiple failed login attempts', description: 'User account locked after 5 failed attempts', status: 'INVESTIGATING', time: '5 hours ago' },
];

export default function AlertsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3"><AlertTriangle className="h-8 w-8 text-orange-500" />Compliance Alerts</h1>
        <Button variant="outline">Mark All as Read</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-red-600">2</div><div className="text-sm text-gray-600">Critical</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-orange-600">10</div><div className="text-sm text-gray-600">High</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-yellow-600">18</div><div className="text-sm text-gray-600">Medium</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-blue-600">15</div><div className="text-sm text-gray-600">Low</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Active Alerts</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${alert.severity === 'CRITICAL' ? 'text-red-600' : alert.severity === 'HIGH' ? 'text-orange-600' : 'text-yellow-600'}`} />
                    <div>
                      <div className="font-semibold">{alert.title}</div>
                      <div className="text-sm text-gray-600 mt-1">{alert.description}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={alert.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' : alert.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}>{alert.severity}</Badge>
                        <Badge variant="outline">{alert.status}</Badge>
                        <span className="text-xs text-gray-500">{alert.time}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline"><CheckCircle className="h-4 w-4" /></Button>
                    <Button size="sm" variant="outline"><XCircle className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

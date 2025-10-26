import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Real-time Monitoring | Compliance | White Cross',
};

export default function MonitoringPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-3"><Activity className="h-8 w-8 text-purple-500" />Real-time Compliance Monitoring</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-green-600">12</div><div className="text-sm text-gray-600">Active Sessions</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold">45</div><div className="text-sm text-gray-600">Events/min</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-red-600">3</div><div className="text-sm text-gray-600">Active Alerts</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-amber-600">8</div><div className="text-sm text-gray-600">PHI Access Now</div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Live Activity Stream</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { time: 'Just now', user: 'Sarah Johnson', action: 'PHI_VIEW', resource: 'Student Record #1234' },
              { time: '1 min ago', user: 'Michael Chen', action: 'LOGIN', resource: null },
              { time: '2 min ago', user: 'Emily Davis', action: 'PHI_UPDATE', resource: 'Health Record #5678' },
              { time: '3 min ago', user: 'John Smith', action: 'RECORD_CREATE', resource: 'Student #9012' },
              { time: '5 min ago', user: 'Sarah Johnson', action: 'PHI_EXPORT', resource: 'Monthly Report' },
            ].map((event, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{event.action}</Badge>
                  <div><div className="font-medium">{event.user}</div>{event.resource && <div className="text-sm text-gray-600">{event.resource}</div>}</div>
                </div>
                <div className="text-sm text-gray-500">{event.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

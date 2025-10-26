import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Training Compliance Report | White Cross',
};

export default function TrainingReportPage() {
  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-3"><Users className="h-8 w-8 text-amber-500" />Training Compliance Report</h1>
      <div className="grid grid-cols-4 gap-6">
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold">100</div><div className="text-sm text-gray-600">Total Users</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-green-600">85</div><div className="text-sm text-gray-600">Completed</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-red-600">15</div><div className="text-sm text-gray-600">Overdue</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold">85%</div><div className="text-sm text-gray-600">Completion Rate</div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Training Modules</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { module: 'HIPAA Privacy Training', completed: 90, total: 100, rate: 90 },
            { module: 'HIPAA Security Training', completed: 88, total: 100, rate: 88 },
            { module: 'Data Breach Response', completed: 82, total: 100, rate: 82 },
            { module: 'Incident Reporting', completed: 79, total: 100, rate: 79 },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-2"><span className="font-medium">{item.module}</span><span className="text-sm text-gray-600">{item.completed}/{item.total} ({item.rate}%)</span></div>
              <Progress value={item.rate} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Eye } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compliance Violations | White Cross',
};

const violations = [
  { id: '1', type: 'UNAUTHORIZED_ACCESS', severity: 'CRITICAL', description: 'Access attempt to restricted records without authorization', user: 'Unknown', date: '2024-01-15', status: 'INVESTIGATING' },
  { id: '2', type: 'EXCESSIVE_ACCESS', severity: 'HIGH', description: 'Bulk access to 150+ patient records in 10 minutes', user: 'John Smith', date: '2024-01-14', status: 'OPEN' },
  { id: '3', type: 'POLICY_VIOLATION', severity: 'MEDIUM', description: 'PHI accessed without documented business need', user: 'Emily Davis', date: '2024-01-13', status: 'RESOLVED' },
  { id: '4', type: 'IMPROPER_DISPOSAL', severity: 'HIGH', description: 'PHI document not properly disposed', user: 'Sarah Johnson', date: '2024-01-12', status: 'RESOLVED' },
];

export default function ViolationsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-3"><AlertTriangle className="h-8 w-8 text-red-500" />Compliance Violations</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold">23</div><div className="text-sm text-gray-600">Total</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-red-600">5</div><div className="text-sm text-gray-600">Open</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-green-600">18</div><div className="text-sm text-gray-600">Resolved</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-purple-600">1</div><div className="text-sm text-gray-600">Critical</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Violation Reports</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {violations.map((violation) => (
              <div key={violation.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={violation.severity === 'CRITICAL' ? 'bg-purple-100 text-purple-800' : violation.severity === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>{violation.severity}</Badge>
                      <Badge variant="outline">{violation.type.replace(/_/g, ' ')}</Badge>
                      <Badge className={violation.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : violation.status === 'INVESTIGATING' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>{violation.status}</Badge>
                    </div>
                    <div className="font-medium mb-1">{violation.description}</div>
                    <div className="text-sm text-gray-600">User: {violation.user} | Date: {violation.date}</div>
                  </div>
                  <Button size="sm" variant="outline"><Eye className="h-4 w-4 mr-2" />Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

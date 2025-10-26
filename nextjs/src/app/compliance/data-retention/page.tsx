import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Database, Archive, Trash2, AlertTriangle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Data Retention | Compliance | White Cross',
};

const retentionPolicies = [
  { type: 'HEALTH_RECORD', name: 'Health Records', retention: '6 years', archiveAfter: '3 years', total: 25000, eligible: 3000, status: 'ACTIVE' },
  { type: 'STUDENT', name: 'Student Records', retention: '7 years', archiveAfter: '5 years', total: 15000, eligible: 1500, status: 'ACTIVE' },
  { type: 'DOCUMENT', name: 'Documents', retention: '6 years', archiveAfter: '4 years', total: 8000, eligible: 500, status: 'ACTIVE' },
  { type: 'AUDIT_LOG', name: 'Audit Logs', retention: '6 years', archiveAfter: null, total: 150000, eligible: 0, status: 'ACTIVE' },
];

export default function DataRetentionPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-3"><Database className="h-8 w-8 text-blue-500" />Data Retention Management</h1>
        <Button variant="outline">Run Retention Analysis</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold">50,000</div><div className="text-sm text-gray-600">Total Records</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-blue-600">5,000</div><div className="text-sm text-gray-600">Eligible for Archival</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-amber-600">500</div><div className="text-sm text-gray-600">Eligible for Deletion</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold">150 GB</div><div className="text-sm text-gray-600">Storage Used</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Retention Policies</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-4">
            {retentionPolicies.map((policy, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-lg">{policy.name}</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Retention: {policy.retention}
                      {policy.archiveAfter && ` | Archive after: ${policy.archiveAfter}`}
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800">{policy.status}</Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-3">
                  <div><div className="text-xs text-gray-600">Total Records</div><div className="text-lg font-semibold">{policy.total.toLocaleString()}</div></div>
                  <div><div className="text-xs text-gray-600">Eligible for Action</div><div className="text-lg font-semibold text-blue-600">{policy.eligible.toLocaleString()}</div></div>
                  <div><div className="text-xs text-gray-600">Retention Rate</div><div className="text-lg font-semibold">{((1 - policy.eligible / policy.total) * 100).toFixed(1)}%</div></div>
                </div>
                <Progress value={(1 - policy.eligible / policy.total) * 100} className="h-2" />
                <div className="flex gap-2 mt-3">
                  <Button size="sm" variant="outline"><Archive className="h-4 w-4 mr-2" />Archive Now</Button>
                  {policy.eligible > 0 && (
                    <Button size="sm" variant="outline" className="text-red-600"><Trash2 className="h-4 w-4 mr-2" />Review Deletions</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">Important: HIPAA Retention Requirements</p>
              <ul className="list-disc list-inside space-y-1">
                <li>HIPAA requires retention of PHI for a minimum of 6 years from creation or last use</li>
                <li>State laws may require longer retention periods</li>
                <li>Records under legal hold or investigation must be retained indefinitely</li>
                <li>Secure disposal is required when deleting PHI</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Scheduled Retention Jobs</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div><div className="font-medium">Monthly Archive Job</div><div className="text-sm text-gray-600">Archives records older than retention threshold</div></div>
              <Badge variant="outline">Next: Feb 1, 2024</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div><div className="font-medium">Quarterly Deletion Review</div><div className="text-sm text-gray-600">Review and approve scheduled deletions</div></div>
              <Badge variant="outline">Next: Mar 1, 2024</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

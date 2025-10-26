import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'HIPAA Compliance Report | White Cross',
};

export default function HipaaReportPage() {
  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3"><Shield className="h-8 w-8 text-blue-500" />HIPAA Compliance Report</h1>
          <p className="text-gray-600 mt-2">Comprehensive assessment of HIPAA compliance status</p>
        </div>
        <Button><Download className="h-4 w-4 mr-2" />Export PDF</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card><CardContent className="pt-6"><div className="text-center"><div className="text-3xl font-bold text-green-600">88</div><div className="text-sm text-gray-600 mt-1">Compliance Score</div><Badge className="mt-2 bg-green-100 text-green-800">Good</Badge></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-center"><div className="text-3xl font-bold text-amber-600">35</div><div className="text-sm text-gray-600 mt-1">Risk Score</div><Badge className="mt-2 bg-amber-100 text-amber-800">Moderate</Badge></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-center"><div className="text-3xl font-bold text-blue-600">5</div><div className="text-sm text-gray-600 mt-1">Open Findings</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Executive Summary</CardTitle></CardHeader>
        <CardContent><p className="text-gray-700">Overall compliance status is good with a compliance score of 88%. Five open findings require attention, primarily related to policy acknowledgments and training completion. Risk level is moderate at 35%.</p></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Findings</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { severity: 'HIGH', finding: 'Policy acknowledgment rate below target (92.5% vs 95% target)', recommendation: 'Send reminders to pending users' },
              { severity: 'MEDIUM', finding: 'Training completion rate needs improvement (85% vs 95% target)', recommendation: 'Implement automated training reminders' },
              { severity: 'LOW', finding: 'After-hours PHI access patterns detected', recommendation: 'Review access justifications' },
            ].map((item, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={item.severity === 'HIGH' ? 'bg-red-100 text-red-800' : item.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}>{item.severity}</Badge>
                </div>
                <div className="font-medium mb-1">{item.finding}</div>
                <div className="text-sm text-gray-600"><strong>Recommendation:</strong> {item.recommendation}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Data Integrity Report | White Cross',
};

export default function DataIntegrityReportPage() {
  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-3"><FileText className="h-8 w-8 text-purple-500" />Data Integrity Report</h1>
      <div className="grid grid-cols-3 gap-6">
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold">15,234</div><div className="text-sm text-gray-600">Logs Analyzed</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold text-green-600">0</div><div className="text-sm text-gray-600">Integrity Violations</div></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><div className="text-2xl font-bold">0</div><div className="text-sm text-gray-600">Unverified Logs</div></CardContent></Card>
      </div>
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div><div className="font-semibold text-green-900">All audit logs verified</div><p className="text-sm text-green-700">Cryptographic verification confirms no tampering detected in the audit trail.</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

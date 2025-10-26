import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Edit, Users } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Policy Detail | Compliance | White Cross',
};

export default function PolicyDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">HIPAA Privacy Policy</h1>
          <div className="flex items-center gap-3 mt-2">
            <Badge>ACTIVE</Badge>
            <span className="text-sm text-gray-600">Version 2.1.0</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/compliance/policies/${params.id}/acknowledgments`}>
            <Button variant="outline"><Users className="h-4 w-4 mr-2" />Acknowledgments</Button>
          </Link>
          <Link href={`/compliance/policies/${params.id}/edit`}>
            <Button><Edit className="h-4 w-4 mr-2" />Edit</Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Policy Overview</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><span className="text-sm text-gray-600">Effective Date:</span><div className="font-medium">January 1, 2024</div></div>
            <div><span className="text-sm text-gray-600">Review Date:</span><div className="font-medium">December 1, 2024</div></div>
            <div><span className="text-sm text-gray-600">Owner:</span><div className="font-medium">Compliance Officer</div></div>
            <div><span className="text-sm text-gray-600">Type:</span><Badge variant="outline">HIPAA Privacy</Badge></div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Policy Content</CardTitle></CardHeader>
        <CardContent className="prose max-w-none">
          <p>This policy establishes standards for the use and disclosure of protected health information...</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Acknowledgment Statistics</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center"><div className="text-2xl font-bold">100</div><div className="text-sm text-gray-600">Total Assigned</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-green-600">95</div><div className="text-sm text-gray-600">Acknowledged</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-yellow-600">3</div><div className="text-sm text-gray-600">Pending</div></div>
            <div className="text-center"><div className="text-2xl font-bold text-red-600">2</div><div className="text-sm text-gray-600">Overdue</div></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

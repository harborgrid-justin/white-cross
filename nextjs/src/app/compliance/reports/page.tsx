import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Shield, Lock, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Compliance Reports | White Cross',
};

const reports = [
  { title: 'HIPAA Compliance Report', description: 'Comprehensive HIPAA compliance assessment', href: '/compliance/reports/hipaa', icon: Shield, color: 'text-blue-500' },
  { title: 'Access Control Report', description: 'User access patterns and anomalies', href: '/compliance/reports/access-control', icon: Lock, color: 'text-green-500' },
  { title: 'Data Integrity Report', description: 'Audit log verification and integrity', href: '/compliance/reports/data-integrity', icon: FileText, color: 'text-purple-500' },
  { title: 'Training Compliance Report', description: 'Staff training completion status', href: '/compliance/reports/training', icon: Users, color: 'text-amber-500' },
];

export default function ReportsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3"><TrendingUp className="h-8 w-8 text-blue-500" />Compliance Reports</h1>
        <p className="text-gray-600 mt-2">Generate comprehensive compliance and audit reports</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <Link key={report.href} href={report.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <report.icon className={`h-6 w-6 ${report.color}`} />
                  {report.title}
                </CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Generate Report</Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

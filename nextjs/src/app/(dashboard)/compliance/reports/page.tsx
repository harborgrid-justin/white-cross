import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { FileText, Download, Plus, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compliance Reports | White Cross',
  description: 'Generate and view HIPAA, FERPA, and custom compliance reports',
};

// Force dynamic rendering due to auth requirements
export const dynamic = "force-dynamic";

/**
 * Compliance Reports Page
 *
 * Displays generated compliance reports and provides report generation interface.
 * Server Component for compliance reporting.
 */
export default async function ComplianceReportsPage() {
  // TODO: Replace with actual server action
  const { reports, templates } = await getComplianceReports();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Compliance Reports</h1>
          <p className="text-muted-foreground mt-1">
            Generate HIPAA, FERPA, and custom compliance reports
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
      </div>

      {/* Report Templates */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:bg-accent/50 transition-colors cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {template.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {template.description}
              </p>
              <Button size="sm" className="w-full">
                Generate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generated Reports */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Generated Reports</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{report.title}</h4>
                      <Badge variant={getStatusVariant(report.status)}>
                        {report.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {report.type} • {formatDate(report.generatedAt)} by {report.generatedBy}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Period: {formatDate(report.period.start)} - {formatDate(report.period.end)}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function getComplianceReports() {
  const mockTemplates = [
    {
      id: '1',
      name: 'HIPAA Security Assessment',
      description: 'Comprehensive security risk assessment report',
    },
    {
      id: '2',
      name: 'Audit Trail Report',
      description: 'Detailed audit log analysis and compliance verification',
    },
    {
      id: '3',
      name: 'Training Compliance',
      description: 'Staff training completion and certification status',
    },
    {
      id: '4',
      name: 'Data Breach Analysis',
      description: 'Breach notification and incident response report',
    },
  ];

  const mockReports = [
    {
      id: '1',
      title: 'Q1 2024 HIPAA Compliance Report',
      type: 'SECURITY_RISK_ASSESSMENT',
      status: 'FINALIZED',
      generatedAt: '2024-04-01T00:00:00Z',
      generatedBy: 'Admin User',
      period: {
        start: '2024-01-01T00:00:00Z',
        end: '2024-03-31T23:59:59Z',
      },
    },
    {
      id: '2',
      title: 'March 2024 Audit Trail Report',
      type: 'AUDIT_TRAIL',
      status: 'FINALIZED',
      generatedAt: '2024-04-01T00:00:00Z',
      generatedBy: 'Compliance Officer',
      period: {
        start: '2024-03-01T00:00:00Z',
        end: '2024-03-31T23:59:59Z',
      },
    },
  ];

  return { templates: mockTemplates, reports: mockReports };
}

function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
  return status === 'FINALIZED' ? 'default' : 'secondary';
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

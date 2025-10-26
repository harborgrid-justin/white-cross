/**
 * Create New Custom Report Page
 */

'use client';

import { useRouter } from 'next/navigation';
import { CustomReportBuilder } from '@/components/analytics/CustomReportBuilder';
import { createCustomReport } from '@/lib/actions/analytics.actions';
import type { CustomReportConfig } from '@/lib/validations/report.schemas';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewCustomReportPage() {
  const router = useRouter();

  const handleSave = async (config: CustomReportConfig) => {
    const result = await createCustomReport(config);

    if (result.success) {
      toast.success('Report created successfully');
      router.push('/analytics/custom-reports');
    } else {
      toast.error(result.error || 'Failed to create report');
      throw new Error(result.error);
    }
  };

  const handlePreview = (config: CustomReportConfig) => {
    console.log('Preview report:', config);
    toast.info('Preview functionality coming soon');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/analytics/custom-reports"
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create Custom Report</h1>
          <p className="mt-1 text-sm text-gray-500">
            Build a custom analytics report with your preferred metrics and visualizations
          </p>
        </div>
      </div>

      {/* Report Builder */}
      <CustomReportBuilder onSave={handleSave} onPreview={handlePreview} />
    </div>
  );
}

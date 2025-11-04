'use client';

/**
 * Information Cards component for Forms Sidebar
 * Displays HIPAA compliance notice and weekly analytics summary
 */

import React from 'react';
import { Shield, TrendingUp, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * HIPAA Compliance Notice Card
 */
export function HIPAAComplianceCard() {
  return (
    <Card className="p-3 bg-blue-50 border-blue-200">
      <div className="flex items-start gap-2">
        <Shield className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-medium text-blue-900 mb-1">
            HIPAA Compliance
          </h4>
          <p className="text-xs text-blue-700">
            All healthcare forms automatically include HIPAA consent and data
            protection measures.
          </p>
        </div>
      </div>
    </Card>
  );
}

interface WeeklySummaryData {
  formResponses: number;
  avgCompletion: string;
  newForms: number;
}

interface WeeklySummaryCardProps {
  data: WeeklySummaryData;
}

/**
 * Weekly Analytics Summary Card
 */
export function WeeklySummaryCard({ data }: WeeklySummaryCardProps) {
  return (
    <Card className="p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900">This Week</h4>
        <TrendingUp className="h-4 w-4 text-green-500" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Form Responses:</span>
          <span className="font-medium text-gray-900">{data.formResponses}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Avg. Completion:</span>
          <span className="font-medium text-gray-900">{data.avgCompletion}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">New Forms:</span>
          <span className="font-medium text-gray-900">{data.newForms}</span>
        </div>
      </div>
      <a href="/forms/analytics">
        <Button variant="outline" size="sm" className="w-full mt-3">
          <BarChart3 className="h-4 w-4 mr-2" />
          Full Analytics
        </Button>
      </a>
    </Card>
  );
}

/**
 * Combined Info Cards component
 */
interface SidebarInfoCardsProps {
  weeklySummary: WeeklySummaryData;
}

export function SidebarInfoCards({ weeklySummary }: SidebarInfoCardsProps) {
  return (
    <>
      <HIPAAComplianceCard />
      <WeeklySummaryCard data={weeklySummary} />
    </>
  );
}

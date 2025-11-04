/**
 * DashboardAnalytics Component
 *
 * Displays healthcare analytics and trends including:
 * - Health Trends card (compliance rates, response times)
 * - Monthly Summary card (aggregate statistics)
 * - Visual trend indicators
 *
 * @component
 */

'use client';

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TrendItemProps {
  label: string;
  value: string;
  isPositive: boolean;
}

function TrendItem({ label, value, isPositive }: TrendItemProps) {
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  const colorClass = isPositive ? 'text-green-600' : 'text-red-600';

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center space-x-2">
        <TrendIcon className={`h-4 w-4 ${colorClass}`} />
        <span className="text-sm font-medium">{value}</span>
      </div>
    </div>
  );
}

interface SummaryItemProps {
  label: string;
  value: string | number;
}

function SummaryItem({ label, value }: SummaryItemProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

export function DashboardAnalytics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Health Trends Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Health Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <TrendItem label="Medication Compliance" value="92.3%" isPositive={true} />
            <TrendItem label="Screening Completion" value="88.7%" isPositive={true} />
            <TrendItem label="Emergency Response Time" value="4.2 min" isPositive={false} />
            <TrendItem label="Parent Engagement" value="76.8%" isPositive={true} />
          </div>
        </CardContent>
      </Card>

      {/* Monthly Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <SummaryItem label="Total Appointments" value="342" />
            <SummaryItem label="Medications Administered" value="1,247" />
            <SummaryItem label="Health Screenings" value="156" />
            <SummaryItem label="Emergency Incidents" value="23" />
            <SummaryItem label="Documents Processed" value="89" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * @fileoverview Incident Analytics Dashboard Page
 * @module app/(dashboard)/incidents/analytics
 */

import React from 'react';
import { Metadata } from 'next';
import { getIncidentAnalytics } from '@/actions/incidents.actions';
import { Card } from '@/components/ui/layout/Card';
import { Badge } from '@/components/ui/display/Badge';

export const metadata: Metadata = {
  title: 'Incident Analytics | White Cross',
  description: 'View incident analytics and insights',
};



export default async function IncidentAnalyticsPage() {
  const analyticsResult = await getIncidentAnalytics();
  const analytics = analyticsResult.data;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Incident Analytics</h1>

      {analytics && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Total Incidents
              </h3>
              <p className="text-3xl font-bold">{analytics.totalIncidents}</p>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Avg Response Time
              </h3>
              <p className="text-3xl font-bold">
                {Math.round(analytics.responseMetrics.avgResponseTime)} min
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Avg Resolution Time
              </h3>
              <p className="text-3xl font-bold">
                {Math.round(analytics.responseMetrics.avgResolutionTime / 60)} hrs
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">
                Most Common Type
              </h3>
              <p className="text-2xl font-bold">
                {Object.entries(analytics.byType).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
              </p>
            </Card>
          </div>

          {/* Type Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">By Type</h2>
              <div className="space-y-2">
                {Object.entries(analytics.byType).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center">
                    <span className="text-sm">{type}</span>
                    <Badge>{count}</Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">By Severity</h2>
              <div className="space-y-2">
                {Object.entries(analytics.bySeverity).map(([severity, count]) => (
                  <div key={severity} className="flex justify-between items-center">
                    <span className="text-sm">{severity}</span>
                    <Badge
                      color={
                        severity === 'CRITICAL' || severity === 'LIFE_THREATENING'
                          ? 'red'
                          : severity === 'SERIOUS'
                          ? 'orange'
                          : 'green'
                      }
                    >
                      {count}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Location Hotspots */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Location Hotspots</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(analytics.byLocation)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 8)
                .map(([location, count]) => (
                  <div key={location} className="text-center p-4 bg-gray-50 rounded">
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs text-gray-600">{location.replace('_', ' ')}</p>
                  </div>
                ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

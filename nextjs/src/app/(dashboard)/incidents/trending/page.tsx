/**
 * @fileoverview Incident Trending Analysis Page
 * @module app/(dashboard)/incidents/trending
 */

import React from 'react';
import { Metadata } from 'next';
import { getTrendingIncidents } from '@/actions/incidents.actions';
import { Card } from '@/components/ui/layout/Card';
import { Badge } from '@/components/ui/display/Badge';

export const metadata: Metadata = {
  title: 'Trending Incidents | White Cross',
  description: 'View incident trends and patterns',
};

export default async function TrendingIncidentsPage() {
  const trendingResult = await getTrendingIncidents('month');
  const trending = trendingResult.data;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Trending Incidents</h1>

      {trending && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Increasing Types */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Increasing Types</h2>
            <div className="space-y-3">
              {trending.increasingTypes.map((item) => (
                <div key={item.type} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.type.replace('_', ' ')}</p>
                    <p className="text-xs text-gray-600">{item.count} incidents</p>
                  </div>
                  <Badge color={item.change > 50 ? 'red' : item.change > 20 ? 'orange' : 'yellow'}>
                    +{item.change}%
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Hotspots */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Location Hotspots</h2>
            <div className="space-y-3">
              {trending.hotspots.map((item) => (
                <div key={item.location} className="flex justify-between items-center">
                  <p className="font-medium">{item.location.replace('_', ' ')}</p>
                  <Badge>{item.count}</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Patterns */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Identified Patterns</h2>
            <div className="space-y-3">
              {trending.patterns.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <p className="font-medium text-sm">{item.pattern}</p>
                  <Badge>{item.occurrences}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

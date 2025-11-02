/**
 * Recurring Appointments Management Page
 * 
 * Route: /appointments/recurring
 * Manage recurring appointment series
 */

'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Repeat, Calendar, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { RecurringAppointmentManager } from '@/components/features/appointments';
import { apiClient, API_ENDPOINTS } from '@/lib/api-client';

export default function RecurringAppointmentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize page
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading recurring appointments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Recurring Appointments</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Recurring Appointments"
        description="Manage recurring appointment series and patterns"
        actions={
          <div className="flex gap-2">
            <Link href="/appointments">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                View All Appointments
              </Button>
            </Link>
            <Link href="/appointments/recurring/new">
              <Button variant="default" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Series
              </Button>
            </Link>
          </div>
        }
      />

      {/* Recurring Appointments Manager */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Repeat className="h-5 w-5 mr-2" />
            Active Recurring Series
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RecurringAppointmentManager userId="current-user" />
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>About Recurring Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">What are recurring appointments?</h4>
              <p>
                Recurring appointments allow you to schedule a series of appointments that repeat at regular intervals.
                This is useful for students who need regular medication administration, health check-ups, or therapy sessions.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Supported patterns:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li><strong>Daily:</strong> Every N days (e.g., every 2 days)</li>
                <li><strong>Weekly:</strong> Specific days of the week (e.g., Monday, Wednesday, Friday)</li>
                <li><strong>Monthly:</strong> Same day each month (e.g., 15th of every month)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Automatic scheduling of future appointments</li>
                <li>Bulk editing of entire series</li>
                <li>Individual appointment modifications</li>
                <li>Series end date or occurrence count</li>
                <li>Holiday and break exclusions</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}




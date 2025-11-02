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
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/api';

export default function RecurringAppointmentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize page
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-primary"></div>
        <span className="ml-2 sm:ml-3 text-xs sm:text-sm text-muted-foreground">Loading recurring appointments...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] p-4">
        <div className="text-center">
          <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-destructive mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">Error Loading Recurring Appointments</h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
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
          <div className="flex flex-col xs:flex-row gap-2">
            <Link href="/appointments">
              <Button variant="outline" size="sm">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                <span className="hidden xs:inline">View All </span>Appointments
              </Button>
            </Link>
            <Link href="/appointments/recurring/new">
              <Button variant="default" size="sm">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Create Series
              </Button>
            </Link>
          </div>
        }
      />

      {/* Recurring Appointments Manager */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-base sm:text-lg">
            <Repeat className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0" />
            Active Recurring Series
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <RecurringAppointmentManager userId="current-user" />
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">About Recurring Appointments</CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-1 sm:mb-2 text-xs sm:text-sm">What are recurring appointments?</h4>
              <p className="text-[10px] xs:text-xs sm:text-sm">
                Recurring appointments allow you to schedule a series of appointments that repeat at regular intervals.
                This is useful for students who need regular medication administration, health check-ups, or therapy sessions.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-1 sm:mb-2 text-xs sm:text-sm">Supported patterns:</h4>
              <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 ml-3 sm:ml-4 text-[10px] xs:text-xs sm:text-sm">
                <li><strong>Daily:</strong> Every N days (e.g., every 2 days)</li>
                <li><strong>Weekly:</strong> Specific days of the week (e.g., Monday, Wednesday, Friday)</li>
                <li><strong>Monthly:</strong> Same day each month (e.g., 15th of every month)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-foreground mb-1 sm:mb-2 text-xs sm:text-sm">Features:</h4>
              <ul className="list-disc list-inside space-y-0.5 sm:space-y-1 ml-3 sm:ml-4 text-[10px] xs:text-xs sm:text-sm">
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

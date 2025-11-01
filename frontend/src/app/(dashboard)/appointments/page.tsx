/**
 * Appointments Page - White Cross Healthcare Platform
 *
 * Features:
 * - View scheduled appointments with modern component architecture
 * - Leverage server actions for data management
 * - Healthcare-specific appointment management
 * - Integration with parallel routes and modern patterns
 */

'use client';

/**
 * Force dynamic rendering for real-time appointment data
 */


import React from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import AppointmentsContent from './_components/AppointmentsContent';
import AppointmentsSidebar from './_components/AppointmentsSidebar';

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Appointments"
        description="Manage student healthcare appointments and schedules"
        actions={
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Appointments Content */}
          <div className="lg:col-span-3">
            <AppointmentsContent />
          </div>
          
          {/* Appointments Sidebar */}
          <div className="lg:col-span-1">
            <AppointmentsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
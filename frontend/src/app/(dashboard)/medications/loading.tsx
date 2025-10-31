/**
 * @fileoverview Medications Loading State - Advanced Skeleton UI for Healthcare Medication Management
 * @module app/(dashboard)/medications/loading
 *
 * @description
 * Comprehensive loading skeleton component for medication management dashboard.
 * Provides healthcare-specific loading states with medication tracking features.
 *
 * **Healthcare Features:**
 * - Medication list with administration schedules
 * - Prescription details and controlled substance indicators  
 * - Emergency medication alerts and due notifications
 * - Inventory levels and expiration tracking
 * - Administration history and compliance monitoring
 *
 * **Accessibility:**
 * - ARIA labels for medication management context
 * - Screen reader announcements for loading states
 * - Keyboard navigation preservation during loading
 *
 * @since 1.0.0
 */

import { Skeleton } from '@/components/ui/Skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

export default function MedicationsLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading medication management dashboard">
      {/* Header with Quick Actions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-56" /> {/* Title */}
            <Skeleton className="h-4 w-96" /> {/* Subtitle */}
          </div>
          <div className="flex items-center space-x-3">
            <Skeleton className="h-10 w-32" /> {/* Add Medication */}
            <Skeleton className="h-10 w-28" /> {/* Emergency Kit */}
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          <div className="lg:col-span-2">
            <Skeleton className="h-10 w-full" /> {/* Search */}
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-10 w-full" /> {/* Type Filter */}
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-10 w-full" /> {/* Status Filter */}
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-10 w-full" /> {/* Route Filter */}
          </div>
          <div className="lg:col-span-1">
            <Skeleton className="h-10 w-full" /> {/* Actions */}
          </div>
        </div>
      </div>

      {/* Critical Alerts Banner */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <Skeleton className="h-5 w-5 rounded" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-8 w-20" />
          </div>
        </CardContent>
      </Card>

      {/* Statistics Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {/* Total Medications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-12 mb-2" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>

        {/* Active Prescriptions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-12 mb-2" />
            <Skeleton className="h-3 w-28" />
          </CardContent>
        </Card>

        {/* Due Today */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-18" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-8 mb-2" />
            <Skeleton className="h-3 w-22" />
          </CardContent>
        </Card>

        {/* Expiring Soon */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-22" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-8 mb-2" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>

        {/* Controlled Substances */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-26" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-8 mb-2" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>

        {/* Low Stock */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-18" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-8 mb-2" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      </div>

      {/* Due Now Section */}
      <Card className="border-orange-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Medications List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-40" />
            <div className="flex items-center space-x-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
              {/* Medication Icon/Type */}
              <div className="flex-shrink-0">
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>

              {/* Medication Details */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-5 w-48" /> {/* Medication Name */}
                  <Skeleton className="h-4 w-16 rounded-full" /> {/* Type Badge */}
                  <Skeleton className="h-4 w-18 rounded-full" /> {/* Status Badge */}
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <Skeleton className="h-4 w-20" /> {/* Strength */}
                  <Skeleton className="h-4 w-24" /> {/* Route */}
                  <Skeleton className="h-4 w-28" /> {/* Frequency */}
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <Skeleton className="h-4 w-32" /> {/* Student Name */}
                  <Skeleton className="h-4 w-28" /> {/* Last Admin */}
                </div>
              </div>

              {/* Schedule & Actions */}
              <div className="flex-shrink-0 space-y-2 text-right">
                <Skeleton className="h-4 w-20" /> {/* Next Due */}
                <div className="flex items-center justify-end space-x-2">
                  <Skeleton className="h-8 w-8 rounded" /> {/* Administer */}
                  <Skeleton className="h-8 w-8 rounded" /> {/* More Actions */}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
      
      <span className="sr-only">Loading medication management dashboard with prescription tracking, administration schedules, and inventory monitoring</span>
    </div>
  );
}

/**
 * Immunizations Page - White Cross Healthcare Platform
 *
 * Features:
 * - Comprehensive immunizations management 
 * - Vaccination tracking and compliance monitoring
 * - Healthcare workflow integration
 * - Modern component architecture
 */

'use client';

/**
 * Force dynamic rendering for real-time immunization data
 */


import React from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImmunizationsContent from './_components/ImmunizationsContent';
import ImmunizationsSidebar from './_components/ImmunizationsSidebar';

export default function ImmunizationsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Immunizations"
        description="Manage student immunizations and vaccination records"
        actions={
          <Button variant="default">
            <Plus className="h-4 w-4 mr-2" />
            Add Immunization
          </Button>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Immunizations Content */}
          <div className="lg:col-span-3">
            <ImmunizationsContent />
          </div>
          
          {/* Immunizations Sidebar */}
          <div className="lg:col-span-1">
            <ImmunizationsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}




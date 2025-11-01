/**
 * Documents Page - White Cross Healthcare Platform
 *
 * Features:
 * - Healthcare document management
 * - Medical records and file uploads  
 * - HIPAA-compliant document handling
 * - Modern component architecture
 */

'use client';

/**
 * Force dynamic rendering for real-time document data
 */


import React from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import DocumentsContent from './_components/DocumentsContent';
import DocumentsSidebar from './_components/DocumentsSidebar';

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Documents"
        description="Manage healthcare documents and medical records"
        actions={
          <div className="flex space-x-3">
            <Button variant="secondary">
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Create Document
            </Button>
          </div>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Documents Content */}
          <div className="lg:col-span-3">
            <DocumentsContent />
          </div>
          
          {/* Documents Sidebar */}
          <div className="lg:col-span-1">
            <DocumentsSidebar />
          </div>
        </div>
      </div>
    </div>
  );
}
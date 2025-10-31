/**
 * @fileoverview Default Sidebar for Compliance - Default sidebar when no specific sidebar route is active
 * @module app/(dashboard)/compliance/@sidebar/default
 * @category Compliance - Parallel Routes
 */

import { ComplianceSidebar } from '../_components/ComplianceSidebar';

interface ComplianceSidebarDefaultProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    status?: string;
    priority?: string;
    dateRange?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default function ComplianceSidebarDefault({ searchParams }: ComplianceSidebarDefaultProps) {
  return (
    <div className="h-full bg-gray-50 border-l border-gray-200 p-4">
      <ComplianceSidebar searchParams={searchParams} />
    </div>
  );
}
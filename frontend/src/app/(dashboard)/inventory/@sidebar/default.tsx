/**
 * @fileoverview Default Sidebar for Inventory - Default sidebar when no specific sidebar route is active
 * @module app/(dashboard)/inventory/@sidebar/default
 * @category Inventory - Parallel Routes
 */

import { InventorySidebar } from '../_components/InventorySidebar';

interface InventorySidebarDefaultProps {
  searchParams: {
    page?: string;
    limit?: string;
    search?: string;
    category?: string;
    status?: string;
    location?: string;
    sortBy?: string;
    sortOrder?: string;
  };
}

export default function InventorySidebarDefault({ searchParams }: InventorySidebarDefaultProps) {
  return (
    <div className="h-full bg-gray-50 border-l border-gray-200 p-4">
      <InventorySidebar searchParams={searchParams} />
    </div>
  );
}
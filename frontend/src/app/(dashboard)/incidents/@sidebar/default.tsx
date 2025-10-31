/**
 * @fileoverview Incidents Sidebar Default - Parallel route slot for sidebar navigation
 * @module app/(dashboard)/incidents/@sidebar/default
 * @category Incidents - Parallel Routes
 */

import { IncidentsSidebar } from '../_components/IncidentsSidebar';

interface IncidentsSidebarDefaultProps {
  searchParams: {
    page?: string;
    limit?: string;
    type?: string;
    status?: string;
    severity?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
  };
}

export default function IncidentsSidebarDefault({ searchParams }: IncidentsSidebarDefaultProps) {
  return <IncidentsSidebar searchParams={searchParams} />;
}
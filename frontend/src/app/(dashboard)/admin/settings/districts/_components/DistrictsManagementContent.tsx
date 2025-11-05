/**
 * @fileoverview Districts Management Content Component
 * @module app/(dashboard)/admin/settings/districts/_components/DistrictsManagementContent
 * @category Admin - Components
 */

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminDataTable } from '../../../_components/AdminDataTable';
import { exportData } from '@/lib/admin-utils';
import toast from 'react-hot-toast';
import type { District, DistrictSearchParams } from '@/lib/actions/admin.districts';

interface DistrictsManagementContentProps {
  initialDistricts: District[];
  totalCount: number;
  searchParams: DistrictSearchParams;
}

/**
 * Client component for districts management with optimistic updates
 * Follows the established pattern from UserManagementContent
 */
export function DistrictsManagementContent({
  initialDistricts,
  totalCount,
  searchParams
}: DistrictsManagementContentProps) {
  const [districts] = useState(initialDistricts);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Handle search with URL updates for server-side filtering
  const handleSearch = (query: string) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (query) params.set('search', query);
      if (searchParams.status && searchParams.status !== 'all') {
        params.set('status', searchParams.status);
      }
      
      const url = params.toString() ? `?${params.toString()}` : '';
      router.push(`/admin/settings/districts${url}`);
    });
  };

  // Handle status filter change
  const handleStatusChange = (status: string) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (searchParams.search) params.set('search', searchParams.search);
      if (status !== 'all') params.set('status', status);
      
      const url = params.toString() ? `?${params.toString()}` : '';
      router.push(`/admin/settings/districts${url}`);
    });
  };

  // Handle export
  const handleExport = async () => {
    try {
      await exportData(districts, {
        format: 'csv',
        filename: `districts-export-${new Date().toISOString().split('T')[0]}`,
      });
      toast.success('Districts exported successfully');
    } catch (error) {
      toast.error('Failed to export districts');
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: 'name',
      label: 'District',
      render: (district: District) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{district.name}</div>
            <div className="text-sm text-gray-500">Code: {district.code}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'address',
      label: 'Address',
      render: (district: District) => (
        <div className="text-sm text-gray-900">{district.address}</div>
      ),
    },
    {
      key: 'contact',
      label: 'Contact',
      render: (district: District) => (
        <div className="text-sm">
          <div className="text-gray-900">{district.phoneNumber}</div>
          <div className="text-gray-500">{district.email}</div>
        </div>
      ),
    },
    {
      key: 'schoolCount',
      label: 'Schools',
      render: (district: District) => (
        <span className="text-sm text-gray-900">{district.schoolCount}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (district: District) => (
        <Badge variant={district.status === 'active' ? 'success' : 'secondary'}>
          {district.status}
        </Badge>
      ),
    },
  ];

  // Filter configuration
  const filters = [
    {
      key: 'status',
      label: 'Status',
      value: searchParams.status || 'all',
      onChange: handleStatusChange,
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={isPending}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add District
        </Button>
      </div>

      {/* Data table with integrated search and filters */}
      <AdminDataTable
        data={districts}
        columns={columns}
        loading={isPending}
        searchPlaceholder="Search districts..."
        onSearch={handleSearch}
        onExport={handleExport}
        filters={filters}
        emptyMessage="No districts found"
        keyExtractor={(district) => district.id}
      />

      {/* Results summary */}
      {districts.length > 0 && (
        <div className="text-sm text-gray-600 text-center">
          Showing {districts.length} of {totalCount} districts
        </div>
      )}
    </div>
  );
}

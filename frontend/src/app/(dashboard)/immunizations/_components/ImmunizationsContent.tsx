/**
 * @fileoverview Immunizations Dashboard Content
 * @module app/(dashboard)/immunizations/_components/ImmunizationsContent
 * @category Healthcare - Immunizations
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, FileText } from 'lucide-react';
import ImmunizationStatsCards from './ImmunizationStatsCards';
import ImmunizationQuickActions from './ImmunizationQuickActions';
import ImmunizationRecentActivity from './ImmunizationRecentActivity';
import ImmunizationComplianceOverview from './ImmunizationComplianceOverview';

interface ImmunizationsContentProps {
  searchParams: Record<string, string | undefined>;
}

export function ImmunizationsContent({ searchParams }: ImmunizationsContentProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchParams.search || '');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const params = new URLSearchParams(searchParams as Record<string, string>);
    params.set('search', query);
    router.push(`/immunizations?${params.toString()}`);
  };

  return (
    <div className="space-y-8 p-6">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Immunization Management</h1>
            <p className="text-gray-600 mt-1">CDC-compliant vaccine tracking with real-time compliance monitoring</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => router.push('/immunizations/reports')}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Link href="/immunizations/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Record Vaccine
              </Button>
            </Link>
          </div>
        </div>
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search students, vaccines, or records..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="pl-10" />
        </div>
      </div>
      <ImmunizationStatsCards />
      <ImmunizationQuickActions />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ImmunizationRecentActivity />
        </div>
        <div className="lg:col-span-1">
          <ImmunizationComplianceOverview />
        </div>
      </div>
    </div>
  );
}

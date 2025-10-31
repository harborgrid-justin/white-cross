/**
 * Immunizations Management Page
 * Main dashboard for viewing and managing student immunizations
 *
 * @module app/immunizations/page
 */

'use client';

/**
 * Force dynamic rendering for real-time immunization data
 * Immunization records are frequently updated and user-specific
 */
export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Syringe, AlertTriangle, CheckCircle, Clock, Plus, Search, Filter } from 'lucide-react';
import { Card } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-client';

interface Immunization {
  id: string;
  studentId: string;
  studentName: string;
  vaccineName: string;
  vaccineType: string;
  doseNumber: number;
  dateAdministered: string;
  nextDueDate?: string;
  lotNumber?: string;
  manufacturer?: string;
  administeredBy: string;
  status: 'completed' | 'due' | 'overdue' | 'upcoming';
  notes?: string;
}

interface ImmunizationStats {
  totalRecords: number;
  dueCount: number;
  overdueCount: number;
  upcomingCount: number;
}

/**
 * Immunizations Management Page Component
 */
export default function ImmunizationsPage() {
  const router = useRouter();
  const [immunizations, setImmunizations] = useState<Immunization[]>([]);
  const [stats, setStats] = useState<ImmunizationStats>({
    totalRecords: 0,
    dueCount: 0,
    overdueCount: 0,
    upcomingCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterVaccineType, setFilterVaccineType] = useState<string>('');

  useEffect(() => {
    fetchImmunizations();
  }, [filterStatus, filterVaccineType]);

  const fetchImmunizations = async () => {
    try {
      setLoading(true);

      // Build query params
      const params: any = {};
      if (filterStatus && filterStatus !== 'all') {
        params.status = filterStatus;
      }
      if (filterVaccineType) {
        params.vaccineType = filterVaccineType;
      }

      // Fetch immunizations
      const response = await apiClient.get<any>(
        API_ENDPOINTS.IMMUNIZATIONS.BASE,
        params
      );

      // Handle response structure
      const immunizationsData = response.data || response.immunizations || [];
      setImmunizations(immunizationsData);

      // Calculate stats
      const due = immunizationsData.filter((i: Immunization) => i.status === 'due');
      const overdue = immunizationsData.filter((i: Immunization) => i.status === 'overdue');
      const upcoming = immunizationsData.filter((i: Immunization) => i.status === 'upcoming');

      setStats({
        totalRecords: immunizationsData.length,
        dueCount: due.length,
        overdueCount: overdue.length,
        upcomingCount: upcoming.length,
      });
    } catch (error) {
      console.error('Error fetching immunizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImmunizations = immunizations.filter(immunization => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        immunization.studentName?.toLowerCase().includes(query) ||
        immunization.vaccineName?.toLowerCase().includes(query) ||
        immunization.vaccineType?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'due':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'due':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'overdue':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'upcoming':
        return <Clock className="h-5 w-5 text-blue-600" />;
      default:
        return <Syringe className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Immunization Records
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Track and manage student immunization records
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/immunizations/due">
            <Button variant="outline" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              View Due Immunizations
            </Button>
          </Link>
          <Link href="/immunizations/new">
            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Record Immunization
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Records</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalRecords}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Syringe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Due Now</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.dueCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.overdueCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.upcomingCount}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by student or vaccine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="due">Due</option>
              <option value="overdue">Overdue</option>
              <option value="upcoming">Upcoming</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Vaccine Type
            </label>
            <Select
              value={filterVaccineType}
              onChange={(e) => setFilterVaccineType(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="dtap">DTaP</option>
              <option value="mmr">MMR</option>
              <option value="polio">Polio</option>
              <option value="varicella">Varicella</option>
              <option value="hep-b">Hepatitis B</option>
              <option value="hpv">HPV</option>
              <option value="meningococcal">Meningococcal</option>
              <option value="tdap">Tdap</option>
              <option value="flu">Influenza</option>
              <option value="covid">COVID-19</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Immunizations List */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          All Immunization Records
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Loading immunization records...</p>
          </div>
        ) : filteredImmunizations.length === 0 ? (
          <div className="text-center py-8">
            <Syringe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No immunization records found</p>
            <Link href="/immunizations/new">
              <Button variant="outline" className="mt-4">
                Record First Immunization
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredImmunizations.map((immunization) => (
              <div
                key={immunization.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => router.push(`/immunizations/${immunization.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(immunization.status)}
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {immunization.studentName || 'Unknown Student'}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(immunization.status)}`}>
                        {immunization.status.charAt(0).toUpperCase() + immunization.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div>
                        <strong>Vaccine:</strong> {immunization.vaccineName}
                      </div>
                      <div>
                        <strong>Type:</strong> {immunization.vaccineType.toUpperCase()}
                      </div>
                      <div>
                        <strong>Dose:</strong> {immunization.doseNumber}
                      </div>
                      <div>
                        <strong>Date:</strong> {formatDate(immunization.dateAdministered)}
                      </div>
                    </div>

                    {immunization.nextDueDate && (
                      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <strong>Next Due:</strong> {formatDate(immunization.nextDueDate)}
                      </div>
                    )}

                    {immunization.administeredBy && (
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        <strong>Administered By:</strong> {immunization.administeredBy}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

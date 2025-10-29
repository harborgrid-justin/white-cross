/**
 * Due Immunizations Page
 * Displays all immunizations that are currently due or overdue
 *
 * @module app/immunizations/due/page
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, Syringe, Calendar, User, ArrowLeft, Plus, Search } from 'lucide-react';
import { Card } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-client';

interface DueImmunization {
  id: string;
  studentId: string;
  studentName: string;
  studentGrade: string;
  vaccineName: string;
  vaccineType: string;
  doseNumber: number;
  dueDate: string;
  daysPastDue: number;
  status: 'due' | 'overdue';
  lastDoseDate?: string;
  notes?: string;
}

interface DueStats {
  totalDue: number;
  overdue: number;
  dueThisWeek: number;
  dueThisMonth: number;
}

/**
 * Due Immunizations Page Component
 */
export default function DueImmunizationsPage() {
  const router = useRouter();
  const [dueImmunizations, setDueImmunizations] = useState<DueImmunization[]>([]);
  const [stats, setStats] = useState<DueStats>({
    totalDue: 0,
    overdue: 0,
    dueThisWeek: 0,
    dueThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('');

  useEffect(() => {
    fetchDueImmunizations();
  }, [filterStatus, filterGrade]);

  const fetchDueImmunizations = async () => {
    try {
      setLoading(true);

      // Build query params
      const params: any = {
        status: 'due,overdue'
      };
      if (filterStatus && filterStatus !== 'all') {
        params.status = filterStatus;
      }
      if (filterGrade) {
        params.grade = filterGrade;
      }

      // Fetch due immunizations
      const response = await apiClient.get<any>(
        `${API_ENDPOINTS.IMMUNIZATIONS.BASE}/due`,
        params
      );

      // Handle response structure
      const dueData = response.data || response.immunizations || [];
      setDueImmunizations(dueData);

      // Calculate stats
      const now = new Date();
      const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const overdue = dueData.filter((i: DueImmunization) => i.status === 'overdue');
      const dueThisWeek = dueData.filter((i: DueImmunization) => {
        const dueDate = new Date(i.dueDate);
        return dueDate <= oneWeekFromNow && dueDate >= now;
      });
      const dueThisMonth = dueData.filter((i: DueImmunization) => {
        const dueDate = new Date(i.dueDate);
        return dueDate <= oneMonthFromNow && dueDate >= now;
      });

      setStats({
        totalDue: dueData.length,
        overdue: overdue.length,
        dueThisWeek: dueThisWeek.length,
        dueThisMonth: dueThisMonth.length,
      });
    } catch (error) {
      console.error('Error fetching due immunizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImmunizations = dueImmunizations.filter(immunization => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        immunization.studentName?.toLowerCase().includes(query) ||
        immunization.vaccineName?.toLowerCase().includes(query) ||
        immunization.vaccineType?.toLowerCase().includes(query) ||
        immunization.studentGrade?.toLowerCase().includes(query)
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
    return status === 'overdue'
      ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
  };

  const getPriorityBadge = (daysPastDue: number) => {
    if (daysPastDue > 30) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">High Priority</span>;
    } else if (daysPastDue > 0) {
      return <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">Priority</span>;
    } else if (daysPastDue >= -7) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Due Soon</span>;
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/immunizations"
          className="inline-flex items-center text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to All Immunizations
        </Link>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Due Immunizations
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Immunizations requiring immediate attention
            </p>
          </div>
          <Link href="/immunizations/new">
            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Record Immunization
            </Button>
          </Link>
        </div>
      </div>

      {/* Alert Banner */}
      {stats.overdue > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-400">
                <strong className="font-medium">Attention Required:</strong>
                {' '}There are {stats.overdue} overdue immunizations that need immediate attention.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Due</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalDue}
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
                {stats.overdue}
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
              <p className="text-sm text-gray-600 dark:text-gray-400">Due This Week</p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">
                {stats.dueThisWeek}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Due This Month</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.dueThisMonth}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
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
              <option value="all">All</option>
              <option value="overdue">Overdue Only</option>
              <option value="due">Due Only</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Grade
            </label>
            <Select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
            >
              <option value="">All Grades</option>
              <option value="K">Kindergarten</option>
              <option value="1">1st Grade</option>
              <option value="2">2nd Grade</option>
              <option value="3">3rd Grade</option>
              <option value="4">4th Grade</option>
              <option value="5">5th Grade</option>
              <option value="6">6th Grade</option>
              <option value="7">7th Grade</option>
              <option value="8">8th Grade</option>
              <option value="9">9th Grade</option>
              <option value="10">10th Grade</option>
              <option value="11">11th Grade</option>
              <option value="12">12th Grade</option>
            </Select>
          </div>
        </div>
      </Card>

      {/* Due Immunizations List */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Due and Overdue Immunizations
        </h2>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Loading due immunizations...</p>
          </div>
        ) : filteredImmunizations.length === 0 ? (
          <div className="text-center py-8">
            <Syringe className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No immunizations are currently due</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              All students are up to date with their immunizations
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredImmunizations.map((immunization) => (
              <div
                key={immunization.id}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                onClick={() => router.push(`/students/${immunization.studentId}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {immunization.studentName}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(immunization.status)}`}>
                        {immunization.status === 'overdue' ? 'Overdue' : 'Due'}
                      </span>
                      {getPriorityBadge(immunization.daysPastDue)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <div className="flex items-center gap-2">
                        <Syringe className="h-4 w-4" />
                        {immunization.vaccineName}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Grade {immunization.studentGrade}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Due: {formatDate(immunization.dueDate)}
                      </div>
                      <div>
                        <strong>Dose:</strong> {immunization.doseNumber}
                      </div>
                    </div>

                    {immunization.daysPastDue > 0 && (
                      <div className="text-sm text-red-600 dark:text-red-400 font-medium">
                        {immunization.daysPastDue} days overdue
                      </div>
                    )}

                    {immunization.lastDoseDate && (
                      <div className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                        Last dose: {formatDate(immunization.lastDoseDate)}
                      </div>
                    )}

                    {immunization.notes && (
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        <strong>Notes:</strong> {immunization.notes}
                      </p>
                    )}
                  </div>

                  <div className="ml-4">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/immunizations/new?studentId=${immunization.studentId}&vaccineType=${immunization.vaccineType}`);
                      }}
                    >
                      Record Now
                    </Button>
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

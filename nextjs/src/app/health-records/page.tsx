/**
 * Health Records List Page - White Cross Healthcare Platform (Next.js)
 * Comprehensive health records management
 *
 * @module app/health-records/page
 * @version 1.0.0
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Heart,
  Plus,
  Search,
  FileText,
  AlertTriangle,
  Calendar,
  Filter,
} from 'lucide-react';

// UI Components
import { Card } from '@/components/ui/layout/Card';
import { Button } from '@/components/ui/buttons/Button';
import { Badge } from '@/components/ui/display/Badge';

// API Client
import { apiClient, API_ENDPOINTS } from '@/lib/api-client';

interface HealthRecord {
  id: string;
  studentId: string;
  recordType: string;
  recordDate: string;
  provider?: string;
  description?: string;
  notes?: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    grade: string;
  };
}

export default function HealthRecordsPage() {
  const searchParams = useSearchParams();
  const studentId = searchParams?.get('studentId');

  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  const recordTypes = [
    'CHECKUP',
    'ILLNESS',
    'INJURY',
    'VACCINATION',
    'SCREENING',
    'MEDICATION',
    'OTHER',
  ];

  useEffect(() => {
    const loadRecords = async () => {
      try {
        setLoading(true);
        setError(null);

        const params: Record<string, string | number> = {};

        if (studentId) {
          params.studentId = studentId;
        }

        if (searchQuery) {
          params.search = searchQuery;
        }

        if (selectedType !== 'all') {
          params.recordType = selectedType;
        }

        const response = await apiClient.get<{ data: HealthRecord[] }>(
          API_ENDPOINTS.healthRecords,
          params
        );

        setRecords(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error loading health records:', err);
        setError(err instanceof Error ? err.message : 'Failed to load health records');
        setLoading(false);
      }
    };

    loadRecords();
  }, [studentId, searchQuery, selectedType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading health records...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Health Records
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center">
            <Heart className="h-8 w-8 text-red-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Health Records</h1>
          </div>
          <p className="mt-1 text-gray-600">
            {studentId
              ? 'Student health records with HIPAA compliance'
              : 'Manage all student health records'}
          </p>
        </div>
        <div className="flex space-x-3">
          <Link href={studentId ? `/health-records/new?studentId=${studentId}` : '/health-records/new'}>
            <Button leftIcon={<Plus />}>Add Record</Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Record Types</option>
              {recordTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center text-sm text-gray-500">
            <FileText className="h-4 w-4 mr-2" />
            {records.length} record{records.length !== 1 ? 's' : ''} found
          </div>
        </div>
      </Card>

      {/* Records List */}
      <Card>
        {records.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No health records found</h3>
            <p className="text-gray-600 mb-4">Get started by adding a new health record.</p>
            <Link href={studentId ? `/health-records/new?studentId=${studentId}` : '/health-records/new'}>
              <Button leftIcon={<Plus />}>Add First Record</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provider
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(record.recordDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.student ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {record.student.firstName} {record.student.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {record.student.studentNumber} • {record.student.grade}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">Unknown</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="info">{record.recordType.replace('_', ' ')}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md truncate">
                        {record.description || record.notes || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">{record.provider || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/health-records/${record.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

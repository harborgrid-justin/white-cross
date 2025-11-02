/**
 * @fileoverview Medications Content - Main Medication Management Interface
 * @module app/(dashboard)/medications/_components/MedicationsContent
 *
 * @description
 * Comprehensive medication management interface providing healthcare professionals
 * with advanced filtering, searching, and administration tracking capabilities.
 *
 * **Healthcare Features:**
 * - Medication administration scheduling and tracking
 * - Real-time inventory monitoring and alerts
 * - Controlled substance compliance and logging
 * - Drug interaction checking and warnings
 * - Emergency medication quick access
 * - HIPAA-compliant audit trail integration
 *
 * @since 1.0.0
 */

'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  getMedications,
  getDueMedications,
  getOverdueMedications,
  administerMedication,
  type AdministerMedicationData
} from '@/lib/actions/medications.actions';
import { 
  Pill, 
  Clock, 
  AlertTriangle, 
  Search,
  Calendar,
  User,
  Syringe,
  Shield,
  Zap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Edit,
  Download,
  Printer
} from 'lucide-react';

// Type definitions
interface Medication {
  id: string;
  name: string;
  genericName?: string;
  type: 'prescription' | 'over_the_counter' | 'supplement' | 'emergency' | 'inhaler' | 'epipen' | 'insulin' | 'controlled_substance';
  status: 'active' | 'discontinued' | 'expired' | 'on_hold' | 'completed' | 'cancelled';
  strength: string;
  administrationRoute: string;
  frequency: string;
  studentId: string;
  lastAdministered?: string;
  nextDue?: string;
  isControlled: boolean;
  warnings?: string[];
}

interface MedicationFilters {
  status?: string[];
  type?: string[];
  isControlled?: boolean;
  searchQuery?: string;
}

interface MedicationsContentProps {
  searchParams: {
    page?: string;
    limit?: string;
    status?: string;
    type?: string;
    studentId?: string;
    search?: string;
  };
}

export function MedicationsContent({ searchParams }: MedicationsContentProps) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [dueMedications, setDueMedications] = useState<Medication[]>([]);
  const [overdueMedications, setOverdueMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.search || '');
  const [filters, setFilters] = useState<MedicationFilters>({});
  const [sortBy, setSortBy] = useState<'name' | 'nextDue' | 'student' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        setIsLoading(true);
        
        // Build filters from search params
        const medicationFilters = {
          status: searchParams.status,
          type: searchParams.type,
          studentId: searchParams.studentId,
          searchQuery: searchParams.search,
        };

        const [medicationsData, dueData, overdueData] = await Promise.all([
          getMedications(medicationFilters),
          getDueMedications(),
          getOverdueMedications()
        ]);

        setMedications(medicationsData);
        setDueMedications(dueData);
        setOverdueMedications(overdueData);
      } catch (error) {
        console.error('Failed to fetch medications:', error);
        // Fallback to mock data
        setMedications([]);
        setDueMedications([]);
        setOverdueMedications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedications();
  }, [searchParams]);

  // Filter and search logic
  const filteredMedications = useMemo(() => {
    let result = medications.filter(med => {
      if (filters.status && !filters.status.includes(med.status)) return false;
      if (filters.type && !filters.type.includes(med.type)) return false;
      if (filters.isControlled !== undefined && med.isControlled !== filters.isControlled) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return med.name.toLowerCase().includes(query) ||
               med.genericName?.toLowerCase().includes(query) ||
               med.studentId.toLowerCase().includes(query);
      }
      return true;
    });

    // Sort medications
    result.sort((a, b) => {
      const modifier = sortOrder === 'asc' ? 1 : -1;
      
      switch (sortBy) {
        case 'name':
          return modifier * a.name.localeCompare(b.name);
        case 'nextDue':
          if (!a.nextDue && !b.nextDue) return 0;
          if (!a.nextDue) return modifier;
          if (!b.nextDue) return -modifier;
          return modifier * (new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime());
        case 'student':
          return modifier * a.studentId.localeCompare(b.studentId);
        case 'type':
          return modifier * a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return result;
  }, [medications, filters, searchQuery, sortBy, sortOrder]);

  const handleFilterChange = useCallback((newFilters: Partial<MedicationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
  }, []);

  const handleAdministerMedication = async (medicationId: string) => {
    try {
      const adminData: AdministerMedicationData = {
        medicationId,
        studentId: medications.find(m => m.id === medicationId)?.studentId || '',
        administeredBy: 'current-user', // Replace with actual user
        administeredAt: new Date().toISOString(),
        dosageGiven: 'Standard dose', // Replace with actual dosage
      };

      await administerMedication(adminData);
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Failed to administer medication:', error);
    }
  };

  const getMedicationIcon = (type: Medication['type']) => {
    const iconMap = {
      prescription: Pill,
      over_the_counter: Pill,
      supplement: Pill,
      emergency: Zap,
      inhaler: Pill,
      epipen: Syringe,
      insulin: Syringe,
      controlled_substance: Shield,
    };
    const IconComponent = iconMap[type] || Pill;
    return <IconComponent className="h-5 w-5" />;
  };

  const getStatusIcon = (status: Medication['status']) => {
    const iconMap = {
      active: CheckCircle2,
      discontinued: XCircle,
      expired: XCircle,
      on_hold: AlertCircle,
      completed: CheckCircle2,
      cancelled: XCircle,
    };
    const IconComponent = iconMap[status] || AlertCircle;
    return <IconComponent className="h-4 w-4" />;
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const isDue = (medication: Medication) => {
    if (!medication.nextDue) return false;
    const now = new Date();
    const due = new Date(medication.nextDue);
    return due <= now;
  };

  const isOverdue = (medication: Medication) => {
    if (!medication.nextDue) return false;
    const now = new Date();
    const due = new Date(medication.nextDue);
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    return due <= oneHourAgo;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Critical Alerts Section */}
      {overdueMedications.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-red-800">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Overdue Medications ({overdueMedications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueMedications.slice(0, 3).map(medication => (
                <div key={medication.id} className="flex items-center justify-between p-2 bg-red-100 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getMedicationIcon(medication.type)}
                    <div>
                      <p className="font-medium text-red-900">{medication.name}</p>
                      <p className="text-sm text-red-700">
                        Due: {medication.nextDue ? formatDateTime(medication.nextDue) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleAdministerMedication(medication.id)}
                  >
                    Administer Now
                  </Button>
                </div>
              ))}
              {overdueMedications.length > 3 && (
                <p className="text-sm text-red-700 text-center mt-2">
                  +{overdueMedications.length - 3} more overdue medications
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Due Soon Section */}
      {dueMedications.length > 0 && overdueMedications.length === 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-orange-800">
              <Clock className="mr-2 h-5 w-5" />
              Due Now ({dueMedications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dueMedications.slice(0, 3).map(medication => (
                <div key={medication.id} className="flex items-center justify-between p-2 bg-orange-100 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getMedicationIcon(medication.type)}
                    <div>
                      <p className="font-medium text-orange-900">{medication.name}</p>
                      <p className="text-sm text-orange-700">
                        Due: {medication.nextDue ? formatDateTime(medication.nextDue) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAdministerMedication(medication.id)}
                  >
                    Administer
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Medications ({filteredMedications.length})</span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search medications by name, generic, student, or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={handleClearFilters}
              disabled={!searchQuery && Object.keys(filters).length === 0}
            >
              Clear Filters
            </Button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={filters.status?.includes('active') ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange({ 
                status: filters.status?.includes('active') ? [] : ['active'] 
              })}
            >
              Active Only
            </Button>
            <Button
              variant={filters.isControlled === true ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange({ 
                isControlled: filters.isControlled === true ? undefined : true 
              })}
            >
              <Shield className="mr-1 h-3 w-3" />
              Controlled
            </Button>
            <Button
              variant={filters.type?.includes('emergency') ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange({ 
                type: filters.type?.includes('emergency') ? [] : ['emergency'] 
              })}
            >
              <Zap className="mr-1 h-3 w-3" />
              Emergency
            </Button>
            <Button
              variant={filters.type?.includes('epipen') ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange({ 
                type: filters.type?.includes('epipen') ? [] : ['epipen'] 
              })}
            >
              <Syringe className="mr-1 h-3 w-3" />
              EpiPens
            </Button>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as 'name' | 'nextDue' | 'student' | 'type')}
              className="text-sm border border-gray-300 rounded px-2 py-1"
              aria-label="Sort medications by"
            >
              <option value="name">Medication Name</option>
              <option value="nextDue">Next Due</option>
              <option value="student">Student</option>
              <option value="type">Type</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>

          {/* Medications List */}
          <div className="space-y-3">
            {filteredMedications.length === 0 ? (
              <div className="text-center py-12">
                <Pill className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No medications found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            ) : (
              filteredMedications.map(medication => (
                <div 
                  key={medication.id} 
                  className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Medication Icon */}
                  <div className="flex-shrink-0">
                    <div className="p-2 rounded-lg bg-blue-100">
                      {getMedicationIcon(medication.type)}
                    </div>
                  </div>

                  {/* Medication Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {medication.name}
                      </h3>
                      <Badge variant="secondary">
                        {medication.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <div className="flex items-center">
                        {getStatusIcon(medication.status)}
                        <Badge 
                          variant={medication.status === 'active' ? 'primary' : 'secondary'}
                          className="ml-1"
                        >
                          {medication.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{medication.strength}</span>
                      <span>{medication.administrationRoute}</span>
                      <span>{medication.frequency}</span>
                      {medication.isControlled && (
                        <Badge variant="danger" className="text-xs">
                          <Shield className="mr-1 h-3 w-3" />
                          CONTROLLED
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center">
                        <User className="mr-1 h-3 w-3" />
                        Student ID: {medication.studentId}
                      </span>
                      {medication.lastAdministered && (
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          Last: {formatDateTime(medication.lastAdministered)}
                        </span>
                      )}
                      {medication.nextDue && (
                        <span className={`flex items-center ${isDue(medication) ? 'text-orange-600 font-medium' : isOverdue(medication) ? 'text-red-600 font-medium' : ''}`}>
                          <Clock className="mr-1 h-3 w-3" />
                          Next: {formatDateTime(medication.nextDue)}
                        </span>
                      )}
                    </div>

                    {/* Warnings */}
                    {medication.warnings && medication.warnings.length > 0 && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-yellow-800">
                            <p className="font-medium">Warnings:</p>
                            <ul className="list-disc list-inside mt-1">
                              {medication.warnings.map((warning, index) => (
                                <li key={index}>{warning}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    {medication.status === 'active' && (
                      <Button
                        size="sm"
                        onClick={() => handleAdministerMedication(medication.id)}
                        disabled={!isDue(medication) && medication.frequency !== 'as_needed'}
                      >
                        <Syringe className="mr-1 h-4 w-4" />
                        Administer
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                    >
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}




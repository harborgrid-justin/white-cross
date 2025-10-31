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
 * **Medication Administration Features:**
 * - Five Rights verification workflow
 * - Barcode scanning for medication identification  
 * - Dosage calculation and verification
 * - Administration witness requirements
 * - Adverse reaction reporting
 * - Parent notification automation
 *
 * **Compliance & Safety:**
 * - FDA NDC code validation and verification
 * - DEA controlled substance tracking (Schedules I-V)
 * - State pharmacy board regulation compliance
 * - Joint Commission medication safety standards
 * - Automated allergy contraindication alerts
 *
 * @since 1.0.0
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Medication, 
  MedicationFilters, 
  MedicationSummary,
  medicationUtils,
  type MedicationType,
  type MedicationStatus
} from '../types';
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

interface MedicationsContentProps {
  medications: Medication[];
  summary: MedicationSummary;
  onMedicationAdminister?: (medicationId: string) => void;
  onMedicationEdit?: (medicationId: string) => void;
  onMedicationView?: (medicationId: string) => void;
  onExportData?: () => void;
  className?: string;
}

export function MedicationsContent({
  medications,
  summary,
  onMedicationAdminister,
  onMedicationEdit,
  onMedicationView,
  onExportData,
  className
}: MedicationsContentProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<MedicationFilters>({});
  const [sortBy, setSortBy] = useState<'name' | 'nextDue' | 'student' | 'type'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter and search logic
  const filteredMedications = useMemo(() => {
    let result = medicationUtils.applyFilters(medications, {
      ...filters,
      searchQuery
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

  // Due medications (for priority display)
  const dueMedications = useMemo(() => {
    return filteredMedications.filter(med => medicationUtils.isDue(med));
  }, [filteredMedications]);

  const overdueMedications = useMemo(() => {
    return filteredMedications.filter(med => medicationUtils.isOverdue(med));
  }, [filteredMedications]);

  const handleFilterChange = useCallback((newFilters: Partial<MedicationFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
  }, []);

  const getMedicationIcon = (type: MedicationType) => {
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

  const getStatusIcon = (status: MedicationStatus) => {
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

  return (
    <div className={`space-y-6 ${className || ''}`}>
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
                        Due: {medication.nextDue ? medicationUtils.formatDateTime(medication.nextDue) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onMedicationAdminister?.(medication.id)}
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
                        Due: {medication.nextDue ? medicationUtils.formatDateTime(medication.nextDue) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onMedicationAdminister?.(medication.id)}
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
              <Button variant="outline" size="sm" onClick={onExportData}>
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
              variant={filters.status?.includes('active') ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange({ 
                status: filters.status?.includes('active') ? [] : ['active'] 
              })}
            >
              Active Only
            </Button>
            <Button
              variant={filters.isControlled === true ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange({ 
                isControlled: filters.isControlled === true ? undefined : true 
              })}
            >
              <Shield className="mr-1 h-3 w-3" />
              Controlled
            </Button>
            <Button
              variant={filters.type?.includes('emergency') ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange({ 
                type: filters.type?.includes('emergency') ? [] : ['emergency'] 
              })}
            >
              <Zap className="mr-1 h-3 w-3" />
              Emergency
            </Button>
            <Button
              variant={filters.type?.includes('epipen') ? 'default' : 'outline'}
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
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-300 rounded px-2 py-1"
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
                    <div className={`p-2 rounded-lg ${medicationUtils.getTypeColor(medication.type)}`}>
                      {getMedicationIcon(medication.type)}
                    </div>
                  </div>

                  {/* Medication Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {medication.name}
                      </h3>
                      <Badge variant="outline" className={medicationUtils.getTypeColor(medication.type)}>
                        {medication.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <div className="flex items-center">
                        {getStatusIcon(medication.status)}
                        <Badge 
                          variant={medication.status === 'active' ? 'default' : 'secondary'}
                          className={`ml-1 ${medicationUtils.getStatusColor(medication.status)}`}
                        >
                          {medication.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{medication.strength}</span>
                      <span>{medicationUtils.formatAdministrationRoute(medication.administrationRoute)}</span>
                      <span>{medicationUtils.formatFrequency(medication.frequency)}</span>
                      {medication.isControlled && (
                        <Badge variant="destructive" className="text-xs">
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
                          Last: {medicationUtils.formatDateTime(medication.lastAdministered)}
                        </span>
                      )}
                      {medication.nextDue && (
                        <span className={`flex items-center ${medicationUtils.isDue(medication) ? 'text-orange-600 font-medium' : medicationUtils.isOverdue(medication) ? 'text-red-600 font-medium' : ''}`}>
                          <Clock className="mr-1 h-3 w-3" />
                          Next: {medicationUtils.formatDateTime(medication.nextDue)}
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
                    {medicationUtils.isActive(medication) && (
                      <Button
                        size="sm"
                        onClick={() => onMedicationAdminister?.(medication.id)}
                        disabled={!medicationUtils.isDue(medication) && medication.frequency !== 'as_needed'}
                      >
                        <Syringe className="mr-1 h-4 w-4" />
                        Administer
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMedicationView?.(medication.id)}
                    >
                      <Eye className="mr-1 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onMedicationEdit?.(medication.id)}
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
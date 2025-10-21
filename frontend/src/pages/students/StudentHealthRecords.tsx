import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  Shield, 
  User, 
  Heart, 
  Pill, 
  Activity, 
  Clock, 
  Eye, 
  Edit,
  Download
} from 'lucide-react';

interface HealthRecord {
  id: string;
  studentId: string;
  studentName: string;
  recordType: 'medical_history' | 'allergy' | 'medication' | 'immunization' | 'physical_exam' | 'incident' | 'other';
  title: string;
  description: string;
  date: string;
  provider?: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string[];
  allergies?: string[];
  restrictions?: string[];
  followUpRequired: boolean;
  followUpDate?: string;
  confidentialityLevel: 'standard' | 'confidential' | 'restricted';
  attachments?: string[];
  createdBy: string;
  createdAt: string;
  lastUpdated: string;
  status: 'active' | 'resolved' | 'ongoing' | 'archived';
}

interface HealthRecordFilters {
  recordType: string;
  status: string;
  confidentialityLevel: string;
  followUpRequired: string;
  dateRange: string;
}

const StudentHealthRecords: React.FC = () => {
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<HealthRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<HealthRecordFilters>({
    recordType: '',
    status: '',
    confidentialityLevel: '',
    followUpRequired: '',
    dateRange: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [showRecordModal, setShowRecordModal] = useState(false);

  useEffect(() => {
    fetchHealthRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [records, searchTerm, filters]);

  const fetchHealthRecords = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      const mockRecords: HealthRecord[] = [
        {
          id: '1',
          studentId: 'STU001',
          studentName: 'John Smith',
          recordType: 'allergy',
          title: 'Severe Peanut Allergy',
          description: 'Student has a severe allergy to peanuts and tree nuts. Carries EpiPen at all times.',
          date: '2024-01-15',
          provider: 'Dr. Sarah Johnson, Allergist',
          diagnosis: 'IgE-mediated food allergy',
          treatment: 'Avoidance, emergency epinephrine',
          medications: ['EpiPen Auto-Injector'],
          allergies: ['Peanuts', 'Tree nuts'],
          restrictions: ['No nuts in classroom', 'Separate lunch area'],
          followUpRequired: true,
          followUpDate: '2024-06-15',
          confidentialityLevel: 'confidential',
          attachments: ['allergy_test_results.pdf'],
          createdBy: 'School Nurse',
          createdAt: '2024-01-15T10:30:00Z',
          lastUpdated: '2024-01-20T14:45:00Z',
          status: 'active'
        },
        {
          id: '2',
          studentId: 'STU001',
          studentName: 'John Smith',
          recordType: 'immunization',
          title: 'Annual Flu Vaccination',
          description: 'Student received annual influenza vaccination as part of school health program.',
          date: '2024-09-15',
          provider: 'School Health Clinic',
          treatment: 'Influenza vaccine (quadrivalent)',
          followUpRequired: false,
          confidentialityLevel: 'standard',
          createdBy: 'School Nurse',
          createdAt: '2024-09-15T11:00:00Z',
          lastUpdated: '2024-09-15T11:00:00Z',
          status: 'active'
        },
        {
          id: '3',
          studentId: 'STU002',
          studentName: 'Emma Wilson',
          recordType: 'medication',
          title: 'Daily Asthma Medication',
          description: 'Student requires daily inhaled corticosteroid and rescue inhaler for asthma management.',
          date: '2024-08-20',
          provider: 'Dr. Michael Chen, Pulmonologist',
          diagnosis: 'Mild persistent asthma',
          treatment: 'Daily controller + rescue medication',
          medications: ['Flovent HFA (morning)', 'Albuterol inhaler (as needed)'],
          restrictions: ['Modified PE activities during flare-ups'],
          followUpRequired: true,
          followUpDate: '2024-12-20',
          confidentialityLevel: 'confidential',
          createdBy: 'School Nurse',
          createdAt: '2024-08-20T09:15:00Z',
          lastUpdated: '2024-10-01T13:30:00Z',
          status: 'ongoing'
        }
      ];
      setRecords(mockRecords);
    } catch (error) {
      console.error('Error fetching health records:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterRecords = () => {
    let filtered = records;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.provider && record.provider.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.diagnosis && record.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Record type filter
    if (filters.recordType) {
      filtered = filtered.filter(record => record.recordType === filters.recordType);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(record => record.status === filters.status);
    }

    // Confidentiality level filter
    if (filters.confidentialityLevel) {
      filtered = filtered.filter(record => record.confidentialityLevel === filters.confidentialityLevel);
    }

    // Follow-up required filter
    if (filters.followUpRequired) {
      const followUpRequired = filters.followUpRequired === 'true';
      filtered = filtered.filter(record => record.followUpRequired === followUpRequired);
    }

    setFilteredRecords(filtered);
  };

  const handleViewRecord = (record: HealthRecord) => {
    setSelectedRecord(record);
    setShowRecordModal(true);
  };

  const handleEditRecord = (record: HealthRecord) => {
    // TODO: Implement edit functionality
    console.log('Editing record:', record.id);
  };

  const handleAddRecord = () => {
    setSelectedRecord(null);
    setShowRecordModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case 'allergy':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'medication':
        return <Pill className="w-5 h-5 text-blue-500" />;
      case 'immunization':
        return <Shield className="w-5 h-5 text-green-500" />;
      case 'physical_exam':
        return <Activity className="w-5 h-5 text-purple-500" />;
      case 'incident':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'medical_history':
        return <Heart className="w-5 h-5 text-pink-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      ongoing: 'bg-blue-100 text-blue-800',
      resolved: 'bg-gray-100 text-gray-800',
      archived: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getConfidentialityBadge = (level: string) => {
    const colors = {
      standard: 'bg-gray-100 text-gray-800',
      confidential: 'bg-yellow-100 text-yellow-800',
      restricted: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[level as keyof typeof colors]}`}>
        <Shield className="w-3 h-3 inline mr-1" />
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </span>
    );
  };

  const getRecordTypeLabel = (type: string) => {
    const labels = {
      medical_history: 'Medical History',
      allergy: 'Allergy',
      medication: 'Medication',
      immunization: 'Immunization',
      physical_exam: 'Physical Exam',
      incident: 'Incident',
      other: 'Other'
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Student Health Records</h1>
              <p className="mt-2 text-sm text-gray-600">
                Comprehensive health information management with HIPAA compliance
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={handleAddRecord}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Health Record
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by student name, record title, provider, or diagnosis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Record Type
                  </label>
                  <select
                    value={filters.recordType}
                    onChange={(e) => setFilters({ ...filters, recordType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Filter by record type"
                  >
                    <option value="">All Types</option>
                    <option value="allergy">Allergy</option>
                    <option value="medication">Medication</option>
                    <option value="immunization">Immunization</option>
                    <option value="physical_exam">Physical Exam</option>
                    <option value="incident">Incident</option>
                    <option value="medical_history">Medical History</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Filter by status"
                  >
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="resolved">Resolved</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confidentiality
                  </label>
                  <select
                    value={filters.confidentialityLevel}
                    onChange={(e) => setFilters({ ...filters, confidentialityLevel: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Filter by confidentiality level"
                  >
                    <option value="">All Levels</option>
                    <option value="standard">Standard</option>
                    <option value="confidential">Confidential</option>
                    <option value="restricted">Restricted</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Follow-up Required
                  </label>
                  <select
                    value={filters.followUpRequired}
                    onChange={(e) => setFilters({ ...filters, followUpRequired: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Filter by follow-up requirement"
                  >
                    <option value="">All Records</option>
                    <option value="true">Follow-up Required</option>
                    <option value="false">No Follow-up</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Filter by date range"
                  >
                    <option value="">All Dates</option>
                    <option value="last_week">Last Week</option>
                    <option value="last_month">Last Month</option>
                    <option value="last_3_months">Last 3 Months</option>
                    <option value="last_year">Last Year</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => setFilters({
                      recordType: '',
                      status: '',
                      confidentialityLevel: '',
                      followUpRequired: '',
                      dateRange: ''
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Health Records List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Health Records ({filteredRecords.length})
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredRecords.map((record) => (
              <div key={record.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getRecordTypeIcon(record.recordType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">
                            {record.title}
                          </h3>
                          <span className="text-sm text-gray-500">
                            ({getRecordTypeLabel(record.recordType)})
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                          Student: <span className="font-medium">{record.studentName}</span>
                        </p>
                        
                        <p className="text-sm text-gray-700 mb-3">
                          {record.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="font-medium">Date:</span>
                              <span className="ml-1">{formatDate(record.date)}</span>
                            </div>
                            {record.provider && (
                              <div className="flex items-center text-sm text-gray-600">
                                <User className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="font-medium">Provider:</span>
                                <span className="ml-1">{record.provider}</span>
                              </div>
                            )}
                            {record.diagnosis && (
                              <div className="flex items-center text-sm text-gray-600">
                                <FileText className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="font-medium">Diagnosis:</span>
                                <span className="ml-1">{record.diagnosis}</span>
                              </div>
                            )}
                          </div>
                          <div className="space-y-2">
                            {record.followUpRequired && record.followUpDate && (
                              <div className="flex items-center text-sm text-amber-600">
                                <Clock className="w-4 h-4 mr-2" />
                                <span className="font-medium">Follow-up:</span>
                                <span className="ml-1">{formatDate(record.followUpDate)}</span>
                              </div>
                            )}
                            {record.attachments && record.attachments.length > 0 && (
                              <div className="flex items-center text-sm text-gray-600">
                                <FileText className="w-4 h-4 mr-2 text-gray-400" />
                                <span className="font-medium">Attachments:</span>
                                <span className="ml-1">{record.attachments.length} file(s)</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {getStatusBadge(record.status)}
                          {getConfidentialityBadge(record.confidentialityLevel)}
                          {record.followUpRequired && (
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                              <Clock className="w-3 h-3 mr-1" />
                              Follow-up Required
                            </span>
                          )}
                        </div>

                        {/* Key Information Highlights */}
                        {record.allergies && record.allergies.length > 0 && (
                          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-3">
                            <p className="text-sm text-red-800">
                              <strong>Allergies:</strong> {record.allergies.join(', ')}
                            </p>
                          </div>
                        )}
                        
                        {record.medications && record.medications.length > 0 && (
                          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-3">
                            <p className="text-sm text-blue-800">
                              <strong>Medications:</strong> {record.medications.join(', ')}
                            </p>
                          </div>
                        )}

                        {record.restrictions && record.restrictions.length > 0 && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-3">
                            <p className="text-sm text-yellow-800">
                              <strong>Restrictions:</strong> {record.restrictions.join(', ')}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          Created {formatDateTime(record.createdAt)} by {record.createdBy}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewRecord(record)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="View Record"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditRecord(record)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        title="Edit Record"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredRecords.length === 0 && (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No health records found</h3>
                <p className="text-gray-500">
                  {searchTerm || Object.values(filters).some(f => f)
                    ? 'Try adjusting your search criteria or filters'
                    : 'Add the first health record to get started'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHealthRecords;

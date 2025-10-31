'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { 
  AlertTriangle, 
  FileText, 
  Users, 
  Activity,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Clock,
  Shield,
  MapPin
} from 'lucide-react';

export interface Incident {
  id: string;
  type: 'INJURY' | 'ILLNESS' | 'BEHAVIORAL' | 'SAFETY' | 'EMERGENCY';
  status: 'DRAFT' | 'PENDING_REVIEW' | 'UNDER_INVESTIGATION' | 'REQUIRES_ACTION' | 'RESOLVED' | 'ARCHIVED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  studentId: string;
  studentName: string;
  reportedBy: string;
  reportedById: string;
  incidentDate: string;
  createdAt: string;
  updatedAt: string;
  location: string;
  witnesses?: string[];
  followUpRequired: boolean;
  injuriesReported: boolean;
  medicalAttentionRequired: boolean;
  parentsNotified: boolean;
  tags: string[];
}

interface IncidentsContentProps {
  searchParams: {
    page?: string;
    limit?: string;
    type?: string;
    status?: string;
    severity?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    reportedBy?: string;
    studentId?: string;
  };
}

export function IncidentsContent({ searchParams }: IncidentsContentProps) {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '20');

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockIncidents: Incident[] = [
          {
            id: '1',
            type: 'INJURY',
            status: 'PENDING_REVIEW',
            severity: 'MEDIUM',
            title: 'Playground Fall Incident',
            description: 'Student fell from monkey bars during recess. Complained of wrist pain.',
            studentId: 'student-001',
            studentName: 'Emma Johnson',
            reportedBy: 'Sarah Wilson',
            reportedById: 'nurse-001',
            incidentDate: '2024-01-15T10:30:00Z',
            createdAt: '2024-01-15T10:45:00Z',
            updatedAt: '2024-01-15T10:45:00Z',
            location: 'Main Playground',
            witnesses: ['teacher-002', 'student-045'],
            followUpRequired: true,
            injuriesReported: true,
            medicalAttentionRequired: true,
            parentsNotified: false,
            tags: ['playground', 'injury', 'wrist'],
          },
          {
            id: '2',
            type: 'BEHAVIORAL',
            status: 'UNDER_INVESTIGATION',
            severity: 'HIGH',
            title: 'Classroom Disruption',
            description: 'Student exhibited aggressive behavior during math class, disrupting other students.',
            studentId: 'student-002',
            studentName: 'Michael Chen',
            reportedBy: 'Jennifer Davis',
            reportedById: 'teacher-003',
            incidentDate: '2024-01-15T14:15:00Z',
            createdAt: '2024-01-15T14:30:00Z',
            updatedAt: '2024-01-15T15:00:00Z',
            location: 'Room 205',
            witnesses: ['student-023', 'student-034'],
            followUpRequired: true,
            injuriesReported: false,
            medicalAttentionRequired: false,
            parentsNotified: true,
            tags: ['behavioral', 'classroom', 'aggressive'],
          },
          {
            id: '3',
            type: 'ILLNESS',
            status: 'RESOLVED',
            severity: 'LOW',
            title: 'Stomach Upset Complaint',
            description: 'Student complained of nausea and stomach pain after lunch.',
            studentId: 'student-003',
            studentName: 'Sofia Rodriguez',
            reportedBy: 'Sarah Wilson',
            reportedById: 'nurse-001',
            incidentDate: '2024-01-14T12:45:00Z',
            createdAt: '2024-01-14T13:00:00Z',
            updatedAt: '2024-01-14T16:30:00Z',
            location: 'Nurse\'s Office',
            witnesses: [],
            followUpRequired: false,
            injuriesReported: false,
            medicalAttentionRequired: false,
            parentsNotified: true,
            tags: ['illness', 'stomach', 'lunch'],
          },
          {
            id: '4',
            type: 'SAFETY',
            status: 'REQUIRES_ACTION',
            severity: 'HIGH',
            title: 'Wet Floor Hazard',
            description: 'Water leak in hallway created slippery conditions. Multiple students nearly slipped.',
            studentId: 'multiple',
            studentName: 'Multiple Students',
            reportedBy: 'Mark Thompson',
            reportedById: 'custodian-001',
            incidentDate: '2024-01-15T08:30:00Z',
            createdAt: '2024-01-15T08:45:00Z',
            updatedAt: '2024-01-15T09:15:00Z',
            location: 'Main Hallway',
            witnesses: ['teacher-001', 'teacher-004'],
            followUpRequired: true,
            injuriesReported: false,
            medicalAttentionRequired: false,
            parentsNotified: false,
            tags: ['safety', 'hazard', 'hallway', 'water'],
          },
          {
            id: '5',
            type: 'EMERGENCY',
            status: 'RESOLVED',
            severity: 'CRITICAL',
            title: 'Severe Allergic Reaction',
            description: 'Student experienced anaphylactic reaction to peanuts in cafeteria. EpiPen administered.',
            studentId: 'student-004',
            studentName: 'Alex Thompson',
            reportedBy: 'Sarah Wilson',
            reportedById: 'nurse-001',
            incidentDate: '2024-01-12T11:50:00Z',
            createdAt: '2024-01-12T12:00:00Z',
            updatedAt: '2024-01-12T18:30:00Z',
            location: 'Cafeteria',
            witnesses: ['teacher-005', 'student-067', 'cafeteria-staff-001'],
            followUpRequired: true,
            injuriesReported: true,
            medicalAttentionRequired: true,
            parentsNotified: true,
            tags: ['emergency', 'allergic-reaction', 'epipen', 'cafeteria'],
          },
        ];
        
        // Apply filters
        let filteredIncidents = mockIncidents;
        
        if (searchParams.type) {
          filteredIncidents = filteredIncidents.filter(incident => 
            incident.type === searchParams.type
          );
        }
        
        if (searchParams.status) {
          filteredIncidents = filteredIncidents.filter(incident => 
            incident.status === searchParams.status
          );
        }
        
        if (searchParams.severity) {
          filteredIncidents = filteredIncidents.filter(incident => 
            incident.severity === searchParams.severity
          );
        }
        
        if (searchParams.search) {
          const searchTerm = searchParams.search.toLowerCase();
          filteredIncidents = filteredIncidents.filter(incident =>
            incident.title.toLowerCase().includes(searchTerm) ||
            incident.description.toLowerCase().includes(searchTerm) ||
            incident.studentName.toLowerCase().includes(searchTerm) ||
            incident.location.toLowerCase().includes(searchTerm)
          );
        }
        
        setIncidents(filteredIncidents);
        setTotalCount(filteredIncidents.length);
      } catch (error) {
        console.error('Error fetching incidents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIncidents();
  }, [searchParams]);

  const getStatusColor = (status: Incident['status']) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'PENDING_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_INVESTIGATION': return 'bg-blue-100 text-blue-800';
      case 'REQUIRES_ACTION': return 'bg-orange-100 text-orange-800';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'ARCHIVED': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: Incident['severity']) => {
    switch (severity) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Incident['type']) => {
    switch (type) {
      case 'INJURY': return <AlertTriangle className="h-4 w-4" />;
      case 'ILLNESS': return <Activity className="h-4 w-4" />;
      case 'BEHAVIORAL': return <Users className="h-4 w-4" />;
      case 'SAFETY': return <Shield className="h-4 w-4" />;
      case 'EMERGENCY': return <AlertTriangle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>

        {/* Filters Skeleton */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>

        {/* Content Skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 5 }, (_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incident Reports</h1>
          <p className="text-gray-600">
            Showing {incidents.length} of {totalCount} incidents
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Incident
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">
                {incidents.filter(i => i.status === 'PENDING_REVIEW').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Under Investigation</p>
              <p className="text-2xl font-bold text-blue-600">
                {incidents.filter(i => i.status === 'UNDER_INVESTIGATION').length}
              </p>
            </div>
            <Search className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Requires Action</p>
              <p className="text-2xl font-bold text-orange-600">
                {incidents.filter(i => i.status === 'REQUIRES_ACTION').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Critical Incidents</p>
              <p className="text-2xl font-bold text-red-600">
                {incidents.filter(i => i.severity === 'CRITICAL').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {incidents.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No incidents found
            </h3>
            <p className="text-gray-600 mb-4">
              No incidents match your current filters.
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create First Incident
            </Button>
          </Card>
        ) : (
          incidents.map((incident) => (
            <Card key={incident.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getTypeIcon(incident.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {incident.title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      {incident.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {incident.studentName}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {incident.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(incident.incidentDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Badge className={getSeverityColor(incident.severity)}>
                    {incident.severity}
                  </Badge>
                  <Badge className={getStatusColor(incident.status)}>
                    {incident.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {incident.followUpRequired && (
                    <Badge variant="outline" className="text-blue-600">
                      Follow-up Required
                    </Badge>
                  )}
                  {incident.medicalAttentionRequired && (
                    <Badge variant="outline" className="text-red-600">
                      Medical Attention
                    </Badge>
                  )}
                  {incident.parentsNotified && (
                    <Badge variant="outline" className="text-green-600">
                      Parents Notified
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalCount > limit && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} incidents
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={page * limit >= totalCount}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  FileText, 
  Heart, 
  Activity, 
  Pill,
  Plus,
  Calendar,
  Clock,
  AlertTriangle,
  Stethoscope,
  RefreshCw,
  Eye,
  Bell,
  TrendingUp,
  Shield,
  BookOpen,
  Search
} from 'lucide-react';

interface HealthRecordsSidebarProps {
  searchParams: {
    page?: string;
    limit?: string;
    type?: string;
    status?: string;
    priority?: string;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    studentId?: string;
  };
}

interface HealthRecordsStats {
  total: number;
  active: number;
  pendingReview: number;
  archived: number;
  criticalPriority: number;
  followUpsRequired: number;
  confidentialRecords: number;
  expiringRecords: number;
  medicalHistory: number;
  physicalExams: number;
  immunizations: number;
  allergies: number;
  medications: number;
  vitalSigns: number;
  growthCharts: number;
  screenings: number;
}

export function HealthRecordsSidebar({ searchParams }: HealthRecordsSidebarProps) {
  const [stats, setStats] = useState<HealthRecordsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const mockStats: HealthRecordsStats = {
          total: 1247,
          active: 892,
          pendingReview: 23,
          archived: 332,
          criticalPriority: 8,
          followUpsRequired: 45,
          confidentialRecords: 156,
          expiringRecords: 12,
          medicalHistory: 245,
          physicalExams: 189,
          immunizations: 423,
          allergies: 78,
          medications: 134,
          vitalSigns: 267,
          growthCharts: 156,
          screenings: 89,
        };
        
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching health records stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [searchParams]);

  const recentRecords = [
    {
      id: '1',
      title: 'Annual Physical Exam',
      studentName: 'Emma Johnson',
      type: 'PHYSICAL_EXAM',
      status: 'ACTIVE',
      priority: 'MEDIUM',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      title: 'Severe Peanut Allergy',
      studentName: 'Michael Chen',
      type: 'ALLERGY',
      status: 'ACTIVE',
      priority: 'HIGH',
      timestamp: '4 hours ago',
    },
    {
      id: '3',
      title: 'Vision Screening',
      studentName: 'Sofia Rodriguez',
      type: 'SCREENING',
      status: 'PENDING_REVIEW',
      priority: 'MEDIUM',
      timestamp: '6 hours ago',
    },
  ];

  const upcomingActions = [
    {
      id: '1',
      action: 'Schedule ophthalmology follow-up',
      student: 'Maya Patel',
      dueDate: 'Today',
      priority: 'HIGH',
      type: 'FOLLOW_UP',
    },
    {
      id: '2',
      action: 'Review immunization records',
      student: 'Alex Thompson',
      dueDate: 'Tomorrow',
      priority: 'MEDIUM',
      type: 'REVIEW',
    },
    {
      id: '3',
      action: 'Update medication dosage',
      student: 'Sofia Rodriguez',
      dueDate: 'This Week',
      priority: 'MEDIUM',
      type: 'MEDICATION',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'text-green-600 bg-green-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      case 'HIGH': return 'text-orange-600 bg-orange-50';
      case 'CRITICAL': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'MEDICAL_HISTORY': return <FileText className="h-4 w-4" />;
      case 'PHYSICAL_EXAM': return <Stethoscope className="h-4 w-4" />;
      case 'IMMUNIZATION': return <Heart className="h-4 w-4" />;
      case 'ALLERGY': return <AlertTriangle className="h-4 w-4" />;
      case 'MEDICATION': return <Pill className="h-4 w-4" />;
      case 'VITAL_SIGNS': return <Activity className="h-4 w-4" />;
      case 'SCREENING': return <Eye className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Card className="p-4">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 16 }, (_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Health Records Statistics */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Records Overview
            </h3>
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          {stats && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.total}
                </div>
                <div className="text-xs text-gray-600">Total Records</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-600">
                  {stats.active}
                </div>
                <div className="text-xs text-gray-600">Active</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pendingReview}
                </div>
                <div className="text-xs text-gray-600">Pending Review</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-red-600">
                  {stats.criticalPriority}
                </div>
                <div className="text-xs text-gray-600">Critical</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-orange-600">
                  {stats.followUpsRequired}
                </div>
                <div className="text-xs text-gray-600">Follow-ups Due</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-purple-600">
                  {stats.confidentialRecords}
                </div>
                <div className="text-xs text-gray-600">Confidential</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-pink-600">
                  {stats.expiringRecords}
                </div>
                <div className="text-xs text-gray-600">Expiring Soon</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-gray-600">
                  {stats.archived}
                </div>
                <div className="text-xs text-gray-600">Archived</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Record Types Breakdown */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Record Types
            </h3>
          </div>
          
          {stats && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-lg font-bold text-blue-600">
                  {stats.medicalHistory}
                </div>
                <div className="text-xs text-gray-600">Medical History</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-green-600">
                  {stats.physicalExams}
                </div>
                <div className="text-xs text-gray-600">Physical Exams</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-purple-600">
                  {stats.immunizations}
                </div>
                <div className="text-xs text-gray-600">Immunizations</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-red-600">
                  {stats.allergies}
                </div>
                <div className="text-xs text-gray-600">Allergies</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-orange-600">
                  {stats.medications}
                </div>
                <div className="text-xs text-gray-600">Medications</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-cyan-600">
                  {stats.vitalSigns}
                </div>
                <div className="text-xs text-gray-600">Vital Signs</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-indigo-600">
                  {stats.growthCharts}
                </div>
                <div className="text-xs text-gray-600">Growth Charts</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-teal-600">
                  {stats.screenings}
                </div>
                <div className="text-xs text-gray-600">Screenings</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Recent Records */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Records
            </h3>
            <Badge variant="info">
              {recentRecords.length}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {recentRecords.map((record) => (
              <div key={record.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(record.type)}
                    <span className="font-medium text-gray-900 text-sm">
                      {record.title}
                    </span>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={getPriorityColor(record.priority)}
                  >
                    {record.priority}
                  </Badge>
                </div>
                <div className="text-sm text-gray-600 mb-1">
                  {record.studentName}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {record.timestamp}
                  </span>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <Button variant="ghost" size="sm" className="w-full text-sm">
            View All Recent
          </Button>
        </div>
      </Card>

      {/* Upcoming Actions */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Upcoming Actions
            </h3>
            <Badge variant="warning">
              {upcomingActions.filter(action => action.priority === 'HIGH').length}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {upcomingActions.map((action) => (
              <div key={action.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <Badge 
                    variant="secondary"
                    className={getPriorityColor(action.priority)}
                  >
                    {action.priority} Priority
                  </Badge>
                  <span className="text-xs text-gray-500">{action.dueDate}</span>
                </div>
                <div className="text-sm text-gray-900 mb-1 font-medium">
                  {action.action}
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  Student: {action.student}
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  <Calendar className="h-3 w-3 mr-1" />
                  Schedule Action
                </Button>
              </div>
            ))}
          </div>
          
          <Button variant="ghost" size="sm" className="w-full text-sm">
            View All Actions
          </Button>
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Quick Actions
          </h3>
          
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Add Health Record
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Stethoscope className="h-4 w-4 mr-2" />
              Schedule Physical
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Search className="h-4 w-4 mr-2" />
              Advanced Search
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Generate Reports
            </Button>
          </div>
        </div>
      </Card>

      {/* System Status */}
      <Card className="p-4">
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Status
          </h3>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Health Records Database</span>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>HIPAA Compliance</span>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Data Encryption</span>
              <Badge variant="success">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Backup Systems</span>
              <Badge variant="success">Ready</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
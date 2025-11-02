'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Pill, 
  Clock, 
  AlertTriangle,
  Plus,
  Calendar,
  Shield,
  Eye,
  RefreshCw,
  Thermometer,
  Siren
} from 'lucide-react';

interface MedicationsSidebarProps {
  searchParams: {
    page?: string;
    limit?: string;
    type?: string;
    status?: string;
    search?: string;
    studentId?: string;
    category?: string;
    dueDate?: string;
  };
}

interface MedicationStats {
  totalActive: number;
  dueToday: number;
  overdue: number;
  lowStock: number;
  expiringSoon: number;
  controlledSubstances: number;
  emergencyMedications: number;
  missedDoses: number;
}

export function MedicationsSidebar({ searchParams }: MedicationsSidebarProps) {
  const [stats, setStats] = useState<MedicationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call with mock data
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const mockStats: MedicationStats = {
          totalActive: 247,
          dueToday: 18,
          overdue: 3,
          lowStock: 5,
          expiringSoon: 12,
          controlledSubstances: 23,
          emergencyMedications: 31,
          missedDoses: 2,
        };
        
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching medication stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [searchParams]);

  const criticalAlerts = [
    {
      id: '1',
      type: 'overdue',
      message: 'Sarah Johnson - Albuterol inhaler overdue by 2 hours',
      priority: 'high',
      timestamp: '2 hours ago',
    },
    {
      id: '2',
      type: 'low_stock',
      message: 'Epinephrine auto-injectors - Only 2 remaining',
      priority: 'high',
      timestamp: '30 minutes ago',
    },
    {
      id: '3',
      type: 'expiring',
      message: 'Insulin vials expiring in 3 days',
      priority: 'medium',
      timestamp: '1 hour ago',
    },
  ];

  const dueMedications = [
    {
      id: '1',
      studentName: 'Emma Davis',
      medication: 'Methylphenidate 10mg',
      dueTime: '12:00 PM',
      isLate: false,
    },
    {
      id: '2',
      studentName: 'Michael Chen',
      medication: 'Albuterol 2 puffs',
      dueTime: '11:30 AM',
      isLate: true,
    },
    {
      id: '3',
      studentName: 'Sofia Rodriguez',
      medication: 'Insulin 4 units',
      dueTime: '12:15 PM',
      isLate: false,
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Card className="p-4">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 8 }, (_, i) => (
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
      {/* Medication Statistics */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Medication Overview
            </h3>
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          
          {stats && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalActive}
                </div>
                <div className="text-xs text-gray-600">Active Medications</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-green-600">
                  {stats.dueToday}
                </div>
                <div className="text-xs text-gray-600">Due Today</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-red-600">
                  {stats.overdue}
                </div>
                <div className="text-xs text-gray-600">Overdue</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.lowStock}
                </div>
                <div className="text-xs text-gray-600">Low Stock</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-orange-600">
                  {stats.expiringSoon}
                </div>
                <div className="text-xs text-gray-600">Expiring Soon</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-purple-600">
                  {stats.controlledSubstances}
                </div>
                <div className="text-xs text-gray-600">Controlled</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-indigo-600">
                  {stats.emergencyMedications}
                </div>
                <div className="text-xs text-gray-600">Emergency</div>
              </div>
              
              <div className="space-y-1">
                <div className="text-lg font-bold text-gray-600">
                  {stats.missedDoses}
                </div>
                <div className="text-xs text-gray-600">Missed Doses</div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Critical Alerts */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Critical Alerts
            </h3>
            <Badge variant="danger">
              {criticalAlerts.filter(alert => alert.priority === 'high').length}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {criticalAlerts.map((alert) => (
              <div key={alert.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <Badge 
                    variant="secondary"
                    className={getPriorityColor(alert.priority)}
                  >
                    {alert.priority} priority
                  </Badge>
                  <span className="text-xs text-gray-500">{alert.timestamp}</span>
                </div>
                <div className="text-sm text-gray-900 mb-2">
                  {alert.message}
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
              </div>
            ))}
          </div>
          
          <Button variant="ghost" size="sm" className="w-full text-sm">
            View All Alerts
          </Button>
        </div>
      </Card>

      {/* Due Medications */}
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Due Now
            </h3>
            <Badge variant="info">
              {dueMedications.length}
            </Badge>
          </div>
          
          <div className="space-y-3">
            {dueMedications.map((med) => (
              <div key={med.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 text-sm">
                    {med.studentName}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    med.isLate ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {med.dueTime}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {med.medication}
                </div>
                <Button variant="default" size="sm" className="w-full">
                  {med.isLate ? 'Administer Now' : 'Record Administration'}
                </Button>
              </div>
            ))}
          </div>
          
          <Button variant="ghost" size="sm" className="w-full text-sm">
            View Full Schedule
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
              Add Medication
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Siren className="h-4 w-4 mr-2" />
              Emergency Administration
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Shield className="h-4 w-4 mr-2" />
              Controlled Substances
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Administration Schedule
            </Button>
            
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Thermometer className="h-4 w-4 mr-2" />
              Temperature Log
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
              <span>Medication Database</span>
              <Badge variant="success">Online</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Drug Interaction Checker</span>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Controlled Substance Tracking</span>
              <Badge variant="success">Compliant</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Backup Systems</span>
              <Badge variant="warning">Maintenance</Badge>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}




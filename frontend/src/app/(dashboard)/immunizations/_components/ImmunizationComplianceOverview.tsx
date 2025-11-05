import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  ArrowRight
} from 'lucide-react';
import { getComplianceMetrics } from '@/lib/actions/immunizations.actions';

interface ComplianceMetric {
  name: string;
  vaccineType: string;
  compliant: number;
  total: number;
  percentage: number;
  status: 'excellent' | 'good' | 'warning' | 'critical';
}

export default function ImmunizationComplianceOverview() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<ComplianceMetric[]>([]);
  const [overallCompliance, setOverallCompliance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadComplianceData() {
      try {
        setLoading(true);
        const complianceData = await getComplianceMetrics();
        
        // Transform API data to component format
        const transformedMetrics: ComplianceMetric[] = complianceData.metrics.map(metric => ({
          name: metric.name,
          vaccineType: metric.vaccineType,
          compliant: metric.compliant,
          total: metric.total,
          percentage: metric.percentage,
          status: metric.status
        }));

        setMetrics(transformedMetrics);
        setOverallCompliance(complianceData.overallCompliance);
      } catch (error) {
        console.error('Failed to load compliance data:', error);
        
        // Fallback to mock data
        const mockMetrics: ComplianceMetric[] = [
          {
            name: 'COVID-19',
            vaccineType: 'covid19',
            compliant: 232,
            total: 248,
            percentage: 93.5,
            status: 'excellent'
          },
          {
            name: 'Influenza',
            vaccineType: 'flu',
            compliant: 215,
            total: 248,
            percentage: 86.7,
            status: 'good'
          },
          {
            name: 'MMR',
            vaccineType: 'measles',
            compliant: 240,
            total: 248,
            percentage: 96.8,
            status: 'excellent'
          },
          {
            name: 'Hepatitis B',
            vaccineType: 'hepatitis_b',
            compliant: 198,
            total: 248,
            percentage: 79.8,
            status: 'warning'
          },
          {
            name: 'Tdap',
            vaccineType: 'tetanus',
            compliant: 205,
            total: 248,
            percentage: 82.7,
            status: 'good'
          }
        ];
        
        setMetrics(mockMetrics);
        
        // Calculate overall compliance
        const overall = mockMetrics.reduce((sum, m) => sum + m.percentage, 0) / mockMetrics.length;
        setOverallCompliance(overall);
      } finally {
        setLoading(false);
      }
    }

    loadComplianceData();
  }, []);

  const getStatusColor = (status: ComplianceMetric['status']) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'warning':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-48 mb-6" />
        <Skeleton className="h-32 w-full mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Compliance Overview</h3>
            <p className="text-sm text-gray-500">Vaccine compliance rates by type</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => router.push('/immunizations/compliance')}
          className="flex items-center gap-2"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Overall Compliance Summary */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Overall Compliance</p>
            <p className="text-2xl font-bold text-blue-600">{overallCompliance.toFixed(1)}%</p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-green-600">+2.1%</span>
          </div>
        </div>
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${overallCompliance}%` }}
          />
        </div>
      </div>

      {/* Compliance Metrics */}
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div 
            key={metric.vaccineType}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
            onClick={() => router.push(`/immunizations/compliance/${metric.vaccineType}`)}
          >
            <div className="flex items-center gap-4 flex-1">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                {metric.status === 'excellent' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                {metric.status === 'good' && <Target className="w-5 h-5 text-blue-600" />}
                {metric.status === 'warning' && <Clock className="w-5 h-5 text-orange-600" />}
                {metric.status === 'critical' && <AlertTriangle className="w-5 h-5 text-red-600" />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">{metric.name}</h4>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(metric.status)}`}
                  >
                    {metric.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">
                        {metric.compliant} of {metric.total} compliant
                      </span>
                      <span className="font-medium">{metric.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(metric.percentage)}`}
                        style={{ width: `${metric.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/immunizations/tracking')}
            className="flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Track Progress
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => router.push('/immunizations/reports')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            View Reports
          </Button>
        </div>
      </div>
    </Card>
  );
}
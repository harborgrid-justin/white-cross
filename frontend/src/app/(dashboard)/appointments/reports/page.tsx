import { Suspense } from 'react';
import { PageHeader } from '@/components/layouts/PageHeader';
import { Container } from '@/components/layouts/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { API_ENDPOINTS } from '@/lib/api-client';

interface ReportsPageProps {
  searchParams: {
    period?: 'week' | 'month' | 'quarter' | 'year';
    start?: string;
    end?: string;
  };
}

interface AppointmentStats {
  total: number;
  scheduled: number;
  completed: number;
  cancelled: number;
  noShow: number;
  completionRate: number;
  cancellationRate: number;
  noShowRate: number;
}

interface ProviderStats {
  providerId: string;
  providerName: string;
  totalAppointments: number;
  completedAppointments: number;
  averageDuration: number;
  completionRate: number;
}

interface ReportData {
  appointmentStats: AppointmentStats;
  providerStats: ProviderStats[];
  dailyTrends: Array<{
    date: string;
    scheduled: number;
    completed: number;
    cancelled: number;
  }>;
  appointmentTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
}

/**
 * Fetch report data
 */
async function fetchReportData(params: ReportsPageProps['searchParams']): Promise<ReportData> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const url = `${baseUrl}${API_ENDPOINTS.APPOINTMENTS.REPORTS}`;
  
  try {
    const queryParams = new URLSearchParams();
    if (params.period) queryParams.set('period', params.period);
    if (params.start) queryParams.set('start', params.start);
    if (params.end) queryParams.set('end', params.end);

    const response = await fetch(`${url}?${queryParams}`, {
      next: {
        revalidate: 3600, // Cache for 1 hour
        tags: ['appointments', 'reports'],
      },
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.API_KEY && { 'x-api-key': process.env.API_KEY }),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch report data: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching report data:', error);
    
    // Return mock data for development
    return {
      appointmentStats: {
        total: 0,
        scheduled: 0,
        completed: 0,
        cancelled: 0,
        noShow: 0,
        completionRate: 0,
        cancellationRate: 0,
        noShowRate: 0,
      },
      providerStats: [],
      dailyTrends: [],
      appointmentTypes: [],
    };
  }
}

function ReportsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-8 w-full mb-2" />
              <Skeleton className="h-12 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, className = '' }: {
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="text-sm font-medium text-gray-600 mb-1">{title}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {subtitle && <div className="text-sm text-gray-500 mt-1">{subtitle}</div>}
      </CardContent>
    </Card>
  );
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const period = searchParams.period || 'month';
  const reportData = await fetchReportData(searchParams);

  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <Container>
      <PageHeader
        title="Appointment Reports & Analytics"
        description="Comprehensive analytics and reports for appointment management"
      />

      <div className="space-y-6">
        {/* Period Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Report Period</CardTitle>
          </CardHeader>
          <CardContent>
            <form method="GET" className="flex flex-wrap gap-4 items-end">
              <div>
                <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
                  Period
                </label>
                <select
                  id="period"
                  name="period"
                  defaultValue={period}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="quarter">This Quarter</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="start" className="block text-sm font-medium text-gray-700 mb-1">
                  Custom Start Date
                </label>
                <input
                  type="date"
                  id="start"
                  name="start"
                  defaultValue={searchParams.start}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="end" className="block text-sm font-medium text-gray-700 mb-1">
                  Custom End Date
                </label>
                <input
                  type="date"
                  id="end"
                  name="end"
                  defaultValue={searchParams.end}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update Report
              </button>
            </form>
          </CardContent>
        </Card>

        <Suspense fallback={<ReportsSkeleton />}>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Appointments"
              value={reportData.appointmentStats.total}
              subtitle="All appointments in period"
            />
            <StatCard
              title="Completion Rate"
              value={formatPercentage(reportData.appointmentStats.completionRate)}
              subtitle={`${reportData.appointmentStats.completed} completed`}
              className="border-green-200"
            />
            <StatCard
              title="Cancellation Rate"
              value={formatPercentage(reportData.appointmentStats.cancellationRate)}
              subtitle={`${reportData.appointmentStats.cancelled} cancelled`}
              className="border-yellow-200"
            />
            <StatCard
              title="No-Show Rate"
              value={formatPercentage(reportData.appointmentStats.noShowRate)}
              subtitle={`${reportData.appointmentStats.noShow} no-shows`}
              className="border-red-200"
            />
          </div>

          {/* Charts and Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Daily Appointment Trends</CardTitle>
              </CardHeader>
              <CardContent>
                {reportData.dailyTrends.length > 0 ? (
                  <div className="space-y-4">
                    {reportData.dailyTrends.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium">
                          {new Date(day.date).toLocaleDateString()}
                        </div>
                        <div className="flex gap-4 text-sm">
                          <span className="text-blue-600">Scheduled: {day.scheduled}</span>
                          <span className="text-green-600">Completed: {day.completed}</span>
                          <span className="text-red-600">Cancelled: {day.cancelled}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No trend data available for the selected period
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Appointment Types */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {reportData.appointmentTypes.length > 0 ? (
                  <div className="space-y-3">
                    {reportData.appointmentTypes.map((type, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                          />
                          <span className="font-medium">{type.type}</span>
                        </div>
                        <div className="flex gap-4">
                          <span className="text-sm text-gray-600">{type.count}</span>
                          <span className="text-sm font-medium">{type.percentage.toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No appointment type data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Provider Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Provider Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {reportData.providerStats.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium text-gray-700">Provider</th>
                        <th className="text-left p-3 font-medium text-gray-700">Total Appointments</th>
                        <th className="text-left p-3 font-medium text-gray-700">Completed</th>
                        <th className="text-left p-3 font-medium text-gray-700">Completion Rate</th>
                        <th className="text-left p-3 font-medium text-gray-700">Avg Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.providerStats.map((provider, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{provider.providerName}</td>
                          <td className="p-3">{provider.totalAppointments}</td>
                          <td className="p-3">{provider.completedAppointments}</td>
                          <td className="p-3">{formatPercentage(provider.completionRate)}</td>
                          <td className="p-3">{provider.averageDuration} min</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No provider performance data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card>
            <CardHeader>
              <CardTitle>Export Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                  Export to Excel
                </button>
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                  Export to PDF
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Email Report
                </button>
              </div>
            </CardContent>
          </Card>
        </Suspense>
      </div>
    </Container>
  );
}

export const metadata = {
  title: 'Appointment Reports & Analytics',
  description: 'Comprehensive analytics and reports for appointment management',
};

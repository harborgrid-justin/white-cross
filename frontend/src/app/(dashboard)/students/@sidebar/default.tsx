import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export default function DefaultSidebar() {
  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Student Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Students</span>
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Present Today</span>
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Health Alerts</span>
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Medications Due</span>
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Link
            href="/students/new"
            className="block w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
          >
            Add New Student
          </Link>
          <Link
            href="/students/reports"
            className="block w-full px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 text-center"
          >
            Generate Reports
          </Link>
          <Link
            href="/students/search"
            className="block w-full px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 text-center"
          >
            Advanced Search
          </Link>
          <a
            href="/health-records"
            className="block w-full px-3 py-2 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 text-center"
          >
            Health Records
          </a>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 min-w-0">
                  <Skeleton className="h-3 w-full mb-1" />
                  <Skeleton className="h-2 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-orange-600">Health Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="p-2 bg-orange-50 border border-orange-200 rounded-md">
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-2 w-2/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export default function DefaultSidebar() {
  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Today's Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Scheduled</span>
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Completed</span>
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Remaining</span>
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
          <a
            href="/appointments/new"
            className="block w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 text-center"
          >
            New Appointment
          </a>
          <a
            href="/appointments/calendar"
            className="block w-full px-3 py-2 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-700 text-center"
          >
            View Calendar
          </a>
          <a
            href="/appointments/search"
            className="block w-full px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 text-center"
          >
            Search Appointments
          </a>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Next Appointments</CardTitle>
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
    </div>
  );
}

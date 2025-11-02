import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DefaultSidebar() {
  return (
    <div className="space-y-4">
      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Report Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Generated Today</span>
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Pending</span>
              <Skeleton className="h-4 w-8" />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Scheduled</span>
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-8 w-8 rounded" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-2 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {['Health Records', 'Immunizations', 'Attendance', 'Incidents', 'Compliance'].map((type) => (
              <div key={type} className="flex items-center justify-between p-2 rounded bg-gray-50">
                <span className="text-xs text-gray-600">{type}</span>
                <Skeleton className="h-3 w-6" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-8 w-full rounded" />
            <Skeleton className="h-8 w-full rounded" />
            <Skeleton className="h-8 w-full rounded" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



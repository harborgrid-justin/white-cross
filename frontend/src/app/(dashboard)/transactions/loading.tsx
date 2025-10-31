import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export default function TransactionsLoading() {
  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>

          {/* Filters Bar */}
          <Card className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex-1 min-w-64">
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-36" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
            
            {/* Advanced Filters */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1" />
                    <Skeleton className="h-10 flex-1" />
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Transactions Table */}
          <Card>
            <div className="p-6">
              {/* Table Header */}
              <div className="grid grid-cols-7 gap-4 pb-4 border-b border-gray-200">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-18" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>

              {/* Table Rows */}
              <div className="space-y-4 pt-4">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="grid grid-cols-7 gap-4 items-center py-3">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-6 w-18 rounded-full" />
                    <Skeleton className="h-4 w-16" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="flex gap-1">
                      <Skeleton className="h-8 w-8 rounded" />
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20" />
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Skeleton key={i} className="h-8 w-8" />
                      ))}
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l border-gray-200 p-6 space-y-6">
        {/* Financial Summary */}
        <Card className="p-4">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-12" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-14" />
                <Skeleton className="h-4 w-18" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-4">
          <div className="space-y-4">
            <Skeleton className="h-6 w-28" />
            <div className="space-y-3">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Pending Reviews */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-4">
          <div className="space-y-4">
            <Skeleton className="h-6 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </Card>

        {/* Monthly Revenue Chart */}
        <Card className="p-4">
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-2">
              <div className="flex items-end gap-2 h-32">
                {Array.from({ length: 6 }, (_, i) => {
                  const heights = ['20%', '45%', '70%', '35%', '60%', '85%'];
                  return (
                    <div key={i} className="flex-1 flex items-end">
                      <Skeleton 
                        className="w-full" 
                        style={{ height: heights[i] }}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between">
                {Array.from({ length: 6 }, (_, i) => (
                  <Skeleton key={i} className="h-3 w-8" />
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
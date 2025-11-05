import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface UserMonitoringLayoutProps {
  children: React.ReactNode;
}

export default function UserMonitoringLayout({ children }: UserMonitoringLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">User Monitoring</h1>
        <p className="text-gray-600 mt-1">Monitor user activity, sessions, and engagement metrics</p>
      </div>
      
      <Suspense fallback={<div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full" />)}</div>}>
        {children}
      </Suspense>
    </div>
  );
}

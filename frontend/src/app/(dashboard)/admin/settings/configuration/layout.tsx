import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ConfigurationLayoutProps {
  children: React.ReactNode;
}

export default function ConfigurationLayout({ children }: ConfigurationLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-900">Configuration</h1>
        <p className="text-gray-600 mt-1">Manage system configuration and settings</p>
      </div>
      
      <Suspense fallback={<div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full" />)}</div>}>
        {children}
      </Suspense>
    </div>
  );
}

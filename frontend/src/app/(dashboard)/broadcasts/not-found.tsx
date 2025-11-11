import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Radio } from 'lucide-react';

export default function BroadcastsNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-gray-100 p-3">
            <Radio className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Broadcast Not Found
        </h2>
        <p className="text-gray-600">
          The broadcast message you&apos;re looking for doesn&apos;t exist or has been removed.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link href="/broadcasts">View All Broadcasts</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

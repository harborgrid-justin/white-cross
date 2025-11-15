import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[30vh]">
      <div className="text-center space-y-4 max-w-sm">
        <div className="flex justify-center">
          <div className="rounded-full bg-gray-100 p-2">
            <User className="h-6 w-6 text-gray-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">
          Content Not Found
        </h3>
        <p className="text-gray-600 text-sm">
          The profile content you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button size="sm" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>
    </div>
  );
}

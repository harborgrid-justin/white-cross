import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';

export default function BillingNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-gray-100 p-3">
            <CreditCard className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Billing Page Not Found
        </h2>
        <p className="text-gray-600">
          The billing page you&apos;re looking for doesn&apos;t exist.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild>
            <Link href="/settings/billing">Billing</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/settings">Settings</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
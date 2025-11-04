/**
 * @fileoverview Communications Not Found Page
 * @module app/(dashboard)/communications/not-found
 * @category Communications - Pages
 */

import Link from 'next/link';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function CommunicationsNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="max-w-md w-full mx-4">
        <div className="p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <MessageCircle className="w-8 h-8 text-blue-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Communication Not Found
          </h1>
          
          <p className="text-gray-600 mb-8">
            The communication or message you&apos;re looking for doesn&apos;t exist or may have been deleted.
          </p>
          
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href="/dashboard/communications">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Communications
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard">
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

/**
 * New Broadcast Content Component
 *
 * Client component for creating broadcasts
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BroadcastForm } from '@/components/features/communication/components/BroadcastForm';

export function NewBroadcastContent() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">New Broadcast</h1>
          <p className="text-muted-foreground mt-1">
            Create a new broadcast announcement
          </p>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Broadcast Details</CardTitle>
        </CardHeader>
        <CardContent>
          <BroadcastForm
            onSuccess={() => router.push('/communications/broadcasts')}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </div>
  );
}



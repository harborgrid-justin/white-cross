/**
 * Compose Content Component
 *
 * Client component for message composition
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Label } from '@/components/ui/Label';
import { MessageComposer } from '@/components/communications/MessageComposer';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';

export function ComposeContent() {
  const router = useRouter();
  const [recipientIds, setRecipientIds] = useState<string[]>([]);
  const [recipientSearch, setRecipientSearch] = useState('');

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
          <h1 className="text-3xl font-bold">Compose Message</h1>
          <p className="text-muted-foreground mt-1">
            Send a new message
          </p>
        </div>
      </div>

      {/* Composer */}
      <Card>
        <CardHeader>
          <CardTitle>New Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recipients */}
          <div className="space-y-2">
            <Label htmlFor="recipients">Recipients</Label>
            <Input
              id="recipients"
              placeholder="Search for users..."
              value={recipientSearch}
              onChange={(e) => setRecipientSearch(e.target.value)}
            />
            {recipientIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {recipientIds.map(id => (
                  <Badge key={id} variant="secondary">
                    User {id}
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Start typing to search for users
            </p>
          </div>

          {/* Message Composer */}
          <MessageComposer
            recipientIds={recipientIds}
            onSent={() => router.push('/communications')}
            onCancel={() => router.back()}
          />
        </CardContent>
      </Card>
    </div>
  );
}

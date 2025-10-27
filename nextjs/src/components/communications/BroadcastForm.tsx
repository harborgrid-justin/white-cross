'use client';

/**
 * Broadcast Form Component
 *
 * Form for creating and editing broadcasts
 */

'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { createBroadcast, updateBroadcast } from '@/lib/actions/communications.actions';
import {
  CreateBroadcastSchema,
  type CreateBroadcastInput,
  type Broadcast,
  type BroadcastPriority,
  type BroadcastCategory,
  type AudienceType
} from '@/lib/validations/broadcast.schemas';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface BroadcastFormProps {
  broadcast?: Broadcast;
  onSuccess?: (broadcast: Broadcast) => void;
  onCancel?: () => void;
}

export function BroadcastForm({ broadcast, onSuccess, onCancel }: BroadcastFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateBroadcastInput>({
    resolver: zodResolver(CreateBroadcastSchema),
    defaultValues: broadcast ? {
      title: broadcast.title,
      message: broadcast.message,
      category: broadcast.category,
      priority: broadcast.priority,
      audience: broadcast.audience,
      channels: broadcast.channels,
      requireAcknowledgment: broadcast.requireAcknowledgment,
      allowReplies: broadcast.allowReplies,
      containsPhi: broadcast.containsPhi
    } : {
      title: '',
      message: '',
      category: 'announcement',
      priority: 'normal',
      audience: {
        type: 'all',
        includeInactive: false
      },
      channels: {
        inApp: true,
        email: false,
        sms: false,
        push: false
      },
      requireAcknowledgment: false,
      allowReplies: false,
      containsPhi: false,
      scheduled: false
    }
  });

  const onSubmit = async (data: CreateBroadcastInput) => {
    setIsSubmitting(true);

    const result = broadcast
      ? await updateBroadcast({ id: broadcast.id, ...data })
      : await createBroadcast(data);

    if (result.success && result.data) {
      toast({
        title: broadcast ? 'Broadcast updated' : 'Broadcast created',
        description: broadcast
          ? 'Your broadcast has been updated successfully'
          : 'Your broadcast has been created and will be sent'
      });

      onSuccess?.(result.data);
      if (!onSuccess) {
        router.push('/communications/broadcasts');
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to save broadcast'
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter broadcast title..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="health">Health</SelectItem>
                  <SelectItem value="policy">Policy</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Priority */}
        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your broadcast message..."
                  rows={8}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Audience Type */}
        <FormField
          control={form.control}
          name="audience.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Audience</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="roles">By Roles</SelectItem>
                  <SelectItem value="schools">By Schools</SelectItem>
                  <SelectItem value="grades">By Grades</SelectItem>
                  <SelectItem value="students">Specific Students</SelectItem>
                  <SelectItem value="guardians">Guardians</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="custom">Custom Selection</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select who should receive this broadcast
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Delivery Channels */}
        <div className="space-y-3">
          <Label>Delivery Channels</Label>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="channels.inApp"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    In-App Notification
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="channels.email"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Email
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="channels.sms"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    SMS
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="channels.push"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Push Notification
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <Label>Options</Label>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="requireAcknowledgment"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Require Acknowledgment
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="allowReplies"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Allow Replies
                  </FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="containsPhi"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    Contains PHI (Protected Health Information)
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {broadcast ? 'Update Broadcast' : 'Create Broadcast'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

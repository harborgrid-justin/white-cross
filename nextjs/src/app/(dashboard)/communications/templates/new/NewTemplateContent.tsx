/**
 * New Template Content Component
 *
 * Client component for creating templates
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createTemplate } from '@/lib/actions/communications.actions';
import {
  CreateTemplateSchema,
  type CreateTemplateInput
} from '@/lib/validations/template.schemas';
import { useToast } from '@/hooks/use-toast';

export function NewTemplateContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [variables, setVariables] = useState<Array<{ key: string; label: string; required: boolean }>>([]);

  const form = useForm<CreateTemplateInput>({
    resolver: zodResolver(CreateTemplateSchema),
    defaultValues: {
      name: '',
      description: '',
      type: 'message',
      category: 'general',
      subject: '',
      body: '',
      variables: [],
      tags: [],
      isPublic: false,
      isSystem: false
    }
  });

  const addVariable = () => {
    setVariables([...variables, { key: '', label: '', required: false }]);
  };

  const removeVariable = (index: number) => {
    setVariables(variables.filter((_, i) => i !== index));
  };

  const updateVariable = (index: number, field: string, value: any) => {
    const updated = [...variables];
    updated[index] = { ...updated[index], [field]: value };
    setVariables(updated);
  };

  const onSubmit = async (data: CreateTemplateInput) => {
    const result = await createTemplate({
      ...data,
      variables: variables.map(v => ({
        key: v.key,
        label: v.label,
        required: v.required,
        type: 'text' as const
      }))
    });

    if (result.success) {
      toast({
        title: 'Template created',
        description: 'Your template has been created successfully'
      });
      router.push('/communications/templates');
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to create template'
      });
    }
  };

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
          <h1 className="text-3xl font-bold">New Template</h1>
          <p className="text-muted-foreground mt-1">
            Create a new reusable message template
          </p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter template name..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter template description..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type and Category */}
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="message">Message</SelectItem>
                          <SelectItem value="broadcast">Broadcast</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="emergency">Emergency</SelectItem>
                          <SelectItem value="appointment">Appointment</SelectItem>
                          <SelectItem value="medication">Medication</SelectItem>
                          <SelectItem value="incident">Incident</SelectItem>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="announcement">Announcement</SelectItem>
                          <SelectItem value="reminder">Reminder</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Subject */}
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter subject..." {...field} />
                    </FormControl>
                    <FormDescription>
                      Use variables like {'{student_name}'} or {'{appointment_date}'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Body */}
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter template body..."
                        rows={10}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Use variables like {'{student_name}'} or {'{appointment_date}'}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Options */}
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">
                        Make this template public (available to all users)
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Variables */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Variables</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addVariable}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variable
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {variables.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No variables added. Variables allow dynamic content in your templates.
                </p>
              ) : (
                <div className="space-y-4">
                  {variables.map((variable, index) => (
                    <div key={index} className="flex items-end gap-4 p-4 border rounded-lg">
                      <div className="flex-1 grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Key</label>
                          <Input
                            placeholder="variable_name"
                            value={variable.key}
                            onChange={(e) => updateVariable(index, 'key', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Label</label>
                          <Input
                            placeholder="Variable Name"
                            value={variable.label}
                            onChange={(e) => updateVariable(index, 'label', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Required</label>
                          <div className="flex items-center h-10">
                            <Checkbox
                              checked={variable.required}
                              onCheckedChange={(checked) => updateVariable(index, 'required', checked)}
                            />
                          </div>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVariable(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Create Template
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

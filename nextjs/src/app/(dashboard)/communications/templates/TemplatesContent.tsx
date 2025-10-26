/**
 * Templates Content Component
 *
 * Client component for template library
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, Filter, FileText, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  getTemplates,
  deleteTemplate,
  duplicateTemplate
} from '@/lib/actions/communications.actions';
import type { Template, TemplateType, TemplateCategory } from '@/lib/validations/template.schemas';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export function TemplatesContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TemplateType | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | 'all'>('all');

  useEffect(() => {
    loadTemplates();
  }, [typeFilter, categoryFilter]);

  const loadTemplates = async () => {
    setIsLoading(true);

    const result = await getTemplates({
      type: typeFilter !== 'all' ? typeFilter : undefined,
      category: categoryFilter !== 'all' ? categoryFilter : undefined,
      search: searchQuery || undefined,
      limit: 100,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });

    if (result.success && result.data) {
      setTemplates(result.data.templates);
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to load templates'
      });
    }

    setIsLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadTemplates();
  };

  const handleDuplicate = async (templateId: string) => {
    const result = await duplicateTemplate(templateId);

    if (result.success) {
      toast({
        title: 'Template duplicated',
        description: 'A copy of the template has been created'
      });
      loadTemplates();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to duplicate template'
      });
    }
  };

  const handleDelete = async (templateId: string, isSystem: boolean) => {
    if (isSystem) {
      toast({
        variant: 'destructive',
        title: 'Cannot delete',
        description: 'System templates cannot be deleted'
      });
      return;
    }

    const result = await deleteTemplate(templateId);

    if (result.success) {
      toast({
        title: 'Template deleted',
        description: 'The template has been deleted'
      });
      loadTemplates();
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error || 'Failed to delete template'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage reusable message templates
          </p>
        </div>
        <Button onClick={() => router.push('/communications/templates/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </form>

        {/* Type Filter */}
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TemplateType | 'all')}>
          <SelectTrigger className="w-40">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="message">Message</SelectItem>
            <SelectItem value="broadcast">Broadcast</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
          </SelectContent>
        </Select>

        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as TemplateCategory | 'all')}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="health">Health</SelectItem>
            <SelectItem value="emergency">Emergency</SelectItem>
            <SelectItem value="appointment">Appointment</SelectItem>
            <SelectItem value="medication">Medication</SelectItem>
            <SelectItem value="incident">Incident</SelectItem>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="announcement">Announcement</SelectItem>
            <SelectItem value="reminder">Reminder</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No templates</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Create your first template to get started
            </p>
            <Button
              className="mt-4"
              onClick={() => router.push('/communications/templates/new')}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map(template => (
            <Card
              key={template.id}
              className="cursor-pointer hover:bg-accent transition-colors group"
              onClick={() => router.push(`/communications/templates/${template.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="truncate">{template.name}</CardTitle>
                    {template.description && (
                      <CardDescription className="line-clamp-2 mt-1">
                        {template.description}
                      </CardDescription>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">{template.type}</Badge>
                  <Badge variant="secondary">{template.category}</Badge>
                  {template.isSystem && <Badge>System</Badge>}
                  {template.isPublic && <Badge variant="outline">Public</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>
                    <p>By {template.createdByName}</p>
                    <p className="text-xs">
                      {template.usageCount} uses
                      {template.lastUsedAt && ` • Last used ${format(new Date(template.lastUsedAt), 'PP')}`}
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDuplicate(template.id)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    {!template.isSystem && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDelete(template.id, template.isSystem)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

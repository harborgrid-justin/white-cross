/**
 * Message Templates Component
 *
 * Template browser and selector with preview and variable substitution
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit,
  Copy,
  Trash2,
  Eye,
  MoreVertical,
  Star,
  Lock,
  Globe,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Template, TemplateCategory } from '@/lib/validations/template.schemas';
import { deleteTemplateAction, duplicateTemplateAction } from '@/lib/actions/communications.actions';
import { toast } from 'sonner';

interface MessageTemplatesProps {
  templates: Template[];
  onSelect?: (template: Template) => void;
  onRefresh?: () => Promise<void>;
  selectable?: boolean;
  className?: string;
}

export function MessageTemplates({
  templates: initialTemplates,
  onSelect,
  onRefresh,
  selectable = false,
  className
}: MessageTemplatesProps) {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | 'all'>('all');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Filter and search templates
  const filteredTemplates = useMemo(() => {
    let result = [...templates];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.subject.toLowerCase().includes(query) ||
        t.body.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(t => t.category === categoryFilter);
    }

    // Sort by usage count (most used first), then by name
    result.sort((a, b) => {
      if (b.usageCount !== a.usageCount) {
        return b.usageCount - a.usageCount;
      }
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [templates, searchQuery, categoryFilter]);

  // Group templates by category
  const groupedTemplates = useMemo(() => {
    const groups: Record<string, Template[]> = {};

    filteredTemplates.forEach(template => {
      const category = template.category || 'general';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(template);
    });

    return groups;
  }, [filteredTemplates]);

  const handleView = (template: Template) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };

  const handleSelect = (template: Template) => {
    if (selectable && onSelect) {
      onSelect(template);
    } else {
      router.push(`/communications/compose?template=${template.id}`);
    }
  };

  const handleEdit = (template: Template) => {
    router.push(`/communications/templates/${template.id}/edit`);
  };

  const handleDuplicate = async (template: Template) => {
    try {
      await duplicateTemplateAction({ templateId: template.id });
      await onRefresh?.();
      toast.success('Template duplicated');
    } catch (error) {
      toast.error('Failed to duplicate template');
    }
  };

  const handleDelete = async (template: Template) => {
    try {
      await deleteTemplateAction({ templateId: template.id });
      setTemplates(prev => prev.filter(t => t.id !== template.id));
      toast.success('Template deleted');
    } catch (error) {
      toast.error('Failed to delete template');
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      health: '🏥',
      emergency: '🚨',
      appointment: '📅',
      medication: '💊',
      incident: '⚠️',
      general: '📝',
      announcement: '📢',
      reminder: '⏰'
    };
    return icons[category] || '📝';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      health: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      emergency: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      appointment: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      medication: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      incident: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      general: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      announcement: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      reminder: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return colors[category] || colors.general;
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Message Templates</h2>
          <p className="text-muted-foreground mt-1">
            Browse and select pre-made message templates
          </p>
        </div>
        <Button onClick={() => router.push('/communications/templates/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as TemplateCategory | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
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
      {Object.keys(groupedTemplates).length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No templates found</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {searchQuery || categoryFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first template to get started'}
            </p>
            <Button onClick={() => router.push('/communications/templates/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
            <div key={category}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{getCategoryIcon(category)}</span>
                <h3 className="text-lg font-semibold capitalize">{category}</h3>
                <Badge variant="secondary">{categoryTemplates.length}</Badge>
              </div>

              {/* Templates Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={cn(
                      'transition-all hover:shadow-md cursor-pointer',
                      selectable && 'hover:border-primary'
                    )}
                    onClick={() => handleSelect(template)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base truncate">
                            {template.name}
                          </CardTitle>
                          {template.description && (
                            <CardDescription className="line-clamp-2 mt-1">
                              {template.description}
                            </CardDescription>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleView(template);
                            }}>
                              <Eye className="h-4 w-4 mr-2" />
                              Preview
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleSelect(template);
                            }}>
                              <ChevronRight className="h-4 w-4 mr-2" />
                              Use Template
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(template);
                            }}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicate(template);
                            }}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(template);
                              }}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Template Info */}
                      <div className="flex items-center gap-2 mt-3">
                        <Badge className={getCategoryColor(template.category)}>
                          {template.category}
                        </Badge>
                        {template.isPublic ? (
                          <Badge variant="outline">
                            <Globe className="h-3 w-3 mr-1" />
                            Public
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            <Lock className="h-3 w-3 mr-1" />
                            Private
                          </Badge>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent>
                      {/* Subject Preview */}
                      <p className="text-sm font-medium text-muted-foreground mb-2">Subject:</p>
                      <p className="text-sm truncate mb-3">{template.subject}</p>

                      {/* Body Preview */}
                      <p className="text-sm font-medium text-muted-foreground mb-2">Message:</p>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {template.body.replace(/<[^>]*>/g, '')}
                      </p>

                      {/* Variables */}
                      {template.variables && template.variables.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                          <p className="text-xs text-muted-foreground mb-2">Variables:</p>
                          <div className="flex flex-wrap gap-1">
                            {template.variables.map((variable) => (
                              <Badge key={variable.key} variant="secondary" className="text-xs">
                                {variable.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Usage Count */}
                      <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                        Used {template.usageCount} times
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{previewTemplate?.name}</DialogTitle>
            {previewTemplate?.description && (
              <DialogDescription>{previewTemplate.description}</DialogDescription>
            )}
          </DialogHeader>
          {previewTemplate && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                {/* Subject */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Subject:</p>
                  <p className="font-medium">{previewTemplate.subject}</p>
                </div>

                {/* Body */}
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Message:</p>
                  <div
                    className="prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: previewTemplate.body }}
                  />
                </div>

                {/* Variables */}
                {previewTemplate.variables && previewTemplate.variables.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Variables:</p>
                    <div className="space-y-2">
                      {previewTemplate.variables.map((variable) => (
                        <div key={variable.key} className="flex items-start gap-2 text-sm">
                          <Badge variant="secondary">{variable.label}</Badge>
                          <div>
                            <p className="font-medium">${{{variable.key}}}</p>
                            {variable.description && (
                              <p className="text-muted-foreground">{variable.description}</p>
                            )}
                            {variable.defaultValue && (
                              <p className="text-xs text-muted-foreground">
                                Default: {variable.defaultValue}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            {previewTemplate && (
              <Button onClick={() => {
                handleSelect(previewTemplate);
                setShowPreview(false);
              }}>
                Use Template
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

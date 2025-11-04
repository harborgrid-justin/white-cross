'use client';

import React, { useState } from 'react';
import { 
  FileText,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  Copy,
  Eye,
  Star,
  StarOff,
  MoreVertical,
  Grid,
  List,
  Calendar,
  User,
  Clock,
  Tag,
  Share2,
  Settings,
  CheckCircle,
  AlertCircle,
  Info,
  X,
  Save,
  RefreshCw,
  FolderOpen,
  Database,
  BarChart3,
  PieChart,
  LineChart,
  Table
} from 'lucide-react';

/**
 * Template category types
 */
type TemplateCategory = 'clinical' | 'financial' | 'operational' | 'compliance' | 'patient-satisfaction' | 'custom';

/**
 * Template complexity levels
 */
type TemplateComplexity = 'simple' | 'intermediate' | 'advanced';

/**
 * Template data source types
 */
type DataSource = 'students' | 'medications' | 'appointments' | 'communications' | 'health-records' | 'billing' | 'compliance';

/**
 * Chart configuration for templates
 */
interface ChartConfig {
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'table';
  title: string;
  xAxis?: string;
  yAxis?: string;
  groupBy?: string;
  aggregate?: 'count' | 'sum' | 'avg' | 'min' | 'max';
}

/**
 * Report template interface
 */
interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  complexity: TemplateComplexity;
  dataSources: DataSource[];
  fields: string[];
  filters: Record<string, unknown>[];
  charts: ChartConfig[];
  tags: string[];
  isPublic: boolean;
  isFavorite: boolean;
  isBuiltIn: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  usageCount: number;
  rating: number;
  version: string;
  thumbnail?: string;
  previewData?: unknown[];
}

/**
 * Template folder interface
 */
interface TemplateFolder {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  templateCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Props for the ReportTemplates component
 */
interface ReportTemplatesProps {
  /** List of report templates */
  templates?: ReportTemplate[];
  /** Template folders */
  folders?: TemplateFolder[];
  /** Loading state */
  loading?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Create template handler */
  onCreateTemplate?: (template: Omit<ReportTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'rating'>) => void;
  /** Update template handler */
  onUpdateTemplate?: (id: string, updates: Partial<ReportTemplate>) => void;
  /** Delete template handler */
  onDeleteTemplate?: (id: string) => void;
  /** Duplicate template handler */
  onDuplicateTemplate?: (id: string) => void;
  /** Use template handler */
  onUseTemplate?: (id: string) => void;
  /** Preview template handler */
  onPreviewTemplate?: (id: string) => void;
  /** Import template handler */
  onImportTemplate?: (file: File) => void;
  /** Export template handler */
  onExportTemplate?: (id: string) => void;
  /** Toggle favorite handler */
  onToggleFavorite?: (id: string, isFavorite: boolean) => void;
  /** Share template handler */
  onShareTemplate?: (id: string) => void;
  /** Create folder handler */
  onCreateFolder?: (folder: Omit<TemplateFolder, 'id' | 'templateCount' | 'createdAt' | 'updatedAt'>) => void;
}

/**
 * ReportTemplates Component
 * 
 * A comprehensive report templates management component that allows users to
 * browse, create, edit, and organize report templates. Supports categorization,
 * favoriting, sharing, and template marketplace functionality.
 * 
 * @param props - ReportTemplates component props
 * @returns JSX element representing the report templates interface
 */
const ReportTemplates = ({
  templates = [],
  folders = [],
  loading = false,
  className = '',
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  onUseTemplate,
  onPreviewTemplate,
  onImportTemplate,
  onExportTemplate,
  onToggleFavorite,
  onShareTemplate,
  onCreateFolder
}: ReportTemplatesProps) => {
  // State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<TemplateCategory | 'all'>('all');
  const [complexityFilter, setComplexityFilter] = useState<TemplateComplexity | 'all'>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  // New template form state
  const [newTemplate, setNewTemplate] = useState<Partial<ReportTemplate>>({
    name: '',
    description: '',
    category: 'operational',
    complexity: 'simple',
    dataSources: [],
    fields: [],
    filters: [],
    charts: [],
    tags: [],
    isPublic: false,
    isFavorite: false,
    isBuiltIn: false,
    version: '1.0'
  });

  /**
   * Gets category display info
   */
  const getCategoryInfo = (category: TemplateCategory) => {
    const categoryConfig = {
      clinical: { label: 'Clinical', color: 'bg-blue-100 text-blue-800', icon: FileText },
      financial: { label: 'Financial', color: 'bg-green-100 text-green-800', icon: BarChart3 },
      operational: { label: 'Operational', color: 'bg-purple-100 text-purple-800', icon: Settings },
      compliance: { label: 'Compliance', color: 'bg-red-100 text-red-800', icon: CheckCircle },
      'patient-satisfaction': { label: 'Patient Satisfaction', color: 'bg-yellow-100 text-yellow-800', icon: Star },
      custom: { label: 'Custom', color: 'bg-gray-100 text-gray-800', icon: User }
    };
    return categoryConfig[category];
  };

  /**
   * Gets complexity badge styling
   */
  const getComplexityBadge = (complexity: TemplateComplexity) => {
    const complexityConfig = {
      simple: { bg: 'bg-green-100', text: 'text-green-800', label: 'Simple' },
      intermediate: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Intermediate' },
      advanced: { bg: 'bg-red-100', text: 'text-red-800', label: 'Advanced' }
    };

    const config = complexityConfig[complexity];
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  /**
   * Formats date string
   */
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  /**
   * Renders star rating
   */
  const renderStarRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-3 h-3 ${i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
        />
      );
    }
    return <div className="flex items-center space-x-0.5">{stars}</div>;
  };

  /**
   * Filters templates based on search and filters
   */
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    const matchesComplexity = complexityFilter === 'all' || template.complexity === complexityFilter;
    const matchesFavorites = !showFavoritesOnly || template.isFavorite;
    
    return matchesSearch && matchesCategory && matchesComplexity && matchesFavorites;
  });

  /**
   * Handles template action
   */
  const handleTemplateAction = (action: string, template: ReportTemplate) => {
    switch (action) {
      case 'use':
        onUseTemplate?.(template.id);
        break;
      case 'preview':
        setSelectedTemplate(template);
        onPreviewTemplate?.(template.id);
        setShowPreviewModal(true);
        break;
      case 'edit':
        setSelectedTemplate(template);
        setNewTemplate(template);
        setShowCreateModal(true);
        break;
      case 'duplicate':
        onDuplicateTemplate?.(template.id);
        break;
      case 'export':
        onExportTemplate?.(template.id);
        break;
      case 'share':
        onShareTemplate?.(template.id);
        break;
      case 'favorite':
        onToggleFavorite?.(template.id, !template.isFavorite);
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this template?')) {
          onDeleteTemplate?.(template.id);
        }
        break;
    }
  };

  /**
   * Handles create template
   */
  const handleCreateTemplate = () => {
    if (newTemplate.name && onCreateTemplate) {
      onCreateTemplate(newTemplate as Omit<ReportTemplate, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'rating'>);
      setShowCreateModal(false);
      setNewTemplate({
        name: '',
        description: '',
        category: 'operational',
        complexity: 'simple',
        dataSources: [],
        fields: [],
        filters: [],
        charts: [],
        tags: [],
        isPublic: false,
        isFavorite: false,
        isBuiltIn: false,
        version: '1.0'
      });
    }
  };

  /**
   * Handles file import
   */
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImportTemplate) {
      onImportTemplate(file);
      setShowImportModal(false);
    }
  };

  return (
    <div className={`bg-white ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Report Templates</h1>
            <p className="text-gray-600 mt-1">
              Browse, create, and manage report templates for quick report generation
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowImportModal(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 
                       bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                       bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Template
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md 
                           leading-5 bg-white placeholder-gray-500 focus:outline-none 
                           focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 
                           focus:border-blue-500 sm:text-sm"
                  placeholder="Search templates..."
                  aria-label="Search templates"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategoryFilter(e.target.value as TemplateCategory | 'all')}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm 
                         focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Filter by category"
              >
                <option value="all">All Categories</option>
                <option value="clinical">Clinical</option>
                <option value="financial">Financial</option>
                <option value="operational">Operational</option>
                <option value="compliance">Compliance</option>
                <option value="patient-satisfaction">Patient Satisfaction</option>
                <option value="custom">Custom</option>
              </select>
              
              <select
                value={complexityFilter}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setComplexityFilter(e.target.value as TemplateComplexity | 'all')}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm 
                         focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Filter by complexity"
              >
                <option value="all">All Levels</option>
                <option value="simple">Simple</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border
                         ${showFavoritesOnly 
                           ? 'text-yellow-700 bg-yellow-50 border-yellow-300' 
                           : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                         }`}
              aria-label="Show favorites only"
            >
              <Star className={`w-4 h-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`} />
              Favorites
            </button>
          </div>
          
          <div className="flex items-center space-x-2 border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 text-blue-700' : 'text-gray-400 hover:text-gray-600'}`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Templates Content */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || categoryFilter !== 'all' || complexityFilter !== 'all' || showFavoritesOnly
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first report template'
              }
            </p>
            {!searchTerm && categoryFilter === 'all' && complexityFilter === 'all' && !showFavoritesOnly && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700 
                         bg-blue-100 border border-transparent rounded-md hover:bg-blue-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredTemplates.map((template) => {
              const categoryInfo = getCategoryInfo(template.category);
              const CategoryIcon = categoryInfo.icon;
              
              if (viewMode === 'grid') {
                return (
                  <div key={template.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    {/* Template Thumbnail */}
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-t-lg relative">
                      {template.thumbnail ? (
                        <img
                          src={template.thumbnail}
                          alt={`${template.name} preview`}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-32 bg-gradient-to-br from-blue-50 to-blue-100">
                          <CategoryIcon className="w-8 h-8 text-blue-600" />
                        </div>
                      )}
                      
                      {/* Favorite Button */}
                      <button
                        onClick={() => handleTemplateAction('favorite', template)}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:shadow-md"
                        aria-label={template.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star className={`w-4 h-4 ${template.isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} />
                      </button>
                      
                      {/* Built-in Badge */}
                      {template.isBuiltIn && (
                        <div className="absolute top-2 left-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Built-in
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* Template Info */}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate pr-2">{template.name}</h3>
                        <div className="flex items-center space-x-1">
                          {getComplexityBadge(template.complexity)}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{template.description}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryInfo.color}`}>
                          {categoryInfo.label}
                        </span>
                        {renderStarRating(template.rating)}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{template.usageCount} uses</span>
                        <span>{formatDate(template.updatedAt)}</span>
                      </div>
                      
                      {/* Tags */}
                      {template.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {template.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                          {template.tags.length > 3 && (
                            <span className="text-xs text-gray-500">+{template.tags.length - 3} more</span>
                          )}
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleTemplateAction('use', template)}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium 
                                   text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                        >
                          Use Template
                        </button>
                        
                        <button
                          onClick={() => handleTemplateAction('preview', template)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
                          title="Preview template"
                          aria-label="Preview template"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <div className="relative">
                          <button
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
                            title="More options"
                            aria-label="More options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                // List view
                return (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
                          <CategoryIcon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-medium text-gray-900">{template.name}</h3>
                            {getComplexityBadge(template.complexity)}
                            {template.isBuiltIn && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Built-in
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>{template.usageCount} uses</span>
                            <span>•</span>
                            <span>{template.dataSources.length} data sources</span>
                            <span>•</span>
                            <span>{formatDate(template.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleTemplateAction('favorite', template)}
                          className="p-2 text-gray-400 hover:text-yellow-500"
                          title={template.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                          aria-label={template.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star className={`w-4 h-4 ${template.isFavorite ? 'text-yellow-400 fill-current' : ''}`} />
                        </button>
                        
                        <button
                          onClick={() => handleTemplateAction('use', template)}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-white 
                                   bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                        >
                          Use Template
                        </button>
                        
                        <button
                          onClick={() => handleTemplateAction('preview', template)}
                          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
                          title="Preview template"
                          aria-label="Preview template"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedTemplate ? 'Edit Template' : 'Create New Template'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedTemplate(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={newTemplate.name || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter template name"
                  aria-label="Template name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newTemplate.description || ''}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe this template"
                  aria-label="Template description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newTemplate.category || 'operational'}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewTemplate(prev => ({ ...prev, category: e.target.value as TemplateCategory }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md 
                             focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Template category"
                  >
                    <option value="clinical">Clinical</option>
                    <option value="financial">Financial</option>
                    <option value="operational">Operational</option>
                    <option value="compliance">Compliance</option>
                    <option value="patient-satisfaction">Patient Satisfaction</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Complexity
                  </label>
                  <select
                    value={newTemplate.complexity || 'simple'}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewTemplate(prev => ({ ...prev, complexity: e.target.value as TemplateComplexity }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md 
                             focus:ring-blue-500 focus:border-blue-500"
                    aria-label="Template complexity"
                  >
                    <option value="simple">Simple</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={newTemplate.tags?.join(', ') || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                    setNewTemplate(prev => ({ ...prev, tags }));
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md 
                           focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter tags separated by commas"
                  aria-label="Template tags"
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newTemplate.isPublic || false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTemplate(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Make this template public</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newTemplate.isFavorite || false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTemplate(prev => ({ ...prev, isFavorite: e.target.checked }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Add to favorites</span>
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setSelectedTemplate(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border 
                         border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTemplate}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                         border border-transparent rounded-md hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2 inline" />
                {selectedTemplate ? 'Update Template' : 'Create Template'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Import Template</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label="Close import modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <label className="block">
                  <span className="text-sm font-medium text-gray-900">Choose a template file</span>
                  <input
                    type="file"
                    accept=".json,.xml,.csv"
                    onChange={handleFileImport}
                    className="sr-only"
                  />
                  <span className="block text-sm text-gray-500 mt-1">
                    Support for JSON, XML, and CSV files
                  </span>
                </label>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border 
                         border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Preview - {selectedTemplate.name}
              </h3>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setSelectedTemplate(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600"
                aria-label="Close preview modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Template Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <span className="text-gray-900">{getCategoryInfo(selectedTemplate.category).label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Complexity:</span>
                      <span className="text-gray-900">{selectedTemplate.complexity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Data Sources:</span>
                      <span className="text-gray-900">{selectedTemplate.dataSources.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Fields:</span>
                      <span className="text-gray-900">{selectedTemplate.fields.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Charts:</span>
                      <span className="text-gray-900">{selectedTemplate.charts.length}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Usage Statistics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Usage Count:</span>
                      <span className="text-gray-900">{selectedTemplate.usageCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Rating:</span>
                      <div className="flex items-center space-x-1">
                        {renderStarRating(selectedTemplate.rating)}
                        <span className="text-gray-900">({selectedTemplate.rating})</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Created:</span>
                      <span className="text-gray-900">{formatDate(selectedTemplate.createdAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Updated:</span>
                      <span className="text-gray-900">{formatDate(selectedTemplate.updatedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedTemplate.previewData && selectedTemplate.previewData.length > 0 ? (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Sample Data</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {selectedTemplate.fields.slice(0, 5).map((field, index) => (
                            <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {field}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedTemplate.previewData.slice(0, 5).map((row, index) => (
                          <tr key={index}>
                            {selectedTemplate.fields.slice(0, 5).map((field, fieldIndex) => (
                              <td key={fieldIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {String((row as Record<string, unknown>)[field] || '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Table className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No preview data available</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setSelectedTemplate(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border 
                         border-gray-300 rounded-md hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleTemplateAction('use', selectedTemplate);
                  setShowPreviewModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 
                         border border-transparent rounded-md hover:bg-blue-700"
              >
                Use This Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTemplates;

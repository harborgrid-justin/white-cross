/**
 * TemplateLibrary Component
 *
 * Main browsing interface for report templates with grid/list views,
 * search, and filtering capabilities.
 */

import React, { useState } from 'react';
import {
  Search,
  Star,
  Grid,
  List,
  RefreshCw,
  FileText,
  Plus,
  Eye,
  MoreVertical
} from 'lucide-react';
import { ReportTemplate, ViewMode } from './types';
import { TemplateCategories } from './TemplateCategories';
import { TemplateMetadata } from './TemplateMetadata';
import { getCategoryInfo, renderComplexityBadge } from './utils';
import { useTemplateFilters } from './hooks';

/**
 * Props for the TemplateLibrary component
 */
export interface TemplateLibraryProps {
  /** List of report templates */
  templates: ReportTemplate[];
  /** Loading state */
  loading?: boolean;
  /** Template action handler */
  onTemplateAction: (action: string, template: ReportTemplate) => void;
  /** Create new template handler */
  onCreateTemplate: () => void;
  /** Custom CSS classes */
  className?: string;
}

/**
 * TemplateLibrary Component
 *
 * Provides the main interface for browsing and managing report templates
 * with support for search, filtering, and multiple view modes.
 *
 * @param props - TemplateLibrary component props
 * @returns JSX element representing the template library interface
 */
export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({
  templates,
  loading = false,
  onTemplateAction,
  onCreateTemplate,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    complexityFilter,
    setComplexityFilter,
    showFavoritesOnly,
    setShowFavoritesOnly,
    filteredTemplates
  } = useTemplateFilters(templates);

  const renderGridView = (template: ReportTemplate) => {
    const categoryInfo = getCategoryInfo(template.category);
    const CategoryIcon = categoryInfo.icon;

    return (
      <div
        key={template.id}
        className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
      >
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
            onClick={() => onTemplateAction('favorite', template)}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:shadow-md"
            aria-label={
              template.isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
          >
            <Star
              className={`w-4 h-4 ${template.isFavorite ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
            />
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
            <h3 className="text-lg font-medium text-gray-900 truncate pr-2">
              {template.name}
            </h3>
            <div className="flex items-center space-x-1">
              {renderComplexityBadge(template.complexity)}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {template.description}
          </p>

          <TemplateMetadata template={template} compact />

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 mt-4">
            <button
              onClick={() => onTemplateAction('use', template)}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium
                       text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Use Template
            </button>

            <button
              onClick={() => onTemplateAction('preview', template)}
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
  };

  const renderListView = (template: ReportTemplate) => {
    const categoryInfo = getCategoryInfo(template.category);
    const CategoryIcon = categoryInfo.icon;

    return (
      <div
        key={template.id}
        className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-lg ${categoryInfo.color}`}>
              <CategoryIcon className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {template.name}
                </h3>
                {renderComplexityBadge(template.complexity)}
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
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onTemplateAction('favorite', template)}
              className="p-2 text-gray-400 hover:text-yellow-500"
              title={
                template.isFavorite
                  ? 'Remove from favorites'
                  : 'Add to favorites'
              }
              aria-label={
                template.isFavorite
                  ? 'Remove from favorites'
                  : 'Add to favorites'
              }
            >
              <Star
                className={`w-4 h-4 ${template.isFavorite ? 'text-yellow-400 fill-current' : ''}`}
              />
            </button>

            <button
              onClick={() => onTemplateAction('use', template)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white
                       bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              Use Template
            </button>

            <button
              onClick={() => onTemplateAction('preview', template)}
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
  };

  return (
    <div className={className}>
      {/* Filters and Search */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSearchTerm(e.target.value)
                  }
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md
                           leading-5 bg-white placeholder-gray-500 focus:outline-none
                           focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500
                           focus:border-blue-500 sm:text-sm"
                  placeholder="Search templates..."
                  aria-label="Search templates"
                />
              </div>
            </div>

            {/* Category and Complexity Filters */}
            <TemplateCategories
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              complexityFilter={complexityFilter}
              onComplexityChange={setComplexityFilter}
            />

            {/* Favorites Toggle */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md border
                         ${showFavoritesOnly ? 'text-yellow-700 bg-yellow-50 border-yellow-300' : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'}`}
              aria-label="Show favorites only"
            >
              <Star
                className={`w-4 h-4 mr-2 ${showFavoritesOnly ? 'fill-current' : ''}`}
              />
              Favorites
            </button>
          </div>

          {/* View Mode Toggle */}
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No templates found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ||
              categoryFilter !== 'all' ||
              complexityFilter !== 'all' ||
              showFavoritesOnly
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first report template'}
            </p>
            {!searchTerm &&
              categoryFilter === 'all' &&
              complexityFilter === 'all' &&
              !showFavoritesOnly && (
                <button
                  onClick={onCreateTemplate}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-700
                           bg-blue-100 border border-transparent rounded-md hover:bg-blue-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </button>
              )}
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredTemplates.map((template) =>
              viewMode === 'grid'
                ? renderGridView(template)
                : renderListView(template)
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateLibrary;

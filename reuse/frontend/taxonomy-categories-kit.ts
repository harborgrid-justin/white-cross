/**
 * @fileoverview Taxonomy and Categorization Kit - Production-ready functions for taxonomy management,
 * categories, tags, and term organization with hierarchical support.
 *
 * @module reuse/frontend/taxonomy-categories-kit
 * @version 1.0.0
 *
 * @description
 * Enterprise-grade toolkit for building taxonomy systems, category hierarchies, tag management,
 * and term organization. Includes 40+ functions for CRUD operations, hierarchical navigation,
 * filtering, bulk operations, and permissions.
 *
 * Features:
 * - Complete type definitions for taxonomies, categories, tags, and terms
 * - React hooks for taxonomy data management
 * - Display components (trees, lists, grids, clouds)
 * - Input components (selectors, pickers, autocomplete)
 * - CRUD operations with validation
 * - Hierarchical category management
 * - Tag management and bulk operations
 * - Advanced filtering and search
 * - Analytics and statistics
 * - Permissions and access control
 *
 * @example
 * ```tsx
 * import {
 *   useTaxonomy,
 *   CategoryTree,
 *   TagInput,
 *   TaxonomyBuilder
 * } from '@/reuse/frontend/taxonomy-categories-kit';
 *
 * // Use in components
 * const { categories, loading } = useTaxonomy('products');
 * ```
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';

/* ============================================================================
 * TYPE DEFINITIONS
 * ========================================================================== */

/**
 * Base term interface - foundation for all taxonomy elements
 */
export interface Term {
  id: string;
  name: string;
  slug: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Category with hierarchical support
 */
export interface Category extends Term {
  parentId?: string;
  children?: Category[];
  level: number;
  path: string[]; // Array of ancestor IDs
  order: number;
  count?: number; // Number of items in this category
  icon?: string;
  color?: string;
  isActive: boolean;
}

/**
 * Tag for flexible categorization
 */
export interface Tag extends Term {
  count: number; // Usage count
  color?: string;
  isPopular?: boolean;
  category?: string; // Optional grouping
}

/**
 * Taxonomy - collection of terms with specific rules
 */
export interface Taxonomy {
  id: string;
  name: string;
  slug: string;
  type: 'category' | 'tag' | 'custom';
  description?: string;
  hierarchical: boolean;
  allowMultiple: boolean; // Allow multiple terms per item
  terms: Term[];
  settings: TaxonomySettings;
  permissions?: TaxonomyPermissions;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Taxonomy configuration settings
 */
export interface TaxonomySettings {
  maxDepth?: number; // Maximum hierarchy depth
  maxTerms?: number; // Maximum terms per item
  caseSensitive?: boolean;
  allowDuplicateNames?: boolean;
  requiredFields?: string[];
  customFields?: Record<string, unknown>;
}

/**
 * Taxonomy permissions
 */
export interface TaxonomyPermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canAssign: boolean;
  restrictedTerms?: string[]; // Term IDs requiring special permission
  roles?: string[];
}

/**
 * Category tree node for rendering
 */
export interface CategoryTreeNode extends Category {
  expanded?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

/**
 * Tag with selection state
 */
export interface SelectableTag extends Tag {
  selected: boolean;
}

/**
 * Taxonomy filter options
 */
export interface TaxonomyFilterOptions {
  taxonomyId?: string;
  search?: string;
  parentId?: string;
  level?: number;
  isActive?: boolean;
  sortBy?: 'name' | 'count' | 'order' | 'created';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Category move operation
 */
export interface CategoryMoveOperation {
  categoryId: string;
  newParentId?: string;
  newOrder?: number;
}

/**
 * Tag suggestion
 */
export interface TagSuggestion {
  tag: Tag;
  score: number;
  reason: 'popular' | 'related' | 'recent' | 'context';
}

/**
 * Taxonomy statistics
 */
export interface TaxonomyStats {
  totalTerms: number;
  totalCategories: number;
  totalTags: number;
  maxDepth: number;
  avgTermsPerItem: number;
  mostUsedTerms: Term[];
  recentlyAdded: Term[];
  orphanedTerms: Term[];
}

/* ============================================================================
 * REACT HOOKS
 * ========================================================================== */

/**
 * Hook for managing taxonomy data with caching and real-time updates
 *
 * @param taxonomyId - Taxonomy identifier
 * @param options - Filter and fetch options
 * @returns Taxonomy data and management functions
 *
 * @example
 * ```tsx
 * const { taxonomy, terms, loading, error, refresh } = useTaxonomy('products', {
 *   search: 'electronics',
 *   sortBy: 'name'
 * });
 *
 * if (loading) return <Spinner />;
 * if (error) return <Error message={error.message} />;
 *
 * return <div>{taxonomy.name}: {terms.length} terms</div>;
 * ```
 */
export function useTaxonomy(
  taxonomyId: string,
  options: TaxonomyFilterOptions = {}
) {
  const [taxonomy, setTaxonomy] = useState<Taxonomy | null>(null);
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTaxonomy = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulated API call - replace with actual implementation
      const response = await fetch(`/api/taxonomies/${taxonomyId}?${new URLSearchParams(options as any)}`);
      if (!response.ok) throw new Error('Failed to fetch taxonomy');

      const data = await response.json();
      setTaxonomy(data.taxonomy);
      setTerms(data.terms);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [taxonomyId, options]);

  useEffect(() => {
    fetchTaxonomy();
  }, [fetchTaxonomy]);

  return {
    taxonomy,
    terms,
    loading,
    error,
    refresh: fetchTaxonomy
  };
}

/**
 * Hook for managing categories with hierarchical structure
 *
 * @param taxonomyId - Optional taxonomy filter
 * @param options - Filter options
 * @returns Categories with tree structure
 *
 * @example
 * ```tsx
 * const { categories, tree, flatList, loading } = useCategories('products');
 *
 * return (
 *   <select>
 *     {flatList.map(cat => (
 *       <option key={cat.id} value={cat.id}>
 *         {'—'.repeat(cat.level)} {cat.name}
 *       </option>
 *     ))}
 *   </select>
 * );
 * ```
 */
export function useCategories(
  taxonomyId?: string,
  options: TaxonomyFilterOptions = {}
) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Build hierarchical tree structure
  const tree = useMemo(() => {
    return buildCategoryTree(categories);
  }, [categories]);

  // Flatten tree for display
  const flatList = useMemo(() => {
    return flattenCategoryTree(tree);
  }, [tree]);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ taxonomyId, ...options } as any);
      const response = await fetch(`/api/categories?${params}`);
      if (!response.ok) throw new Error('Failed to fetch categories');

      const data = await response.json();
      setCategories(data.categories);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [taxonomyId, options]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    tree,
    flatList,
    loading,
    error,
    refresh: fetchCategories
  };
}

/**
 * Hook for managing tags with suggestions and autocomplete
 *
 * @param options - Filter and search options
 * @returns Tags and management functions
 *
 * @example
 * ```tsx
 * const { tags, popularTags, searchTags, addTag, removeTag } = useTags();
 *
 * const handleSearch = async (query: string) => {
 *   const results = await searchTags(query);
 *   setTagSuggestions(results);
 * };
 * ```
 */
export function useTags(options: TaxonomyFilterOptions = {}) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const popularTags = useMemo(() => {
    return tags
      .filter(tag => tag.isPopular || tag.count > 10)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }, [tags]);

  const searchTags = useCallback(async (query: string) => {
    try {
      const response = await fetch(`/api/tags/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search tags');
      return await response.json();
    } catch (err) {
      console.error('Tag search error:', err);
      return [];
    }
  }, []);

  const addTag = useCallback(async (tag: Partial<Tag>) => {
    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tag)
      });
      if (!response.ok) throw new Error('Failed to create tag');
      const newTag = await response.json();
      setTags(prev => [...prev, newTag]);
      return newTag;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create tag');
    }
  }, []);

  const removeTag = useCallback(async (tagId: string) => {
    try {
      const response = await fetch(`/api/tags/${tagId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete tag');
      setTags(prev => prev.filter(t => t.id !== tagId));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete tag');
    }
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/tags?${new URLSearchParams(options as any)}`);
        if (!response.ok) throw new Error('Failed to fetch tags');
        const data = await response.json();
        setTags(data.tags);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [options]);

  return {
    tags,
    popularTags,
    loading,
    error,
    searchTags,
    addTag,
    removeTag
  };
}

/**
 * Hook for managing generic terms
 *
 * @param taxonomyId - Taxonomy identifier
 * @returns Terms and CRUD operations
 */
export function useTerms(taxonomyId: string) {
  const [terms, setTerms] = useState<Term[]>([]);
  const [loading, setLoading] = useState(true);

  const createTerm = useCallback(async (term: Partial<Term>) => {
    const response = await fetch(`/api/taxonomies/${taxonomyId}/terms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(term)
    });
    if (!response.ok) throw new Error('Failed to create term');
    const newTerm = await response.json();
    setTerms(prev => [...prev, newTerm]);
    return newTerm;
  }, [taxonomyId]);

  const updateTerm = useCallback(async (termId: string, updates: Partial<Term>) => {
    const response = await fetch(`/api/terms/${termId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update term');
    const updated = await response.json();
    setTerms(prev => prev.map(t => t.id === termId ? updated : t));
    return updated;
  }, []);

  const deleteTerm = useCallback(async (termId: string) => {
    const response = await fetch(`/api/terms/${termId}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete term');
    setTerms(prev => prev.filter(t => t.id !== termId));
  }, []);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/taxonomies/${taxonomyId}/terms`);
        if (!response.ok) throw new Error('Failed to fetch terms');
        const data = await response.json();
        setTerms(data.terms);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, [taxonomyId]);

  return {
    terms,
    loading,
    createTerm,
    updateTerm,
    deleteTerm
  };
}

/* ============================================================================
 * DISPLAY COMPONENTS
 * ========================================================================== */

/**
 * Renders hierarchical category tree with expand/collapse
 *
 * @example
 * ```tsx
 * <CategoryTree
 *   categories={categories}
 *   onSelect={(category) => console.log('Selected:', category)}
 *   expandedIds={expandedIds}
 *   selectedId={selectedId}
 *   showCounts
 *   draggable
 * />
 * ```
 */
export interface CategoryTreeProps {
  categories: Category[];
  onSelect?: (category: Category) => void;
  expandedIds?: string[];
  selectedId?: string;
  showCounts?: boolean;
  showIcons?: boolean;
  draggable?: boolean;
  onDrop?: (draggedId: string, targetId: string) => void;
  className?: string;
  renderNode?: (category: Category) => ReactNode;
}

export function CategoryTree({
  categories,
  onSelect,
  expandedIds = [],
  selectedId,
  showCounts = true,
  showIcons = true,
  draggable = false,
  onDrop,
  className = '',
  renderNode
}: CategoryTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(expandedIds));

  const toggleExpand = (categoryId: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const renderTreeNode = (category: Category, level: number = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expanded.has(category.id);
    const isSelected = category.id === selectedId;

    return (
      <div key={category.id} style={{ marginLeft: `${level * 20}px` }}>
        <div
          className={`category-tree-node ${isSelected ? 'selected' : ''} ${className}`}
          onClick={() => onSelect?.(category)}
          draggable={draggable}
          onDragStart={(e) => e.dataTransfer.setData('categoryId', category.id)}
          onDrop={(e) => {
            e.preventDefault();
            const draggedId = e.dataTransfer.getData('categoryId');
            onDrop?.(draggedId, category.id);
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          {hasChildren && (
            <button onClick={(e) => { e.stopPropagation(); toggleExpand(category.id); }}>
              {isExpanded ? '▼' : '▶'}
            </button>
          )}
          {showIcons && category.icon && <span>{category.icon}</span>}
          {renderNode ? renderNode(category) : (
            <>
              <span>{category.name}</span>
              {showCounts && category.count !== undefined && (
                <span className="count">({category.count})</span>
              )}
            </>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {category.children!.map(child => renderTreeNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const tree = buildCategoryTree(categories);

  return (
    <div className={`category-tree ${className}`}>
      {tree.map(category => renderTreeNode(category))}
    </div>
  );
}

/**
 * Renders categories as a flat list
 *
 * @example
 * ```tsx
 * <CategoryList
 *   categories={categories}
 *   onSelect={(cat) => navigate(`/category/${cat.slug}`)}
 *   showDescription
 *   showCount
 * />
 * ```
 */
export interface CategoryListProps {
  categories: Category[];
  onSelect?: (category: Category) => void;
  selectedId?: string;
  showDescription?: boolean;
  showCount?: boolean;
  showIcons?: boolean;
  className?: string;
}

export function CategoryList({
  categories,
  onSelect,
  selectedId,
  showDescription = false,
  showCount = true,
  showIcons = true,
  className = ''
}: CategoryListProps) {
  return (
    <ul className={`category-list ${className}`}>
      {categories.map(category => (
        <li
          key={category.id}
          className={category.id === selectedId ? 'selected' : ''}
          onClick={() => onSelect?.(category)}
        >
          {showIcons && category.icon && <span className="icon">{category.icon}</span>}
          <div className="content">
            <h4>{category.name}</h4>
            {showDescription && category.description && <p>{category.description}</p>}
          </div>
          {showCount && category.count !== undefined && (
            <span className="count">{category.count}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * Renders categories in a grid layout
 *
 * @example
 * ```tsx
 * <CategoryGrid
 *   categories={categories}
 *   columns={3}
 *   onSelect={(cat) => setSelectedCategory(cat)}
 * />
 * ```
 */
export interface CategoryGridProps {
  categories: Category[];
  columns?: number;
  onSelect?: (category: Category) => void;
  showIcons?: boolean;
  showCount?: boolean;
  className?: string;
}

export function CategoryGrid({
  categories,
  columns = 3,
  onSelect,
  showIcons = true,
  showCount = true,
  className = ''
}: CategoryGridProps) {
  return (
    <div
      className={`category-grid ${className}`}
      style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '1rem' }}
    >
      {categories.map(category => (
        <div
          key={category.id}
          className="category-card"
          onClick={() => onSelect?.(category)}
        >
          {showIcons && category.icon && (
            <div className="icon" style={{ fontSize: '2rem' }}>{category.icon}</div>
          )}
          <h3>{category.name}</h3>
          {category.description && <p>{category.description}</p>}
          {showCount && category.count !== undefined && (
            <span className="count">{category.count} items</span>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Renders tags as a cloud with size based on popularity
 *
 * @example
 * ```tsx
 * <TagCloud
 *   tags={tags}
 *   minSize={12}
 *   maxSize={32}
 *   onTagClick={(tag) => filterByTag(tag)}
 * />
 * ```
 */
export interface TagCloudProps {
  tags: Tag[];
  minSize?: number;
  maxSize?: number;
  onTagClick?: (tag: Tag) => void;
  colorScheme?: 'default' | 'rainbow' | 'monochrome';
  className?: string;
}

export function TagCloud({
  tags,
  minSize = 12,
  maxSize = 32,
  onTagClick,
  colorScheme = 'default',
  className = ''
}: TagCloudProps) {
  const maxCount = Math.max(...tags.map(t => t.count), 1);
  const minCount = Math.min(...tags.map(t => t.count), 1);

  const getFontSize = (count: number) => {
    const normalized = (count - minCount) / (maxCount - minCount || 1);
    return minSize + normalized * (maxSize - minSize);
  };

  const getColor = (index: number) => {
    if (colorScheme === 'rainbow') {
      const hue = (index * 360) / tags.length;
      return `hsl(${hue}, 70%, 50%)`;
    }
    if (colorScheme === 'monochrome') {
      return '#333';
    }
    return undefined;
  };

  return (
    <div className={`tag-cloud ${className}`} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {tags.map((tag, index) => (
        <button
          key={tag.id}
          className="tag-cloud-item"
          style={{
            fontSize: `${getFontSize(tag.count)}px`,
            color: tag.color || getColor(index),
            cursor: 'pointer'
          }}
          onClick={() => onTagClick?.(tag)}
        >
          {tag.name}
        </button>
      ))}
    </div>
  );
}

/* ============================================================================
 * INPUT COMPONENTS
 * ========================================================================== */

/**
 * Category selector with hierarchical dropdown
 *
 * @example
 * ```tsx
 * <CategorySelector
 *   categories={categories}
 *   value={selectedCategory}
 *   onChange={setSelectedCategory}
 *   placeholder="Select a category..."
 * />
 * ```
 */
export interface CategorySelectorProps {
  categories: Category[];
  value?: string;
  onChange: (categoryId: string) => void;
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  className?: string;
}

export function CategorySelector({
  categories,
  value,
  onChange,
  placeholder = 'Select category',
  allowClear = true,
  disabled = false,
  className = ''
}: CategorySelectorProps) {
  const flatList = flattenCategoryTree(buildCategoryTree(categories));

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`category-selector ${className}`}
    >
      <option value="">{placeholder}</option>
      {flatList.map(category => (
        <option key={category.id} value={category.id}>
          {'—'.repeat(category.level)} {category.name}
        </option>
      ))}
    </select>
  );
}

/**
 * Multi-select category picker with search
 *
 * @example
 * ```tsx
 * <CategoryPicker
 *   categories={categories}
 *   selectedIds={selectedCategories}
 *   onChange={setSelectedCategories}
 *   maxSelections={5}
 * />
 * ```
 */
export interface CategoryPickerProps {
  categories: Category[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  maxSelections?: number;
  searchable?: boolean;
  className?: string;
}

export function CategoryPicker({
  categories,
  selectedIds,
  onChange,
  maxSelections,
  searchable = true,
  className = ''
}: CategoryPickerProps) {
  const [search, setSearch] = useState('');

  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    const query = search.toLowerCase();
    return categories.filter(cat =>
      cat.name.toLowerCase().includes(query) ||
      cat.description?.toLowerCase().includes(query)
    );
  }, [categories, search]);

  const toggleCategory = (categoryId: string) => {
    if (selectedIds.includes(categoryId)) {
      onChange(selectedIds.filter(id => id !== categoryId));
    } else {
      if (maxSelections && selectedIds.length >= maxSelections) return;
      onChange([...selectedIds, categoryId]);
    }
  };

  return (
    <div className={`category-picker ${className}`}>
      {searchable && (
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}
      <div className="category-list">
        {filteredCategories.map(category => (
          <label key={category.id}>
            <input
              type="checkbox"
              checked={selectedIds.includes(category.id)}
              onChange={() => toggleCategory(category.id)}
              disabled={maxSelections && selectedIds.length >= maxSelections && !selectedIds.includes(category.id)}
            />
            {category.name}
            {category.count !== undefined && <span> ({category.count})</span>}
          </label>
        ))}
      </div>
    </div>
  );
}

/**
 * Dropdown with category hierarchy
 *
 * @example
 * ```tsx
 * <CategoryDropdown
 *   categories={categories}
 *   onSelect={(cat) => navigate(`/products/${cat.slug}`)}
 * />
 * ```
 */
export interface CategoryDropdownProps {
  categories: Category[];
  onSelect: (category: Category) => void;
  triggerText?: string;
  className?: string;
}

export function CategoryDropdown({
  categories,
  onSelect,
  triggerText = 'Categories',
  className = ''
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const tree = buildCategoryTree(categories);

  const handleSelect = (category: Category) => {
    onSelect(category);
    setIsOpen(false);
  };

  return (
    <div className={`category-dropdown ${className}`}>
      <button onClick={() => setIsOpen(!isOpen)}>
        {triggerText} {isOpen ? '▲' : '▼'}
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <CategoryTree
            categories={categories}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Tag input with autocomplete and creation
 *
 * @example
 * ```tsx
 * <TagInput
 *   tags={selectedTags}
 *   onChange={setSelectedTags}
 *   suggestions={availableTags}
 *   allowCreate
 *   maxTags={10}
 * />
 * ```
 */
export interface TagInputProps {
  tags: Tag[];
  onChange: (tags: Tag[]) => void;
  suggestions?: Tag[];
  allowCreate?: boolean;
  maxTags?: number;
  placeholder?: string;
  className?: string;
}

export function TagInput({
  tags,
  onChange,
  suggestions = [],
  allowCreate = true,
  maxTags,
  placeholder = 'Add tags...',
  className = ''
}: TagInputProps) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = useMemo(() => {
    if (!input) return [];
    const query = input.toLowerCase();
    return suggestions.filter(tag =>
      tag.name.toLowerCase().includes(query) &&
      !tags.some(t => t.id === tag.id)
    );
  }, [input, suggestions, tags]);

  const addTag = (tag: Tag) => {
    if (maxTags && tags.length >= maxTags) return;
    onChange([...tags, tag]);
    setInput('');
    setShowSuggestions(false);
  };

  const removeTag = (tagId: string) => {
    onChange(tags.filter(t => t.id !== tagId));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input && allowCreate) {
      e.preventDefault();
      const newTag: Tag = {
        id: `temp-${Date.now()}`,
        name: input,
        slug: input.toLowerCase().replace(/\s+/g, '-'),
        count: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      addTag(newTag);
    }
  };

  return (
    <div className={`tag-input ${className}`}>
      <div className="selected-tags">
        {tags.map(tag => (
          <span key={tag.id} className="tag" style={{ backgroundColor: tag.color }}>
            {tag.name}
            <button onClick={() => removeTag(tag.id)}>×</button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowSuggestions(true);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={maxTags && tags.length >= maxTags}
      />
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="suggestions">
          {filteredSuggestions.map(tag => (
            <li key={tag.id} onClick={() => addTag(tag)}>
              {tag.name} <span className="count">({tag.count})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Tag autocomplete with debounced search
 *
 * @example
 * ```tsx
 * <TagAutocomplete
 *   onSelect={(tag) => addTagToItem(tag)}
 *   onSearch={searchTagsAPI}
 *   debounceMs={300}
 * />
 * ```
 */
export interface TagAutocompleteProps {
  onSelect: (tag: Tag) => void;
  onSearch: (query: string) => Promise<Tag[]>;
  debounceMs?: number;
  minChars?: number;
  placeholder?: string;
  className?: string;
}

export function TagAutocomplete({
  onSelect,
  onSearch,
  debounceMs = 300,
  minChars = 2,
  placeholder = 'Search tags...',
  className = ''
}: TagAutocompleteProps) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (input.length < minChars) {
      setResults([]);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const tags = await onSearch(input);
        setResults(tags);
      } catch (err) {
        console.error('Tag search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [input, onSearch, debounceMs, minChars]);

  const handleSelect = (tag: Tag) => {
    onSelect(tag);
    setInput('');
    setResults([]);
  };

  return (
    <div className={`tag-autocomplete ${className}`}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
      />
      {loading && <div className="loading">Searching...</div>}
      {results.length > 0 && (
        <ul className="results">
          {results.map(tag => (
            <li key={tag.id} onClick={() => handleSelect(tag)}>
              {tag.name}
              <span className="count">({tag.count})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Tag suggestions component
 *
 * @example
 * ```tsx
 * <TagSuggestions
 *   suggestions={suggestedTags}
 *   onSelect={(tag) => addTag(tag)}
 *   maxSuggestions={5}
 * />
 * ```
 */
export interface TagSuggestionsProps {
  suggestions: TagSuggestion[];
  onSelect: (tag: Tag) => void;
  maxSuggestions?: number;
  showReason?: boolean;
  className?: string;
}

export function TagSuggestions({
  suggestions,
  onSelect,
  maxSuggestions = 10,
  showReason = true,
  className = ''
}: TagSuggestionsProps) {
  const topSuggestions = suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSuggestions);

  return (
    <div className={`tag-suggestions ${className}`}>
      <h4>Suggested Tags</h4>
      <div className="suggestions-list">
        {topSuggestions.map(({ tag, reason, score }) => (
          <button
            key={tag.id}
            className="suggestion"
            onClick={() => onSelect(tag)}
          >
            <span className="tag-name">{tag.name}</span>
            {showReason && <span className="reason">{reason}</span>}
            <span className="score">{Math.round(score * 100)}%</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
 * CRUD OPERATIONS
 * ========================================================================== */

/**
 * Creates a new category with validation
 *
 * @param category - Category data
 * @param parentId - Optional parent category ID
 * @returns Created category
 *
 * @example
 * ```tsx
 * const newCategory = await CreateCategory({
 *   name: 'Electronics',
 *   description: 'Electronic devices and accessories',
 *   icon: '📱'
 * }, parentCategoryId);
 * ```
 */
export async function CreateCategory(
  category: Partial<Category>,
  parentId?: string
): Promise<Category> {
  // Validate required fields
  if (!category.name) {
    throw new Error('Category name is required');
  }

  // Generate slug if not provided
  const slug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-');

  // Determine level based on parent
  let level = 0;
  let path: string[] = [];
  if (parentId) {
    const parent = await fetch(`/api/categories/${parentId}`).then(r => r.json());
    level = parent.level + 1;
    path = [...parent.path, parentId];
  }

  const newCategory = {
    ...category,
    slug,
    level,
    path,
    parentId,
    order: category.order || 0,
    isActive: category.isActive !== undefined ? category.isActive : true,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newCategory)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create category');
  }

  return response.json();
}

/**
 * Updates an existing category
 *
 * @param categoryId - Category ID
 * @param updates - Fields to update
 * @returns Updated category
 *
 * @example
 * ```tsx
 * const updated = await UpdateCategory(categoryId, {
 *   name: 'Consumer Electronics',
 *   description: 'Updated description',
 *   icon: '🔌'
 * });
 * ```
 */
export async function UpdateCategory(
  categoryId: string,
  updates: Partial<Category>
): Promise<Category> {
  const response = await fetch(`/api/categories/${categoryId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...updates,
      updatedAt: new Date()
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update category');
  }

  return response.json();
}

/**
 * Deletes a category and optionally handles children
 *
 * @param categoryId - Category ID to delete
 * @param options - Deletion options
 *
 * @example
 * ```tsx
 * // Delete and move children to parent
 * await DeleteCategory(categoryId, { moveChildrenToParent: true });
 *
 * // Delete recursively
 * await DeleteCategory(categoryId, { recursive: true });
 * ```
 */
export async function DeleteCategory(
  categoryId: string,
  options: {
    recursive?: boolean;
    moveChildrenToParent?: boolean;
    reassignTo?: string;
  } = {}
): Promise<void> {
  const response = await fetch(`/api/categories/${categoryId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete category');
  }
}

/* ============================================================================
 * ORGANIZATION & MANAGEMENT
 * ========================================================================== */

/**
 * Moves a category to a new parent
 *
 * @param operation - Move operation details
 * @returns Updated category
 *
 * @example
 * ```tsx
 * await MoveCategory({
 *   categoryId: 'cat-123',
 *   newParentId: 'cat-456',
 *   newOrder: 5
 * });
 * ```
 */
export async function MoveCategory(
  operation: CategoryMoveOperation
): Promise<Category> {
  const { categoryId, newParentId, newOrder } = operation;

  const response = await fetch(`/api/categories/${categoryId}/move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newParentId, newOrder })
  });

  if (!response.ok) {
    throw new Error('Failed to move category');
  }

  return response.json();
}

/**
 * Reorders categories within the same parent
 *
 * @param categoryIds - Array of category IDs in desired order
 * @param parentId - Optional parent ID
 *
 * @example
 * ```tsx
 * await ReorderCategories(['cat-1', 'cat-3', 'cat-2'], 'parent-id');
 * ```
 */
export async function ReorderCategories(
  categoryIds: string[],
  parentId?: string
): Promise<void> {
  const response = await fetch('/api/categories/reorder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categoryIds, parentId })
  });

  if (!response.ok) {
    throw new Error('Failed to reorder categories');
  }
}

/**
 * Drag and drop handler for category reordering
 *
 * @example
 * ```tsx
 * const handleDrop = CategoryDragDrop({
 *   onSuccess: () => refreshCategories(),
 *   onError: (err) => showError(err.message)
 * });
 *
 * <div onDrop={(e) => handleDrop(e, targetCategoryId)} />
 * ```
 */
export function CategoryDragDrop(config: {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}) {
  return async (draggedId: string, targetId: string) => {
    try {
      await MoveCategory({
        categoryId: draggedId,
        newParentId: targetId
      });
      config.onSuccess?.();
    } catch (err) {
      config.onError?.(err instanceof Error ? err : new Error('Failed to move category'));
    }
  };
}

/**
 * Renders nested categories with indentation
 *
 * @example
 * ```tsx
 * <NestedCategories
 *   categories={categories}
 *   maxDepth={5}
 *   onSelect={(cat) => console.log(cat)}
 * />
 * ```
 */
export interface NestedCategoriesProps {
  categories: Category[];
  maxDepth?: number;
  onSelect?: (category: Category) => void;
  className?: string;
}

export function NestedCategories({
  categories,
  maxDepth = Infinity,
  onSelect,
  className = ''
}: NestedCategoriesProps) {
  const tree = buildCategoryTree(categories);

  const renderNested = (category: Category, depth: number = 0) => {
    if (depth >= maxDepth) return null;

    return (
      <div key={category.id} className="nested-category" style={{ marginLeft: `${depth * 20}px` }}>
        <div onClick={() => onSelect?.(category)}>
          {category.name}
        </div>
        {category.children && category.children.length > 0 && (
          <div className="children">
            {category.children.map(child => renderNested(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`nested-categories ${className}`}>
      {tree.map(cat => renderNested(cat))}
    </div>
  );
}

/**
 * Gets hierarchical categories with parent-child relationships
 *
 * @param categories - Flat array of categories
 * @returns Hierarchical structure
 *
 * @example
 * ```tsx
 * const hierarchy = HierarchicalCategories(flatCategories);
 * console.log(hierarchy); // Tree structure
 * ```
 */
export function HierarchicalCategories(categories: Category[]): Category[] {
  return buildCategoryTree(categories);
}

/**
 * Gets subcategories for a parent category
 *
 * @param parentId - Parent category ID
 * @param categories - All categories
 * @param depth - Maximum depth to retrieve
 * @returns Subcategories
 *
 * @example
 * ```tsx
 * const subs = SubCategories('electronics', allCategories, 2);
 * ```
 */
export function SubCategories(
  parentId: string,
  categories: Category[],
  depth: number = 1
): Category[] {
  const getChildren = (pid: string, currentDepth: number): Category[] => {
    if (currentDepth >= depth) return [];

    const children = categories.filter(cat => cat.parentId === pid);
    return children.flatMap(child => [
      child,
      ...getChildren(child.id, currentDepth + 1)
    ]);
  };

  return getChildren(parentId, 0);
}

/* ============================================================================
 * TAG MANAGEMENT
 * ========================================================================== */

/**
 * Tag manager component for bulk operations
 *
 * @example
 * ```tsx
 * <TagManager
 *   tags={allTags}
 *   onUpdate={(tags) => saveTags(tags)}
 *   allowMerge
 *   allowBulkDelete
 * />
 * ```
 */
export interface TagManagerProps {
  tags: Tag[];
  onUpdate: (tags: Tag[]) => void;
  allowMerge?: boolean;
  allowBulkDelete?: boolean;
  className?: string;
}

export function TagManager({
  tags,
  onUpdate,
  allowMerge = true,
  allowBulkDelete = true,
  className = ''
}: TagManagerProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} tags?`)) return;

    try {
      await Promise.all(selected.map(id =>
        fetch(`/api/tags/${id}`, { method: 'DELETE' })
      ));
      onUpdate(tags.filter(t => !selected.includes(t.id)));
      setSelected([]);
    } catch (err) {
      console.error('Bulk delete failed:', err);
    }
  };

  const handleMerge = async () => {
    if (selected.length < 2) return;
    const targetId = selected[0];
    const sourceIds = selected.slice(1);

    try {
      await fetch('/api/tags/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId, sourceIds })
      });
      onUpdate(tags.filter(t => !sourceIds.includes(t.id)));
      setSelected([targetId]);
    } catch (err) {
      console.error('Merge failed:', err);
    }
  };

  return (
    <div className={`tag-manager ${className}`}>
      <div className="toolbar">
        {selected.length > 0 && (
          <>
            <span>{selected.length} selected</span>
            {allowBulkDelete && (
              <button onClick={handleBulkDelete}>Delete Selected</button>
            )}
            {allowMerge && selected.length > 1 && (
              <button onClick={handleMerge}>Merge Tags</button>
            )}
          </>
        )}
      </div>
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" onChange={(e) => {
              setSelected(e.target.checked ? tags.map(t => t.id) : []);
            }} /></th>
            <th>Name</th>
            <th>Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tags.map(tag => (
            <tr key={tag.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(tag.id)}
                  onChange={(e) => {
                    setSelected(e.target.checked
                      ? [...selected, tag.id]
                      : selected.filter(id => id !== tag.id)
                    );
                  }}
                />
              </td>
              <td>{tag.name}</td>
              <td>{tag.count}</td>
              <td>
                <button onClick={() => setEditingId(tag.id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Tag editor for individual tag editing
 *
 * @example
 * ```tsx
 * <TagEditor
 *   tag={selectedTag}
 *   onSave={(updated) => updateTag(updated)}
 *   onCancel={() => setEditMode(false)}
 * />
 * ```
 */
export interface TagEditorProps {
  tag: Tag;
  onSave: (tag: Tag) => void;
  onCancel: () => void;
  className?: string;
}

export function TagEditor({
  tag,
  onSave,
  onCancel,
  className = ''
}: TagEditorProps) {
  const [formData, setFormData] = useState(tag);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={`tag-editor ${className}`}>
      <div>
        <label>Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Slug</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div>
        <label>Color</label>
        <input
          type="color"
          value={formData.color || '#cccccc'}
          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
        />
      </div>
      <div className="actions">
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

/**
 * Bulk edit tags
 *
 * @param tagIds - Tags to edit
 * @param updates - Fields to update
 *
 * @example
 * ```tsx
 * await TagBulkEdit(['tag1', 'tag2'], { color: '#ff0000' });
 * ```
 */
export async function TagBulkEdit(
  tagIds: string[],
  updates: Partial<Tag>
): Promise<void> {
  const response = await fetch('/api/tags/bulk-edit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tagIds, updates })
  });

  if (!response.ok) {
    throw new Error('Failed to bulk edit tags');
  }
}

/* ============================================================================
 * TAXONOMY BUILDING
 * ========================================================================== */

/**
 * Taxonomy builder component for creating new taxonomies
 *
 * @example
 * ```tsx
 * <TaxonomyBuilder
 *   onSave={(taxonomy) => createTaxonomy(taxonomy)}
 *   onCancel={() => setBuilderOpen(false)}
 * />
 * ```
 */
export interface TaxonomyBuilderProps {
  onSave: (taxonomy: Partial<Taxonomy>) => void;
  onCancel: () => void;
  initialData?: Partial<Taxonomy>;
  className?: string;
}

export function TaxonomyBuilder({
  onSave,
  onCancel,
  initialData,
  className = ''
}: TaxonomyBuilderProps) {
  const [formData, setFormData] = useState<Partial<Taxonomy>>(initialData || {
    name: '',
    slug: '',
    type: 'category',
    hierarchical: true,
    allowMultiple: false,
    settings: {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={`taxonomy-builder ${className}`}>
      <h2>Create Taxonomy</h2>

      <div>
        <label>Name</label>
        <input
          type="text"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Slug</label>
        <input
          type="text"
          value={formData.slug || ''}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Type</label>
        <select
          value={formData.type || 'category'}
          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
        >
          <option value="category">Category</option>
          <option value="tag">Tag</option>
          <option value="custom">Custom</option>
        </select>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.hierarchical || false}
            onChange={(e) => setFormData({ ...formData, hierarchical: e.target.checked })}
          />
          Hierarchical
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.allowMultiple || false}
            onChange={(e) => setFormData({ ...formData, allowMultiple: e.target.checked })}
          />
          Allow Multiple Terms
        </label>
      </div>

      <div>
        <label>Description</label>
        <textarea
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="actions">
        <button type="submit">Create Taxonomy</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

/**
 * Taxonomy editor for modifying existing taxonomies
 *
 * @example
 * ```tsx
 * <TaxonomyEditor
 *   taxonomy={currentTaxonomy}
 *   onSave={(updated) => updateTaxonomy(updated)}
 * />
 * ```
 */
export interface TaxonomyEditorProps {
  taxonomy: Taxonomy;
  onSave: (taxonomy: Taxonomy) => void;
  onCancel: () => void;
  className?: string;
}

export function TaxonomyEditor({
  taxonomy,
  onSave,
  onCancel,
  className = ''
}: TaxonomyEditorProps) {
  const [formData, setFormData] = useState(taxonomy);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={`taxonomy-editor ${className}`}>
      <h2>Edit Taxonomy</h2>

      <div>
        <label>Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <label>Settings - Max Depth</label>
        <input
          type="number"
          value={formData.settings.maxDepth || ''}
          onChange={(e) => setFormData({
            ...formData,
            settings: { ...formData.settings, maxDepth: parseInt(e.target.value) }
          })}
        />
      </div>

      <div>
        <label>Settings - Max Terms</label>
        <input
          type="number"
          value={formData.settings.maxTerms || ''}
          onChange={(e) => setFormData({
            ...formData,
            settings: { ...formData.settings, maxTerms: parseInt(e.target.value) }
          })}
        />
      </div>

      <div className="actions">
        <button type="submit">Save Changes</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

/**
 * Imports taxonomy from JSON or CSV
 *
 * @param file - File to import
 * @param format - File format
 * @returns Imported taxonomy
 *
 * @example
 * ```tsx
 * const taxonomy = await TaxonomyImport(file, 'json');
 * ```
 */
export async function TaxonomyImport(
  file: File,
  format: 'json' | 'csv'
): Promise<Taxonomy> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('format', format);

  const response = await fetch('/api/taxonomies/import', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Failed to import taxonomy');
  }

  return response.json();
}

/* ============================================================================
 * FILTERING
 * ========================================================================== */

/**
 * Category filters component
 *
 * @example
 * ```tsx
 * <CategoryFilters
 *   categories={categories}
 *   selectedIds={selected}
 *   onChange={setSelected}
 *   showCounts
 * />
 * ```
 */
export interface CategoryFiltersProps {
  categories: Category[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  showCounts?: boolean;
  multiSelect?: boolean;
  className?: string;
}

export function CategoryFilters({
  categories,
  selectedIds,
  onChange,
  showCounts = true,
  multiSelect = true,
  className = ''
}: CategoryFiltersProps) {
  const handleToggle = (categoryId: string) => {
    if (multiSelect) {
      if (selectedIds.includes(categoryId)) {
        onChange(selectedIds.filter(id => id !== categoryId));
      } else {
        onChange([...selectedIds, categoryId]);
      }
    } else {
      onChange([categoryId]);
    }
  };

  return (
    <div className={`category-filters ${className}`}>
      {categories.map(category => (
        <label key={category.id}>
          <input
            type={multiSelect ? 'checkbox' : 'radio'}
            checked={selectedIds.includes(category.id)}
            onChange={() => handleToggle(category.id)}
          />
          {category.name}
          {showCounts && category.count !== undefined && (
            <span> ({category.count})</span>
          )}
        </label>
      ))}
    </div>
  );
}

/**
 * Tag filters component
 *
 * @example
 * ```tsx
 * <TagFilters
 *   tags={allTags}
 *   selectedTags={selectedTags}
 *   onChange={setSelectedTags}
 * />
 * ```
 */
export interface TagFiltersProps {
  tags: Tag[];
  selectedTags: string[];
  onChange: (selectedTags: string[]) => void;
  showCounts?: boolean;
  className?: string;
}

export function TagFilters({
  tags,
  selectedTags,
  onChange,
  showCounts = true,
  className = ''
}: TagFiltersProps) {
  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter(id => id !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  return (
    <div className={`tag-filters ${className}`}>
      {tags.map(tag => (
        <button
          key={tag.id}
          className={selectedTags.includes(tag.id) ? 'active' : ''}
          onClick={() => toggleTag(tag.id)}
          style={{ backgroundColor: tag.color }}
        >
          {tag.name}
          {showCounts && <span> ({tag.count})</span>}
        </button>
      ))}
    </div>
  );
}

/**
 * Combined taxonomy filters
 *
 * @example
 * ```tsx
 * <TaxonomyFilters
 *   taxonomies={taxonomies}
 *   onFilter={(filters) => applyFilters(filters)}
 * />
 * ```
 */
export interface TaxonomyFiltersProps {
  taxonomies: Taxonomy[];
  onFilter: (filters: Record<string, string[]>) => void;
  className?: string;
}

export function TaxonomyFilters({
  taxonomies,
  onFilter,
  className = ''
}: TaxonomyFiltersProps) {
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  useEffect(() => {
    onFilter(filters);
  }, [filters, onFilter]);

  const updateFilter = (taxonomyId: string, termIds: string[]) => {
    setFilters(prev => ({
      ...prev,
      [taxonomyId]: termIds
    }));
  };

  return (
    <div className={`taxonomy-filters ${className}`}>
      {taxonomies.map(taxonomy => (
        <div key={taxonomy.id} className="taxonomy-filter-section">
          <h3>{taxonomy.name}</h3>
          {taxonomy.type === 'category' ? (
            <CategoryFilters
              categories={taxonomy.terms as Category[]}
              selectedIds={filters[taxonomy.id] || []}
              onChange={(ids) => updateFilter(taxonomy.id, ids)}
            />
          ) : (
            <TagFilters
              tags={taxonomy.terms as Tag[]}
              selectedTags={filters[taxonomy.id] || []}
              onChange={(ids) => updateFilter(taxonomy.id, ids)}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/* ============================================================================
 * SUGGESTIONS & RECOMMENDATIONS
 * ========================================================================== */

/**
 * Gets related categories based on content or usage
 *
 * @param categoryId - Source category
 * @param limit - Maximum results
 * @returns Related categories
 *
 * @example
 * ```tsx
 * const related = await RelatedCategories('electronics', 5);
 * ```
 */
export async function RelatedCategories(
  categoryId: string,
  limit: number = 10
): Promise<Category[]> {
  const response = await fetch(
    `/api/categories/${categoryId}/related?limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch related categories');
  }

  return response.json();
}

/**
 * Gets suggested tags based on content
 *
 * @param content - Content to analyze
 * @param limit - Maximum suggestions
 * @returns Tag suggestions
 *
 * @example
 * ```tsx
 * const suggestions = await SuggestedTags(articleContent, 10);
 * ```
 */
export async function SuggestedTags(
  content: string,
  limit: number = 10
): Promise<TagSuggestion[]> {
  const response = await fetch('/api/tags/suggest', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, limit })
  });

  if (!response.ok) {
    throw new Error('Failed to get tag suggestions');
  }

  return response.json();
}

/**
 * Gets popular tags
 *
 * @param limit - Maximum results
 * @param timeframe - Time period ('day' | 'week' | 'month' | 'all')
 * @returns Popular tags
 *
 * @example
 * ```tsx
 * const popularTags = await PopularTags(20, 'week');
 * ```
 */
export async function PopularTags(
  limit: number = 20,
  timeframe: 'day' | 'week' | 'month' | 'all' = 'all'
): Promise<Tag[]> {
  const response = await fetch(
    `/api/tags/popular?limit=${limit}&timeframe=${timeframe}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch popular tags');
  }

  return response.json();
}

/* ============================================================================
 * ANALYTICS & STATISTICS
 * ========================================================================== */

/**
 * Gets category usage counts
 *
 * @param categoryIds - Categories to analyze
 * @returns Count data
 *
 * @example
 * ```tsx
 * const counts = await CategoryCounts(['cat1', 'cat2']);
 * ```
 */
export async function CategoryCounts(
  categoryIds?: string[]
): Promise<Record<string, number>> {
  const params = categoryIds ? `?ids=${categoryIds.join(',')}` : '';
  const response = await fetch(`/api/categories/counts${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch category counts');
  }

  return response.json();
}

/**
 * Gets tag usage counts
 *
 * @param tagIds - Tags to analyze
 * @returns Count data
 *
 * @example
 * ```tsx
 * const counts = await TagCounts();
 * ```
 */
export async function TagCounts(
  tagIds?: string[]
): Promise<Record<string, number>> {
  const params = tagIds ? `?ids=${tagIds.join(',')}` : '';
  const response = await fetch(`/api/tags/counts${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch tag counts');
  }

  return response.json();
}

/**
 * Gets comprehensive taxonomy statistics
 *
 * @param taxonomyId - Taxonomy to analyze
 * @returns Statistics
 *
 * @example
 * ```tsx
 * const stats = await TaxonomyStats('products');
 * console.log(stats.totalTerms, stats.maxDepth);
 * ```
 */
export async function TaxonomyStats(
  taxonomyId: string
): Promise<TaxonomyStats> {
  const response = await fetch(`/api/taxonomies/${taxonomyId}/stats`);

  if (!response.ok) {
    throw new Error('Failed to fetch taxonomy stats');
  }

  return response.json();
}

/* ============================================================================
 * ADVANCED OPERATIONS
 * ========================================================================== */

/**
 * Merges multiple categories into one
 *
 * @param targetId - Category to merge into
 * @param sourceIds - Categories to merge
 * @returns Merged category
 *
 * @example
 * ```tsx
 * await MergeCategories('electronics', ['phones', 'tablets']);
 * ```
 */
export async function MergeCategories(
  targetId: string,
  sourceIds: string[]
): Promise<Category> {
  const response = await fetch('/api/categories/merge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetId, sourceIds })
  });

  if (!response.ok) {
    throw new Error('Failed to merge categories');
  }

  return response.json();
}

/**
 * Splits a category into multiple categories
 *
 * @param categoryId - Category to split
 * @param newCategories - New category definitions
 * @returns Created categories
 *
 * @example
 * ```tsx
 * await SplitCategories('electronics', [
 *   { name: 'Mobile Phones', items: ['item1', 'item2'] },
 *   { name: 'Tablets', items: ['item3', 'item4'] }
 * ]);
 * ```
 */
export async function SplitCategories(
  categoryId: string,
  newCategories: Array<{ name: string; items: string[] }>
): Promise<Category[]> {
  const response = await fetch(`/api/categories/${categoryId}/split`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ newCategories })
  });

  if (!response.ok) {
    throw new Error('Failed to split category');
  }

  return response.json();
}

/**
 * Manages category aliases for SEO and redirects
 *
 * @param categoryId - Category ID
 * @param aliases - Array of alias slugs
 *
 * @example
 * ```tsx
 * await CategoryAliases('electronics', ['tech', 'gadgets', 'devices']);
 * ```
 */
export async function CategoryAliases(
  categoryId: string,
  aliases: string[]
): Promise<void> {
  const response = await fetch(`/api/categories/${categoryId}/aliases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ aliases })
  });

  if (!response.ok) {
    throw new Error('Failed to set category aliases');
  }
}

/* ============================================================================
 * PERMISSIONS & ACCESS CONTROL
 * ========================================================================== */

/**
 * Checks taxonomy permissions for current user
 *
 * @param taxonomyId - Taxonomy to check
 * @returns Permission details
 *
 * @example
 * ```tsx
 * const perms = await TaxonomyPermissions('products');
 * if (perms.canCreate) {
 *   // Show create button
 * }
 * ```
 */
export async function TaxonomyPermissions(
  taxonomyId: string
): Promise<TaxonomyPermissions> {
  const response = await fetch(`/api/taxonomies/${taxonomyId}/permissions`);

  if (!response.ok) {
    throw new Error('Failed to fetch permissions');
  }

  return response.json();
}

/**
 * Checks category access for current user
 *
 * @param categoryId - Category to check
 * @param action - Action to verify
 * @returns Whether action is allowed
 *
 * @example
 * ```tsx
 * const canEdit = await CategoryAccess('cat-123', 'edit');
 * ```
 */
export async function CategoryAccess(
  categoryId: string,
  action: 'view' | 'edit' | 'delete' | 'assign'
): Promise<boolean> {
  const response = await fetch(
    `/api/categories/${categoryId}/access?action=${action}`
  );

  if (!response.ok) {
    throw new Error('Failed to check access');
  }

  const data = await response.json();
  return data.allowed;
}

/**
 * Gets restricted terms requiring special permissions
 *
 * @param taxonomyId - Taxonomy ID
 * @returns Restricted term IDs and requirements
 *
 * @example
 * ```tsx
 * const restricted = await RestrictedTerms('products');
 * console.log(restricted); // ['term-1', 'term-2']
 * ```
 */
export async function RestrictedTerms(
  taxonomyId: string
): Promise<string[]> {
  const response = await fetch(`/api/taxonomies/${taxonomyId}/restricted`);

  if (!response.ok) {
    throw new Error('Failed to fetch restricted terms');
  }

  const data = await response.json();
  return data.termIds;
}

/* ============================================================================
 * UTILITY FUNCTIONS
 * ========================================================================== */

/**
 * Builds hierarchical tree from flat category array
 *
 * @param categories - Flat array of categories
 * @returns Tree structure
 */
export function buildCategoryTree(categories: Category[]): Category[] {
  const categoryMap = new Map<string, Category>();
  const roots: Category[] = [];

  // Create map of all categories
  categories.forEach(cat => {
    categoryMap.set(cat.id, { ...cat, children: [] });
  });

  // Build tree structure
  categories.forEach(cat => {
    const category = categoryMap.get(cat.id)!;
    if (cat.parentId && categoryMap.has(cat.parentId)) {
      const parent = categoryMap.get(cat.parentId)!;
      if (!parent.children) parent.children = [];
      parent.children.push(category);
    } else {
      roots.push(category);
    }
  });

  return roots;
}

/**
 * Flattens category tree to ordered list
 *
 * @param tree - Hierarchical category tree
 * @returns Flat array with depth information
 */
export function flattenCategoryTree(tree: Category[]): Category[] {
  const result: Category[] = [];

  const flatten = (categories: Category[], level: number = 0) => {
    categories.forEach(cat => {
      result.push({ ...cat, level });
      if (cat.children && cat.children.length > 0) {
        flatten(cat.children, level + 1);
      }
    });
  };

  flatten(tree);
  return result;
}

/**
 * Validates taxonomy configuration
 *
 * @param taxonomy - Taxonomy to validate
 * @returns Validation result
 */
export function validateTaxonomy(taxonomy: Partial<Taxonomy>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!taxonomy.name) errors.push('Name is required');
  if (!taxonomy.slug) errors.push('Slug is required');
  if (!taxonomy.type) errors.push('Type is required');

  if (taxonomy.slug && !/^[a-z0-9-]+$/.test(taxonomy.slug)) {
    errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Generates category breadcrumb path
 *
 * @param category - Category to get path for
 * @param allCategories - All available categories
 * @returns Breadcrumb array
 */
export function getCategoryBreadcrumb(
  category: Category,
  allCategories: Category[]
): Category[] {
  const breadcrumb: Category[] = [];
  let current: Category | undefined = category;

  while (current) {
    breadcrumb.unshift(current);
    current = current.parentId
      ? allCategories.find(c => c.id === current!.parentId)
      : undefined;
  }

  return breadcrumb;
}

/**
 * Searches terms with fuzzy matching
 *
 * @param terms - Terms to search
 * @param query - Search query
 * @returns Matching terms
 */
export function searchTerms<T extends Term>(
  terms: T[],
  query: string
): T[] {
  const lowerQuery = query.toLowerCase();

  return terms.filter(term =>
    term.name.toLowerCase().includes(lowerQuery) ||
    term.slug.toLowerCase().includes(lowerQuery) ||
    term.description?.toLowerCase().includes(lowerQuery)
  );
}

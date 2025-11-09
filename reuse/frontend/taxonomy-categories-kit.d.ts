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
import type { ReactNode } from 'react';
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
    path: string[];
    order: number;
    count?: number;
    icon?: string;
    color?: string;
    isActive: boolean;
}
/**
 * Tag for flexible categorization
 */
export interface Tag extends Term {
    count: number;
    color?: string;
    isPopular?: boolean;
    category?: string;
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
    allowMultiple: boolean;
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
    maxDepth?: number;
    maxTerms?: number;
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
    restrictedTerms?: string[];
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
export declare function useTaxonomy(taxonomyId: string, options?: TaxonomyFilterOptions): {
    taxonomy: any;
    terms: any;
    loading: any;
    error: any;
    refresh: any;
};
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
export declare function useCategories(taxonomyId?: string, options?: TaxonomyFilterOptions): {
    categories: any;
    tree: any;
    flatList: any;
    loading: any;
    error: any;
    refresh: any;
};
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
export declare function useTags(options?: TaxonomyFilterOptions): {
    tags: any;
    popularTags: any;
    loading: any;
    error: any;
    searchTags: any;
    addTag: any;
    removeTag: any;
};
/**
 * Hook for managing generic terms
 *
 * @param taxonomyId - Taxonomy identifier
 * @returns Terms and CRUD operations
 */
export declare function useTerms(taxonomyId: string): {
    terms: any;
    loading: any;
    createTerm: any;
    updateTerm: any;
    deleteTerm: any;
};
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
export declare function CategoryTree({ categories, onSelect, expandedIds, selectedId, showCounts, showIcons, draggable, onDrop, className, renderNode }: CategoryTreeProps): void;
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
export declare function CategoryList({ categories, onSelect, selectedId, showDescription, showCount, showIcons, className }: CategoryListProps): any;
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
export declare function CategoryGrid({ categories, columns, onSelect, showIcons, showCount, className }: CategoryGridProps): any;
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
export declare function TagCloud({ tags, minSize, maxSize, onTagClick, colorScheme, className }: TagCloudProps): any;
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
export declare function CategorySelector({ categories, value, onChange, placeholder, allowClear, disabled, className }: CategorySelectorProps): {
    value: string | undefined;
};
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
export declare function CategoryPicker({ categories, selectedIds, onChange, maxSelections, searchable, className }: CategoryPickerProps): any;
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
export declare function CategoryDropdown({ categories, onSelect, triggerText, className }: CategoryDropdownProps): any;
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
export declare function TagInput({ tags, onChange, suggestions, allowCreate, maxTags, placeholder, className }: TagInputProps): any;
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
export declare function TagAutocomplete({ onSelect, onSearch, debounceMs, minChars, placeholder, className }: TagAutocompleteProps): any;
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
export declare function TagSuggestions({ suggestions, onSelect, maxSuggestions, showReason, className }: TagSuggestionsProps): any;
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
export declare function CreateCategory(category: Partial<Category>, parentId?: string): Promise<Category>;
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
export declare function UpdateCategory(categoryId: string, updates: Partial<Category>): Promise<Category>;
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
export declare function DeleteCategory(categoryId: string, options?: {
    recursive?: boolean;
    moveChildrenToParent?: boolean;
    reassignTo?: string;
}): Promise<void>;
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
export declare function MoveCategory(operation: CategoryMoveOperation): Promise<Category>;
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
export declare function ReorderCategories(categoryIds: string[], parentId?: string): Promise<void>;
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
export declare function CategoryDragDrop(config: {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
}): (draggedId: string, targetId: string) => Promise<void>;
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
export declare function NestedCategories({ categories, maxDepth, onSelect, className }: NestedCategoriesProps): void;
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
export declare function HierarchicalCategories(categories: Category[]): Category[];
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
export declare function SubCategories(parentId: string, categories: Category[], depth?: number): Category[];
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
export declare function TagManager({ tags, onUpdate, allowMerge, allowBulkDelete, className }: TagManagerProps): any;
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
export declare function TagEditor({ tag, onSave, onCancel, className }: TagEditorProps): {
    handleSubmit: (e: React.FormEvent) => void;
};
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
export declare function TagBulkEdit(tagIds: string[], updates: Partial<Tag>): Promise<void>;
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
export declare function TaxonomyBuilder({ onSave, onCancel, initialData, className }: TaxonomyBuilderProps): {
    handleSubmit: (e: React.FormEvent) => void;
};
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
export declare function TaxonomyEditor({ taxonomy, onSave, onCancel, className }: TaxonomyEditorProps): {
    handleSubmit: (e: React.FormEvent) => void;
};
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
export declare function TaxonomyImport(file: File, format: 'json' | 'csv'): Promise<Taxonomy>;
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
export declare function CategoryFilters({ categories, selectedIds, onChange, showCounts, multiSelect, className }: CategoryFiltersProps): any;
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
export declare function TagFilters({ tags, selectedTags, onChange, showCounts, className }: TagFiltersProps): any;
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
export declare function TaxonomyFilters({ taxonomies, onFilter, className }: TaxonomyFiltersProps): any;
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
export declare function RelatedCategories(categoryId: string, limit?: number): Promise<Category[]>;
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
export declare function SuggestedTags(content: string, limit?: number): Promise<TagSuggestion[]>;
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
export declare function PopularTags(limit?: number, timeframe?: 'day' | 'week' | 'month' | 'all'): Promise<Tag[]>;
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
export declare function CategoryCounts(categoryIds?: string[]): Promise<Record<string, number>>;
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
export declare function TagCounts(tagIds?: string[]): Promise<Record<string, number>>;
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
export declare function TaxonomyStats(taxonomyId: string): Promise<TaxonomyStats>;
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
export declare function MergeCategories(targetId: string, sourceIds: string[]): Promise<Category>;
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
export declare function SplitCategories(categoryId: string, newCategories: Array<{
    name: string;
    items: string[];
}>): Promise<Category[]>;
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
export declare function CategoryAliases(categoryId: string, aliases: string[]): Promise<void>;
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
export declare function TaxonomyPermissions(taxonomyId: string): Promise<TaxonomyPermissions>;
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
export declare function CategoryAccess(categoryId: string, action: 'view' | 'edit' | 'delete' | 'assign'): Promise<boolean>;
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
export declare function RestrictedTerms(taxonomyId: string): Promise<string[]>;
/**
 * Builds hierarchical tree from flat category array
 *
 * @param categories - Flat array of categories
 * @returns Tree structure
 */
export declare function buildCategoryTree(categories: Category[]): Category[];
/**
 * Flattens category tree to ordered list
 *
 * @param tree - Hierarchical category tree
 * @returns Flat array with depth information
 */
export declare function flattenCategoryTree(tree: Category[]): Category[];
/**
 * Validates taxonomy configuration
 *
 * @param taxonomy - Taxonomy to validate
 * @returns Validation result
 */
export declare function validateTaxonomy(taxonomy: Partial<Taxonomy>): {
    valid: boolean;
    errors: string[];
};
/**
 * Generates category breadcrumb path
 *
 * @param category - Category to get path for
 * @param allCategories - All available categories
 * @returns Breadcrumb array
 */
export declare function getCategoryBreadcrumb(category: Category, allCategories: Category[]): Category[];
/**
 * Searches terms with fuzzy matching
 *
 * @param terms - Terms to search
 * @param query - Search query
 * @returns Matching terms
 */
export declare function searchTerms<T extends Term>(terms: T[], query: string): T[];
//# sourceMappingURL=taxonomy-categories-kit.d.ts.map
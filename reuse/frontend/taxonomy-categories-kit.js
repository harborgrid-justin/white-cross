"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTaxonomy = useTaxonomy;
exports.useCategories = useCategories;
exports.useTags = useTags;
exports.useTerms = useTerms;
exports.CategoryTree = CategoryTree;
exports.CategoryList = CategoryList;
exports.CategoryGrid = CategoryGrid;
exports.TagCloud = TagCloud;
exports.CategorySelector = CategorySelector;
exports.CategoryPicker = CategoryPicker;
exports.CategoryDropdown = CategoryDropdown;
exports.TagInput = TagInput;
exports.TagAutocomplete = TagAutocomplete;
exports.TagSuggestions = TagSuggestions;
exports.CreateCategory = CreateCategory;
exports.UpdateCategory = UpdateCategory;
exports.DeleteCategory = DeleteCategory;
exports.MoveCategory = MoveCategory;
exports.ReorderCategories = ReorderCategories;
exports.CategoryDragDrop = CategoryDragDrop;
exports.NestedCategories = NestedCategories;
exports.HierarchicalCategories = HierarchicalCategories;
exports.SubCategories = SubCategories;
exports.TagManager = TagManager;
exports.TagEditor = TagEditor;
exports.TagBulkEdit = TagBulkEdit;
exports.TaxonomyBuilder = TaxonomyBuilder;
exports.TaxonomyEditor = TaxonomyEditor;
exports.TaxonomyImport = TaxonomyImport;
exports.CategoryFilters = CategoryFilters;
exports.TagFilters = TagFilters;
exports.TaxonomyFilters = TaxonomyFilters;
exports.RelatedCategories = RelatedCategories;
exports.SuggestedTags = SuggestedTags;
exports.PopularTags = PopularTags;
exports.CategoryCounts = CategoryCounts;
exports.TagCounts = TagCounts;
exports.TaxonomyStats = TaxonomyStats;
exports.MergeCategories = MergeCategories;
exports.SplitCategories = SplitCategories;
exports.CategoryAliases = CategoryAliases;
exports.TaxonomyPermissions = TaxonomyPermissions;
exports.CategoryAccess = CategoryAccess;
exports.RestrictedTerms = RestrictedTerms;
exports.buildCategoryTree = buildCategoryTree;
exports.flattenCategoryTree = flattenCategoryTree;
exports.validateTaxonomy = validateTaxonomy;
exports.getCategoryBreadcrumb = getCategoryBreadcrumb;
exports.searchTerms = searchTerms;
const react_1 = require("react");
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
function useTaxonomy(taxonomyId, options = {}) {
    const [taxonomy, setTaxonomy] = (0, react_1.useState)(null);
    const [terms, setTerms] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const fetchTaxonomy = (0, react_1.useCallback)(async () => {
        try {
            setLoading(true);
            setError(null);
            // Simulated API call - replace with actual implementation
            const response = await fetch(`/api/taxonomies/${taxonomyId}?${new URLSearchParams(options)}`);
            if (!response.ok)
                throw new Error('Failed to fetch taxonomy');
            const data = await response.json();
            setTaxonomy(data.taxonomy);
            setTerms(data.terms);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
        }
        finally {
            setLoading(false);
        }
    }, [taxonomyId, options]);
    (0, react_1.useEffect)(() => {
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
function useCategories(taxonomyId, options = {}) {
    const [categories, setCategories] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    // Build hierarchical tree structure
    const tree = (0, react_1.useMemo)(() => {
        return buildCategoryTree(categories);
    }, [categories]);
    // Flatten tree for display
    const flatList = (0, react_1.useMemo)(() => {
        return flattenCategoryTree(tree);
    }, [tree]);
    const fetchCategories = (0, react_1.useCallback)(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ taxonomyId, ...options });
            const response = await fetch(`/api/categories?${params}`);
            if (!response.ok)
                throw new Error('Failed to fetch categories');
            const data = await response.json();
            setCategories(data.categories);
        }
        catch (err) {
            setError(err instanceof Error ? err : new Error('Unknown error'));
        }
        finally {
            setLoading(false);
        }
    }, [taxonomyId, options]);
    (0, react_1.useEffect)(() => {
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
function useTags(options = {}) {
    const [tags, setTags] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    const popularTags = (0, react_1.useMemo)(() => {
        return tags
            .filter(tag => tag.isPopular || tag.count > 10)
            .sort((a, b) => b.count - a.count)
            .slice(0, 20);
    }, [tags]);
    const searchTags = (0, react_1.useCallback)(async (query) => {
        try {
            const response = await fetch(`/api/tags/search?q=${encodeURIComponent(query)}`);
            if (!response.ok)
                throw new Error('Failed to search tags');
            return await response.json();
        }
        catch (err) {
            console.error('Tag search error:', err);
            return [];
        }
    }, []);
    const addTag = (0, react_1.useCallback)(async (tag) => {
        try {
            const response = await fetch('/api/tags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tag)
            });
            if (!response.ok)
                throw new Error('Failed to create tag');
            const newTag = await response.json();
            setTags(prev => [...prev, newTag]);
            return newTag;
        }
        catch (err) {
            throw err instanceof Error ? err : new Error('Failed to create tag');
        }
    }, []);
    const removeTag = (0, react_1.useCallback)(async (tagId) => {
        try {
            const response = await fetch(`/api/tags/${tagId}`, { method: 'DELETE' });
            if (!response.ok)
                throw new Error('Failed to delete tag');
            setTags(prev => prev.filter(t => t.id !== tagId));
        }
        catch (err) {
            throw err instanceof Error ? err : new Error('Failed to delete tag');
        }
    }, []);
    (0, react_1.useEffect)(() => {
        const fetchTags = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/tags?${new URLSearchParams(options)}`);
                if (!response.ok)
                    throw new Error('Failed to fetch tags');
                const data = await response.json();
                setTags(data.tags);
            }
            catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error'));
            }
            finally {
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
function useTerms(taxonomyId) {
    const [terms, setTerms] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const createTerm = (0, react_1.useCallback)(async (term) => {
        const response = await fetch(`/api/taxonomies/${taxonomyId}/terms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(term)
        });
        if (!response.ok)
            throw new Error('Failed to create term');
        const newTerm = await response.json();
        setTerms(prev => [...prev, newTerm]);
        return newTerm;
    }, [taxonomyId]);
    const updateTerm = (0, react_1.useCallback)(async (termId, updates) => {
        const response = await fetch(`/api/terms/${termId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        if (!response.ok)
            throw new Error('Failed to update term');
        const updated = await response.json();
        setTerms(prev => prev.map(t => t.id === termId ? updated : t));
        return updated;
    }, []);
    const deleteTerm = (0, react_1.useCallback)(async (termId) => {
        const response = await fetch(`/api/terms/${termId}`, { method: 'DELETE' });
        if (!response.ok)
            throw new Error('Failed to delete term');
        setTerms(prev => prev.filter(t => t.id !== termId));
    }, []);
    (0, react_1.useEffect)(() => {
        const fetchTerms = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/taxonomies/${taxonomyId}/terms`);
                if (!response.ok)
                    throw new Error('Failed to fetch terms');
                const data = await response.json();
                setTerms(data.terms);
            }
            finally {
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
function CategoryTree({ categories, onSelect, expandedIds = [], selectedId, showCounts = true, showIcons = true, draggable = false, onDrop, className = '', renderNode }) {
    const [expanded, setExpanded] = (0, react_1.useState)(new Set(expandedIds));
    const toggleExpand = (categoryId) => {
        setExpanded(prev => {
            const next = new Set(prev);
            if (next.has(categoryId)) {
                next.delete(categoryId);
            }
            else {
                next.add(categoryId);
            }
            return next;
        });
    };
    const renderTreeNode = (category, level = 0) => {
        const hasChildren = category.children && category.children.length > 0;
        const isExpanded = expanded.has(category.id);
        const isSelected = category.id === selectedId;
        return key = { category, : .id };
        style = {};
        {
            marginLeft: `${level * 20}px`;
        }
    };
     >
        className;
    {
        `category-tree-node ${isSelected ? 'selected' : ''} ${className}`;
    }
    onClick = {}();
    onSelect?.(category);
}
draggable = { draggable };
onDragStart = {}(e);
e.dataTransfer.setData('categoryId', category.id);
onDrop = {}(e);
{
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('categoryId');
    onDrop?.(draggedId, category.id);
}
onDragOver = {}(e);
e.preventDefault();
    >
        { hasChildren } && onClick;
{
    (e) => { e.stopPropagation(); toggleExpand(category.id); };
}
 >
    { isExpanded, '▼': '▶' }
    < /button>;
{
    showIcons && category.icon && { category, : .icon } < /span>;
}
{
    renderNode ? renderNode(category) : ({ category, : .name } < /span>);
    {
        showCounts && category.count !== undefined && className;
        "count" > ({ category, : .count }) < /span>;
    }
    />;
}
/div>;
{
    hasChildren && isExpanded && ({ category, : .children.map(child => renderTreeNode(child, level + 1)) }
        < /div>);
}
/div>;
;
;
const tree = buildCategoryTree(categories);
return className = {} `category-tree ${className}`;
 >
    { tree, : .map(category => renderTreeNode(category)) }
    < /div>;
;
function CategoryList({ categories, onSelect, selectedId, showDescription = false, showCount = true, showIcons = true, className = '' }) {
    return className = {} `category-list ${className}`;
}
 >
    { categories, : .map(category => key = { category, : .id }, className = { category, : .id === selectedId ? 'selected' : '' }, onClick = {}(), onSelect?.(category)) }
    >
        { showIcons } && category.icon && className;
"icon" > { category, : .icon } < /span>;
className;
"content" >
    { category, : .name } < /h4>;
{
    showDescription && category.description && { category, : .description } < /p>;
}
/div>;
{
    showCount && category.count !== undefined && className;
    "count" > { category, : .count } < /span>;
}
/li>;
/ul>;
;
function CategoryGrid({ categories, columns = 3, onSelect, showIcons = true, showCount = true, className = '' }) {
    return className = {} `category-grid ${className}`;
}
style = {};
{
    display: 'grid', gridTemplateColumns;
    `repeat(${columns}, 1fr)`, gap;
    '1rem';
}
    >
        { categories, : .map(category => key = { category, : .id }, className = "category-card", onClick = {}(), onSelect?.(category)) }
    >
        { showIcons } && category.icon && className;
"icon";
style = {};
{
    fontSize: '2rem';
}
 > { category, : .icon } < /div>;
({ category, : .name } < /h3>);
{
    category.description && { category, : .description } < /p>;
}
{
    showCount && category.count !== undefined && className;
    "count" > { category, : .count };
    items < /span>;
}
/div>;
/div>;
;
function TagCloud({ tags, minSize = 12, maxSize = 32, onTagClick, colorScheme = 'default', className = '' }) {
    const maxCount = Math.max(...tags.map(t => t.count), 1);
    const minCount = Math.min(...tags.map(t => t.count), 1);
    const getFontSize = (count) => {
        const normalized = (count - minCount) / (maxCount - minCount || 1);
        return minSize + normalized * (maxSize - minSize);
    };
    const getColor = (index) => {
        if (colorScheme === 'rainbow') {
            const hue = (index * 360) / tags.length;
            return `hsl(${hue}, 70%, 50%)`;
        }
        if (colorScheme === 'monochrome') {
            return '#333';
        }
        return undefined;
    };
    return className = {} `tag-cloud ${className}`;
}
style = {};
{
    display: 'flex', flexWrap;
    'wrap', gap;
    '0.5rem';
}
 >
    { tags, : .map((tag, index) => key = { tag, : .id }, className = "tag-cloud-item", style = {}, {
            fontSize: `${getFontSize(tag.count)}px`,
            color: tag.color || getColor(index),
            cursor: 'pointer'
        }) };
onClick = {}();
onTagClick?.(tag);
    >
        { tag, : .name }
    < /button>;
/div>;
;
function CategorySelector({ categories, value, onChange, placeholder = 'Select category', allowClear = true, disabled = false, className = '' }) {
    const flatList = flattenCategoryTree(buildCategoryTree(categories));
    return value = { value } || '';
}
onChange = {}(e);
onChange(e.target.value);
disabled = { disabled };
className = {} `category-selector ${className}`;
    >
        value;
"" > { placeholder } < /option>;
{
    flatList.map(category => key = { category, : .id }, value = { category, : .id } >
        { '—': .repeat(category.level) }, { category, : .name }
        < /option>);
}
/select>;
;
function CategoryPicker({ categories, selectedIds, onChange, maxSelections, searchable = true, className = '' }) {
    const [search, setSearch] = (0, react_1.useState)('');
    const filteredCategories = (0, react_1.useMemo)(() => {
        if (!search)
            return categories;
        const query = search.toLowerCase();
        return categories.filter(cat => cat.name.toLowerCase().includes(query) ||
            cat.description?.toLowerCase().includes(query));
    }, [categories, search]);
    const toggleCategory = (categoryId) => {
        if (selectedIds.includes(categoryId)) {
            onChange(selectedIds.filter(id => id !== categoryId));
        }
        else {
            if (maxSelections && selectedIds.length >= maxSelections)
                return;
            onChange([...selectedIds, categoryId]);
        }
    };
    return className = {} `category-picker ${className}`;
}
 >
    { searchable } && type;
"text";
placeholder = "Search categories...";
value = { search };
onChange = {}(e);
setSearch(e.target.value);
/>;
className;
"category-list" >
    { filteredCategories, : .map(category => key = { category, : .id } >
            type, "checkbox", checked = { selectedIds, : .includes(category.id) }, onChange = {}(), toggleCategory(category.id)) };
disabled = { maxSelections } && selectedIds.length >= maxSelections && !selectedIds.includes(category.id);
/>;
{
    category.name;
}
{
    category.count !== undefined && ({ category, : .count }) < /span>;
}
/label>;
/div>
    < /div>;
;
function CategoryDropdown({ categories, onSelect, triggerText = 'Categories', className = '' }) {
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const tree = buildCategoryTree(categories);
    const handleSelect = (category) => {
        onSelect(category);
        setIsOpen(false);
    };
    return className = {} `category-dropdown ${className}`;
}
 >
    onClick;
{
    () => setIsOpen(!isOpen);
}
 >
    { triggerText };
{
    isOpen ? '▲' : '▼';
}
/button>;
{
    isOpen && className;
    "dropdown-menu" >
        categories;
    {
        categories;
    }
    onSelect = { handleSelect }
        /  >
        /div>;
}
/div>;
;
function TagInput({ tags, onChange, suggestions = [], allowCreate = true, maxTags, placeholder = 'Add tags...', className = '' }) {
    const [input, setInput] = (0, react_1.useState)('');
    const [showSuggestions, setShowSuggestions] = (0, react_1.useState)(false);
    const filteredSuggestions = (0, react_1.useMemo)(() => {
        if (!input)
            return [];
        const query = input.toLowerCase();
        return suggestions.filter(tag => tag.name.toLowerCase().includes(query) &&
            !tags.some(t => t.id === tag.id));
    }, [input, suggestions, tags]);
    const addTag = (tag) => {
        if (maxTags && tags.length >= maxTags)
            return;
        onChange([...tags, tag]);
        setInput('');
        setShowSuggestions(false);
    };
    const removeTag = (tagId) => {
        onChange(tags.filter(t => t.id !== tagId));
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && input && allowCreate) {
            e.preventDefault();
            const newTag = {
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
    return className = {} `tag-input ${className}`;
}
 >
    className;
"selected-tags" >
    { tags, : .map(tag => key = { tag, : .id }, className = "tag", style = {}, { backgroundColor: tag.color }) } >
    { tag, : .name }
    < button;
onClick = {}();
removeTag(tag.id);
 > ;
/button>
    < /span>;
/div>
    < input;
type = "text";
value = { input };
onChange = {}(e);
{
    setInput(e.target.value);
    setShowSuggestions(true);
}
onKeyDown = { handleKeyDown };
placeholder = { placeholder };
disabled = { maxTags } && tags.length >= maxTags;
/>;
{
    showSuggestions && filteredSuggestions.length > 0 && className;
    "suggestions" >
        { filteredSuggestions, : .map(tag => key = { tag, : .id }, onClick = {}(), addTag(tag)) } >
        { tag, : .name } < span;
    className = "count" > ({ tag, : .count }) < /span>
        < /li>;
}
/ul>;
/div>;
;
function TagAutocomplete({ onSelect, onSearch, debounceMs = 300, minChars = 2, placeholder = 'Search tags...', className = '' }) {
    const [input, setInput] = (0, react_1.useState)('');
    const [results, setResults] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const timeoutRef = (0, react_1.useRef)();
    (0, react_1.useEffect)(() => {
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
            }
            catch (err) {
                console.error('Tag search error:', err);
                setResults([]);
            }
            finally {
                setLoading(false);
            }
        }, debounceMs);
        return () => {
            if (timeoutRef.current)
                clearTimeout(timeoutRef.current);
        };
    }, [input, onSearch, debounceMs, minChars]);
    const handleSelect = (tag) => {
        onSelect(tag);
        setInput('');
        setResults([]);
    };
    return className = {} `tag-autocomplete ${className}`;
}
 >
    type;
"text";
value = { input };
onChange = {}(e);
setInput(e.target.value);
placeholder = { placeholder }
    /  >
    { loading } && className;
"loading" > Searching;
/div>;
{
    results.length > 0 && className;
    "results" >
        { results, : .map(tag => key = { tag, : .id }, onClick = {}(), handleSelect(tag)) } >
        { tag, : .name }
        < span;
    className = "count" > ({ tag, : .count }) < /span>
        < /li>;
}
/ul>;
/div>;
;
function TagSuggestions({ suggestions, onSelect, maxSuggestions = 10, showReason = true, className = '' }) {
    const topSuggestions = suggestions
        .sort((a, b) => b.score - a.score)
        .slice(0, maxSuggestions);
    return className = {} `tag-suggestions ${className}`;
}
 >
    Suggested;
Tags < /h4>
    < div;
className = "suggestions-list" >
    { topSuggestions, : .map(({ tag, reason, score }) => key = { tag, : .id }, className = "suggestion", onClick = {}(), onSelect(tag)) }
    >
        className;
"tag-name" > { tag, : .name } < /span>;
{
    showReason && className;
    "reason" > { reason } < /span>;
}
className;
"score" > { Math, : .round(score * 100) } % /span>
    < /button>;
/div>
    < /div>;
;
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
async function CreateCategory(category, parentId) {
    // Validate required fields
    if (!category.name) {
        throw new Error('Category name is required');
    }
    // Generate slug if not provided
    const slug = category.slug || category.name.toLowerCase().replace(/\s+/g, '-');
    // Determine level based on parent
    let level = 0;
    let path = [];
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
async function UpdateCategory(categoryId, updates) {
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
async function DeleteCategory(categoryId, options = {}) {
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
async function MoveCategory(operation) {
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
async function ReorderCategories(categoryIds, parentId) {
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
function CategoryDragDrop(config) {
    return async (draggedId, targetId) => {
        try {
            await MoveCategory({
                categoryId: draggedId,
                newParentId: targetId
            });
            config.onSuccess?.();
        }
        catch (err) {
            config.onError?.(err instanceof Error ? err : new Error('Failed to move category'));
        }
    };
}
function NestedCategories({ categories, maxDepth = Infinity, onSelect, className = '' }) {
    const tree = buildCategoryTree(categories);
    const renderNested = (category, depth = 0) => {
        if (depth >= maxDepth)
            return null;
        return key = { category, : .id };
        className = "nested-category";
        style = {};
        {
            marginLeft: `${depth * 20}px`;
        }
    };
     >
        onClick;
    {
        () => onSelect?.(category);
    }
     >
        { category, : .name }
        < /div>;
    {
        category.children && category.children.length > 0 && className;
        "children" >
            { category, : .children.map(child => renderNested(child, depth + 1)) }
            < /div>;
    }
    /div>;
    ;
}
;
return className = {} `nested-categories ${className}`;
 >
    { tree, : .map(cat => renderNested(cat)) }
    < /div>;
;
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
function HierarchicalCategories(categories) {
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
function SubCategories(parentId, categories, depth = 1) {
    const getChildren = (pid, currentDepth) => {
        if (currentDepth >= depth)
            return [];
        const children = categories.filter(cat => cat.parentId === pid);
        return children.flatMap(child => [
            child,
            ...getChildren(child.id, currentDepth + 1)
        ]);
    };
    return getChildren(parentId, 0);
}
function TagManager({ tags, onUpdate, allowMerge = true, allowBulkDelete = true, className = '' }) {
    const [selected, setSelected] = (0, react_1.useState)([]);
    const [editingId, setEditingId] = (0, react_1.useState)(null);
    const handleBulkDelete = async () => {
        if (!confirm(`Delete ${selected.length} tags?`))
            return;
        try {
            await Promise.all(selected.map(id => fetch(`/api/tags/${id}`, { method: 'DELETE' })));
            onUpdate(tags.filter(t => !selected.includes(t.id)));
            setSelected([]);
        }
        catch (err) {
            console.error('Bulk delete failed:', err);
        }
    };
    const handleMerge = async () => {
        if (selected.length < 2)
            return;
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
        }
        catch (err) {
            console.error('Merge failed:', err);
        }
    };
    return className = {} `tag-manager ${className}`;
}
 >
    className;
"toolbar" >
    { selected, : .length > 0 && { selected, : .length } } / span >
    { allowBulkDelete } && onClick;
{
    handleBulkDelete;
}
 > Delete;
Selected < /button>;
{
    allowMerge && selected.length > 1 && onClick;
    {
        handleMerge;
    }
     > Merge;
    Tags < /button>;
}
/>;
/div>
    < table >
    type;
"checkbox";
onChange = {}(e);
{
    setSelected(e.target.checked ? tags.map(t => t.id) : []);
}
/></th >
    Name < /th>
    < th > Count < /th>
    < th > Actions < /th>
    < /tr>
    < (/thead>);
{
    tags.map(tag => key = { tag, : .id } >
        type, "checkbox", checked = { selected, : .includes(tag.id) }, onChange = {}(e), {
        setSelected(e) { }, : .target.checked
            ? [...selected, tag.id]
            : selected.filter(id => id !== tag.id)
    });
}
/>
    < /td>
    < td > { tag, : .name } < /td>
    < td > { tag, : .count } < /td>
    < td >
    onClick;
{
    () => setEditingId(tag.id);
}
 > Edit < /button>
    < /td>
    < /tr>;
/tbody>
    < /table>
    < /div>;
;
function TagEditor({ tag, onSave, onCancel, className = '' }) {
    const [formData, setFormData] = (0, react_1.useState)(tag);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    return onSubmit = { handleSubmit };
    className = {} `tag-editor ${className}`;
}
 >
    Name < /label>
    < input;
type = "text";
value = { formData, : .name };
onChange = {}(e);
setFormData({ ...formData, name: e.target.value });
required
    /  >
    /div>
    < div >
    Slug < /label>
    < input;
type = "text";
value = { formData, : .slug };
onChange = {}(e);
setFormData({ ...formData, slug: e.target.value });
required
    /  >
    /div>
    < div >
    Description < /label>
    < textarea;
value = { formData, : .description || '' };
onChange = {}(e);
setFormData({ ...formData, description: e.target.value });
/>
    < /div>
    < div >
    Color < /label>
    < input;
type = "color";
value = { formData, : .color || '#cccccc' };
onChange = {}(e);
setFormData({ ...formData, color: e.target.value });
/>
    < /div>
    < div;
className = "actions" >
    type;
"submit" > Save < /button>
    < button;
type = "button";
onClick = { onCancel } > Cancel < /button>
    < /div>
    < /form>;
;
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
async function TagBulkEdit(tagIds, updates) {
    const response = await fetch('/api/tags/bulk-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tagIds, updates })
    });
    if (!response.ok) {
        throw new Error('Failed to bulk edit tags');
    }
}
function TaxonomyBuilder({ onSave, onCancel, initialData, className = '' }) {
    const [formData, setFormData] = (0, react_1.useState)(initialData || {
        name: '',
        slug: '',
        type: 'category',
        hierarchical: true,
        allowMultiple: false,
        settings: {}
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    return onSubmit = { handleSubmit };
    className = {} `taxonomy-builder ${className}`;
}
 >
    Create;
Taxonomy < /h2>
    < div >
    Name < /label>
    < input;
type = "text";
value = { formData, : .name || '' };
onChange = {}(e);
setFormData({ ...formData, name: e.target.value });
required
    /  >
    /div>
    < div >
    Slug < /label>
    < input;
type = "text";
value = { formData, : .slug || '' };
onChange = {}(e);
setFormData({ ...formData, slug: e.target.value });
required
    /  >
    /div>
    < div >
    Type < /label>
    < select;
value = { formData, : .type || 'category' };
onChange = {}(e);
setFormData({ ...formData, type: e.target.value });
    >
        value;
"category" > Category < /option>
    < option;
value = "tag" > Tag < /option>
    < option;
value = "custom" > Custom < /option>
    < /select>
    < /div>
    < div >
    type;
"checkbox";
checked = { formData, : .hierarchical || false };
onChange = {}(e);
setFormData({ ...formData, hierarchical: e.target.checked });
/>;
Hierarchical
    < /label>
    < /div>
    < div >
    type;
"checkbox";
checked = { formData, : .allowMultiple || false };
onChange = {}(e);
setFormData({ ...formData, allowMultiple: e.target.checked });
/>;
Allow;
Multiple;
Terms
    < /label>
    < /div>
    < div >
    Description < /label>
    < textarea;
value = { formData, : .description || '' };
onChange = {}(e);
setFormData({ ...formData, description: e.target.value });
/>
    < /div>
    < div;
className = "actions" >
    type;
"submit" > Create;
Taxonomy < /button>
    < button;
type = "button";
onClick = { onCancel } > Cancel < /button>
    < /div>
    < /form>;
;
function TaxonomyEditor({ taxonomy, onSave, onCancel, className = '' }) {
    const [formData, setFormData] = (0, react_1.useState)(taxonomy);
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };
    return onSubmit = { handleSubmit };
    className = {} `taxonomy-editor ${className}`;
}
 >
    Edit;
Taxonomy < /h2>
    < div >
    Name < /label>
    < input;
type = "text";
value = { formData, : .name };
onChange = {}(e);
setFormData({ ...formData, name: e.target.value });
required
    /  >
    /div>
    < div >
    Settings - Max;
Depth < /label>
    < input;
type = "number";
value = { formData, : .settings.maxDepth || '' };
onChange = {}(e);
setFormData({
    ...formData,
    settings: { ...formData.settings, maxDepth: parseInt(e.target.value) }
});
/>
    < /div>
    < div >
    Settings - Max;
Terms < /label>
    < input;
type = "number";
value = { formData, : .settings.maxTerms || '' };
onChange = {}(e);
setFormData({
    ...formData,
    settings: { ...formData.settings, maxTerms: parseInt(e.target.value) }
});
/>
    < /div>
    < div;
className = "actions" >
    type;
"submit" > Save;
Changes < /button>
    < button;
type = "button";
onClick = { onCancel } > Cancel < /button>
    < /div>
    < /form>;
;
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
async function TaxonomyImport(file, format) {
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
function CategoryFilters({ categories, selectedIds, onChange, showCounts = true, multiSelect = true, className = '' }) {
    const handleToggle = (categoryId) => {
        if (multiSelect) {
            if (selectedIds.includes(categoryId)) {
                onChange(selectedIds.filter(id => id !== categoryId));
            }
            else {
                onChange([...selectedIds, categoryId]);
            }
        }
        else {
            onChange([categoryId]);
        }
    };
    return className = {} `category-filters ${className}`;
}
 >
    { categories, : .map(category => key = { category, : .id } >
            type, { multiSelect, 'checkbox': 'radio' }, checked = { selectedIds, : .includes(category.id) }, onChange = {}(), handleToggle(category.id)) }
        /  >
    { category, : .name };
{
    showCounts && category.count !== undefined && (({ category, : .count }) < /span>);
}
/label>;
/div>;
;
function TagFilters({ tags, selectedTags, onChange, showCounts = true, className = '' }) {
    const toggleTag = (tagId) => {
        if (selectedTags.includes(tagId)) {
            onChange(selectedTags.filter(id => id !== tagId));
        }
        else {
            onChange([...selectedTags, tagId]);
        }
    };
    return className = {} `tag-filters ${className}`;
}
 >
    { tags, : .map(tag => key = { tag, : .id }, className = { selectedTags, : .includes(tag.id) ? 'active' : '' }, onClick = {}(), toggleTag(tag.id)) };
style = {};
{
    backgroundColor: tag.color;
}
    >
        { tag, : .name };
{
    showCounts && ({ tag, : .count }) < /span>;
}
/button>;
/div>;
;
function TaxonomyFilters({ taxonomies, onFilter, className = '' }) {
    const [filters, setFilters] = (0, react_1.useState)({});
    (0, react_1.useEffect)(() => {
        onFilter(filters);
    }, [filters, onFilter]);
    const updateFilter = (taxonomyId, termIds) => {
        setFilters(prev => ({
            ...prev,
            [taxonomyId]: termIds
        }));
    };
    return className = {} `taxonomy-filters ${className}`;
}
 >
    { taxonomies, : .map(taxonomy => key = { taxonomy, : .id }, className = "taxonomy-filter-section" >
            { taxonomy, : .name } < /h3>, { taxonomy, : .type === 'category' ? categories = { taxonomy, : .terms }
                :
            ,
            selectedIds = { filters, [taxonomy.id]:  || [] },
            onChange = {}(ids), updateFilter(taxonomy) { }, : .id, ids }) }
        /  >
;
tags = { taxonomy, : .terms };
selectedTags = { filters, [taxonomy.id]:  || [] };
onChange = {}(ids);
updateFilter(taxonomy.id, ids);
/>;
/div>;
/div>;
;
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
async function RelatedCategories(categoryId, limit = 10) {
    const response = await fetch(`/api/categories/${categoryId}/related?limit=${limit}`);
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
async function SuggestedTags(content, limit = 10) {
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
async function PopularTags(limit = 20, timeframe = 'all') {
    const response = await fetch(`/api/tags/popular?limit=${limit}&timeframe=${timeframe}`);
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
async function CategoryCounts(categoryIds) {
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
async function TagCounts(tagIds) {
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
async function TaxonomyStats(taxonomyId) {
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
async function MergeCategories(targetId, sourceIds) {
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
async function SplitCategories(categoryId, newCategories) {
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
async function CategoryAliases(categoryId, aliases) {
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
async function TaxonomyPermissions(taxonomyId) {
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
async function CategoryAccess(categoryId, action) {
    const response = await fetch(`/api/categories/${categoryId}/access?action=${action}`);
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
async function RestrictedTerms(taxonomyId) {
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
function buildCategoryTree(categories) {
    const categoryMap = new Map();
    const roots = [];
    // Create map of all categories
    categories.forEach(cat => {
        categoryMap.set(cat.id, { ...cat, children: [] });
    });
    // Build tree structure
    categories.forEach(cat => {
        const category = categoryMap.get(cat.id);
        if (cat.parentId && categoryMap.has(cat.parentId)) {
            const parent = categoryMap.get(cat.parentId);
            if (!parent.children)
                parent.children = [];
            parent.children.push(category);
        }
        else {
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
function flattenCategoryTree(tree) {
    const result = [];
    const flatten = (categories, level = 0) => {
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
function validateTaxonomy(taxonomy) {
    const errors = [];
    if (!taxonomy.name)
        errors.push('Name is required');
    if (!taxonomy.slug)
        errors.push('Slug is required');
    if (!taxonomy.type)
        errors.push('Type is required');
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
function getCategoryBreadcrumb(category, allCategories) {
    const breadcrumb = [];
    let current = category;
    while (current) {
        breadcrumb.unshift(current);
        current = current.parentId
            ? allCategories.find(c => c.id === current.parentId)
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
function searchTerms(terms, query) {
    const lowerQuery = query.toLowerCase();
    return terms.filter(term => term.name.toLowerCase().includes(lowerQuery) ||
        term.slug.toLowerCase().includes(lowerQuery) ||
        term.description?.toLowerCase().includes(lowerQuery));
}
//# sourceMappingURL=taxonomy-categories-kit.js.map
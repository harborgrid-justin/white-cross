'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Plus, Check, Tag as TagIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: (string | undefined)[]) => twMerge(clsx(inputs));

/**
 * Tag type
 */
export interface Tag {
  /** Unique tag ID */
  id: string;
  /** Tag label */
  label: string;
  /** Tag color */
  color?: string;
  /** Tag category */
  category?: string;
}

/**
 * TagSelector props
 */
export interface TagSelectorProps {
  /** Available tags */
  availableTags: Tag[];
  /** Selected tag IDs */
  selectedTags: string[];
  /** Selection change handler */
  onChange: (selectedTags: string[]) => void;
  /** Allow creating new tags */
  allowCreate?: boolean;
  /** Create tag handler */
  onCreate?: (tagLabel: string) => void | Promise<void>;
  /** Maximum number of tags */
  maxTags?: number;
  /** Placeholder text */
  placeholder?: string;
  /** Read-only mode */
  readOnly?: boolean;
  /** Custom className */
  className?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Variant */
  variant?: 'default' | 'outline' | 'filled';
}

/**
 * TagSelector - Tag selection and management component
 *
 * @example
 * ```tsx
 * const tags: Tag[] = [
 *   { id: '1', label: 'Allergy', color: 'red' },
 *   { id: '2', label: 'Medication', color: 'blue' },
 *   { id: '3', label: 'Chronic Condition', color: 'yellow' }
 * ];
 *
 * <TagSelector
 *   availableTags={tags}
 *   selectedTags={selectedTagIds}
 *   onChange={setSelectedTagIds}
 *   allowCreate
 *   onCreate={handleCreateTag}
 *   maxTags={5}
 * />
 * ```
 */
export const TagSelector: React.FC<TagSelectorProps> = ({
  availableTags,
  selectedTags,
  onChange,
  allowCreate = false,
  onCreate,
  maxTags,
  placeholder = 'Select tags...',
  readOnly = false,
  className,
  size = 'md',
  variant = 'default'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedTagObjects = availableTags.filter(tag => selectedTags.includes(tag.id));
  const isMaxReached = maxTags !== undefined && selectedTags.length >= maxTags;

  // Filter available tags based on search and selection
  const filteredTags = availableTags.filter(tag => {
    const matchesSearch = tag.label.toLowerCase().includes(searchQuery.toLowerCase());
    const notSelected = !selectedTags.includes(tag.id);
    return matchesSearch && notSelected;
  });

  const handleToggleTag = useCallback((tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter(id => id !== tagId));
    } else if (!isMaxReached) {
      onChange([...selectedTags, tagId]);
    }
  }, [selectedTags, onChange, isMaxReached]);

  const handleRemoveTag = useCallback((tagId: string) => {
    onChange(selectedTags.filter(id => id !== tagId));
  }, [selectedTags, onChange]);

  const handleCreateTag = useCallback(async () => {
    if (!searchQuery.trim() || !onCreate) return;

    setIsCreating(true);
    try {
      await onCreate(searchQuery.trim());
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to create tag:', error);
    } finally {
      setIsCreating(false);
    }
  }, [searchQuery, onCreate]);

  const handleInputFocus = () => {
    if (!readOnly) {
      setIsOpen(true);
    }
  };

  const showCreateOption = allowCreate && onCreate && searchQuery.trim() &&
    !filteredTags.some(tag => tag.label.toLowerCase() === searchQuery.toLowerCase());

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Selected Tags Display */}
      <div
        className={cn(
          'min-h-[42px] w-full rounded-md border bg-white dark:bg-gray-800 transition-all duration-200',
          variant === 'outline'
            ? 'border-gray-300 dark:border-gray-600'
            : variant === 'filled'
            ? 'border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'
            : 'border-gray-300 dark:border-gray-600',
          isOpen && !readOnly ? 'ring-2 ring-primary-500 border-primary-500' : undefined,
          readOnly ? 'bg-gray-50 dark:bg-gray-900 cursor-not-allowed' : undefined,
          'p-2'
        )}
        onClick={() => !readOnly && inputRef.current?.focus()}
      >
        <div className="flex flex-wrap items-center gap-2">
          {selectedTagObjects.map(tag => (
            <Badge
              key={tag.id}
              variant="secondary"
              size={size === 'lg' ? 'md' : 'sm'}
              className={cn(
                'group transition-all duration-150',
                !readOnly ? 'pr-1 hover:pr-0' : undefined
              )}
            >
              {tag.color && (
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1.5"
                  style={{ backgroundColor: tag.color }}
                  aria-hidden="true"
                />
              )}
              <span>{tag.label}</span>
              {!readOnly && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveTag(tag.id);
                  }}
                  className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-gray-300 dark:hover:bg-gray-600 rounded p-0.5"
                  aria-label={`Remove ${tag.label} tag`}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}

          {!readOnly && (
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={handleInputFocus}
              placeholder={selectedTags.length === 0 ? placeholder : ''}
              disabled={readOnly || isMaxReached}
              className={cn(
                'flex-1 min-w-[120px] outline-none bg-transparent',
                sizeClasses[size],
                'text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500',
                'disabled:cursor-not-allowed'
              )}
              aria-label="Search tags"
            />
          )}
        </div>

        {maxTags && (
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {selectedTags.length}/{maxTags} tags
          </div>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && !readOnly && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto animate-slideIn">
          {/* Available Tags */}
          {filteredTags.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-2 py-1">
                Available Tags
              </div>
              {filteredTags.map(tag => {
                const isSelected = selectedTags.includes(tag.id);

                return (
                  <button
                    key={tag.id}
                    onClick={() => handleToggleTag(tag.id)}
                    disabled={isMaxReached && !isSelected}
                    className={cn(
                      'w-full flex items-center justify-between gap-2 px-2 py-2 rounded transition-colors duration-150',
                      'hover:bg-gray-100 dark:hover:bg-gray-700',
                      'focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700',
                      'disabled:opacity-50 disabled:cursor-not-allowed',
                      sizeClasses[size]
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {tag.color && (
                        <span
                          className="inline-block w-2 h-2 rounded-full"
                          style={{ backgroundColor: tag.color }}
                          aria-hidden="true"
                        />
                      )}
                      <span className="text-gray-900 dark:text-gray-100">{tag.label}</span>
                      {tag.category && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {tag.category}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="h-4 w-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Create New Tag Option */}
          {showCreateOption && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCreateTag}
                isLoading={isCreating}
                className="w-full justify-start"
              >
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Create "{searchQuery}"
              </Button>
            </div>
          )}

          {/* Empty State */}
          {filteredTags.length === 0 && !showCreateOption && (
            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
              {searchQuery ? 'No tags found' : 'No available tags'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

TagSelector.displayName = 'TagSelector';

export default React.memo(TagSelector);





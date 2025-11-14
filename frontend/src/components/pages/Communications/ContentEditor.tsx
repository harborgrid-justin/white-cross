import React from 'react';
import DOMPurify from 'isomorphic-dompurify';
import { EyeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { CommunicationTemplate } from './CommunicationComposer.types';
import { getTypeIcon } from './CommunicationComposer.utils';

export interface ContentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  showPreview: boolean;
  onTogglePreview: () => void;
  showTemplates: boolean;
  onToggleTemplates: () => void;
  templates: CommunicationTemplate[];
  onTemplateSelect: (template: CommunicationTemplate) => void;
  tags: string[];
  tagInput: string;
  onTagInputChange: (value: string) => void;
  onTagKeyPress: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onRemoveTag: (tag: string) => void;
  contentRef?: React.RefObject<HTMLTextAreaElement>;
}

/**
 * ContentEditor Component
 *
 * Handles the message content editor with preview mode,
 * template selection, and tag management.
 *
 * @param props - The component props
 * @returns The rendered ContentEditor component
 */
const ContentEditor: React.FC<ContentEditorProps> = ({
  content,
  onContentChange,
  showPreview,
  onTogglePreview,
  showTemplates,
  onToggleTemplates,
  templates,
  onTemplateSelect,
  tags,
  tagInput,
  onTagInputChange,
  onTagKeyPress,
  onRemoveTag,
  contentRef
}) => {
  return (
    <>
      {/* Template and Preview Controls */}
      <div className="flex items-center justify-end space-x-2">
        {/* Templates */}
        {templates.length > 0 && (
          <button
            onClick={onToggleTemplates}
            className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded"
          >
            Templates
          </button>
        )}

        {/* Preview */}
        <button
          onClick={onTogglePreview}
          className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded"
        >
          <EyeIcon className="h-4 w-4" />
          <span>Preview</span>
        </button>
      </div>

      {/* Templates Dropdown */}
      {showTemplates && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Communication Templates</h4>
          <div className="space-y-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => onTemplateSelect(template)}
                className="w-full text-left p-2 border border-gray-200 rounded hover:bg-white hover:shadow-sm transition-all"
              >
                <div className="flex items-center space-x-2">
                  {getTypeIcon(template.type)}
                  <div>
                    <div className="text-sm font-medium text-gray-900">{template.name}</div>
                    <div className="text-xs text-gray-500">{template.subject}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
          Message
        </label>
        {showPreview ? (
          <div className="min-h-32 p-3 border border-gray-300 rounded-md bg-gray-50">
            <div className="prose max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(content.replace(/\n/g, '<br>'), {
                    ALLOWED_TAGS: ['br', 'p', 'b', 'i', 'u', 'strong', 'em'],
                    ALLOWED_ATTR: []
                  })
                }}
              />
            </div>
          </div>
        ) : (
          <textarea
            ref={contentRef}
            id="content"
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onContentChange(e.target.value)}
            placeholder="Enter your message..."
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          />
        )}
      </div>

      {/* Tags */}
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="space-y-2">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center space-x-1 bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
                >
                  <span>{tag}</span>
                  <button
                    onClick={() => onRemoveTag(tag)}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <input
            type="text"
            value={tagInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onTagInputChange(e.target.value)}
            onKeyDown={onTagKeyPress}
            placeholder="Add tags (press Enter or comma to add)..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </>
  );
};

export default ContentEditor;

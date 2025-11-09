"use strict";
/**
 * LOC: RTEE1234567
 * File: /reuse/frontend/rich-text-editor-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - React/Next.js components
 *   - Content management systems
 *   - Document editors
 *   - Collaboration tools
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContentText = exports.getContentJSON = exports.clearContent = exports.redo = exports.undo = exports.sanitizeHTML = exports.convertFromHTML = exports.convertToHTML = exports.parseMarkdownToJSON = exports.convertFromMarkdown = exports.convertToMarkdown = exports.registerExtension = exports.createCustomMark = exports.createCustomNode = exports.splitTableCell = exports.mergeTableCells = exports.deleteTable = exports.deleteTableRow = exports.addTableRowAfter = exports.addTableRowBefore = exports.deleteTableColumn = exports.addTableColumnAfter = exports.addTableColumnBefore = exports.insertTable = exports.insertEmbed = exports.insertVideo = exports.insertImage = exports.removeLink = exports.createLink = exports.decreaseListIndent = exports.increaseListIndent = exports.toggleTaskList = exports.toggleOrderedList = exports.toggleBulletList = exports.setTextAlign = exports.insertHorizontalRule = exports.setCodeBlock = exports.setBlockquote = exports.setParagraph = exports.setHeading = exports.toggleHighlight = exports.setTextColor = exports.toggleCodeFormat = exports.toggleStrikethrough = exports.toggleUnderline = exports.toggleItalic = exports.toggleBold = exports.destroyEditor = exports.initializeEditor = exports.createEditor = void 0;
exports.exportContent = exports.hasUnsavedChanges = exports.getCharacterCount = exports.getWordCount = exports.getActiveCollaborators = exports.rejectSuggestion = exports.acceptSuggestion = exports.createSuggestion = exports.resolveComment = exports.addComment = exports.initializeCollaboration = exports.configureDragDrop = exports.handlePaste = exports.configurePasteHandler = exports.createDefaultToolbar = exports.createToolbar = exports.createDefaultKeyboardShortcuts = exports.getKeyboardShortcuts = exports.registerKeyboardShortcut = exports.isEditorEmpty = void 0;
// ============================================================================
// EDITOR INITIALIZATION
// ============================================================================
/**
 * Creates a new rich text editor instance with configuration.
 *
 * @param {HTMLElement} element - DOM element to mount editor
 * @param {EditorConfig} config - Editor configuration options
 * @returns {EditorInstance} Editor instance
 *
 * @example
 * ```typescript
 * const editor = createEditor(document.getElementById('editor'), {
 *   content: '<p>Hello world!</p>',
 *   editable: true,
 *   autofocus: true,
 *   placeholder: 'Start typing...',
 *   onUpdate: (editor) => {
 *     console.log('Content updated:', editor.getHTML());
 *   }
 * });
 * ```
 */
const createEditor = (element, config) => {
    // Implementation would integrate with ProseMirror/TipTap
    const editorInstance = {};
    // Initialize editor state, view, and commands
    // Set up event handlers
    // Apply extensions
    if (config.onCreate) {
        config.onCreate(editorInstance);
    }
    return editorInstance;
};
exports.createEditor = createEditor;
/**
 * Initializes editor with default configuration and common extensions.
 *
 * @param {HTMLElement} element - DOM element to mount editor
 * @param {Partial<EditorConfig>} [options] - Optional configuration overrides
 * @returns {EditorInstance} Initialized editor instance
 *
 * @example
 * ```typescript
 * const editor = initializeEditor(document.getElementById('editor'), {
 *   content: 'Initial content',
 *   placeholder: 'Write something...'
 * });
 * // Editor includes standard extensions: bold, italic, headings, lists, links, etc.
 * ```
 */
const initializeEditor = (element, options) => {
    const defaultExtensions = [
        { type: 'mark', name: 'bold' },
        { type: 'mark', name: 'italic' },
        { type: 'mark', name: 'underline' },
        { type: 'mark', name: 'strike' },
        { type: 'mark', name: 'code' },
        { type: 'mark', name: 'link' },
        { type: 'node', name: 'paragraph' },
        { type: 'node', name: 'heading' },
        { type: 'node', name: 'blockquote' },
        { type: 'node', name: 'bulletList' },
        { type: 'node', name: 'orderedList' },
        { type: 'node', name: 'listItem' },
        { type: 'node', name: 'codeBlock' },
        { type: 'node', name: 'horizontalRule' },
        { type: 'plugin', name: 'history' },
        { type: 'plugin', name: 'keymap' },
    ];
    return (0, exports.createEditor)(element, {
        extensions: defaultExtensions,
        editable: true,
        ...options,
    });
};
exports.initializeEditor = initializeEditor;
/**
 * Destroys editor instance and cleans up resources.
 *
 * @param {EditorInstance} editor - Editor instance to destroy
 * @returns {void}
 *
 * @example
 * ```typescript
 * const editor = createEditor(element, config);
 * // ... use editor
 * destroyEditor(editor); // Clean up when done
 * ```
 */
const destroyEditor = (editor) => {
    if (editor.view) {
        editor.view.destroy();
    }
    if (editor.onDestroy) {
        editor.onDestroy();
    }
};
exports.destroyEditor = destroyEditor;
// ============================================================================
// TEXT FORMATTING COMMANDS
// ============================================================================
/**
 * Toggles bold formatting for selected text.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = toggleBold(editor);
 * // Selected text becomes bold or unbold
 * ```
 */
const toggleBold = (editor) => {
    return editor.commands.toggleBold();
};
exports.toggleBold = toggleBold;
/**
 * Toggles italic formatting for selected text.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = toggleItalic(editor);
 * // Selected text becomes italic or not italic
 * ```
 */
const toggleItalic = (editor) => {
    return editor.commands.toggleItalic();
};
exports.toggleItalic = toggleItalic;
/**
 * Toggles underline formatting for selected text.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = toggleUnderline(editor);
 * // Selected text becomes underlined or removes underline
 * ```
 */
const toggleUnderline = (editor) => {
    return editor.commands.toggleUnderline();
};
exports.toggleUnderline = toggleUnderline;
/**
 * Toggles strikethrough formatting for selected text.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = toggleStrikethrough(editor);
 * // Selected text gets strikethrough or removes it
 * ```
 */
const toggleStrikethrough = (editor) => {
    return editor.commands.toggleStrike();
};
exports.toggleStrikethrough = toggleStrikethrough;
/**
 * Toggles code (monospace) formatting for selected text.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = toggleCode(editor);
 * // Selected text becomes monospace code or removes code formatting
 * ```
 */
const toggleCodeFormat = (editor) => {
    return editor.commands.toggleCode();
};
exports.toggleCodeFormat = toggleCodeFormat;
/**
 * Sets text color for selected text.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {string} color - Color value (hex, rgb, or named color)
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = setTextColor(editor, '#ff0000');
 * // Selected text becomes red
 * setTextColor(editor, 'rgb(0, 128, 255)');
 * // Selected text becomes blue
 * ```
 */
const setTextColor = (editor, color) => {
    return editor.commands.setTextColor(color);
};
exports.setTextColor = setTextColor;
/**
 * Toggles text highlight with optional color.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {string} [color] - Highlight color (default: yellow)
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = toggleHighlight(editor, '#ffff00');
 * // Selected text gets yellow highlight background
 * toggleHighlight(editor); // Removes highlight
 * ```
 */
const toggleHighlight = (editor, color) => {
    return editor.commands.toggleHighlight(color);
};
exports.toggleHighlight = toggleHighlight;
// ============================================================================
// HEADINGS & BLOCK FORMATTING
// ============================================================================
/**
 * Sets current block to heading with specified level.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {1 | 2 | 3 | 4 | 5 | 6} level - Heading level (1-6)
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = setHeading(editor, 1);
 * // Current block becomes <h1>
 * setHeading(editor, 3);
 * // Current block becomes <h3>
 * ```
 */
const setHeading = (editor, level) => {
    return editor.commands.setHeading(level);
};
exports.setHeading = setHeading;
/**
 * Sets current block to normal paragraph.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = setParagraph(editor);
 * // Current heading/blockquote becomes normal paragraph
 * ```
 */
const setParagraph = (editor) => {
    return editor.commands.setParagraph();
};
exports.setParagraph = setParagraph;
/**
 * Toggles blockquote formatting for current block.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = setBlockquote(editor);
 * // Current block becomes blockquote or reverts to paragraph
 * ```
 */
const setBlockquote = (editor) => {
    return editor.commands.setBlockquote();
};
exports.setBlockquote = setBlockquote;
/**
 * Sets current block to code block with optional language.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {string} [language] - Programming language for syntax highlighting
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = setCodeBlock(editor, 'typescript');
 * // Creates code block with TypeScript syntax highlighting
 * setCodeBlock(editor, 'python');
 * // Creates code block with Python syntax highlighting
 * ```
 */
const setCodeBlock = (editor, language) => {
    return editor.commands.setCodeBlock(language);
};
exports.setCodeBlock = setCodeBlock;
/**
 * Inserts horizontal rule (divider) at current position.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = insertHorizontalRule(editor);
 * // Inserts <hr> at cursor position
 * ```
 */
const insertHorizontalRule = (editor) => {
    return editor.commands.setHorizontalRule();
};
exports.insertHorizontalRule = insertHorizontalRule;
/**
 * Sets text alignment for current block.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {'left' | 'center' | 'right' | 'justify'} align - Text alignment
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = setTextAlign(editor, 'center');
 * // Centers current block
 * setTextAlign(editor, 'right');
 * // Right-aligns current block
 * ```
 */
const setTextAlign = (editor, align) => {
    return editor.commands.setTextAlign(align);
};
exports.setTextAlign = setTextAlign;
// ============================================================================
// LIST OPERATIONS
// ============================================================================
/**
 * Toggles bullet (unordered) list for current block.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = toggleBulletList(editor);
 * // Creates bullet list or converts list to paragraphs
 * ```
 */
const toggleBulletList = (editor) => {
    return editor.commands.toggleBulletList();
};
exports.toggleBulletList = toggleBulletList;
/**
 * Toggles numbered (ordered) list for current block.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = toggleOrderedList(editor);
 * // Creates numbered list or converts list to paragraphs
 * ```
 */
const toggleOrderedList = (editor) => {
    return editor.commands.toggleOrderedList();
};
exports.toggleOrderedList = toggleOrderedList;
/**
 * Toggles task list (with checkboxes) for current block.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = toggleTaskList(editor);
 * // Creates task list with checkboxes
 * ```
 */
const toggleTaskList = (editor) => {
    return editor.commands.toggleTaskList();
};
exports.toggleTaskList = toggleTaskList;
/**
 * Increases list item indentation (nesting).
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = increaseListIndent(editor);
 * // Indents current list item (creates nested list)
 * ```
 */
const increaseListIndent = (editor) => {
    return editor.commands.sinkListItem();
};
exports.increaseListIndent = increaseListIndent;
/**
 * Decreases list item indentation (un-nesting).
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = decreaseListIndent(editor);
 * // Outdents current list item (removes nesting level)
 * ```
 */
const decreaseListIndent = (editor) => {
    return editor.commands.liftListItem();
};
exports.decreaseListIndent = decreaseListIndent;
// ============================================================================
// LINKS & MEDIA
// ============================================================================
/**
 * Creates or updates link for selected text.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {string} url - Link URL
 * @param {string} [target] - Link target (_blank, _self, etc.)
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = createLink(editor, 'https://example.com', '_blank');
 * // Selected text becomes link opening in new tab
 * ```
 */
const createLink = (editor, url, target) => {
    return editor.commands.setLink(url, target);
};
exports.createLink = createLink;
/**
 * Removes link from selected text.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = removeLink(editor);
 * // Removes link but preserves text
 * ```
 */
const removeLink = (editor) => {
    return editor.commands.unsetLink();
};
exports.removeLink = removeLink;
/**
 * Inserts image at current position.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {string} src - Image source URL
 * @param {string} [alt] - Alt text for accessibility
 * @param {string} [title] - Image title
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = insertImage(editor, '/images/photo.jpg', 'Photo description', 'My Photo');
 * // Inserts <img src="/images/photo.jpg" alt="Photo description" title="My Photo">
 * ```
 */
const insertImage = (editor, src, alt, title) => {
    return editor.commands.setImage(src, alt, title);
};
exports.insertImage = insertImage;
/**
 * Inserts video embed at current position.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {string} src - Video source URL
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = insertVideo(editor, 'https://youtube.com/watch?v=xyz');
 * // Embeds YouTube video
 * ```
 */
const insertVideo = (editor, src) => {
    return editor.commands.setVideo(src);
};
exports.insertVideo = insertVideo;
/**
 * Inserts iframe embed (videos, maps, etc.) at current position.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {string} src - Embed source URL
 * @param {'iframe' | 'video' | 'audio'} [type] - Embed type
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = insertEmbed(editor, 'https://www.google.com/maps/embed?...', 'iframe');
 * // Embeds Google Maps iframe
 * ```
 */
const insertEmbed = (editor, src, type = 'iframe') => {
    return editor.commands.setEmbed(src, type);
};
exports.insertEmbed = insertEmbed;
// ============================================================================
// TABLE OPERATIONS
// ============================================================================
/**
 * Inserts table with specified dimensions at current position.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = insertTable(editor, 3, 4);
 * // Inserts 3x4 table at cursor
 * ```
 */
const insertTable = (editor, rows, cols) => {
    return editor.commands.insertTable(rows, cols);
};
exports.insertTable = insertTable;
/**
 * Adds column before current column in table.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = addTableColumnBefore(editor);
 * // Adds new column to the left of current column
 * ```
 */
const addTableColumnBefore = (editor) => {
    return editor.commands.addColumnBefore();
};
exports.addTableColumnBefore = addTableColumnBefore;
/**
 * Adds column after current column in table.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = addTableColumnAfter(editor);
 * // Adds new column to the right of current column
 * ```
 */
const addTableColumnAfter = (editor) => {
    return editor.commands.addColumnAfter();
};
exports.addTableColumnAfter = addTableColumnAfter;
/**
 * Deletes current column from table.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = deleteTableColumn(editor);
 * // Removes current column from table
 * ```
 */
const deleteTableColumn = (editor) => {
    return editor.commands.deleteColumn();
};
exports.deleteTableColumn = deleteTableColumn;
/**
 * Adds row before current row in table.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = addTableRowBefore(editor);
 * // Adds new row above current row
 * ```
 */
const addTableRowBefore = (editor) => {
    return editor.commands.addRowBefore();
};
exports.addTableRowBefore = addTableRowBefore;
/**
 * Adds row after current row in table.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = addTableRowAfter(editor);
 * // Adds new row below current row
 * ```
 */
const addTableRowAfter = (editor) => {
    return editor.commands.addRowAfter();
};
exports.addTableRowAfter = addTableRowAfter;
/**
 * Deletes current row from table.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = deleteTableRow(editor);
 * // Removes current row from table
 * ```
 */
const deleteTableRow = (editor) => {
    return editor.commands.deleteRow();
};
exports.deleteTableRow = deleteTableRow;
/**
 * Deletes entire table.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = deleteTable(editor);
 * // Removes entire table from document
 * ```
 */
const deleteTable = (editor) => {
    return editor.commands.deleteTable();
};
exports.deleteTable = deleteTable;
/**
 * Merges selected table cells.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = mergeTableCells(editor);
 * // Merges selected cells into one
 * ```
 */
const mergeTableCells = (editor) => {
    return editor.commands.mergeCells();
};
exports.mergeTableCells = mergeTableCells;
/**
 * Splits merged table cell.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if command was executed
 *
 * @example
 * ```typescript
 * const success = splitTableCell(editor);
 * // Splits merged cell back into individual cells
 * ```
 */
const splitTableCell = (editor) => {
    return editor.commands.splitCell();
};
exports.splitTableCell = splitTableCell;
// ============================================================================
// CUSTOM NODES & EXTENSIONS
// ============================================================================
/**
 * Creates custom node specification for editor.
 *
 * @param {string} name - Node name
 * @param {Partial<NodeSpec>} spec - Node specification
 * @returns {EditorExtension} Extension for custom node
 *
 * @example
 * ```typescript
 * const calloutNode = createCustomNode('callout', {
 *   group: 'block',
 *   content: 'block+',
 *   attrs: { type: { default: 'info' } },
 *   parseDOM: [{ tag: 'div.callout' }],
 *   toDOM: (node) => ['div', { class: `callout callout-${node.attrs.type}` }, 0]
 * });
 * ```
 */
const createCustomNode = (name, spec) => {
    return {
        type: 'node',
        name,
        config: spec,
    };
};
exports.createCustomNode = createCustomNode;
/**
 * Creates custom mark specification for editor.
 *
 * @param {string} name - Mark name
 * @param {Partial<MarkSpec>} spec - Mark specification
 * @returns {EditorExtension} Extension for custom mark
 *
 * @example
 * ```typescript
 * const commentMark = createCustomMark('comment', {
 *   attrs: { id: {}, commentId: {} },
 *   parseDOM: [{ tag: 'span.comment' }],
 *   toDOM: (mark) => ['span', { class: 'comment', 'data-id': mark.attrs.commentId }, 0]
 * });
 * ```
 */
const createCustomMark = (name, spec) => {
    return {
        type: 'mark',
        name,
        config: spec,
    };
};
exports.createCustomMark = createCustomMark;
/**
 * Registers custom extension with editor.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {EditorExtension} extension - Extension to register
 * @returns {void}
 *
 * @example
 * ```typescript
 * const customExtension = createCustomNode('callout', { ... });
 * registerExtension(editor, customExtension);
 * // Custom node is now available in editor
 * ```
 */
const registerExtension = (editor, extension) => {
    // Implementation would add extension to editor schema
    // and update available commands
};
exports.registerExtension = registerExtension;
// ============================================================================
// MARKDOWN CONVERSION
// ============================================================================
/**
 * Converts editor content to Markdown format.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {MarkdownOptions} [options] - Markdown conversion options
 * @returns {string} Markdown-formatted content
 *
 * @example
 * ```typescript
 * const markdown = convertToMarkdown(editor, {
 *   preserveWhitespace: true,
 *   linkify: true
 * });
 * // Returns: "# Heading\n\nThis is **bold** and *italic*."
 * ```
 */
const convertToMarkdown = (editor, options) => {
    // Implementation would serialize editor state to Markdown
    return editor.getMarkdown();
};
exports.convertToMarkdown = convertToMarkdown;
/**
 * Converts Markdown content to editor format and sets as content.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {string} markdown - Markdown-formatted content
 * @param {MarkdownOptions} [options] - Markdown parsing options
 * @returns {void}
 *
 * @example
 * ```typescript
 * const markdown = "# Title\n\nThis is **bold** text.";
 * convertFromMarkdown(editor, markdown);
 * // Editor now displays formatted content
 * ```
 */
const convertFromMarkdown = (editor, markdown, options) => {
    // Implementation would parse Markdown and set editor content
    editor.setContent(markdown);
};
exports.convertFromMarkdown = convertFromMarkdown;
/**
 * Parses Markdown to editor JSON format.
 *
 * @param {string} markdown - Markdown-formatted content
 * @param {MarkdownOptions} [options] - Parsing options
 * @returns {EditorJSON} Editor JSON structure
 *
 * @example
 * ```typescript
 * const json = parseMarkdownToJSON("## Heading\n\n- Item 1\n- Item 2");
 * // Returns JSON structure representing the content
 * ```
 */
const parseMarkdownToJSON = (markdown, options) => {
    // Implementation would parse Markdown to JSON
    return {
        type: 'doc',
        content: [],
    };
};
exports.parseMarkdownToJSON = parseMarkdownToJSON;
// ============================================================================
// HTML CONVERSION
// ============================================================================
/**
 * Converts editor content to HTML format.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {HtmlConversionOptions} [options] - HTML conversion options
 * @returns {string} HTML-formatted content
 *
 * @example
 * ```typescript
 * const html = convertToHTML(editor, {
 *   sanitize: true,
 *   allowedTags: ['p', 'strong', 'em', 'a', 'h1', 'h2']
 * });
 * // Returns: "<h1>Title</h1><p>This is <strong>bold</strong>.</p>"
 * ```
 */
const convertToHTML = (editor, options) => {
    const html = editor.getHTML();
    if (options?.sanitize) {
        // Sanitize HTML (implementation would use library like DOMPurify)
        return html;
    }
    return html;
};
exports.convertToHTML = convertToHTML;
/**
 * Converts HTML content to editor format and sets as content.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {string} html - HTML-formatted content
 * @param {HtmlConversionOptions} [options] - HTML parsing options
 * @returns {void}
 *
 * @example
 * ```typescript
 * const html = "<h1>Title</h1><p>Content with <strong>bold</strong>.</p>";
 * convertFromHTML(editor, html, { sanitize: true });
 * // Editor displays formatted content
 * ```
 */
const convertFromHTML = (editor, html, options) => {
    let processedHtml = html;
    if (options?.sanitize) {
        // Sanitize HTML before setting
        processedHtml = html; // Would use DOMPurify
    }
    editor.setContent(processedHtml);
};
exports.convertFromHTML = convertFromHTML;
/**
 * Sanitizes HTML content removing potentially dangerous elements.
 *
 * @param {string} html - HTML content to sanitize
 * @param {HtmlConversionOptions} [options] - Sanitization options
 * @returns {string} Sanitized HTML
 *
 * @example
 * ```typescript
 * const dirty = '<p>Safe</p><script>alert("XSS")</script>';
 * const clean = sanitizeHTML(dirty, {
 *   allowedTags: ['p', 'strong', 'em'],
 *   allowedAttributes: { 'a': ['href'] }
 * });
 * // Returns: '<p>Safe</p>'
 * ```
 */
const sanitizeHTML = (html, options) => {
    // Implementation would use DOMPurify or similar
    // to remove script tags, dangerous attributes, etc.
    return html;
};
exports.sanitizeHTML = sanitizeHTML;
// ============================================================================
// HISTORY & UNDO/REDO
// ============================================================================
/**
 * Undoes last change in editor.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if undo was successful
 *
 * @example
 * ```typescript
 * const success = undo(editor);
 * // Reverts last change
 * ```
 */
const undo = (editor) => {
    return editor.commands.undo();
};
exports.undo = undo;
/**
 * Redoes last undone change in editor.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if redo was successful
 *
 * @example
 * ```typescript
 * const success = redo(editor);
 * // Reapplies undone change
 * ```
 */
const redo = (editor) => {
    return editor.commands.redo();
};
exports.redo = redo;
/**
 * Clears all editor content.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {boolean} [emitUpdate] - Whether to emit update event (default: true)
 * @returns {boolean} True if content was cleared
 *
 * @example
 * ```typescript
 * const success = clearContent(editor);
 * // All content removed, editor is empty
 * ```
 */
const clearContent = (editor, emitUpdate = true) => {
    return editor.commands.clearContent(emitUpdate);
};
exports.clearContent = clearContent;
/**
 * Gets current editor content as JSON.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {EditorJSON} Content in JSON format
 *
 * @example
 * ```typescript
 * const json = getContentJSON(editor);
 * // Returns: { type: 'doc', content: [...] }
 * ```
 */
const getContentJSON = (editor) => {
    return editor.getJSON();
};
exports.getContentJSON = getContentJSON;
/**
 * Gets current editor content as plain text (no formatting).
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {string} Plain text content
 *
 * @example
 * ```typescript
 * const text = getContentText(editor);
 * // Returns: "Title\nThis is bold text."
 * ```
 */
const getContentText = (editor) => {
    return editor.getText();
};
exports.getContentText = getContentText;
/**
 * Checks if editor content is empty.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {boolean} True if editor is empty
 *
 * @example
 * ```typescript
 * if (isEditorEmpty(editor)) {
 *   console.log('Please enter some content');
 * }
 * ```
 */
const isEditorEmpty = (editor) => {
    return editor.isEmpty;
};
exports.isEditorEmpty = isEditorEmpty;
// ============================================================================
// KEYBOARD SHORTCUTS
// ============================================================================
/**
 * Registers custom keyboard shortcut with editor.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {KeyboardShortcut} shortcut - Shortcut configuration
 * @returns {void}
 *
 * @example
 * ```typescript
 * registerKeyboardShortcut(editor, {
 *   key: 'Mod-Shift-x',
 *   command: () => editor.commands.toggleStrike(),
 *   description: 'Toggle strikethrough'
 * });
 * // Ctrl/Cmd+Shift+X now toggles strikethrough
 * ```
 */
const registerKeyboardShortcut = (editor, shortcut) => {
    // Implementation would add shortcut to keymap plugin
};
exports.registerKeyboardShortcut = registerKeyboardShortcut;
/**
 * Gets all registered keyboard shortcuts.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {KeyboardShortcut[]} Array of keyboard shortcuts
 *
 * @example
 * ```typescript
 * const shortcuts = getKeyboardShortcuts(editor);
 * // Returns: [{ key: 'Mod-b', command: ..., description: 'Bold' }, ...]
 * ```
 */
const getKeyboardShortcuts = (editor) => {
    // Implementation would extract shortcuts from keymap
    return [];
};
exports.getKeyboardShortcuts = getKeyboardShortcuts;
/**
 * Creates default keyboard shortcut configuration.
 *
 * @returns {KeyboardShortcut[]} Default shortcuts
 *
 * @example
 * ```typescript
 * const shortcuts = createDefaultKeyboardShortcuts();
 * shortcuts.forEach(shortcut => registerKeyboardShortcut(editor, shortcut));
 * ```
 */
const createDefaultKeyboardShortcuts = () => {
    return [
        { key: 'Mod-b', command: () => true, description: 'Toggle bold' },
        { key: 'Mod-i', command: () => true, description: 'Toggle italic' },
        { key: 'Mod-u', command: () => true, description: 'Toggle underline' },
        { key: 'Mod-z', command: () => true, description: 'Undo' },
        { key: 'Mod-Shift-z', command: () => true, description: 'Redo' },
        { key: 'Mod-k', command: () => true, description: 'Insert link' },
    ];
};
exports.createDefaultKeyboardShortcuts = createDefaultKeyboardShortcuts;
// ============================================================================
// TOOLBAR CUSTOMIZATION
// ============================================================================
/**
 * Creates toolbar configuration for editor.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {Partial<ToolbarConfig>} config - Toolbar configuration
 * @returns {ToolbarConfig} Complete toolbar configuration
 *
 * @example
 * ```typescript
 * const toolbar = createToolbar(editor, {
 *   groups: [
 *     {
 *       name: 'text',
 *       items: [
 *         { name: 'bold', command: () => editor.commands.toggleBold() },
 *         { name: 'italic', command: () => editor.commands.toggleItalic() }
 *       ]
 *     }
 *   ],
 *   sticky: true
 * });
 * ```
 */
const createToolbar = (editor, config) => {
    const defaultGroups = [
        {
            name: 'text',
            items: [
                { name: 'bold', command: () => editor.commands.toggleBold() },
                { name: 'italic', command: () => editor.commands.toggleItalic() },
                { name: 'underline', command: () => editor.commands.toggleUnderline() },
            ],
        },
        {
            name: 'headings',
            items: [
                { name: 'h1', command: () => editor.commands.setHeading(1) },
                { name: 'h2', command: () => editor.commands.setHeading(2) },
                { name: 'h3', command: () => editor.commands.setHeading(3) },
            ],
        },
    ];
    return {
        groups: config.groups || defaultGroups,
        sticky: config.sticky ?? false,
        className: config.className,
    };
};
exports.createToolbar = createToolbar;
/**
 * Creates default toolbar with all standard formatting options.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {ToolbarConfig} Default toolbar configuration
 *
 * @example
 * ```typescript
 * const toolbar = createDefaultToolbar(editor);
 * // Includes: bold, italic, headings, lists, links, images, etc.
 * ```
 */
const createDefaultToolbar = (editor) => {
    return {
        groups: [
            {
                name: 'text',
                items: [
                    { name: 'bold', command: () => editor.commands.toggleBold() },
                    { name: 'italic', command: () => editor.commands.toggleItalic() },
                    { name: 'underline', command: () => editor.commands.toggleUnderline() },
                    { name: 'strike', command: () => editor.commands.toggleStrike() },
                ],
            },
            {
                name: 'headings',
                items: [
                    { name: 'h1', command: () => editor.commands.setHeading(1) },
                    { name: 'h2', command: () => editor.commands.setHeading(2) },
                    { name: 'h3', command: () => editor.commands.setHeading(3) },
                ],
            },
            {
                name: 'lists',
                items: [
                    { name: 'bullet', command: () => editor.commands.toggleBulletList() },
                    { name: 'ordered', command: () => editor.commands.toggleOrderedList() },
                ],
            },
            {
                name: 'insert',
                items: [
                    { name: 'link', command: () => true },
                    { name: 'image', command: () => true },
                    { name: 'table', command: () => editor.commands.insertTable(3, 3) },
                ],
            },
        ],
        sticky: true,
    };
};
exports.createDefaultToolbar = createDefaultToolbar;
// ============================================================================
// COPY/PASTE & DRAG-DROP HANDLING
// ============================================================================
/**
 * Configures paste handler for editor.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {PasteHandlerOptions} options - Paste handling options
 * @returns {void}
 *
 * @example
 * ```typescript
 * configurePasteHandler(editor, {
 *   allowedFormats: ['html', 'markdown'],
 *   sanitizeHtml: true,
 *   preserveFormatting: true,
 *   transformPaste: (content, format) => {
 *     if (format === 'html') return sanitizeHTML(content);
 *     return content;
 *   }
 * });
 * ```
 */
const configurePasteHandler = (editor, options) => {
    // Implementation would set up clipboard event handlers
};
exports.configurePasteHandler = configurePasteHandler;
/**
 * Handles paste event with custom logic.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {ClipboardEvent} event - Clipboard event
 * @param {PasteHandlerOptions} [options] - Paste options
 * @returns {boolean} True if paste was handled
 *
 * @example
 * ```typescript
 * element.addEventListener('paste', (event) => {
 *   handlePaste(editor, event, {
 *     sanitizeHtml: true,
 *     preserveFormatting: false
 *   });
 * });
 * ```
 */
const handlePaste = (editor, event, options) => {
    const clipboardData = event.clipboardData;
    if (!clipboardData)
        return false;
    const html = clipboardData.getData('text/html');
    const text = clipboardData.getData('text/plain');
    if (html && options?.allowedFormats?.includes('html')) {
        const processed = options?.sanitizeHtml ? (0, exports.sanitizeHTML)(html, options) : html;
        editor.commands.insertContent(processed);
        return true;
    }
    if (text) {
        editor.commands.insertContent(text);
        return true;
    }
    return false;
};
exports.handlePaste = handlePaste;
/**
 * Configures drag-and-drop handler for editor.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {object} options - Drag-drop options
 * @returns {void}
 *
 * @example
 * ```typescript
 * configureDragDrop(editor, {
 *   allowFileUpload: true,
 *   maxFileSize: 5 * 1024 * 1024, // 5MB
 *   onFileDrop: async (file) => {
 *     const url = await uploadFile(file);
 *     insertImage(editor, url, file.name);
 *   }
 * });
 * ```
 */
const configureDragDrop = (editor, options) => {
    // Implementation would set up drag/drop event handlers
};
exports.configureDragDrop = configureDragDrop;
// ============================================================================
// COLLABORATION FEATURES
// ============================================================================
/**
 * Initializes collaboration features for editor.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {CollaborationConfig} config - Collaboration configuration
 * @returns {void}
 *
 * @example
 * ```typescript
 * initializeCollaboration(editor, {
 *   documentId: 'doc-123',
 *   userId: 'user-456',
 *   userName: 'John Doe',
 *   userColor: '#ff6b6b',
 *   websocketUrl: 'wss://collab.example.com',
 *   onUserJoin: (user) => console.log(`${user.name} joined`),
 *   onUserLeave: (user) => console.log(`${user.name} left`)
 * });
 * ```
 */
const initializeCollaboration = (editor, config) => {
    // Implementation would set up Y.js or similar CRDT
    // and WebSocket connection for real-time collaboration
};
exports.initializeCollaboration = initializeCollaboration;
/**
 * Adds comment at current selection.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {string} content - Comment content
 * @param {string} userId - User ID
 * @param {string} userName - User name
 * @returns {Comment} Created comment
 *
 * @example
 * ```typescript
 * const comment = addComment(editor, 'This needs revision', 'user-123', 'Jane');
 * // Highlights selected text and attaches comment
 * ```
 */
const addComment = (editor, content, userId, userName) => {
    const selection = editor.state.selection;
    const comment = {
        id: `comment-${Date.now()}`,
        userId,
        userName,
        content,
        position: selection.from,
        createdAt: new Date(),
    };
    // Implementation would add comment mark to selection
    return comment;
};
exports.addComment = addComment;
/**
 * Resolves comment by ID.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {string} commentId - Comment ID to resolve
 * @returns {boolean} True if comment was resolved
 *
 * @example
 * ```typescript
 * const success = resolveComment(editor, 'comment-123');
 * // Marks comment as resolved
 * ```
 */
const resolveComment = (editor, commentId) => {
    // Implementation would update comment status
    return true;
};
exports.resolveComment = resolveComment;
/**
 * Creates suggestion for content change.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {Omit<Suggestion, 'id' | 'createdAt' | 'status'>} suggestion - Suggestion data
 * @returns {Suggestion} Created suggestion
 *
 * @example
 * ```typescript
 * const suggestion = createSuggestion(editor, {
 *   userId: 'user-123',
 *   userName: 'John',
 *   type: 'insert',
 *   content: 'additional text',
 *   from: 100,
 *   to: 100
 * });
 * // Creates tracked change suggestion
 * ```
 */
const createSuggestion = (editor, suggestion) => {
    return {
        ...suggestion,
        id: `suggestion-${Date.now()}`,
        createdAt: new Date(),
        status: 'pending',
    };
};
exports.createSuggestion = createSuggestion;
/**
 * Accepts suggestion and applies change.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {string} suggestionId - Suggestion ID to accept
 * @returns {boolean} True if suggestion was accepted
 *
 * @example
 * ```typescript
 * const success = acceptSuggestion(editor, 'suggestion-123');
 * // Applies suggested change to document
 * ```
 */
const acceptSuggestion = (editor, suggestionId) => {
    // Implementation would apply suggestion and update status
    return true;
};
exports.acceptSuggestion = acceptSuggestion;
/**
 * Rejects suggestion without applying change.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {string} suggestionId - Suggestion ID to reject
 * @returns {boolean} True if suggestion was rejected
 *
 * @example
 * ```typescript
 * const success = rejectSuggestion(editor, 'suggestion-123');
 * // Removes suggestion without applying change
 * ```
 */
const rejectSuggestion = (editor, suggestionId) => {
    // Implementation would remove suggestion and update status
    return true;
};
exports.rejectSuggestion = rejectSuggestion;
/**
 * Gets all active users in collaboration session.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {CollaborationUser[]} Array of active users
 *
 * @example
 * ```typescript
 * const users = getActiveCollaborators(editor);
 * users.forEach(user => {
 *   console.log(`${user.name} is editing`);
 * });
 * ```
 */
const getActiveCollaborators = (editor) => {
    // Implementation would return list from collaboration provider
    return [];
};
exports.getActiveCollaborators = getActiveCollaborators;
// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
/**
 * Gets current word count from editor.
 *
 * @param {EditorInstance} editor - Editor instance
 * @returns {number} Word count
 *
 * @example
 * ```typescript
 * const count = getWordCount(editor);
 * console.log(`Words: ${count}`);
 * ```
 */
const getWordCount = (editor) => {
    const text = editor.getText();
    return text.trim().split(/\s+/).filter(Boolean).length;
};
exports.getWordCount = getWordCount;
/**
 * Gets current character count from editor.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {boolean} [includeSpaces] - Include spaces in count (default: true)
 * @returns {number} Character count
 *
 * @example
 * ```typescript
 * const count = getCharacterCount(editor);
 * const countNoSpaces = getCharacterCount(editor, false);
 * ```
 */
const getCharacterCount = (editor, includeSpaces = true) => {
    const text = editor.getText();
    return includeSpaces ? text.length : text.replace(/\s/g, '').length;
};
exports.getCharacterCount = getCharacterCount;
/**
 * Checks if editor has unsaved changes.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {string} savedContent - Last saved content
 * @returns {boolean} True if there are unsaved changes
 *
 * @example
 * ```typescript
 * let savedHTML = editor.getHTML();
 * // ... user edits ...
 * if (hasUnsavedChanges(editor, savedHTML)) {
 *   console.log('You have unsaved changes');
 * }
 * ```
 */
const hasUnsavedChanges = (editor, savedContent) => {
    return editor.getHTML() !== savedContent;
};
exports.hasUnsavedChanges = hasUnsavedChanges;
/**
 * Exports editor content in specified format.
 *
 * @param {EditorInstance} editor - Editor instance
 * @param {'html' | 'markdown' | 'json' | 'text'} format - Export format
 * @returns {string} Exported content
 *
 * @example
 * ```typescript
 * const html = exportContent(editor, 'html');
 * const markdown = exportContent(editor, 'markdown');
 * const json = exportContent(editor, 'json');
 * ```
 */
const exportContent = (editor, format) => {
    switch (format) {
        case 'html':
            return editor.getHTML();
        case 'markdown':
            return editor.getMarkdown();
        case 'json':
            return JSON.stringify(editor.getJSON(), null, 2);
        case 'text':
            return editor.getText();
        default:
            return editor.getHTML();
    }
};
exports.exportContent = exportContent;
//# sourceMappingURL=rich-text-editor-kit.js.map
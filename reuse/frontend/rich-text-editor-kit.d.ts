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
/**
 * File: /reuse/frontend/rich-text-editor-kit.ts
 * Locator: WC-FRN-RTEE-001
 * Purpose: Comprehensive Rich Text Editor Utilities - ProseMirror/TipTap patterns, formatting, collaboration, markdown
 *
 * Upstream: Independent utility module for rich text editing in React/Next.js applications
 * Downstream: ../frontend/*, content editors, document management, collaboration features
 * Dependencies: TypeScript 5.x, React 18+, ProseMirror, TipTap, Y.js (optional)
 * Exports: 48 utility functions for rich text editing, formatting, collaboration, markdown/HTML conversion
 *
 * LLM Context: Production-ready rich text editor utilities for React/Next.js applications in White Cross system.
 * Provides editor initialization, text formatting (bold, italic, headings), lists, links, images, tables, code blocks,
 * markdown/HTML conversion, collaboration features, undo/redo, keyboard shortcuts, and copy/paste handling.
 * Essential for building feature-rich content editing experiences.
 */
interface EditorConfig {
    content?: string;
    editable?: boolean;
    autofocus?: boolean;
    placeholder?: string;
    extensions?: EditorExtension[];
    onCreate?: (editor: EditorInstance) => void;
    onUpdate?: (editor: EditorInstance) => void;
    onSelectionUpdate?: (editor: EditorInstance) => void;
    onTransaction?: (transaction: EditorTransaction) => void;
    onFocus?: (editor: EditorInstance) => void;
    onBlur?: (editor: EditorInstance) => void;
    onDestroy?: () => void;
}
interface EditorInstance {
    commands: EditorCommands;
    state: EditorState;
    view: EditorView;
    schema: EditorSchema;
    isEditable: boolean;
    isEmpty: boolean;
    getHTML: () => string;
    getJSON: () => EditorJSON;
    getText: () => string;
    getMarkdown: () => string;
    setContent: (content: string, emitUpdate?: boolean) => void;
    setEditable: (editable: boolean) => void;
    destroy: () => void;
    focus: (position?: 'start' | 'end' | number) => void;
    blur: () => void;
}
interface EditorCommands {
    toggleBold: () => boolean;
    toggleItalic: () => boolean;
    toggleUnderline: () => boolean;
    toggleStrike: () => boolean;
    toggleCode: () => boolean;
    toggleHighlight: (color?: string) => boolean;
    setTextColor: (color: string) => boolean;
    setBackgroundColor: (color: string) => boolean;
    setParagraph: () => boolean;
    setHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => boolean;
    setBlockquote: () => boolean;
    setCodeBlock: (language?: string) => boolean;
    setHorizontalRule: () => boolean;
    toggleBulletList: () => boolean;
    toggleOrderedList: () => boolean;
    toggleTaskList: () => boolean;
    toggleTaskItem: () => boolean;
    liftListItem: () => boolean;
    sinkListItem: () => boolean;
    setLink: (url: string, target?: string) => boolean;
    unsetLink: () => boolean;
    setImage: (src: string, alt?: string, title?: string) => boolean;
    setVideo: (src: string) => boolean;
    setEmbed: (src: string, type: 'iframe' | 'video' | 'audio') => boolean;
    insertTable: (rows: number, cols: number) => boolean;
    addColumnBefore: () => boolean;
    addColumnAfter: () => boolean;
    deleteColumn: () => boolean;
    addRowBefore: () => boolean;
    addRowAfter: () => boolean;
    deleteRow: () => boolean;
    deleteTable: () => boolean;
    mergeCells: () => boolean;
    splitCell: () => boolean;
    toggleHeaderRow: () => boolean;
    toggleHeaderColumn: () => boolean;
    setTextAlign: (align: 'left' | 'center' | 'right' | 'justify') => boolean;
    undo: () => boolean;
    redo: () => boolean;
    clearContent: (emitUpdate?: boolean) => boolean;
    clearNodes: () => boolean;
    insertContent: (content: string) => boolean;
    insertContentAt: (position: number, content: string) => boolean;
    selectAll: () => boolean;
    selectTextBlock: () => boolean;
    selectParentNode: () => boolean;
    deleteSelection: () => boolean;
    createCustomCommand: (name: string, fn: () => boolean) => void;
}
interface EditorState {
    doc: EditorNode;
    selection: EditorSelection;
    storedMarks: EditorMark[] | null;
    tr: EditorTransaction;
}
interface EditorView {
    state: EditorState;
    dom: HTMLElement;
    dispatch: (tr: EditorTransaction) => void;
    focus: () => void;
    destroy: () => void;
}
interface EditorSchema {
    nodes: Record<string, NodeSpec>;
    marks: Record<string, MarkSpec>;
}
interface EditorNode {
    type: NodeType;
    content: EditorNode[];
    attrs: Record<string, any>;
    marks: EditorMark[];
    text?: string;
    textContent: string;
    nodeSize: number;
    childCount: number;
}
interface EditorMark {
    type: MarkType;
    attrs: Record<string, any>;
}
interface EditorSelection {
    from: number;
    to: number;
    empty: boolean;
    anchor: number;
    head: number;
}
interface EditorTransaction {
    doc: EditorNode;
    selection: EditorSelection;
    before: EditorState;
    docChanged: boolean;
    selectionSet: boolean;
    storedMarksSet: boolean;
}
interface NodeType {
    name: string;
    schema: EditorSchema;
    spec: NodeSpec;
    isBlock: boolean;
    isText: boolean;
    isInline: boolean;
    isAtom: boolean;
}
interface MarkType {
    name: string;
    schema: EditorSchema;
    spec: MarkSpec;
    isInSet: (marks: EditorMark[]) => EditorMark | null;
}
interface NodeSpec {
    content?: string;
    marks?: string;
    group?: string;
    inline?: boolean;
    atom?: boolean;
    attrs?: Record<string, AttributeSpec>;
    parseDOM?: ParseRule[];
    toDOM?: (node: EditorNode) => any;
}
interface MarkSpec {
    attrs?: Record<string, AttributeSpec>;
    inclusive?: boolean;
    excludes?: string;
    group?: string;
    spanning?: boolean;
    parseDOM?: ParseRule[];
    toDOM?: (mark: EditorMark, inline: boolean) => any;
}
interface AttributeSpec {
    default?: any;
}
interface ParseRule {
    tag?: string;
    attrs?: Record<string, any>;
    getAttrs?: (node: HTMLElement) => Record<string, any> | null;
    priority?: number;
}
interface EditorExtension {
    type: 'node' | 'mark' | 'plugin';
    name: string;
    priority?: number;
    config?: Record<string, any>;
}
interface EditorJSON {
    type: string;
    content?: EditorJSON[];
    marks?: Array<{
        type: string;
        attrs?: Record<string, any>;
    }>;
    attrs?: Record<string, any>;
    text?: string;
}
interface KeyboardShortcut {
    key: string;
    command: () => boolean;
    description?: string;
}
interface ToolbarConfig {
    groups: ToolbarGroup[];
    sticky?: boolean;
    className?: string;
}
interface ToolbarGroup {
    name: string;
    items: ToolbarItem[];
}
interface ToolbarItem {
    name: string;
    icon?: string;
    title?: string;
    command: () => boolean;
    isActive?: () => boolean;
    isDisabled?: () => boolean;
}
interface CollaborationConfig {
    documentId: string;
    userId: string;
    userName: string;
    userColor?: string;
    websocketUrl?: string;
    onConnect?: () => void;
    onDisconnect?: () => void;
    onUserJoin?: (user: CollaborationUser) => void;
    onUserLeave?: (user: CollaborationUser) => void;
}
interface CollaborationUser {
    id: string;
    name: string;
    color: string;
    cursor?: EditorSelection;
}
interface Comment {
    id: string;
    userId: string;
    userName: string;
    content: string;
    position: number;
    createdAt: Date;
    resolvedAt?: Date;
    replies?: Comment[];
}
interface Suggestion {
    id: string;
    userId: string;
    userName: string;
    type: 'insert' | 'delete' | 'format';
    content: string;
    from: number;
    to: number;
    createdAt: Date;
    status: 'pending' | 'accepted' | 'rejected';
}
interface PasteHandlerOptions {
    allowedFormats?: ('html' | 'text' | 'markdown')[];
    sanitizeHtml?: boolean;
    preserveFormatting?: boolean;
    transformPaste?: (content: string, format: string) => string;
}
interface MarkdownOptions {
    codeBlockLanguages?: string[];
    preserveWhitespace?: boolean;
    linkify?: boolean;
    breaks?: boolean;
    typographer?: boolean;
}
interface HtmlConversionOptions {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
    sanitize?: boolean;
    preserveWhitespace?: boolean;
}
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
export declare const createEditor: (element: HTMLElement, config: EditorConfig) => EditorInstance;
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
export declare const initializeEditor: (element: HTMLElement, options?: Partial<EditorConfig>) => EditorInstance;
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
export declare const destroyEditor: (editor: EditorInstance) => void;
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
export declare const toggleBold: (editor: EditorInstance) => boolean;
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
export declare const toggleItalic: (editor: EditorInstance) => boolean;
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
export declare const toggleUnderline: (editor: EditorInstance) => boolean;
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
export declare const toggleStrikethrough: (editor: EditorInstance) => boolean;
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
export declare const toggleCodeFormat: (editor: EditorInstance) => boolean;
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
export declare const setTextColor: (editor: EditorInstance, color: string) => boolean;
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
export declare const toggleHighlight: (editor: EditorInstance, color?: string) => boolean;
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
export declare const setHeading: (editor: EditorInstance, level: 1 | 2 | 3 | 4 | 5 | 6) => boolean;
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
export declare const setParagraph: (editor: EditorInstance) => boolean;
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
export declare const setBlockquote: (editor: EditorInstance) => boolean;
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
export declare const setCodeBlock: (editor: EditorInstance, language?: string) => boolean;
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
export declare const insertHorizontalRule: (editor: EditorInstance) => boolean;
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
export declare const setTextAlign: (editor: EditorInstance, align: "left" | "center" | "right" | "justify") => boolean;
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
export declare const toggleBulletList: (editor: EditorInstance) => boolean;
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
export declare const toggleOrderedList: (editor: EditorInstance) => boolean;
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
export declare const toggleTaskList: (editor: EditorInstance) => boolean;
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
export declare const increaseListIndent: (editor: EditorInstance) => boolean;
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
export declare const decreaseListIndent: (editor: EditorInstance) => boolean;
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
export declare const createLink: (editor: EditorInstance, url: string, target?: string) => boolean;
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
export declare const removeLink: (editor: EditorInstance) => boolean;
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
export declare const insertImage: (editor: EditorInstance, src: string, alt?: string, title?: string) => boolean;
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
export declare const insertVideo: (editor: EditorInstance, src: string) => boolean;
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
export declare const insertEmbed: (editor: EditorInstance, src: string, type?: "iframe" | "video" | "audio") => boolean;
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
export declare const insertTable: (editor: EditorInstance, rows: number, cols: number) => boolean;
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
export declare const addTableColumnBefore: (editor: EditorInstance) => boolean;
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
export declare const addTableColumnAfter: (editor: EditorInstance) => boolean;
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
export declare const deleteTableColumn: (editor: EditorInstance) => boolean;
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
export declare const addTableRowBefore: (editor: EditorInstance) => boolean;
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
export declare const addTableRowAfter: (editor: EditorInstance) => boolean;
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
export declare const deleteTableRow: (editor: EditorInstance) => boolean;
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
export declare const deleteTable: (editor: EditorInstance) => boolean;
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
export declare const mergeTableCells: (editor: EditorInstance) => boolean;
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
export declare const splitTableCell: (editor: EditorInstance) => boolean;
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
export declare const createCustomNode: (name: string, spec: Partial<NodeSpec>) => EditorExtension;
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
export declare const createCustomMark: (name: string, spec: Partial<MarkSpec>) => EditorExtension;
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
export declare const registerExtension: (editor: EditorInstance, extension: EditorExtension) => void;
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
export declare const convertToMarkdown: (editor: EditorInstance, options?: MarkdownOptions) => string;
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
export declare const convertFromMarkdown: (editor: EditorInstance, markdown: string, options?: MarkdownOptions) => void;
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
export declare const parseMarkdownToJSON: (markdown: string, options?: MarkdownOptions) => EditorJSON;
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
export declare const convertToHTML: (editor: EditorInstance, options?: HtmlConversionOptions) => string;
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
export declare const convertFromHTML: (editor: EditorInstance, html: string, options?: HtmlConversionOptions) => void;
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
export declare const sanitizeHTML: (html: string, options?: HtmlConversionOptions) => string;
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
export declare const undo: (editor: EditorInstance) => boolean;
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
export declare const redo: (editor: EditorInstance) => boolean;
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
export declare const clearContent: (editor: EditorInstance, emitUpdate?: boolean) => boolean;
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
export declare const getContentJSON: (editor: EditorInstance) => EditorJSON;
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
export declare const getContentText: (editor: EditorInstance) => string;
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
export declare const isEditorEmpty: (editor: EditorInstance) => boolean;
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
export declare const registerKeyboardShortcut: (editor: EditorInstance, shortcut: KeyboardShortcut) => void;
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
export declare const getKeyboardShortcuts: (editor: EditorInstance) => KeyboardShortcut[];
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
export declare const createDefaultKeyboardShortcuts: () => KeyboardShortcut[];
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
export declare const createToolbar: (editor: EditorInstance, config: Partial<ToolbarConfig>) => ToolbarConfig;
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
export declare const createDefaultToolbar: (editor: EditorInstance) => ToolbarConfig;
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
export declare const configurePasteHandler: (editor: EditorInstance, options: PasteHandlerOptions) => void;
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
export declare const handlePaste: (editor: EditorInstance, event: ClipboardEvent, options?: PasteHandlerOptions) => boolean;
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
export declare const configureDragDrop: (editor: EditorInstance, options: {
    allowFileUpload?: boolean;
    maxFileSize?: number;
    onFileDrop?: (file: File) => void | Promise<void>;
}) => void;
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
export declare const initializeCollaboration: (editor: EditorInstance, config: CollaborationConfig) => void;
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
export declare const addComment: (editor: EditorInstance, content: string, userId: string, userName: string) => Comment;
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
export declare const resolveComment: (editor: EditorInstance, commentId: string) => boolean;
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
export declare const createSuggestion: (editor: EditorInstance, suggestion: Omit<Suggestion, "id" | "createdAt" | "status">) => Suggestion;
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
export declare const acceptSuggestion: (editor: EditorInstance, suggestionId: string) => boolean;
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
export declare const rejectSuggestion: (editor: EditorInstance, suggestionId: string) => boolean;
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
export declare const getActiveCollaborators: (editor: EditorInstance) => CollaborationUser[];
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
export declare const getWordCount: (editor: EditorInstance) => number;
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
export declare const getCharacterCount: (editor: EditorInstance, includeSpaces?: boolean) => number;
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
export declare const hasUnsavedChanges: (editor: EditorInstance, savedContent: string) => boolean;
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
export declare const exportContent: (editor: EditorInstance, format: "html" | "markdown" | "json" | "text") => string;
export {};
//# sourceMappingURL=rich-text-editor-kit.d.ts.map
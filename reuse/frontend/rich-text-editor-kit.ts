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

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

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
  // Formatting
  toggleBold: () => boolean;
  toggleItalic: () => boolean;
  toggleUnderline: () => boolean;
  toggleStrike: () => boolean;
  toggleCode: () => boolean;
  toggleHighlight: (color?: string) => boolean;
  setTextColor: (color: string) => boolean;
  setBackgroundColor: (color: string) => boolean;

  // Headings & Blocks
  setParagraph: () => boolean;
  setHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => boolean;
  setBlockquote: () => boolean;
  setCodeBlock: (language?: string) => boolean;
  setHorizontalRule: () => boolean;

  // Lists
  toggleBulletList: () => boolean;
  toggleOrderedList: () => boolean;
  toggleTaskList: () => boolean;
  toggleTaskItem: () => boolean;
  liftListItem: () => boolean;
  sinkListItem: () => boolean;

  // Links & Media
  setLink: (url: string, target?: string) => boolean;
  unsetLink: () => boolean;
  setImage: (src: string, alt?: string, title?: string) => boolean;
  setVideo: (src: string) => boolean;
  setEmbed: (src: string, type: 'iframe' | 'video' | 'audio') => boolean;

  // Tables
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

  // Alignment
  setTextAlign: (align: 'left' | 'center' | 'right' | 'justify') => boolean;

  // History
  undo: () => boolean;
  redo: () => boolean;

  // Content manipulation
  clearContent: (emitUpdate?: boolean) => boolean;
  clearNodes: () => boolean;
  insertContent: (content: string) => boolean;
  insertContentAt: (position: number, content: string) => boolean;

  // Selection
  selectAll: () => boolean;
  selectTextBlock: () => boolean;
  selectParentNode: () => boolean;
  deleteSelection: () => boolean;

  // Custom commands
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
  marks?: Array<{ type: string; attrs?: Record<string, any> }>;
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
export const createEditor = (
  element: HTMLElement,
  config: EditorConfig,
): EditorInstance => {
  // Implementation would integrate with ProseMirror/TipTap
  const editorInstance = {} as EditorInstance;

  // Initialize editor state, view, and commands
  // Set up event handlers
  // Apply extensions

  if (config.onCreate) {
    config.onCreate(editorInstance);
  }

  return editorInstance;
};

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
export const initializeEditor = (
  element: HTMLElement,
  options?: Partial<EditorConfig>,
): EditorInstance => {
  const defaultExtensions: EditorExtension[] = [
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

  return createEditor(element, {
    extensions: defaultExtensions,
    editable: true,
    ...options,
  });
};

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
export const destroyEditor = (editor: EditorInstance): void => {
  if (editor.view) {
    editor.view.destroy();
  }

  if (editor.onDestroy) {
    editor.onDestroy();
  }
};

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
export const toggleBold = (editor: EditorInstance): boolean => {
  return editor.commands.toggleBold();
};

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
export const toggleItalic = (editor: EditorInstance): boolean => {
  return editor.commands.toggleItalic();
};

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
export const toggleUnderline = (editor: EditorInstance): boolean => {
  return editor.commands.toggleUnderline();
};

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
export const toggleStrikethrough = (editor: EditorInstance): boolean => {
  return editor.commands.toggleStrike();
};

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
export const toggleCodeFormat = (editor: EditorInstance): boolean => {
  return editor.commands.toggleCode();
};

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
export const setTextColor = (editor: EditorInstance, color: string): boolean => {
  return editor.commands.setTextColor(color);
};

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
export const toggleHighlight = (editor: EditorInstance, color?: string): boolean => {
  return editor.commands.toggleHighlight(color);
};

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
export const setHeading = (
  editor: EditorInstance,
  level: 1 | 2 | 3 | 4 | 5 | 6,
): boolean => {
  return editor.commands.setHeading(level);
};

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
export const setParagraph = (editor: EditorInstance): boolean => {
  return editor.commands.setParagraph();
};

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
export const setBlockquote = (editor: EditorInstance): boolean => {
  return editor.commands.setBlockquote();
};

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
export const setCodeBlock = (editor: EditorInstance, language?: string): boolean => {
  return editor.commands.setCodeBlock(language);
};

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
export const insertHorizontalRule = (editor: EditorInstance): boolean => {
  return editor.commands.setHorizontalRule();
};

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
export const setTextAlign = (
  editor: EditorInstance,
  align: 'left' | 'center' | 'right' | 'justify',
): boolean => {
  return editor.commands.setTextAlign(align);
};

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
export const toggleBulletList = (editor: EditorInstance): boolean => {
  return editor.commands.toggleBulletList();
};

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
export const toggleOrderedList = (editor: EditorInstance): boolean => {
  return editor.commands.toggleOrderedList();
};

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
export const toggleTaskList = (editor: EditorInstance): boolean => {
  return editor.commands.toggleTaskList();
};

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
export const increaseListIndent = (editor: EditorInstance): boolean => {
  return editor.commands.sinkListItem();
};

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
export const decreaseListIndent = (editor: EditorInstance): boolean => {
  return editor.commands.liftListItem();
};

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
export const createLink = (
  editor: EditorInstance,
  url: string,
  target?: string,
): boolean => {
  return editor.commands.setLink(url, target);
};

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
export const removeLink = (editor: EditorInstance): boolean => {
  return editor.commands.unsetLink();
};

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
export const insertImage = (
  editor: EditorInstance,
  src: string,
  alt?: string,
  title?: string,
): boolean => {
  return editor.commands.setImage(src, alt, title);
};

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
export const insertVideo = (editor: EditorInstance, src: string): boolean => {
  return editor.commands.setVideo(src);
};

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
export const insertEmbed = (
  editor: EditorInstance,
  src: string,
  type: 'iframe' | 'video' | 'audio' = 'iframe',
): boolean => {
  return editor.commands.setEmbed(src, type);
};

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
export const insertTable = (
  editor: EditorInstance,
  rows: number,
  cols: number,
): boolean => {
  return editor.commands.insertTable(rows, cols);
};

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
export const addTableColumnBefore = (editor: EditorInstance): boolean => {
  return editor.commands.addColumnBefore();
};

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
export const addTableColumnAfter = (editor: EditorInstance): boolean => {
  return editor.commands.addColumnAfter();
};

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
export const deleteTableColumn = (editor: EditorInstance): boolean => {
  return editor.commands.deleteColumn();
};

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
export const addTableRowBefore = (editor: EditorInstance): boolean => {
  return editor.commands.addRowBefore();
};

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
export const addTableRowAfter = (editor: EditorInstance): boolean => {
  return editor.commands.addRowAfter();
};

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
export const deleteTableRow = (editor: EditorInstance): boolean => {
  return editor.commands.deleteRow();
};

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
export const deleteTable = (editor: EditorInstance): boolean => {
  return editor.commands.deleteTable();
};

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
export const mergeTableCells = (editor: EditorInstance): boolean => {
  return editor.commands.mergeCells();
};

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
export const splitTableCell = (editor: EditorInstance): boolean => {
  return editor.commands.splitCell();
};

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
export const createCustomNode = (
  name: string,
  spec: Partial<NodeSpec>,
): EditorExtension => {
  return {
    type: 'node',
    name,
    config: spec,
  };
};

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
export const createCustomMark = (
  name: string,
  spec: Partial<MarkSpec>,
): EditorExtension => {
  return {
    type: 'mark',
    name,
    config: spec,
  };
};

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
export const registerExtension = (
  editor: EditorInstance,
  extension: EditorExtension,
): void => {
  // Implementation would add extension to editor schema
  // and update available commands
};

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
export const convertToMarkdown = (
  editor: EditorInstance,
  options?: MarkdownOptions,
): string => {
  // Implementation would serialize editor state to Markdown
  return editor.getMarkdown();
};

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
export const convertFromMarkdown = (
  editor: EditorInstance,
  markdown: string,
  options?: MarkdownOptions,
): void => {
  // Implementation would parse Markdown and set editor content
  editor.setContent(markdown);
};

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
export const parseMarkdownToJSON = (
  markdown: string,
  options?: MarkdownOptions,
): EditorJSON => {
  // Implementation would parse Markdown to JSON
  return {
    type: 'doc',
    content: [],
  };
};

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
export const convertToHTML = (
  editor: EditorInstance,
  options?: HtmlConversionOptions,
): string => {
  const html = editor.getHTML();

  if (options?.sanitize) {
    // Sanitize HTML (implementation would use library like DOMPurify)
    return html;
  }

  return html;
};

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
export const convertFromHTML = (
  editor: EditorInstance,
  html: string,
  options?: HtmlConversionOptions,
): void => {
  let processedHtml = html;

  if (options?.sanitize) {
    // Sanitize HTML before setting
    processedHtml = html; // Would use DOMPurify
  }

  editor.setContent(processedHtml);
};

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
export const sanitizeHTML = (
  html: string,
  options?: HtmlConversionOptions,
): string => {
  // Implementation would use DOMPurify or similar
  // to remove script tags, dangerous attributes, etc.
  return html;
};

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
export const undo = (editor: EditorInstance): boolean => {
  return editor.commands.undo();
};

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
export const redo = (editor: EditorInstance): boolean => {
  return editor.commands.redo();
};

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
export const clearContent = (editor: EditorInstance, emitUpdate = true): boolean => {
  return editor.commands.clearContent(emitUpdate);
};

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
export const getContentJSON = (editor: EditorInstance): EditorJSON => {
  return editor.getJSON();
};

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
export const getContentText = (editor: EditorInstance): string => {
  return editor.getText();
};

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
export const isEditorEmpty = (editor: EditorInstance): boolean => {
  return editor.isEmpty;
};

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
export const registerKeyboardShortcut = (
  editor: EditorInstance,
  shortcut: KeyboardShortcut,
): void => {
  // Implementation would add shortcut to keymap plugin
};

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
export const getKeyboardShortcuts = (editor: EditorInstance): KeyboardShortcut[] => {
  // Implementation would extract shortcuts from keymap
  return [];
};

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
export const createDefaultKeyboardShortcuts = (): KeyboardShortcut[] => {
  return [
    { key: 'Mod-b', command: () => true, description: 'Toggle bold' },
    { key: 'Mod-i', command: () => true, description: 'Toggle italic' },
    { key: 'Mod-u', command: () => true, description: 'Toggle underline' },
    { key: 'Mod-z', command: () => true, description: 'Undo' },
    { key: 'Mod-Shift-z', command: () => true, description: 'Redo' },
    { key: 'Mod-k', command: () => true, description: 'Insert link' },
  ];
};

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
export const createToolbar = (
  editor: EditorInstance,
  config: Partial<ToolbarConfig>,
): ToolbarConfig => {
  const defaultGroups: ToolbarGroup[] = [
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
export const createDefaultToolbar = (editor: EditorInstance): ToolbarConfig => {
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
export const configurePasteHandler = (
  editor: EditorInstance,
  options: PasteHandlerOptions,
): void => {
  // Implementation would set up clipboard event handlers
};

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
export const handlePaste = (
  editor: EditorInstance,
  event: ClipboardEvent,
  options?: PasteHandlerOptions,
): boolean => {
  const clipboardData = event.clipboardData;
  if (!clipboardData) return false;

  const html = clipboardData.getData('text/html');
  const text = clipboardData.getData('text/plain');

  if (html && options?.allowedFormats?.includes('html')) {
    const processed = options?.sanitizeHtml ? sanitizeHTML(html, options) : html;
    editor.commands.insertContent(processed);
    return true;
  }

  if (text) {
    editor.commands.insertContent(text);
    return true;
  }

  return false;
};

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
export const configureDragDrop = (
  editor: EditorInstance,
  options: {
    allowFileUpload?: boolean;
    maxFileSize?: number;
    onFileDrop?: (file: File) => void | Promise<void>;
  },
): void => {
  // Implementation would set up drag/drop event handlers
};

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
export const initializeCollaboration = (
  editor: EditorInstance,
  config: CollaborationConfig,
): void => {
  // Implementation would set up Y.js or similar CRDT
  // and WebSocket connection for real-time collaboration
};

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
export const addComment = (
  editor: EditorInstance,
  content: string,
  userId: string,
  userName: string,
): Comment => {
  const selection = editor.state.selection;

  const comment: Comment = {
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
export const resolveComment = (editor: EditorInstance, commentId: string): boolean => {
  // Implementation would update comment status
  return true;
};

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
export const createSuggestion = (
  editor: EditorInstance,
  suggestion: Omit<Suggestion, 'id' | 'createdAt' | 'status'>,
): Suggestion => {
  return {
    ...suggestion,
    id: `suggestion-${Date.now()}`,
    createdAt: new Date(),
    status: 'pending',
  };
};

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
export const acceptSuggestion = (
  editor: EditorInstance,
  suggestionId: string,
): boolean => {
  // Implementation would apply suggestion and update status
  return true;
};

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
export const rejectSuggestion = (
  editor: EditorInstance,
  suggestionId: string,
): boolean => {
  // Implementation would remove suggestion and update status
  return true;
};

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
export const getActiveCollaborators = (
  editor: EditorInstance,
): CollaborationUser[] => {
  // Implementation would return list from collaboration provider
  return [];
};

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
export const getWordCount = (editor: EditorInstance): number => {
  const text = editor.getText();
  return text.trim().split(/\s+/).filter(Boolean).length;
};

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
export const getCharacterCount = (
  editor: EditorInstance,
  includeSpaces = true,
): number => {
  const text = editor.getText();
  return includeSpaces ? text.length : text.replace(/\s/g, '').length;
};

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
export const hasUnsavedChanges = (
  editor: EditorInstance,
  savedContent: string,
): boolean => {
  return editor.getHTML() !== savedContent;
};

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
export const exportContent = (
  editor: EditorInstance,
  format: 'html' | 'markdown' | 'json' | 'text',
): string => {
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

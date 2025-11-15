/**
 * GUI Builder Type System
 *
 * This is the main entry point for the comprehensive type system for the
 * Next.js drag-and-drop GUI page builder.
 *
 * The type system is organized into the following modules:
 *
 * - **Core**: Foundation types (brands, utilities, identifiers, validation)
 * - **Components**: Component definitions, metadata, and registry
 * - **Properties**: Property schemas, values, bindings, and validation
 * - **Layout**: Page configuration, component trees, and responsive design
 * - **State**: Editor state, history, and component instance state
 * - **Workflow**: Multi-page workflows, routing, and navigation
 * - **CodeGen**: Code generation, templates, and build configuration
 * - **Templates**: Reusable page and component templates
 * - **Versioning**: Version control, change tracking, and collaboration
 * - **Integration**: Next.js integration (Server Components, Server Actions)
 *
 * @example
 * ```typescript
 * import type {
 *   ComponentDefinition,
 *   PropertySchema,
 *   PageConfig,
 *   EditorState,
 * } from '@/types/gui-builder';
 *
 * // Create a component definition
 * const buttonComponent: ComponentDefinition = {
 *   metadata: {
 *     id: 'button-primary' as ComponentId,
 *     display: {
 *       name: 'Primary Button',
 *       description: 'A primary action button',
 *     },
 *     // ... more metadata
 *   },
 *   properties: {
 *     label: {
 *       id: 'label' as PropertyId,
 *       type: PropertyType.String,
 *       label: 'Button Label',
 *       // ... more configuration
 *     },
 *   },
 *   isBuiltIn: true,
 * };
 * ```
 *
 * @module gui-builder
 */

// ============================================================================
// Core Module
// ============================================================================

export type {
  Brand,
  ComponentId,
  ComponentInstanceId,
  PageId,
  PropertyId,
  WorkflowId,
  TemplateId,
  VersionId,
  BindingId,
  ServerActionId,
  DataSourceId,
  RequireKeys,
  OptionalKeys,
  DeepReadonly,
  DeepPartial,
  KeysOfType,
  RequireAtLeastOne,
  RequireExactlyOne,
  Awaited,
  ValueOf,
  Nullable,
  NonNullable,
  JsonValue,
  JsonObject,
  JsonArray,
  Metadata,
  Point,
  Size,
  Rectangle,
  Result,
  IdGeneratorConfig,
  ParsedId,
  IdPrefix,
  ValidationIssue,
  ValidationResult,
  BaseConstraint,
  RequiredConstraint,
  MinLengthConstraint,
  MaxLengthConstraint,
  MinConstraint,
  MaxConstraint,
  PatternConstraint,
  EmailConstraint,
  URLConstraint,
  EnumConstraint,
  CustomConstraint,
  Constraint,
  ValidationRule,
  ValidationSchema,
  GuiBuilderError,
} from './core';

export {
  isNonEmptyString,
  createBrandedId,
  success,
  failure,
  DEFAULT_PREFIXES,
  generateRandomString,
  generateId,
  parseId,
  createTypedId,
  createComponentId,
  createComponentInstanceId,
  createPageId,
  createPropertyId,
  createWorkflowId,
  createTemplateId,
  createVersionId,
  createBindingId,
  createServerActionId,
  createDataSourceId,
  isValidId,
  ValidationSeverity,
  ConstraintType,
  ErrorCategory,
  createValidationIssue,
  createValidationResult,
  createError,
  isGuiBuilderError,
} from './core';

// ============================================================================
// Components Module
// ============================================================================

export type {
  ComponentSubcategory,
  ComponentTaxonomy,
  ComponentTag,
  ComponentCapabilities,
  ComponentConstraints,
  ComponentDisplay,
  ComponentDocumentation,
  ComponentPerformance,
  ComponentDependencies,
  ComponentMetadata,
  SlotDefinition,
  StylePreset,
  EventHandlerDefinition,
  DefaultPropertyValues,
  ComponentStateDefinition,
  ComponentContextDefinition,
  ResponsiveVariant,
  ComponentCodeTemplate,
  ComponentDefinition,
  MinimalComponentDefinition,
  ResolvedComponentDefinition,
  ComponentFilterOptions,
  ComponentSortOptions,
  PaginationOptions,
  PaginatedResult,
  RegisterComponentOptions,
  RegisterComponentResult,
  RegistryStatistics,
  RegistryChangeEvent,
  RegistryChangeListener,
  ComponentRegistry,
  ComponentRegistryFactory,
} from './components';

export {
  ComponentCategory,
  ComponentComplexity,
  ComponentMaturity,
  LayoutSubcategories,
  FormSubcategories,
  ComponentTags,
  RenderMode,
  DefaultCapabilities,
  isMinimalDefinition,
  isResolvedDefinition,
} from './components';

// ============================================================================
// Properties Module
// ============================================================================

export type {
  BasePropertyValue,
  StringPropertyValue,
  NumberPropertyValue,
  BooleanPropertyValue,
  ObjectPropertyValue,
  ArrayPropertyValue,
  EnumPropertyValue,
  ColorPropertyValue,
  ImagePropertyValue,
  IconPropertyValue,
  URLPropertyValue,
  DatePropertyValue,
  DateTimePropertyValue,
  TimePropertyValue,
  RichTextPropertyValue,
  CodePropertyValue,
  JSONPropertyValue,
  ComponentReferencePropertyValue,
  ServerActionPropertyValue,
  DataBindingPropertyValue,
  ExpressionPropertyValue,
  StylePropertyValue,
  ClassNamePropertyValue,
  SlotPropertyValue,
  PropertyValue,
  ExtractPropertyValueType,
  PropertyValueByType,
  PropertyControlConfig,
  PropertyCondition,
  PropertySchema,
  ResponsivePropertySchema,
  PropertySchemaCollection,
  PropertySchemaGroup,
  PropertyConfiguration,
  BaseBindingExpression,
  PathBindingExpression,
  TemplateBindingExpression,
  ExpressionBindingExpression,
  FunctionBindingExpression,
  ServerActionBindingExpression,
  PropertyReferenceBindingExpression,
  BindingExpression,
  DataSource,
  DataBinding,
  BindingContext,
  BindingEvaluationResult,
  PropertyValidationContext,
  PropertyValidator,
  PropertyValidators,
  PropertyValidationRule,
  PropertyValidationRules,
  PropertyCollectionValidationResult,
  PropertyValidationConfig,
  PropertyGroupTheme,
  PropertyGroup,
  PropertyGroupCollection,
  FlatPropertyList,
} from './properties';

export {
  PropertyType,
  isPropertyValueOfType,
  createStringProperty,
  createNumberProperty,
  createBooleanProperty,
  createEnumProperty,
  createColorProperty,
  PropertyControlType,
  isResponsiveSchema,
  createPropertySchema,
  createSchemaPropertyGroup,
  BindingExpressionType,
  DataSourceType,
  isPathExpression,
  isTemplateExpression,
  isJavaScriptExpression,
  validateConstraint,
  validatePropertyConstraints,
  createPropertyValidationResult,
  PropertyGroupId,
  PropertyGroupLayout,
  createPropertyGroup,
  flattenPropertyGroups,
  findPropertyGroup,
} from './properties';

// ============================================================================
// Layout Module
// ============================================================================

export type {
  BreakpointConfig,
  ResponsiveValue,
  ResponsiveLayoutConfig,
  ResponsiveImage,
  ResponsiveImageSet,
  ResponsiveTypography,
  ResponsiveSpacing,
  ViewportInfo,
  ComponentInstance,
  ComponentTreeNode,
  ComponentTree,
  TreeTraversalOptions,
  TreeSearchResult,
  TreeChangeEvent,
  InsertNodeOptions,
  MoveNodeOptions,
  TreeOperationValidation,
  PageSEO,
  PageRouting,
  PageLayout,
  PageDataConfig,
  PageAccessibility,
  PageConfig,
  PageCollection,
  FlexContainerConfig,
  GridContainerConfig,
  StackContainerConfig,
  ContainerConstraints,
  ContainerConfig,
  SlotConfig,
  SectionConfig,
} from './layout';

export {
  Breakpoint,
  DEFAULT_BREAKPOINTS,
  getBreakpointFromWidth,
  getResponsiveValue,
  isBreakpointActive,
  TreeTraversalOrder,
  TreeOperation,
  findNodeById,
  isAncestor,
  getAncestors,
  getDescendants,
  PageType,
  PageRenderMode,
  ContainerLayout,
} from './layout';

// ============================================================================
// State Module
// ============================================================================

export type {
  SelectionState,
  FocusState,
  HoverState,
  DragDropState,
  ClipboardState,
  ViewportState,
  PanelState,
  EditorState,
  BaseHistoryAction,
  InsertComponentAction,
  UpdateComponentAction,
  DeleteComponentAction,
  MoveComponentAction,
  UpdatePropertyAction,
  BatchAction,
  HistoryAction,
  HistoryEntry,
  HistoryState,
  InstanceRuntimeState,
  InstanceStateMap,
} from './state';

export {
  EditorMode,
  EditorViewMode,
  EditorTool,
  HistoryActionType,
  canUndo,
  canRedo,
} from './state';

// ============================================================================
// Workflow Module
// ============================================================================

export type {
  WorkflowStep,
  WorkflowTransition,
  WorkflowDefinition,
  WorkflowState,
  RouteParam,
  Route,
  NavigationTarget,
  NavigationOptions,
  ServerActionParam,
  ServerActionDefinition,
  ServerActionInvocation,
  TransitionConfig,
} from './workflow';

export { RouteParamType, TransitionType } from './workflow';

// ============================================================================
// Code Generation Module
// ============================================================================

export type {
  TemplateVariable,
  CodeTemplate,
  ASTNode,
  ComponentASTNode,
  ImportASTNode,
  OutputFile,
  CodeOutput,
  CodeGenerationConfig,
  BuildConfig,
  BuildResult,
} from './codegen';

export { ASTNodeType, OutputFormat, BuildTarget } from './codegen';

// ============================================================================
// Templates Module
// ============================================================================

export type {
  TemplateDefinition,
  TemplateVariableDefinition,
  TemplateVariableValues,
} from './templates';

export { TemplateType, TemplateCategory } from './templates';

// ============================================================================
// Versioning Module
// ============================================================================

export type {
  VersionMetadata,
  ChangeEntry,
  ChangeSet,
  DiffEntry,
  VersionDiff,
  UserPresence,
  LockInfo,
  CollaborationSession,
} from './versioning';

export { ChangeType, DiffOperation } from './versioning';

// ============================================================================
// Integration Module
// ============================================================================

export type {
  ServerComponentConfig,
  ServerComponentProps,
  ServerActionBinding,
  FormActionConfig,
  DataSourceConnection,
  DataQueryConfig,
} from './integration';

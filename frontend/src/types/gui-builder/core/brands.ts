/**
 * Brand Types for GUI Builder
 *
 * Branded types provide compile-time type safety by preventing the mixing of
 * different identifier types. For example, a ComponentId cannot be used where
 * a PageId is expected, even though both are strings at runtime.
 *
 * @module gui-builder/core/brands
 */

/**
 * Brand symbol used to create branded types.
 * This creates a unique nominal type that cannot be satisfied by regular strings.
 */
declare const __brand: unique symbol;

/**
 * Base branded type that adds a compile-time-only brand to a value.
 *
 * @template T - The base type to brand (usually string or number)
 * @template B - The brand identifier (usually a string literal)
 *
 * @example
 * ```typescript
 * type UserId = Brand<string, 'UserId'>;
 * const userId: UserId = 'user-123' as UserId; // Must be explicitly cast
 * ```
 */
export type Brand<T, B extends string> = T & { readonly [__brand]: B };

/**
 * Unique identifier for a component definition in the component registry.
 * Component IDs are used to reference reusable component templates.
 *
 * @example
 * ```typescript
 * const buttonComponentId: ComponentId = 'button-primary' as ComponentId;
 * ```
 */
export type ComponentId = Brand<string, 'ComponentId'>;

/**
 * Unique identifier for a component instance on a page.
 * Instance IDs distinguish between multiple uses of the same component definition.
 *
 * @example
 * ```typescript
 * const instanceId: ComponentInstanceId = 'inst-abc123' as ComponentInstanceId;
 * ```
 */
export type ComponentInstanceId = Brand<string, 'ComponentInstanceId'>;

/**
 * Unique identifier for a page in the builder.
 *
 * @example
 * ```typescript
 * const homePageId: PageId = 'page-home' as PageId;
 * ```
 */
export type PageId = Brand<string, 'PageId'>;

/**
 * Unique identifier for a property definition.
 *
 * @example
 * ```typescript
 * const titlePropId: PropertyId = 'prop-title' as PropertyId;
 * ```
 */
export type PropertyId = Brand<string, 'PropertyId'>;

/**
 * Unique identifier for a workflow definition.
 *
 * @example
 * ```typescript
 * const checkoutWorkflowId: WorkflowId = 'workflow-checkout' as WorkflowId;
 * ```
 */
export type WorkflowId = Brand<string, 'WorkflowId'>;

/**
 * Unique identifier for a template.
 *
 * @example
 * ```typescript
 * const landingPageTemplate: TemplateId = 'template-landing' as TemplateId;
 * ```
 */
export type TemplateId = Brand<string, 'TemplateId'>;

/**
 * Unique identifier for a version in version control.
 *
 * @example
 * ```typescript
 * const versionId: VersionId = 'v1.2.3' as VersionId;
 * ```
 */
export type VersionId = Brand<string, 'VersionId'>;

/**
 * Unique identifier for a data binding expression.
 *
 * @example
 * ```typescript
 * const bindingId: BindingId = 'binding-user-name' as BindingId;
 * ```
 */
export type BindingId = Brand<string, 'BindingId'>;

/**
 * Unique identifier for a Server Action.
 *
 * @example
 * ```typescript
 * const actionId: ServerActionId = 'action-submit-form' as ServerActionId;
 * ```
 */
export type ServerActionId = Brand<string, 'ServerActionId'>;

/**
 * Unique identifier for a data source.
 *
 * @example
 * ```typescript
 * const dataSourceId: DataSourceId = 'ds-users-api' as DataSourceId;
 * ```
 */
export type DataSourceId = Brand<string, 'DataSourceId'>;

/**
 * Type guard to check if a value is a non-empty string (useful for branded types).
 *
 * @param value - The value to check
 * @returns True if the value is a non-empty string
 *
 * @example
 * ```typescript
 * if (isNonEmptyString(input)) {
 *   const pageId = input as PageId; // Safe to cast
 * }
 * ```
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Helper to create a branded value with runtime validation.
 * Throws if the value is not a non-empty string.
 *
 * @template B - The brand type
 * @param value - The value to brand
 * @param brandName - The name of the brand (for error messages)
 * @returns The branded value
 * @throws {Error} If the value is not a non-empty string
 *
 * @example
 * ```typescript
 * const pageId = createBrandedId<PageId>('page-home', 'PageId');
 * ```
 */
export function createBrandedId<B extends Brand<string, string>>(
  value: string,
  brandName: string,
): B {
  if (!isNonEmptyString(value)) {
    throw new Error(`${brandName} must be a non-empty string`);
  }
  return value as B;
}

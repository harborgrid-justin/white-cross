# JSDoc Quick Reference for Backend Middleware

## Quick Start Template

### File Header Template
```typescript
/**
 * @fileoverview [Short Title]
 * @module [module/path]
 * @description [Detailed description of purpose and functionality]
 *
 * Key Features:
 * - [Feature 1]
 * - [Feature 2]
 * - [Feature 3]
 *
 * @requires [dependency1] - [Description]
 * @requires [dependency2] - [Description]
 *
 * @version 1.0.0
 * @author [Author Name]
 *
 * @example
 * // High-level usage example
 * import { functionName } from './module';
 * const result = functionName(params);
 */
```

### Function Documentation Template
```typescript
/**
 * @function functionName
 * @description [What the function does and why it's useful]
 *
 * [Additional details about behavior, algorithms, or important notes]
 *
 * @param {Type} paramName - [Description of parameter]
 * @param {Type} [optionalParam] - [Description with default behavior]
 * @param {Type} [optionalParam=defaultValue] - [Description with default value]
 * @returns {ReturnType} [Description of return value]
 *
 * @throws {ErrorType} [When this error occurs]
 *
 * @example
 * // Basic usage
 * const result = functionName(param1, param2);
 *
 * @example
 * // Advanced usage
 * const result = functionName(param1, {
 *   option1: 'value',
 *   option2: true
 * });
 */
```

### Decorator Documentation Template
```typescript
/**
 * @decorator DecoratorName
 * @description [What the decorator does and its purpose]
 *
 * [Detailed behavior explanation]
 *
 * @param {Type} param - [Parameter description]
 * @returns {Function} [Decorator function description]
 *
 * @throws {Error} [When errors occur]
 *
 * @example
 * // Basic usage
 * class MyClass {
 *   @DecoratorName(param)
 *   myMethod() {
 *     // Implementation
 *   }
 * }
 *
 * @example
 * // Advanced usage
 * class MyClass {
 *   @DecoratorName({ option1: true, option2: 'value' })
 *   myMethod() {
 *     // Implementation
 *   }
 * }
 */
```

### Interface Documentation Template
```typescript
/**
 * @interface InterfaceName
 * @description [What this interface represents]
 *
 * [Additional context or usage notes]
 *
 * @property {Type} propertyName - [Description]
 * @property {Type} [optionalProperty] - [Description with optional note]
 *
 * @example
 * // Example implementation
 * const example: InterfaceName = {
 *   propertyName: 'value',
 *   optionalProperty: 123
 * };
 *
 * @example
 * // Example in function
 * function useInterface(data: InterfaceName) {
 *   // Implementation
 * }
 */
```

### Class Documentation Template
```typescript
/**
 * @class ClassName
 * @description [What this class does and its purpose]
 *
 * [Additional details about class behavior]
 *
 * @example
 * // Basic instantiation
 * const instance = new ClassName(param1, param2);
 *
 * @example
 * // Using class methods
 * const instance = new ClassName();
 * const result = instance.method(args);
 */
```

### Enum Documentation Template
```typescript
/**
 * @enum EnumName
 * @description [What this enum represents]
 *
 * [Hierarchy or relationships if applicable]
 *
 * @property {string} VALUE_ONE - [Description of this value]
 * @property {string} VALUE_TWO - [Description of this value]
 *
 * @example
 * // Usage in code
 * const role = EnumName.VALUE_ONE;
 *
 * @example
 * // Type checking
 * function checkEnum(value: EnumName) {
 *   if (value === EnumName.VALUE_ONE) {
 *     // Handle case
 *   }
 * }
 */
```

### Constant Documentation Template
```typescript
/**
 * @constant CONSTANT_NAME
 * @description [What this constant represents]
 *
 * [Details about values and usage]
 *
 * @property {Type} property1 - [Description]
 * @property {Type} property2 - [Description]
 *
 * @example
 * // Using constant values
 * const value = CONSTANT_NAME.property1;
 */
```

---

## Common JSDoc Tags Reference

### Essential Tags
- `@fileoverview` - Module overview (file-level only)
- `@module` - Module path identifier
- `@description` - Detailed description
- `@param` - Function parameter
- `@returns` - Return value
- `@throws` - Error conditions
- `@example` - Usage examples

### Type Tags
- `@type` - Variable type
- `@typedef` - Custom type definition
- `@property` - Object property
- `@interface` - Interface definition
- `@enum` - Enumeration
- `@template` - Generic type parameter

### Organization Tags
- `@requires` - External dependencies
- `@see` - Related items
- `@link` - Link to other documentation
- `@version` - Version number
- `@author` - Author information
- `@since` - Version when added

### Modifier Tags
- `@private` - Private member
- `@public` - Public member
- `@protected` - Protected member
- `@static` - Static member
- `@async` - Async function
- `@deprecated` - Deprecated item

### Special Tags
- `@default` - Default value
- `@readonly` - Read-only property
- `@override` - Overridden method
- `@abstract` - Abstract method
- `@todo` - Future work needed

---

## Type Syntax

### Basic Types
```typescript
@param {string} name - String parameter
@param {number} age - Number parameter
@param {boolean} active - Boolean parameter
@param {any} data - Any type
@param {void} - No return value
```

### Arrays
```typescript
@param {string[]} names - Array of strings
@param {Array<number>} numbers - Array of numbers
@param {Array<Student>} students - Array of Student objects
```

### Objects
```typescript
@param {Object} config - Configuration object
@param {Record<string, any>} map - Key-value map
@param {{name: string, age: number}} person - Object with properties
```

### Unions and Optionals
```typescript
@param {string|number} id - String or number
@param {string} [name] - Optional parameter
@param {number} [age=18] - Optional with default
@param {string|null} value - String or null
```

### Functions
```typescript
@param {Function} callback - Function parameter
@param {(error: Error) => void} onError - Function with signature
@param {(...args: any[]) => boolean} predicate - Rest parameters
```

### Generics
```typescript
@template T - Generic type parameter
@param {T} value - Generic value
@returns {Array<T>} - Generic array return
@returns {Promise<T>} - Generic promise return
```

---

## Examples by Use Case

### Pagination Function
```typescript
/**
 * @function paginateResults
 * @description Paginates query results with metadata
 *
 * Default Values:
 * - page: 1
 * - limit: 20
 * - maxLimit: 100
 *
 * @param {Object[]} items - Array of items to paginate
 * @param {number} [page=1] - Page number (1-indexed)
 * @param {number} [limit=20] - Items per page
 * @returns {PaginatedResponse} Paginated results with metadata
 *
 * @example
 * const result = paginateResults(students, 2, 50);
 * // result.data: [...50 students]
 * // result.pagination: { page: 2, limit: 50, total: 150, ... }
 */
```

### Validation Middleware
```typescript
/**
 * @function validateRequest
 * @description Validates request data against schema
 *
 * Validation Rules:
 * - Required fields must be present
 * - Types must match schema
 * - Custom validators are applied
 *
 * @param {Request} request - Express request object
 * @param {ValidationSchema} schema - Validation schema
 * @returns {ValidationResult} Validation result with errors
 *
 * @throws {ValidationError} When validation fails
 *
 * @example
 * // Validate student creation request
 * const result = validateRequest(req, studentSchema);
 * if (!result.isValid) {
 *   return res.status(400).json({ errors: result.errors });
 * }
 */
```

### Multi-tenant Middleware
```typescript
/**
 * @function injectTenantScope
 * @description Injects facility/tenant scope into request context
 *
 * Scoping Rules:
 * - System admins: Access all facilities
 * - Facility admins: Access own facility only
 * - Nurses: Access own facility only
 * - Students: Access own records only
 *
 * @param {Request} request - Express request object
 * @param {Response} response - Express response object
 * @param {NextFunction} next - Express next function
 *
 * @example
 * // Use in route middleware stack
 * app.get('/api/students',
 *   authenticate,
 *   injectTenantScope,
 *   getStudentsHandler
 * );
 */
```

### File Upload Middleware
```typescript
/**
 * @function validateFileUpload
 * @description Validates uploaded files against constraints
 *
 * Constraints:
 * - Max file size: 10MB
 * - Allowed types: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']
 * - Max files per request: 10
 *
 * @param {Request} request - Express request with files
 * @param {UploadOptions} [options] - Custom upload constraints
 * @returns {ValidationResult} Validation result
 *
 * @throws {FileTooLargeError} When file exceeds size limit
 * @throws {InvalidFileTypeError} When file type not allowed
 *
 * @example
 * // Validate document upload
 * const result = validateFileUpload(req, {
 *   maxSize: 5 * 1024 * 1024, // 5MB
 *   allowedTypes: ['pdf']
 * });
 */
```

### Request Context Middleware
```typescript
/**
 * @function injectRequestContext
 * @description Injects tracking context into request
 *
 * Context includes:
 * - Correlation ID for request tracing
 * - User information from authentication
 * - Timestamp and duration tracking
 * - IP address and user agent
 *
 * @param {Request} request - Express request object
 * @param {Response} response - Express response object
 * @param {NextFunction} next - Express next function
 *
 * @example
 * // Use as early middleware
 * app.use(injectRequestContext);
 *
 * // Access in handlers
 * app.get('/api/data', (req, res) => {
 *   logger.info('Request received', {
 *     correlationId: req.context.correlationId
 *   });
 * });
 */
```

---

## Best Practices Checklist

### File Level
- [ ] Include @fileoverview with clear description
- [ ] List key features
- [ ] Document default values and constraints
- [ ] Add at least one high-level example

### Functions
- [ ] Describe what AND why
- [ ] Document all parameters with types
- [ ] Document return value
- [ ] Include @throws for errors
- [ ] Add 2-3 examples (basic, advanced, edge case)

### Types/Interfaces
- [ ] Describe what it represents
- [ ] Document all properties
- [ ] Show example values
- [ ] Note optional properties clearly

### Examples
- [ ] Show real-world usage
- [ ] Include expected output in comments
- [ ] Cover common use cases
- [ ] Demonstrate error handling

### General
- [ ] Use consistent formatting
- [ ] Keep descriptions concise but complete
- [ ] Use active voice
- [ ] Spell check and grammar check

---

## Common Patterns

### Pattern: Default Values
```typescript
/**
 * @param {number} [limit=20] - Items per page (default: 20, max: 100)
 */
```

### Pattern: Multiple Examples
```typescript
/**
 * @example
 * // Basic usage
 * const result = func(param1);
 *
 * @example
 * // With options
 * const result = func(param1, { option: true });
 *
 * @example
 * // Error handling
 * try {
 *   const result = func(invalidParam);
 * } catch (error) {
 *   console.error(error);
 * }
 */
```

### Pattern: Configuration Object
```typescript
/**
 * @param {Object} config - Configuration options
 * @param {number} config.maxRetries - Maximum retry attempts
 * @param {number} config.timeout - Timeout in milliseconds
 * @param {boolean} [config.logging=true] - Enable logging
 */
```

### Pattern: Callback Functions
```typescript
/**
 * @param {Function} callback - Callback function
 * @param {Error|null} callback.error - Error if operation failed
 * @param {Result} callback.result - Operation result if successful
 */
```

### Pattern: Promise Returns
```typescript
/**
 * @async
 * @function asyncOperation
 * @returns {Promise<Result>} Resolves with operation result
 * @throws {Error} Rejects with error on failure
 *
 * @example
 * // Using async/await
 * const result = await asyncOperation();
 *
 * @example
 * // Using promises
 * asyncOperation()
 *   .then(result => console.log(result))
 *   .catch(error => console.error(error));
 */
```

---

## Troubleshooting

### Common Issues

**Issue: Type not recognized**
```typescript
// ❌ Bad
@param {UnknownType} param

// ✅ Good
@param {import('./types').UnknownType} param
// or
@param {Object} param - Instance of UnknownType
```

**Issue: Optional vs Required unclear**
```typescript
// ❌ Bad
@param {string} name - Name (optional)

// ✅ Good
@param {string} [name] - Optional name parameter
@param {string} [name='default'] - Name with default value
```

**Issue: Complex return type**
```typescript
// ❌ Bad
@returns {Object} Response

// ✅ Good
@returns {{data: Array<Student>, pagination: PaginationMeta}} Paginated response
// or
@typedef {Object} PaginatedResponse
@property {Array<Student>} data
@property {PaginationMeta} pagination
@returns {PaginatedResponse}
```

---

## Additional Resources

- TypeScript Official Docs: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
- JSDoc Official: https://jsdoc.app/
- Google JavaScript Style Guide: https://google.github.io/styleguide/jsguide.html

---

## Quick Commands

### Generate Docs
```bash
# Install documentation generator
npm install -g jsdoc

# Generate documentation
jsdoc -c jsdoc.json
```

### VS Code Extensions
- JSDoc Generator
- Document This
- Better Comments

### Validation
```bash
# TypeScript type checking
npx tsc --noEmit

# ESLint with JSDoc rules
npx eslint --ext .ts
```

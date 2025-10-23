# JSDoc Generation Quick Start Guide

## 🎯 Goal
Add comprehensive JSDoc documentation to all 1,570+ frontend TypeScript/TSX files.

## 🚀 Quick Start (5 Minutes)

### Step 1: Identify Your File Type
Find where your file is located:

```bash
# Your file path determines which agent to use
frontend/src/components/...      → Components Agent
frontend/src/services/...        → Services Agent  
frontend/src/stores/...          → Stores Agent
frontend/src/types/...           → Types Agent
frontend/src/hooks/...           → Hooks/Utils Agent
frontend/src/utils/...           → Hooks/Utils Agent
frontend/src/config/...          → Config/Routes Agent
frontend/src/routes/...          → Config/Routes Agent
```

### Step 2: Read Your Agent's Guidelines
Open the relevant agent file:

```bash
# Example: For a component file
cat .github/agents/components-jsdoc-agent.md

# Example: For a service file
cat .github/agents/services-jsdoc-agent.md
```

### Step 3: Add JSDoc Comments

**Minimum Requirements**:

```typescript
/**
 * @fileoverview Brief file description
 * @module ModuleName
 * @category CategoryName
 */

// ... imports ...

/**
 * Function/Component description
 * 
 * @param {Type} paramName - Parameter description
 * @returns {Type} Return value description
 * 
 * @example
 * ```typescript
 * const result = functionName(param);
 * ```
 */
export function functionName(paramName: Type): ReturnType {
  // implementation
}
```

### Step 4: Verify Your Changes

```bash
cd frontend
npm run type-check  # Ensure types are correct
npm run build       # Ensure build succeeds
```

## 📊 File Distribution

| Agent | File Count | Priority |
|-------|------------|----------|
| Components | ~600 | High |
| Hooks/Utils | ~400 | High |
| Services | ~200 | Critical |
| Stores | ~150 | High |
| Config/Routes | ~120 | Medium |
| Types | ~100 | Medium |

## 🎨 Agent Quick Reference

### Components Agent
**Files**: Components, pages, layouts  
**Focus**: Props, hooks, user interactions  
**Tags**: `@component`, `@param`, `@returns`, `@example`

### Services Agent  
**Files**: API, security, monitoring  
**Focus**: API contracts, errors, security  
**Tags**: `@async`, `@throws`, `@api`, `@hipaa`

### Stores Agent
**Files**: Redux slices, selectors  
**Focus**: State shape, actions, selectors  
**Tags**: `@reducer`, `@action`, `@selector`, `@thunk`

### Types Agent
**Files**: Types, schemas, validation  
**Focus**: Type definitions, constraints  
**Tags**: `@typedef`, `@interface`, `@property`, `@enum`

### Hooks/Utils Agent
**Files**: Custom hooks, utilities  
**Focus**: Hook behavior, pure functions  
**Tags**: `@hook`, `@pure`, `@returns`

### Config/Routes Agent
**Files**: Config, routes, constants  
**Focus**: Settings, routing, initialization  
**Tags**: `@constant`, `@default`, `@see`

## ✅ Quality Checklist

Before considering a file complete:

- [ ] File-level JSDoc with `@fileoverview`, `@module`, `@category`
- [ ] All exported items have JSDoc
- [ ] All parameters documented with types
- [ ] Return values clearly explained
- [ ] At least one `@example` for complex code
- [ ] Error conditions documented with `@throws`
- [ ] PHI handling marked if applicable
- [ ] No modifications to working code
- [ ] Code formatting preserved

## 🔍 Common JSDoc Tags

| Tag | Usage | Example |
|-----|-------|---------|
| `@fileoverview` | File description | `@fileoverview User authentication service` |
| `@module` | Module name | `@module authService` |
| `@category` | File category | `@category Services` |
| `@param` | Parameter | `@param {string} userId - User ID` |
| `@returns` | Return value | `@returns {Promise<User>} User object` |
| `@throws` | Error | `@throws {AuthError} When auth fails` |
| `@example` | Code example | `@example const user = await getUser('123');` |
| `@async` | Async function | `@async` |
| `@deprecated` | Deprecated | `@deprecated Use newFunction instead` |
| `@see` | Reference | `@see https://docs.example.com` |

## 📝 Example: Before & After

### ❌ Before (Incomplete)
```typescript
export const showSuccessToast = (message: string) => {
  const toastId = toast.success(message)
  return toastId
}
```

### ✅ After (Complete)
```typescript
/**
 * Displays a success toast notification with a green checkmark icon
 * 
 * @param {string} message - Success message to display to the user
 * @returns {string} Toast ID that can be used to dismiss the toast
 * 
 * @example
 * ```typescript
 * showSuccessToast('Student record updated successfully');
 * ```
 */
export const showSuccessToast = (message: string) => {
  const toastId = toast.success(message)
  return toastId
}
```

## 🚦 Phased Implementation

Follow this order for maximum impact:

1. **Phase 1**: Services (Critical) - Authentication, API, security
2. **Phase 2**: Stores (High) - Redux state management  
3. **Phase 3**: Types (Medium) - Type definitions
4. **Phase 4**: Hooks/Utils (High) - Reusable logic
5. **Phase 5**: Components (High) - UI components
6. **Phase 6**: Config/Routes (Medium) - Configuration

## 🎯 Success Metrics

You're done when:
- ✅ All files have file-level JSDoc
- ✅ All exports are documented
- ✅ Examples provided for complex code
- ✅ Build and type-check pass
- ✅ IDE shows helpful tooltips

## 📚 Full Documentation

For detailed information:

- **README.md** - Complete agent overview and guidelines
- **IMPLEMENTATION_GUIDE.md** - Comprehensive implementation guide
- **jsdoc-orchestrator.md** - Phased execution strategy
- **[agent-name].md** - Specific agent guidelines

## 🆘 Quick Help

**Q: Which agent do I use?**  
A: Check the file path - it determines the agent (see Step 1)

**Q: What if my file fits multiple agents?**  
A: Use the agent for the file's primary location

**Q: Do I document test files?**  
A: No, focus on source files only (not `.test.ts` or `.spec.ts`)

**Q: Can I modify the code?**  
A: NO - only add JSDoc comments, never modify working code

**Q: How detailed should examples be?**  
A: Show typical usage, keep it simple and practical

**Q: What about private functions?**  
A: Document exported functions first, private functions are optional

## 🔗 Resources

- JSDoc Specification: https://jsdoc.app/
- TypeScript JSDoc: https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html
- Example file: `frontend/src/utils/toast.ts`

---

**Last Updated**: 2025-10-23  
**Version**: 1.0.0  
**Ready to start? Pick a file and follow Step 1! 🚀**

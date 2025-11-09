"use strict";
/**
 * LOC: TYSFT1234567
 * File: /reuse/type-safety-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - NestJS services and controllers
 *   - Sequelize model definitions
 *   - API validation layers
 *   - Form handling utilities
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDefined = isDefined;
exports.isObjectWithKeys = isObjectWithKeys;
exports.isArrayOf = isArrayOf;
exports.isNonEmptyArray = isNonEmptyArray;
exports.isLiteralType = isLiteralType;
exports.hasDiscriminant = hasDiscriminant;
exports.isPromise = isPromise;
exports.isAsyncFunction = isAsyncFunction;
exports.assertDefined = assertDefined;
exports.assertType = assertType;
exports.assertNever = assertNever;
exports.validate = validate;
exports.safeCast = safeCast;
exports.coerce = coerce;
exports.validateUnion = validateUnion;
exports.typedPick = typedPick;
exports.typedOmit = typedOmit;
exports.deepClone = deepClone;
exports.deepMerge = deepMerge;
exports.createReadonly = createReadonly;
exports.typedKeys = typedKeys;
exports.typedEntries = typedEntries;
exports.typedFromEntries = typedFromEntries;
exports.brandedFactory = brandedFactory;
exports.validatedBrand = validatedBrand;
exports.unbrand = unbrand;
exports.opaqueFactory = opaqueFactory;
exports.NominalType = NominalType;
exports.createEnum = createEnum;
exports.matchUnion = matchUnion;
exports.switchUnion = switchUnion;
exports.createVariantGuard = createVariantGuard;
exports.hasProperty = hasProperty;
exports.filterByType = filterByType;
exports.partition = partition;
exports.validateSchema = validateSchema;
exports.parseWithZod = parseWithZod;
exports.safeParseWithZod = safeParseWithZod;
exports.zodGuard = zodGuard;
exports.zodPipeline = zodPipeline;
exports.createTypedDecorator = createTypedDecorator;
exports.getDecoratorMetadata = getDecoratorMetadata;
exports.extractModelAttributes = extractModelAttributes;
exports.createTypedQuery = createTypedQuery;
exports.parseEnv = parseEnv;
exports.createTypedConfig = createTypedConfig;
exports.createBuilder = createBuilder;
exports.getPath = getPath;
exports.createTypedEventEmitter = createTypedEventEmitter;
exports.createStateMachine = createStateMachine;
// ============================================================================
// SECTION 1: ADVANCED TYPE GUARDS (Functions 1-8)
// ============================================================================
/**
 * 1. Type guard for checking if value is defined (not null or undefined)
 *
 * @example
 * const values = [1, null, 2, undefined, 3];
 * const defined = values.filter(isDefined); // [1, 2, 3]
 */
function isDefined(value) {
    return value !== null && value !== undefined;
}
/**
 * 2. Type guard for checking if value is a specific object type with required keys
 *
 * @example
 * interface User { id: number; name: string; }
 * const data: unknown = { id: 1, name: 'John' };
 * if (isObjectWithKeys<User>(data, ['id', 'name'])) {
 *   console.log(data.id, data.name); // Type-safe access
 * }
 */
function isObjectWithKeys(value, keys) {
    if (typeof value !== 'object' || value === null)
        return false;
    return keys.every(key => key in value);
}
/**
 * 3. Type guard for arrays with specific element type
 *
 * @example
 * const data: unknown = [1, 2, 3];
 * if (isArrayOf(data, (x): x is number => typeof x === 'number')) {
 *   data.forEach(n => n.toFixed(2)); // Type-safe as number[]
 * }
 */
function isArrayOf(value, guard) {
    return Array.isArray(value) && value.every(guard);
}
/**
 * 4. Type guard for non-empty arrays
 *
 * @example
 * const arr: string[] = getArray();
 * if (isNonEmptyArray(arr)) {
 *   const first = arr[0]; // Safe access, never undefined
 * }
 */
function isNonEmptyArray(value) {
    return value.length > 0;
}
/**
 * 5. Type guard for literal types using const assertion
 *
 * @example
 * const STATUSES = ['active', 'inactive', 'pending'] as const;
 * type Status = typeof STATUSES[number];
 * const value: string = 'active';
 * if (isLiteralType(value, STATUSES)) {
 *   // value is now Status type
 * }
 */
function isLiteralType(value, literals) {
    return literals.includes(value);
}
/**
 * 6. Type guard for discriminated union by discriminant property
 *
 * @example
 * type Shape =
 *   | { kind: 'circle'; radius: number }
 *   | { kind: 'square'; size: number };
 * const shape: Shape = getShape();
 * if (hasDiscriminant(shape, 'kind', 'circle')) {
 *   console.log(shape.radius); // Type-safe access
 * }
 */
function hasDiscriminant(obj, key, value) {
    return obj[key] === value;
}
/**
 * 7. Type guard for promise types
 *
 * @example
 * const value: unknown = Promise.resolve(42);
 * if (isPromise(value)) {
 *   const result = await value; // Safe to await
 * }
 */
function isPromise(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'then' in value &&
        typeof value.then === 'function');
}
/**
 * 8. Type guard for async functions
 *
 * @example
 * const fn: Function = async () => 42;
 * if (isAsyncFunction(fn)) {
 *   const result = await fn(); // Type-safe async call
 * }
 */
function isAsyncFunction(fn) {
    return typeof fn === 'function' && fn.constructor.name === 'AsyncFunction';
}
// ============================================================================
// SECTION 2: TYPE ASSERTION & VALIDATION (Functions 9-15)
// ============================================================================
/**
 * 9. Assert that a value is defined, throw if not
 *
 * @example
 * const user = users.find(u => u.id === 1);
 * assertDefined(user, 'User not found');
 * console.log(user.name); // user is definitely defined
 */
function assertDefined(value, message = 'Value is null or undefined') {
    if (value === null || value === undefined) {
        throw new Error(message);
    }
}
/**
 * 10. Assert that a value matches a type guard, throw if not
 *
 * @example
 * const data: unknown = getUserData();
 * assertType(data, isObjectWithKeys<User>, ['id', 'name'], 'Invalid user data');
 * console.log(data.id); // Type-safe as User
 */
function assertType(value, guard, ...guardArgs) {
    if (!guard(value, ...guardArgs)) {
        throw new TypeError(`Type assertion failed: ${JSON.stringify(value)}`);
    }
}
/**
 * 11. Assert never for exhaustive checking in discriminated unions
 *
 * @example
 * type Action = { type: 'add' } | { type: 'remove' };
 * function handle(action: Action) {
 *   switch (action.type) {
 *     case 'add': return handleAdd();
 *     case 'remove': return handleRemove();
 *     default: assertNever(action); // Compile error if not exhaustive
 *   }
 * }
 */
function assertNever(value, message = 'Unexpected value') {
    throw new Error(`${message}: ${JSON.stringify(value)}`);
}
/**
 * 12. Runtime type validation with custom validator function
 *
 * @example
 * const validator = (v: unknown): v is number => typeof v === 'number';
 * const value = validate(getUserInput(), validator, 'Expected number');
 * console.log(value.toFixed(2)); // Type-safe as number
 */
function validate(value, validator, errorMessage = 'Validation failed') {
    if (!validator(value)) {
        throw new Error(errorMessage);
    }
    return value;
}
/**
 * 13. Safe type cast with runtime check
 *
 * @example
 * const data: unknown = { id: 1, name: 'John' };
 * const user = safeCast<User>(data, (v): v is User =>
 *   isObjectWithKeys<User>(v, ['id', 'name'])
 * );
 * if (user) {
 *   console.log(user.name); // Type-safe access
 * }
 */
function safeCast(value, guard) {
    return guard(value) ? value : undefined;
}
/**
 * 14. Type-safe coercion with default value
 *
 * @example
 * const count = coerce('123', Number, 0); // 123
 * const invalid = coerce('abc', Number, 0); // 0
 */
function coerce(value, coercer, defaultValue) {
    try {
        const result = coercer(value);
        return result !== null && result !== undefined && !Number.isNaN(result)
            ? result
            : defaultValue;
    }
    catch {
        return defaultValue;
    }
}
/**
 * 15. Multi-type validator for union types
 *
 * @example
 * const validators = [
 *   (v: unknown): v is string => typeof v === 'string',
 *   (v: unknown): v is number => typeof v === 'number'
 * ];
 * if (validateUnion(value, validators)) {
 *   // value is string | number
 * }
 */
function validateUnion(value, validators) {
    return validators.some(validator => validator(value));
}
// ============================================================================
// SECTION 3: GENERIC TYPE BUILDERS & HELPERS (Functions 16-23)
// ============================================================================
/**
 * 16. Create a type-safe pick utility with runtime enforcement
 *
 * @example
 * interface User { id: number; name: string; email: string; password: string; }
 * const user: User = getUser();
 * const safe = typedPick(user, ['id', 'name', 'email']);
 * // safe is { id: number; name: string; email: string }
 */
function typedPick(obj, keys) {
    const result = {};
    keys.forEach(key => {
        result[key] = obj[key];
    });
    return result;
}
/**
 * 17. Create a type-safe omit utility with runtime enforcement
 *
 * @example
 * interface User { id: number; name: string; password: string; }
 * const user: User = getUser();
 * const safe = typedOmit(user, ['password']);
 * // safe is { id: number; name: string }
 */
function typedOmit(obj, keys) {
    const result = { ...obj };
    keys.forEach(key => {
        delete result[key];
    });
    return result;
}
/**
 * 18. Deep clone with type preservation
 *
 * @example
 * interface Config { db: { host: string; port: number }; }
 * const config: Config = getConfig();
 * const cloned = deepClone(config);
 * // cloned is Config type with all nested properties cloned
 */
function deepClone(value) {
    if (value === null || typeof value !== 'object')
        return value;
    if (value instanceof Date)
        return new Date(value.getTime());
    if (value instanceof Array)
        return value.map(item => deepClone(item));
    if (value instanceof Set)
        return new Set(Array.from(value).map(deepClone));
    if (value instanceof Map) {
        return new Map(Array.from(value.entries()).map(([k, v]) => [deepClone(k), deepClone(v)]));
    }
    const cloned = {};
    Object.keys(value).forEach(key => {
        cloned[key] = deepClone(value[key]);
    });
    return cloned;
}
/**
 * 19. Deep merge with type safety
 *
 * @example
 * const defaults = { a: 1, b: { c: 2 } };
 * const overrides = { b: { d: 3 } };
 * const merged = deepMerge(defaults, overrides);
 * // merged is { a: 1, b: { c: 2, d: 3 } }
 */
function deepMerge(target, source) {
    const result = { ...target };
    Object.keys(source).forEach(key => {
        const sourceValue = source[key];
        const targetValue = result[key];
        if (targetValue &&
            typeof targetValue === 'object' &&
            !Array.isArray(targetValue) &&
            sourceValue &&
            typeof sourceValue === 'object' &&
            !Array.isArray(sourceValue)) {
            result[key] = deepMerge(targetValue, sourceValue);
        }
        else {
            result[key] = sourceValue;
        }
    });
    return result;
}
/**
 * 20. Create a readonly proxy with deep immutability
 *
 * @example
 * const data = { user: { name: 'John' } };
 * const readonly = createReadonly(data);
 * readonly.user.name = 'Jane'; // Throws error
 */
function createReadonly(obj) {
    return new Proxy(obj, {
        get(target, prop) {
            const value = target[prop];
            if (typeof value === 'object' && value !== null) {
                return createReadonly(value);
            }
            return value;
        },
        set() {
            throw new Error('Cannot modify readonly object');
        },
        deleteProperty() {
            throw new Error('Cannot delete property from readonly object');
        }
    });
}
/**
 * 21. Type-safe object keys with proper typing
 *
 * @example
 * interface User { id: number; name: string; }
 * const user: User = { id: 1, name: 'John' };
 * const keys = typedKeys(user); // ('id' | 'name')[]
 * keys.forEach(key => console.log(user[key])); // Type-safe
 */
function typedKeys(obj) {
    return Object.keys(obj);
}
/**
 * 22. Type-safe object entries with proper typing
 *
 * @example
 * interface User { id: number; name: string; }
 * const user: User = { id: 1, name: 'John' };
 * const entries = typedEntries(user); // ['id', number] | ['name', string]
 * entries.forEach(([key, value]) => console.log(key, value)); // Type-safe
 */
function typedEntries(obj) {
    return Object.entries(obj);
}
/**
 * 23. Type-safe fromEntries with inference
 *
 * @example
 * const entries: [['id', number], ['name', string]] = [['id', 1], ['name', 'John']];
 * const obj = typedFromEntries(entries);
 * // obj is { id: number; name: string }
 */
function typedFromEntries(entries) {
    return Object.fromEntries(entries);
}
// ============================================================================
// SECTION 4: BRANDED TYPES & FACTORIES (Functions 24-29)
// ============================================================================
/**
 * 24. Create a branded type factory for nominal typing
 *
 * @example
 * type UserId = Branded<number, 'UserId'>;
 * type ProductId = Branded<number, 'ProductId'>;
 * const createUserId = brandedFactory<UserId>();
 * const userId = createUserId(123);
 * const productId = 456 as ProductId; // Error: incompatible types
 */
function brandedFactory() {
    return (value) => {
        return value;
    };
}
/**
 * 25. Validate and create branded type with runtime check
 *
 * @example
 * type Email = Branded<string, 'Email'>;
 * const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
 * const createEmail = validatedBrand<Email>(isEmail, 'Invalid email');
 * const email = createEmail('user@example.com'); // Email type
 * const invalid = createEmail('invalid'); // Throws error
 */
function validatedBrand(validator, errorMessage = 'Validation failed') {
    return (value) => {
        if (!validator(value)) {
            throw new Error(errorMessage);
        }
        return value;
    };
}
/**
 * 26. Extract base type from branded type
 *
 * @example
 * type UserId = Branded<number, 'UserId'>;
 * const userId: UserId = 123 as UserId;
 * const rawId = unbrand(userId); // number
 */
function unbrand(value) {
    return value;
}
/**
 * 27. Create opaque type factory
 *
 * @example
 * type Token = Opaque<string, 'AuthToken'>;
 * const createToken = opaqueFactory<Token>();
 * const token = createToken('secret-token');
 */
function opaqueFactory() {
    return (value) => {
        return value;
    };
}
/**
 * 28. Create nominal type using class-based approach
 *
 * @example
 * class UserId extends NominalType<number, 'UserId'>() {}
 * const userId = new UserId(123);
 * console.log(userId.value); // 123
 */
function NominalType() {
    return class {
        constructor(value) {
            this.value = value;
        }
    };
}
/**
 * 29. Type-safe enum factory with branded values
 *
 * @example
 * const UserRole = createEnum(['admin', 'user', 'guest'] as const);
 * type UserRole = typeof UserRole.Type;
 * const role: UserRole = UserRole.admin; // Type-safe
 */
function createEnum(values) {
    const enumObj = {};
    values.forEach(val => {
        enumObj[val] = val;
    });
    return Object.assign(enumObj, {
        Type: null,
        values: values,
        is: (value) => values.includes(value)
    });
}
// ============================================================================
// SECTION 5: DISCRIMINATED UNIONS & TYPE NARROWING (Functions 30-35)
// ============================================================================
/**
 * 30. Create discriminated union matcher with exhaustive checking
 *
 * @example
 * type Result<T, E> =
 *   | { status: 'success'; data: T }
 *   | { status: 'error'; error: E };
 * const result: Result<User, Error> = getResult();
 * const value = matchUnion(result, 'status', {
 *   success: (r) => r.data,
 *   error: (r) => null
 * });
 */
function matchUnion(value, discriminant, handlers) {
    const key = value[discriminant];
    const handler = handlers[key];
    if (!handler) {
        throw new Error(`No handler for discriminant value: ${String(key)}`);
    }
    return handler(value);
}
/**
 * 31. Type-safe switch helper for discriminated unions
 *
 * @example
 * type Shape =
 *   | { kind: 'circle'; radius: number }
 *   | { kind: 'square'; size: number };
 * const shape: Shape = getShape();
 * const area = switchUnion(shape, 'kind')
 *   .case('circle', s => Math.PI * s.radius ** 2)
 *   .case('square', s => s.size ** 2)
 *   .exec();
 */
function switchUnion(value, discriminant) {
    const cases = new Map();
    let defaultCase;
    return {
        case(variant, handler) {
            cases.set(variant, handler);
            return this;
        },
        default(handler) {
            defaultCase = handler;
            return this;
        },
        exec() {
            const key = value[discriminant];
            const handler = cases.get(key);
            if (handler)
                return handler(value);
            if (defaultCase)
                return defaultCase(value);
            throw new Error(`No handler for discriminant value: ${String(key)}`);
        }
    };
}
/**
 * 32. Create type predicate for discriminated union variant
 *
 * @example
 * type Action =
 *   | { type: 'add'; item: string }
 *   | { type: 'remove'; id: number };
 * const isAddAction = createVariantGuard<Action, 'type', 'add'>('type', 'add');
 * const action: Action = getAction();
 * if (isAddAction(action)) {
 *   console.log(action.item); // Type-safe access
 * }
 */
function createVariantGuard(discriminant, variant) {
    return (value) => {
        return value[discriminant] === variant;
    };
}
/**
 * 33. Narrow type by property existence
 *
 * @example
 * type User = { id: number; name: string; email?: string };
 * const user: User = getUser();
 * if (hasProperty(user, 'email')) {
 *   console.log(user.email.toLowerCase()); // email is string, not string | undefined
 * }
 */
function hasProperty(obj, key) {
    return typeof obj === 'object' && obj !== null && key in obj;
}
/**
 * 34. Filter array and narrow element type
 *
 * @example
 * const mixed: (string | number)[] = [1, 'a', 2, 'b'];
 * const numbers = filterByType(mixed, (x): x is number => typeof x === 'number');
 * // numbers is number[]
 */
function filterByType(array, guard) {
    return array.filter(guard);
}
/**
 * 35. Partition array by type guard
 *
 * @example
 * const mixed: (string | number)[] = [1, 'a', 2, 'b'];
 * const [numbers, strings] = partition(mixed, (x): x is number => typeof x === 'number');
 * // numbers is number[], strings is string[]
 */
function partition(array, guard) {
    const pass = [];
    const fail = [];
    array.forEach(item => {
        if (guard(item)) {
            pass.push(item);
        }
        else {
            fail.push(item);
        }
    });
    return [pass, fail];
}
// ============================================================================
// SECTION 6: RUNTIME TYPE VALIDATION (Functions 36-40)
// ============================================================================
/**
 * 36. Validate object schema at runtime with type inference
 *
 * @example
 * const userSchema = {
 *   id: (v: unknown): v is number => typeof v === 'number',
 *   name: (v: unknown): v is string => typeof v === 'string',
 *   email: (v: unknown): v is string => typeof v === 'string'
 * };
 * const data: unknown = getUserData();
 * if (validateSchema(data, userSchema)) {
 *   console.log(data.id, data.name); // Type-safe as { id: number, name: string, email: string }
 * }
 */
function validateSchema(value, schema) {
    if (typeof value !== 'object' || value === null)
        return false;
    return Object.entries(schema).every(([key, guard]) => {
        return key in value && guard(value[key]);
    });
}
/**
 * 37. Create Zod schema from TypeScript type with validation
 *
 * @example
 * interface User { id: number; name: string; email: string; }
 * const userSchema = z.object({
 *   id: z.number(),
 *   name: z.string(),
 *   email: z.string().email()
 * });
 * const data: unknown = getUserData();
 * const user = parseWithZod(data, userSchema);
 * // user is User type with runtime validation
 */
function parseWithZod(data, schema) {
    return schema.parse(data);
}
/**
 * 38. Safe parse with Zod returning result type
 *
 * @example
 * const result = safeParseWithZod(data, userSchema);
 * if (result.success) {
 *   console.log(result.data.name); // Type-safe access
 * } else {
 *   console.error(result.error);
 * }
 */
function safeParseWithZod(data, schema) {
    const result = schema.safeParse(data);
    if (result.success) {
        return { success: true, data: result.data };
    }
    return { success: false, error: result.error };
}
/**
 * 39. Create type guard from Zod schema
 *
 * @example
 * const userSchema = z.object({ id: z.number(), name: z.string() });
 * const isUser = zodGuard(userSchema);
 * const data: unknown = getUserData();
 * if (isUser(data)) {
 *   console.log(data.id, data.name); // Type-safe
 * }
 */
function zodGuard(schema) {
    return (value) => {
        return schema.safeParse(value).success;
    };
}
/**
 * 40. Validate and transform with Zod pipeline
 *
 * @example
 * const pipeline = zodPipeline(
 *   z.string(),
 *   z.string().transform(s => s.toLowerCase()),
 *   z.string().refine(s => s.length > 3)
 * );
 * const result = pipeline('HELLO'); // 'hello'
 */
function zodPipeline(...schemas) {
    return (data) => {
        return schemas.reduce((acc, schema) => schema.parse(acc), data);
    };
}
// ============================================================================
// SECTION 7: TYPE-SAFE INTEGRATIONS (Functions 41-46)
// ============================================================================
/**
 * 41. Create type-safe NestJS decorator with metadata
 *
 * @example
 * const Auth = createTypedDecorator<{ roles: string[] }>('auth');
 * @Auth({ roles: ['admin'] })
 * class AdminController {}
 * const metadata = getDecoratorMetadata(AdminController, 'auth');
 * // metadata is { roles: string[] }
 */
function createTypedDecorator(metadataKey) {
    return (metadata) => {
        return (target) => {
            Reflect.defineMetadata(metadataKey, metadata, target);
        };
    };
}
/**
 * 42. Get typed metadata from decorator
 *
 * @example
 * const metadata = getDecoratorMetadata<{ roles: string[] }>(AdminController, 'auth');
 * if (metadata) {
 *   console.log(metadata.roles); // Type-safe access
 * }
 */
function getDecoratorMetadata(target, metadataKey) {
    return Reflect.getMetadata(metadataKey, target);
}
/**
 * 43. Type-safe Sequelize model attributes extractor
 *
 * @example
 * class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
 *   declare id: number;
 *   declare name: string;
 * }
 * const attributes = extractModelAttributes(User);
 * // attributes is { id: number, name: string }
 */
function extractModelAttributes(model) {
    const attrs = model.getAttributes();
    return Object.keys(attrs).reduce((acc, key) => {
        acc[key] = null;
        return acc;
    }, {});
}
/**
 * 44. Create type-safe Sequelize query builder
 *
 * @example
 * const query = createTypedQuery(User)
 *   .where({ name: 'John' })
 *   .include(['posts'])
 *   .build();
 * const users = await query.findAll();
 * // users is User[] with type safety
 */
function createTypedQuery(model) {
    let whereClause = {};
    let includeClause = [];
    return {
        where(conditions) {
            whereClause = { ...whereClause, ...conditions };
            return this;
        },
        include(associations) {
            includeClause = [...includeClause, ...associations];
            return this;
        },
        build() {
            return {
                findAll: () => model.findAll({ where: whereClause, include: includeClause }),
                findOne: () => model.findOne({ where: whereClause, include: includeClause }),
                count: () => model.count({ where: whereClause })
            };
        }
    };
}
/**
 * 45. Type-safe environment variable parser
 *
 * @example
 * const envSchema = {
 *   PORT: (v: string) => parseInt(v, 10),
 *   DATABASE_URL: (v: string) => v,
 *   ENABLE_CACHE: (v: string) => v === 'true'
 * };
 * const env = parseEnv(process.env, envSchema);
 * // env is { PORT: number, DATABASE_URL: string, ENABLE_CACHE: boolean }
 */
function parseEnv(env, schema) {
    const result = {};
    Object.entries(schema).forEach(([key, parser]) => {
        const value = env[key];
        if (value === undefined) {
            throw new Error(`Missing environment variable: ${key}`);
        }
        result[key] = parser(value);
    });
    return result;
}
/**
 * 46. Create type-safe configuration object with validation
 *
 * @example
 * const configSchema = z.object({
 *   port: z.number().min(1000),
 *   database: z.object({
 *     host: z.string(),
 *     port: z.number()
 *   })
 * });
 * const config = createTypedConfig(rawConfig, configSchema);
 * // config is type-safe and validated
 */
function createTypedConfig(raw, schema) {
    const validated = schema.parse(raw);
    return createReadonly(validated);
}
// ============================================================================
// SECTION 8: ADVANCED TYPE UTILITIES (Functions 47-50)
// ============================================================================
/**
 * 47. Type-safe builder pattern factory
 *
 * @example
 * interface User { id: number; name: string; email: string; }
 * const userBuilder = createBuilder<User>();
 * const user = userBuilder
 *   .id(1)
 *   .name('John')
 *   .email('john@example.com')
 *   .build();
 */
function createBuilder() {
    const values = {};
    const builder = {
        build() {
            const keys = Object.keys(values);
            const typeKeys = new Set(keys);
            if (typeKeys.size !== keys.length) {
                throw new Error('Missing required properties');
            }
            return values;
        }
    };
    return new Proxy(builder, {
        get(target, prop) {
            if (prop === 'build')
                return target.build;
            return (value) => {
                values[prop] = value;
                return builder;
            };
        }
    });
}
/**
 * 48. Get value at nested path with type safety
 *
 * @example
 * interface User { profile: { address: { city: string } } }
 * const user: User = getUser();
 * const city = getPath(user, 'profile.address.city');
 * // city is string type
 */
function getPath(obj, path) {
    const parts = path.split('.');
    let current = obj;
    for (const part of parts) {
        if (current === null || current === undefined)
            return undefined;
        current = current[part];
    }
    return current;
}
/**
 * 49. Type-safe event emitter with typed events
 *
 * @example
 * interface Events {
 *   userCreated: { id: number; name: string };
 *   userDeleted: { id: number };
 * }
 * const emitter = createTypedEventEmitter<Events>();
 * emitter.on('userCreated', (data) => {
 *   console.log(data.id, data.name); // Type-safe
 * });
 * emitter.emit('userCreated', { id: 1, name: 'John' });
 */
function createTypedEventEmitter() {
    const listeners = new Map();
    return {
        on(event, handler) {
            if (!listeners.has(event)) {
                listeners.set(event, new Set());
            }
            listeners.get(event).add(handler);
            return () => this.off(event, handler);
        },
        off(event, handler) {
            listeners.get(event)?.delete(handler);
        },
        emit(event, data) {
            listeners.get(event)?.forEach(handler => handler(data));
        },
        once(event, handler) {
            const wrappedHandler = (data) => {
                handler(data);
                this.off(event, wrappedHandler);
            };
            this.on(event, wrappedHandler);
        }
    };
}
/**
 * 50. Type-safe state machine implementation
 *
 * @example
 * type State = 'idle' | 'loading' | 'success' | 'error';
 * type Event = 'FETCH' | 'SUCCESS' | 'ERROR' | 'RESET';
 * const machine = createStateMachine<State, Event>({
 *   initial: 'idle',
 *   states: {
 *     idle: { on: { FETCH: 'loading' } },
 *     loading: { on: { SUCCESS: 'success', ERROR: 'error' } },
 *     success: { on: { RESET: 'idle' } },
 *     error: { on: { RESET: 'idle' } }
 *   }
 * });
 * machine.send('FETCH'); // state is 'loading'
 */
function createStateMachine(config) {
    let currentState = config.initial;
    const listeners = new Set();
    return {
        get state() {
            return currentState;
        },
        send(event) {
            const stateConfig = config.states[currentState];
            const nextState = stateConfig.on?.[event];
            if (!nextState) {
                throw new Error(`Invalid transition: ${currentState} -> ${String(event)}`);
            }
            stateConfig.exit?.();
            currentState = nextState;
            config.states[nextState].entry?.();
            listeners.forEach(listener => listener(currentState));
        },
        onTransition(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        }
    };
}
// ============================================================================
// EXPORTS
// ============================================================================
exports.default = {
    // Type Guards
    isDefined,
    isObjectWithKeys,
    isArrayOf,
    isNonEmptyArray,
    isLiteralType,
    hasDiscriminant,
    isPromise,
    isAsyncFunction,
    // Type Assertion & Validation
    assertDefined,
    assertType,
    assertNever,
    validate,
    safeCast,
    coerce,
    validateUnion,
    // Generic Type Builders
    typedPick,
    typedOmit,
    deepClone,
    deepMerge,
    createReadonly,
    typedKeys,
    typedEntries,
    typedFromEntries,
    // Branded Types
    brandedFactory,
    validatedBrand,
    unbrand,
    opaqueFactory,
    NominalType,
    createEnum,
    // Discriminated Unions
    matchUnion,
    switchUnion,
    createVariantGuard,
    hasProperty,
    filterByType,
    partition,
    // Runtime Validation
    validateSchema,
    parseWithZod,
    safeParseWithZod,
    zodGuard,
    zodPipeline,
    // Type-Safe Integrations
    createTypedDecorator,
    getDecoratorMetadata,
    extractModelAttributes,
    createTypedQuery,
    parseEnv,
    createTypedConfig,
    // Advanced Utilities
    createBuilder,
    getPath,
    createTypedEventEmitter,
    createStateMachine
};
//# sourceMappingURL=type-safety-kit.js.map
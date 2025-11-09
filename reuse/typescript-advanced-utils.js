"use strict";
/**
 * TypeScript Advanced Utilities
 *
 * A comprehensive collection of 40 advanced TypeScript patterns for sophisticated
 * type-level programming. Includes advanced generics, mapped types, template literals,
 * recursive types, brand types, builder patterns, and state machines.
 *
 * @module typescript-advanced-utils
 * @target TypeScript 5.x, Node 18+
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.brand = brand;
exports.opaque = opaque;
exports.discriminate = discriminate;
exports.createBuilder = createBuilder;
exports.withDefaults = withDefaults;
exports.createStateMachine = createStateMachine;
exports.deepPartial = deepPartial;
exports.deepReadonly = deepReadonly;
exports.pickByType = pickByType;
exports.toCamelCaseKeys = toCamelCaseKeys;
exports.toSnakeCaseKeys = toSnakeCaseKeys;
exports.getByPath = getByPath;
exports.setByPath = setByPath;
/**
 * Create branded value
 *
 * @param value - Value to brand
 * @returns Branded value
 *
 * @example
 * ```ts
 * type Email = Brand<string, "Email">;
 * const email = brand<Email>("user@example.com");
 * ```
 */
function brand(value) {
    return value;
}
/**
 * Create opaque value
 *
 * @param value - Value to make opaque
 * @returns Opaque value
 *
 * @example
 * ```ts
 * type PositiveNumber = Opaque<number, "Positive">;
 * function makePositive(n: number): PositiveNumber | null {
 *   return n > 0 ? opaque<PositiveNumber>(n) : null;
 * }
 * ```
 */
function opaque(value) {
    return value;
}
/**
 * Discriminate a tagged union
 *
 * @param union - Tagged union value
 * @param tag - Tag to match
 * @returns True if union has the specified tag
 *
 * @example
 * ```ts
 * type Result = { tag: "ok"; value: number } | { tag: "error"; error: string };
 * const result: Result = { tag: "ok", value: 42 };
 *
 * if (discriminate(result, "ok")) {
 *   console.log(result.value); // TypeScript knows this is the ok variant
 * }
 * ```
 */
function discriminate(union, tag) {
    return union.tag === tag;
}
/**
 * Create a builder for a type
 *
 * @returns Builder instance
 *
 * @example
 * ```ts
 * interface User {
 *   name: string;
 *   email: string;
 * }
 *
 * const user = createBuilder<User>()
 *   .name("John")
 *   .email("john@example.com")
 *   .build();
 * ```
 */
function createBuilder() {
    const data = {};
    const builder = {
        build: () => data,
    };
    return new Proxy(builder, {
        get(target, prop) {
            if (prop === 'build') {
                return target.build;
            }
            return (value) => {
                data[prop] = value;
                return builder;
            };
        },
    });
}
/**
 * Create object with default values
 *
 * @param defaults - Default values
 * @param overrides - Override values
 * @returns Merged object
 *
 * @example
 * ```ts
 * interface Config {
 *   host: string;
 *   port: number;
 *   timeout: number;
 * }
 *
 * const config = withDefaults<Config>(
 *   { host: "localhost", port: 3000, timeout: 5000 },
 *   { port: 8080 }
 * );
 * // { host: "localhost", port: 8080, timeout: 5000 }
 * ```
 */
function withDefaults(defaults, overrides = {}) {
    return { ...defaults, ...overrides };
}
/**
 * Create a state machine instance
 *
 * @param initialState - Initial state
 * @param transitions - State transitions
 * @returns State machine instance
 *
 * @example
 * ```ts
 * type State = "idle" | "loading" | "success" | "error";
 * type Event = "fetch" | "resolve" | "reject" | "reset";
 *
 * const machine = createStateMachine<State, Event>("idle", [
 *   { from: "idle", event: "fetch", to: "loading" },
 *   { from: "loading", event: "resolve", to: "success" },
 *   { from: "loading", event: "reject", to: "error" },
 *   { from: "success", event: "reset", to: "idle" },
 *   { from: "error", event: "reset", to: "idle" },
 * ]);
 * ```
 */
function createStateMachine(initialState, transitions) {
    let current = initialState;
    const transitionMap = new Map();
    transitions.forEach((t) => {
        const key = `${t.from}:${t.event}`;
        transitionMap.set(key, t.to);
    });
    return {
        get current() {
            return current;
        },
        transition(event) {
            const key = `${current}:${event}`;
            const next = transitionMap.get(key);
            if (next !== undefined) {
                current = next;
                return current;
            }
            throw new Error(`Invalid transition: ${current} -> ${event}`);
        },
        can(event) {
            const key = `${current}:${event}`;
            return transitionMap.has(key);
        },
    };
}
// ============================================================================
// Utility Functions for Advanced Patterns
// ============================================================================
/**
 * Create a deep partial version of an object
 *
 * @param obj - Object to make partially optional
 * @returns Deep partial object
 *
 * @example
 * ```ts
 * const config = {
 *   database: {
 *     host: "localhost",
 *     port: 5432
 *   }
 * };
 *
 * const partial = deepPartial(config);
 * // All nested properties are optional
 * ```
 */
function deepPartial(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(deepPartial);
    }
    const result = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            result[key] = deepPartial(obj[key]);
        }
    }
    return result;
}
/**
 * Create a deeply readonly version of an object
 *
 * @param obj - Object to make readonly
 * @returns Deep readonly object
 *
 * @example
 * ```ts
 * const config = deepReadonly({
 *   api: { url: "http://api.example.com" }
 * });
 * // config.api.url = "..."; // Error: cannot assign to readonly property
 * ```
 */
function deepReadonly(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach((prop) => {
        const value = obj[prop];
        if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
            deepReadonly(value);
        }
    });
    return obj;
}
/**
 * Pick properties by their type
 *
 * @param obj - Source object
 * @param predicate - Type checking predicate
 * @returns Object with only properties of matching type
 *
 * @example
 * ```ts
 * const data = { id: 1, name: "John", age: 30, active: true };
 * const numbers = pickByType(data, (v): v is number => typeof v === "number");
 * // { id: 1, age: 30 }
 * ```
 */
function pickByType(obj, predicate) {
    const result = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const value = obj[key];
            if (predicate(value)) {
                result[key] = value;
            }
        }
    }
    return result;
}
/**
 * Convert object keys to camelCase
 *
 * @param obj - Object with keys to convert
 * @returns Object with camelCase keys
 *
 * @example
 * ```ts
 * const snake = { first_name: "John", last_name: "Doe" };
 * const camel = toCamelCaseKeys(snake);
 * // { firstName: "John", lastName: "Doe" }
 * ```
 */
function toCamelCaseKeys(obj) {
    const result = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const camelKey = key.replace(/[_-](\w)/g, (_, letter) => letter.toUpperCase());
            result[camelKey] = obj[key];
        }
    }
    return result;
}
/**
 * Convert object keys to snake_case
 *
 * @param obj - Object with keys to convert
 * @returns Object with snake_case keys
 *
 * @example
 * ```ts
 * const camel = { firstName: "John", lastName: "Doe" };
 * const snake = toSnakeCaseKeys(camel);
 * // { first_name: "John", last_name: "Doe" }
 * ```
 */
function toSnakeCaseKeys(obj) {
    const result = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
            result[snakeKey] = obj[key];
        }
    }
    return result;
}
/**
 * Get value from nested object path
 *
 * @param obj - Source object
 * @param path - Dot-separated path
 * @returns Value at path or undefined
 *
 * @example
 * ```ts
 * const user = { address: { city: "NYC" } };
 * const city = getByPath(user, "address.city");  // "NYC"
 * ```
 */
function getByPath(obj, path) {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
        if (result && typeof result === 'object' && key in result) {
            result = result[key];
        }
        else {
            return undefined;
        }
    }
    return result;
}
/**
 * Set value at nested object path
 *
 * @param obj - Source object
 * @param path - Dot-separated path
 * @param value - Value to set
 * @returns New object with value set
 *
 * @example
 * ```ts
 * const user = { address: { city: "NYC" } };
 * const updated = setByPath(user, "address.city", "LA");
 * // { address: { city: "LA" } }
 * ```
 */
function setByPath(obj, path, value) {
    const keys = path.split('.');
    const result = JSON.parse(JSON.stringify(obj));
    let current = result;
    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!(key in current)) {
            current[key] = {};
        }
        current = current[key];
    }
    current[keys[keys.length - 1]] = value;
    return result;
}
//# sourceMappingURL=typescript-advanced-utils.js.map
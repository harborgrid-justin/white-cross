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

// ============================================================================
// Advanced Generic Patterns - Type Definitions
// ============================================================================

/**
 * Recursively makes all properties optional (deep partial)
 *
 * @example
 * ```ts
 * interface User {
 *   name: string;
 *   address: {
 *     street: string;
 *     city: string;
 *   };
 * }
 * type PartialUser = DeepPartial<User>;
 * // { name?: string; address?: { street?: string; city?: string } }
 * ```
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * Recursively makes all properties required
 *
 * @example
 * ```ts
 * type MaybeUser = {
 *   name?: string;
 *   address?: {
 *     street?: string;
 *   };
 * };
 * type CompleteUser = DeepRequired<MaybeUser>;
 * // { name: string; address: { street: string } }
 * ```
 */
export type DeepRequired<T> = T extends object
  ? {
      [P in keyof T]-?: DeepRequired<T[P]>;
    }
  : T;

/**
 * Recursively makes all properties readonly
 *
 * @example
 * ```ts
 * interface Config {
 *   api: {
 *     url: string;
 *     timeout: number;
 *   };
 * }
 * type ImmutableConfig = DeepReadonly<Config>;
 * // { readonly api: { readonly url: string; readonly timeout: number } }
 * ```
 */
export type DeepReadonly<T> = T extends object
  ? {
      readonly [P in keyof T]: DeepReadonly<T[P]>;
    }
  : T;

/**
 * Recursively removes readonly modifiers
 *
 * @example
 * ```ts
 * type ReadonlyConfig = {
 *   readonly api: {
 *     readonly url: string;
 *   };
 * };
 * type MutableConfig = DeepMutable<ReadonlyConfig>;
 * // { api: { url: string } }
 * ```
 */
export type DeepMutable<T> = T extends object
  ? {
      -readonly [P in keyof T]: DeepMutable<T[P]>;
    }
  : T;

/**
 * Recursively removes null and undefined from all properties
 *
 * @example
 * ```ts
 * type MaybeData = {
 *   name: string | null;
 *   nested: {
 *     value: number | undefined;
 *   };
 * };
 * type Data = DeepNonNullable<MaybeData>;
 * // { name: string; nested: { value: number } }
 * ```
 */
export type DeepNonNullable<T> = T extends object
  ? {
      [P in keyof T]: DeepNonNullable<NonNullable<T[P]>>;
    }
  : NonNullable<T>;

// ============================================================================
// Mapped Type Utilities
// ============================================================================

/**
 * Maps all properties to Promises
 *
 * @example
 * ```ts
 * interface User {
 *   id: number;
 *   name: string;
 * }
 * type AsyncUser = MapToPromise<User>;
 * // { id: Promise<number>; name: Promise<string> }
 * ```
 */
export type MapToPromise<T> = {
  [P in keyof T]: Promise<T[P]>;
};

/**
 * Maps all properties to arrays
 *
 * @example
 * ```ts
 * interface Counts {
 *   users: number;
 *   posts: number;
 * }
 * type CountArrays = MapToArray<Counts>;
 * // { users: number[]; posts: number[] }
 * ```
 */
export type MapToArray<T> = {
  [P in keyof T]: T[P][];
};

/**
 * Pick only properties of a specific type
 *
 * @example
 * ```ts
 * interface User {
 *   id: number;
 *   name: string;
 *   age: number;
 *   email: string;
 * }
 * type StringProps = PickByType<User, string>;
 * // { name: string; email: string }
 * ```
 */
export type PickByType<T, ValueType> = Pick<
  T,
  { [K in keyof T]: T[K] extends ValueType ? K : never }[keyof T]
>;

/**
 * Omit properties of a specific type
 *
 * @example
 * ```ts
 * interface User {
 *   id: number;
 *   name: string;
 *   age: number;
 * }
 * type NonNumbers = OmitByType<User, number>;
 * // { name: string }
 * ```
 */
export type OmitByType<T, ValueType> = Pick<
  T,
  { [K in keyof T]: T[K] extends ValueType ? never : K }[keyof T]
>;

/**
 * Require at least one property from a type
 *
 * @example
 * ```ts
 * interface Contact {
 *   email: string;
 *   phone: string;
 * }
 * type ContactMethod = RequireAtLeastOne<Contact>;
 * // { email: string; phone?: string } | { email?: string; phone: string }
 * ```
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

/**
 * Require exactly one property from a type
 *
 * @example
 * ```ts
 * interface Auth {
 *   token: string;
 *   apiKey: string;
 * }
 * type AuthMethod = RequireExactlyOne<Auth>;
 * // { token: string; apiKey?: never } | { token?: never; apiKey: string }
 * ```
 */
export type RequireExactlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, never>>;
  }[Keys];

// ============================================================================
// Template Literal Type Helpers
// ============================================================================

/**
 * Convert string to camelCase
 *
 * @example
 * ```ts
 * type Result1 = CamelCase<"hello_world">;     // "helloWorld"
 * type Result2 = CamelCase<"hello-world">;     // "helloWorld"
 * type Result3 = CamelCase<"hello world">;     // "helloWorld"
 * ```
 */
export type CamelCase<S extends string> = S extends `${infer First}_${infer Rest}`
  ? `${Lowercase<First>}${Capitalize<CamelCase<Rest>>}`
  : S extends `${infer First}-${infer Rest}`
  ? `${Lowercase<First>}${Capitalize<CamelCase<Rest>>}`
  : S extends `${infer First} ${infer Rest}`
  ? `${Lowercase<First>}${Capitalize<CamelCase<Rest>>}`
  : Lowercase<S>;

/**
 * Convert string to PascalCase
 *
 * @example
 * ```ts
 * type Result1 = PascalCase<"hello_world">;    // "HelloWorld"
 * type Result2 = PascalCase<"hello-world">;    // "HelloWorld"
 * ```
 */
export type PascalCase<S extends string> = Capitalize<CamelCase<S>>;

/**
 * Convert string to snake_case
 *
 * @example
 * ```ts
 * type Result1 = SnakeCase<"helloWorld">;      // "hello_world"
 * type Result2 = SnakeCase<"HelloWorld">;      // "hello_world"
 * ```
 */
export type SnakeCase<S extends string> = S extends `${infer First}${infer Rest}`
  ? First extends Uppercase<First>
    ? `_${Lowercase<First>}${SnakeCase<Rest>}`
    : `${First}${SnakeCase<Rest>}`
  : S;

/**
 * Convert string to kebab-case
 *
 * @example
 * ```ts
 * type Result1 = KebabCase<"helloWorld">;      // "hello-world"
 * type Result2 = KebabCase<"HelloWorld">;      // "hello-world"
 * ```
 */
export type KebabCase<S extends string> = S extends `${infer First}${infer Rest}`
  ? First extends Uppercase<First>
    ? `-${Lowercase<First>}${KebabCase<Rest>}`
    : `${First}${KebabCase<Rest>}`
  : S;

/**
 * Capitalize first letter of string
 *
 * @example
 * ```ts
 * type Result = CapitalizeString<"hello">;     // "Hello"
 * ```
 */
export type CapitalizeString<S extends string> = Capitalize<S>;

// ============================================================================
// Recursive Type Utilities
// ============================================================================

/**
 * Get all paths to string properties in an object
 *
 * @example
 * ```ts
 * interface User {
 *   name: string;
 *   age: number;
 *   address: {
 *     street: string;
 *     city: string;
 *   };
 * }
 * type Paths = PathsToStringProps<User>;
 * // "name" | "address.street" | "address.city"
 * ```
 */
export type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: T[K] extends string
        ? [K]
        : T[K] extends object
        ? [K, ...PathsToStringProps<T[K]>]
        : never;
    }[Extract<keyof T, string>] extends infer P
  ? P extends []
    ? never
    : P extends [infer First, ...infer Rest]
    ? Rest extends []
      ? First
      : `${First & string}.${PathsToStringProps<T[First & keyof T]> & string}`
    : never
  : never;

/**
 * Get type at a specific path in an object
 *
 * @example
 * ```ts
 * interface User {
 *   address: {
 *     city: string;
 *   };
 * }
 * type City = GetByPath<User, "address.city">;  // string
 * ```
 */
export type GetByPath<T, P extends string> = P extends `${infer First}.${infer Rest}`
  ? First extends keyof T
    ? GetByPath<T[First], Rest>
    : never
  : P extends keyof T
  ? T[P]
  : never;

/**
 * Set type at a specific path in an object
 *
 * @example
 * ```ts
 * interface User {
 *   address: {
 *     city: string;
 *   };
 * }
 * type Updated = SetByPath<User, "address.city", number>;
 * // { address: { city: number } }
 * ```
 */
export type SetByPath<T, P extends string, V> = P extends `${infer First}.${infer Rest}`
  ? First extends keyof T
    ? {
        [K in keyof T]: K extends First ? SetByPath<T[K], Rest, V> : T[K];
      }
    : never
  : P extends keyof T
  ? {
      [K in keyof T]: K extends P ? V : T[K];
    }
  : never;

/**
 * Get all nested keys from an object
 *
 * @example
 * ```ts
 * interface User {
 *   name: string;
 *   address: {
 *     city: string;
 *   };
 * }
 * type Keys = DeepKeys<User>;
 * // "name" | "address" | "address.city"
 * ```
 */
export type DeepKeys<T> = T extends object
  ? {
      [K in Extract<keyof T, string>]: K | `${K}.${DeepKeys<T[K]> & string}`;
    }[Extract<keyof T, string>]
  : never;

/**
 * Pick nested properties from an object
 *
 * @example
 * ```ts
 * interface User {
 *   name: string;
 *   address: {
 *     street: string;
 *     city: string;
 *   };
 * }
 * type Result = DeepPick<User, "address.city">;
 * // { address: { city: string } }
 * ```
 */
export type DeepPick<T, Path extends string> = Path extends `${infer First}.${infer Rest}`
  ? First extends keyof T
    ? {
        [K in First]: DeepPick<T[K], Rest>;
      }
    : never
  : Path extends keyof T
  ? Pick<T, Path>
  : never;

// ============================================================================
// Brand Types & Nominal Typing
// ============================================================================

/**
 * Brand a type to create nominal typing
 *
 * @example
 * ```ts
 * type UserId = Brand<number, "UserId">;
 * type PostId = Brand<number, "PostId">;
 *
 * const userId: UserId = 123 as UserId;
 * const postId: PostId = 123 as PostId;
 * // userId and postId are not assignable to each other
 * ```
 */
export type Brand<T, BrandName extends string> = T & {
  readonly __brand: BrandName;
};

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
export function brand<T extends Brand<any, any>>(value: any): T {
  return value as T;
}

/**
 * Opaque type for creating distinct types
 *
 * @example
 * ```ts
 * type EUR = Opaque<number, "EUR">;
 * type USD = Opaque<number, "USD">;
 *
 * const euros: EUR = 100 as EUR;
 * const dollars: USD = 100 as USD;
 * // Cannot mix EUR and USD
 * ```
 */
export type Opaque<T, Token = unknown> = T & {
  readonly __opaque: Token;
};

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
export function opaque<T extends Opaque<any, any>>(value: any): T {
  return value as T;
}

/**
 * Create a tagged union type
 *
 * @example
 * ```ts
 * type Result<T, E> = TaggedUnion<"ok", T> | TaggedUnion<"error", E>;
 *
 * const success: Result<number, string> = { tag: "ok", value: 42 };
 * const failure: Result<number, string> = { tag: "error", value: "Failed" };
 * ```
 */
export type TaggedUnion<Tag extends string, T> = {
  readonly tag: Tag;
  readonly value: T;
};

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
export function discriminate<T extends { tag: string }, K extends T['tag']>(
  union: T,
  tag: K
): union is Extract<T, { tag: K }> {
  return union.tag === tag;
}

// ============================================================================
// Builder Pattern Types
// ============================================================================

/**
 * Generic builder pattern type
 *
 * @example
 * ```ts
 * interface User {
 *   name: string;
 *   email: string;
 *   age?: number;
 * }
 *
 * type UserBuilder = Builder<User>;
 * // {
 * //   name: (value: string) => UserBuilder;
 * //   email: (value: string) => UserBuilder;
 * //   age: (value: number) => UserBuilder;
 * //   build: () => User;
 * // }
 * ```
 */
export type Builder<T> = {
  [K in keyof T]-?: (value: T[K]) => Builder<T>;
} & {
  build(): T;
};

/**
 * Fluent builder type with chainable methods
 *
 * @example
 * ```ts
 * interface Config {
 *   host: string;
 *   port: number;
 * }
 *
 * type ConfigBuilder = FluentBuilder<Config>;
 * ```
 */
export type FluentBuilder<T, Built = {}> = {
  [K in Exclude<keyof T, keyof Built>]: (
    value: T[K]
  ) => FluentBuilder<T, Built & Pick<T, K>>;
} & (Required<T> extends Built
  ? {
      build(): T;
    }
  : {});

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
export function createBuilder<T>(): Builder<T> {
  const data: Partial<T> = {};

  const builder: any = {
    build: () => data as T,
  };

  return new Proxy(builder, {
    get(target, prop: string) {
      if (prop === 'build') {
        return target.build;
      }
      return (value: any) => {
        (data as any)[prop] = value;
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
export function withDefaults<T extends object>(
  defaults: T,
  overrides: Partial<T> = {}
): T {
  return { ...defaults, ...overrides };
}

// ============================================================================
// State Machine Types
// ============================================================================

/**
 * State machine type definition
 *
 * @example
 * ```ts
 * type TrafficLightStates = "red" | "yellow" | "green";
 * type TrafficLightEvents = "next";
 *
 * type TrafficLight = StateMachine<TrafficLightStates, TrafficLightEvents>;
 * ```
 */
export type StateMachine<States extends string, Events extends string> = {
  current: States;
  transition: (event: Events) => States;
  can: (event: Events) => boolean;
};

/**
 * State transition definition
 *
 * @example
 * ```ts
 * type DoorTransitions = Transition<"open", "close", "closed">
 *                      | Transition<"closed", "open", "open">;
 * ```
 */
export type Transition<From extends string, Event extends string, To extends string> = {
  from: From;
  event: Event;
  to: To;
  guard?: () => boolean;
};

/**
 * State guard for conditional transitions
 *
 * @example
 * ```ts
 * type AuthGuard = StateGuard<"login", boolean>;
 * ```
 */
export type StateGuard<Event extends string, Condition> = {
  event: Event;
  condition: Condition;
};

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
export function createStateMachine<States extends string, Events extends string>(
  initialState: States,
  transitions: Array<Transition<States, Events, States>>
): StateMachine<States, Events> {
  let current = initialState;

  const transitionMap = new Map<string, States>();
  transitions.forEach((t) => {
    const key = `${t.from}:${t.event}`;
    transitionMap.set(key, t.to);
  });

  return {
    get current() {
      return current;
    },
    transition(event: Events): States {
      const key = `${current}:${event}`;
      const next = transitionMap.get(key);
      if (next !== undefined) {
        current = next;
        return current;
      }
      throw new Error(`Invalid transition: ${current} -> ${event}`);
    },
    can(event: Events): boolean {
      const key = `${current}:${event}`;
      return transitionMap.has(key);
    },
  };
}

// ============================================================================
// Type-Level Programming Utilities
// ============================================================================

/**
 * Conditional type helper (if-then-else at type level)
 *
 * @example
 * ```ts
 * type Result = If<true, string, number>;   // string
 * type Result2 = If<false, string, number>; // number
 * ```
 */
export type If<Condition extends boolean, Then, Else> = Condition extends true
  ? Then
  : Else;

/**
 * Logical AND at type level
 *
 * @example
 * ```ts
 * type Result = And<true, true>;   // true
 * type Result2 = And<true, false>; // false
 * ```
 */
export type And<A extends boolean, B extends boolean> = A extends true
  ? B extends true
    ? true
    : false
  : false;

/**
 * Logical OR at type level
 *
 * @example
 * ```ts
 * type Result = Or<true, false>;   // true
 * type Result2 = Or<false, false>; // false
 * ```
 */
export type Or<A extends boolean, B extends boolean> = A extends true
  ? true
  : B extends true
  ? true
  : false;

/**
 * Logical NOT at type level
 *
 * @example
 * ```ts
 * type Result = Not<true>;   // false
 * type Result2 = Not<false>; // true
 * ```
 */
export type Not<A extends boolean> = A extends true ? false : true;

// ============================================================================
// Variance Helpers
// ============================================================================

/**
 * Covariant type wrapper
 *
 * @example
 * ```ts
 * type Producer<T> = Covariant<T, () => T>;
 * ```
 */
export type Covariant<T, F> = F & {
  readonly __covariant: T;
};

/**
 * Contravariant type wrapper
 *
 * @example
 * ```ts
 * type Consumer<T> = Contravariant<T, (value: T) => void>;
 * ```
 */
export type Contravariant<T, F> = F & {
  readonly __contravariant: (_: T) => void;
};

// ============================================================================
// Higher-Order Type Utilities
// ============================================================================

/**
 * Higher-kinded type emulation
 * Enables partial type application and type-level functions
 *
 * @example
 * ```ts
 * interface ArrayHKT extends HKT {
 *   output: Array<this["input"]>;
 * }
 *
 * interface PromiseHKT extends HKT {
 *   output: Promise<this["input"]>;
 * }
 *
 * type ArrayOfNumbers = Apply<ArrayHKT, number>;  // number[]
 * type PromiseOfString = Apply<PromiseHKT, string>; // Promise<string>
 * ```
 */
export interface HKT {
  input: unknown;
  output: unknown;
}

/**
 * Apply a higher-kinded type
 */
export type Apply<F extends HKT, A> = (F & { input: A })['output'];

/**
 * Map a higher-kinded type over a tuple
 *
 * @example
 * ```ts
 * type Result = MapHKT<ArrayHKT, [number, string, boolean]>;
 * // [number[], string[], boolean[]]
 * ```
 */
export type MapHKT<F extends HKT, Tuple extends readonly unknown[]> = {
  [K in keyof Tuple]: Apply<F, Tuple[K]>;
};

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
export function deepPartial<T extends object>(obj: T): DeepPartial<T> {
  if (typeof obj !== 'object' || obj === null) {
    return obj as DeepPartial<T>;
  }

  if (Array.isArray(obj)) {
    return obj.map(deepPartial) as DeepPartial<T>;
  }

  const result: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = deepPartial(obj[key] as any);
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
export function deepReadonly<T extends object>(obj: T): DeepReadonly<T> {
  if (typeof obj !== 'object' || obj === null) {
    return obj as DeepReadonly<T>;
  }

  Object.freeze(obj);

  Object.getOwnPropertyNames(obj).forEach((prop) => {
    const value = (obj as any)[prop];
    if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
      deepReadonly(value);
    }
  });

  return obj as DeepReadonly<T>;
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
export function pickByType<T extends object, V>(
  obj: T,
  predicate: (value: any) => value is V
): Partial<PickByType<T, V>> {
  const result: any = {};
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
export function toCamelCaseKeys<T extends Record<string, any>>(
  obj: T
): { [K in keyof T as CamelCase<K & string>]: T[K] } {
  const result: any = {};

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = key.replace(/[_-](\w)/g, (_, letter) =>
        letter.toUpperCase()
      );
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
export function toSnakeCaseKeys<T extends Record<string, any>>(obj: T): any {
  const result: any = {};

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
export function getByPath<T extends object>(
  obj: T,
  path: string
): any | undefined {
  const keys = path.split('.');
  let result: any = obj;

  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = result[key];
    } else {
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
export function setByPath<T extends object>(
  obj: T,
  path: string,
  value: any
): T {
  const keys = path.split('.');
  const result = JSON.parse(JSON.stringify(obj));
  let current: any = result;

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

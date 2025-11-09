/**
 * LOC: PAT9876543
 * File: /reuse/typescript-patterns-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - All TypeScript modules requiring design patterns
 *   - Service layer implementations
 *   - Domain-driven design modules
 *   - Dependency injection containers
 */
/**
 * File: /reuse/typescript-patterns-kit.ts
 * Locator: WC-UTL-PAT-001
 * Purpose: Advanced TypeScript Patterns & Type Utilities - Comprehensive pattern implementations with advanced type system features
 *
 * Upstream: Independent utility module for design patterns and type utilities
 * Downstream: ../backend/*, ../frontend/*, Service implementations, DDD modules
 * Dependencies: TypeScript 5.x, Node 18+
 * Exports: 45+ design pattern utilities including branded types, conditional types, mapped types, template literals,
 *          singleton, factory, builder, observer, strategy, DI helpers, type guards, decorators, and proxies
 *
 * LLM Context: Production-grade TypeScript design pattern implementations for White Cross.
 * Provides comprehensive patterns: Singleton, Factory, Abstract Factory, Builder, Prototype, Observer,
 * Strategy, Command, State, Chain of Responsibility, Decorator, Proxy, Facade, Adapter, Dependency Injection,
 * Repository, Unit of Work, Specification, and advanced type utilities with branded types, conditional types,
 * mapped types, template literal types, deep readonly/partial utilities, type guards and predicates.
 * Essential for clean architecture and maintainable enterprise applications.
 */
/**
 * Constructor type for classes
 */
export type Constructor<T = any> = new (...args: any[]) => T;
/**
 * Abstract constructor type
 */
export type AbstractConstructor<T = any> = abstract new (...args: any[]) => T;
/**
 * Factory function type
 */
export type FactoryFunction<T> = (...args: any[]) => T;
/**
 * Observer callback type
 */
export type ObserverCallback<T = any> = (data: T) => void;
/**
 * Strategy interface
 */
export interface Strategy<TInput = any, TOutput = any> {
    execute(input: TInput): TOutput;
}
/**
 * Command interface
 */
export interface Command<TResult = void> {
    execute(): TResult | Promise<TResult>;
    undo?(): void | Promise<void>;
}
/**
 * Specification interface
 */
export interface Specification<T> {
    isSatisfiedBy(candidate: T): boolean;
    and(other: Specification<T>): Specification<T>;
    or(other: Specification<T>): Specification<T>;
    not(): Specification<T>;
}
/**
 * Repository interface
 */
export interface Repository<T, TId = string> {
    findById(id: TId): Promise<T | null>;
    findAll(): Promise<T[]>;
    save(entity: T): Promise<T>;
    delete(id: TId): Promise<boolean>;
}
/**
 * Unit of Work interface
 */
export interface UnitOfWork {
    commit(): Promise<void>;
    rollback(): Promise<void>;
}
/**
 * Middleware function type
 */
export type Middleware<T = any> = (context: T, next: () => Promise<any> | any) => Promise<any> | any;
/**
 * Brand interface for creating nominal types
 */
export interface Brand<K, T> {
    __brand: K;
    __value: T;
}
/**
 * Branded type utility for creating nominal types
 * Prevents mixing of semantically different primitive types
 *
 * @template T - Base type
 * @template K - Brand key
 *
 * @example
 * ```typescript
 * type UserId = Branded<string, 'UserId'>;
 * type ProductId = Branded<string, 'ProductId'>;
 *
 * const userId: UserId = brand('123');
 * const productId: ProductId = brand('456');
 *
 * // Type error: cannot assign UserId to ProductId
 * // const id: ProductId = userId;
 * ```
 */
export type Branded<T, K extends string> = T & Brand<K, T>;
/**
 * Creates a branded value
 *
 * @template T - Value type
 * @template K - Brand key
 * @param {T} value - Value to brand
 * @returns {Branded<T, K>} Branded value
 *
 * @example
 * ```typescript
 * type Email = Branded<string, 'Email'>;
 *
 * const email = brand<string, 'Email'>('user@example.com');
 * ```
 */
export declare function brand<T, K extends string>(value: T): Branded<T, K>;
/**
 * Extracts the underlying value from a branded type
 *
 * @template T - Branded type
 * @param {T} branded - Branded value
 * @returns {any} Underlying value
 *
 * @example
 * ```typescript
 * type UserId = Branded<string, 'UserId'>;
 * const userId: UserId = brand('123');
 * const rawValue = unbrand(userId); // '123'
 * ```
 */
export declare function unbrand<T extends Branded<any, any>>(branded: T): T extends Branded<infer U, any> ? U : never;
/**
 * Creates a validator for branded types
 *
 * @template T - Base type
 * @template K - Brand key
 * @param {(value: T) => boolean} validator - Validation function
 * @returns {(value: T) => Branded<T, K> | null} Branded value validator
 *
 * @example
 * ```typescript
 * type PositiveNumber = Branded<number, 'PositiveNumber'>;
 *
 * const createPositive = createBrandValidator<number, 'PositiveNumber'>(
 *   (n) => n > 0
 * );
 *
 * const positive = createPositive(5); // PositiveNumber
 * const invalid = createPositive(-5); // null
 * ```
 */
export declare function createBrandValidator<T, K extends string>(validator: (value: T) => boolean): (value: T) => Branded<T, K> | null;
/**
 * Type-safe nominal type for UUIDs
 */
export type UUID = Branded<string, 'UUID'>;
/**
 * Type-safe nominal type for email addresses
 */
export type Email = Branded<string, 'Email'>;
/**
 * Type-safe nominal type for URLs
 */
export type URL = Branded<string, 'URL'>;
/**
 * Type-safe nominal type for positive numbers
 */
export type PositiveNumber = Branded<number, 'PositiveNumber'>;
/**
 * Type-safe nominal type for timestamps
 */
export type Timestamp = Branded<number, 'Timestamp'>;
/**
 * Extracts promise resolved type
 *
 * @example
 * ```typescript
 * type UserPromise = Promise<User>;
 * type User = Awaited<UserPromise>; // User type
 * ```
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T;
/**
 * Extracts function return type, unwrapping promises
 *
 * @example
 * ```typescript
 * async function getUser() { return { id: '123' }; }
 * type User = UnwrapPromise<ReturnType<typeof getUser>>; // { id: string }
 * ```
 */
export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
/**
 * Extracts array element type
 *
 * @example
 * ```typescript
 * type Users = User[];
 * type User = ArrayElement<Users>; // User
 * ```
 */
export type ArrayElement<T> = T extends (infer U)[] ? U : T;
/**
 * Makes type nullable
 *
 * @example
 * ```typescript
 * type User = { id: string };
 * type NullableUser = Nullable<User>; // User | null
 * ```
 */
export type Nullable<T> = T | null;
/**
 * Makes type optional
 *
 * @example
 * ```typescript
 * type User = { id: string };
 * type OptionalUser = Optional<User>; // User | undefined
 * ```
 */
export type Optional<T> = T | undefined;
/**
 * Makes type nullable and optional
 *
 * @example
 * ```typescript
 * type User = { id: string };
 * type MaybeUser = Maybe<User>; // User | null | undefined
 * ```
 */
export type Maybe<T> = T | null | undefined;
/**
 * Removes null and undefined from type
 *
 * @example
 * ```typescript
 * type MaybeString = string | null | undefined;
 * type String = NonNullable<MaybeString>; // string
 * ```
 */
export type NonNullable<T> = T extends null | undefined ? never : T;
/**
 * Extracts non-function properties from type
 *
 * @example
 * ```typescript
 * type User = {
 *   id: string;
 *   getName(): string;
 * };
 * type UserData = NonFunctionKeys<User>; // 'id'
 * ```
 */
export type NonFunctionKeys<T> = {
    [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
/**
 * Extracts function properties from type
 *
 * @example
 * ```typescript
 * type User = {
 *   id: string;
 *   getName(): string;
 * };
 * type UserMethods = FunctionKeys<User>; // 'getName'
 * ```
 */
export type FunctionKeys<T> = {
    [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
/**
 * Creates union of object values
 *
 * @example
 * ```typescript
 * const Colors = {
 *   RED: 'red',
 *   GREEN: 'green',
 *   BLUE: 'blue'
 * } as const;
 *
 * type Color = ValueOf<typeof Colors>; // 'red' | 'green' | 'blue'
 * ```
 */
export type ValueOf<T> = T[keyof T];
/**
 * Conditional type that returns TrueType if Condition extends true, otherwise FalseType
 *
 * @example
 * ```typescript
 * type IsString<T> = If<T extends string, 'yes', 'no'>;
 * type Result = IsString<string>; // 'yes'
 * ```
 */
export type If<Condition extends boolean, TrueType, FalseType> = Condition extends true ? TrueType : FalseType;
/**
 * Checks if two types are equal
 *
 * @example
 * ```typescript
 * type IsEqual = Equals<string, string>; // true
 * type NotEqual = Equals<string, number>; // false
 * ```
 */
export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
/**
 * Makes specified keys optional
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 *
 * type PartialUser = PartialBy<User, 'email'>;
 * // { id: string; name: string; email?: string }
 * ```
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
/**
 * Makes specified keys required
 *
 * @example
 * ```typescript
 * interface User {
 *   id?: string;
 *   name?: string;
 * }
 *
 * type RequiredUser = RequiredBy<User, 'id'>;
 * // { id: string; name?: string }
 * ```
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
/**
 * Makes all properties readonly recursively
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   profile: {
 *     name: string;
 *   };
 * }
 *
 * type ImmutableUser = DeepReadonly<User>;
 * // { readonly id: string; readonly profile: { readonly name: string } }
 * ```
 */
export type DeepReadonly<T> = {
    readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K];
};
/**
 * Makes all properties optional recursively
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   profile: {
 *     name: string;
 *   };
 * }
 *
 * type PartialUser = DeepPartial<User>;
 * // { id?: string; profile?: { name?: string } }
 * ```
 */
export type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};
/**
 * Makes all properties required recursively
 *
 * @example
 * ```typescript
 * interface User {
 *   id?: string;
 *   profile?: {
 *     name?: string;
 *   };
 * }
 *
 * type RequiredUser = DeepRequired<User>;
 * // { id: string; profile: { name: string } }
 * ```
 */
export type DeepRequired<T> = {
    [K in keyof T]-?: T[K] extends object ? DeepRequired<T[K]> : T[K];
};
/**
 * Makes all properties mutable (removes readonly)
 *
 * @example
 * ```typescript
 * interface User {
 *   readonly id: string;
 *   readonly name: string;
 * }
 *
 * type MutableUser = Mutable<User>;
 * // { id: string; name: string }
 * ```
 */
export type Mutable<T> = {
    -readonly [K in keyof T]: T[K];
};
/**
 * Makes all properties mutable recursively
 *
 * @example
 * ```typescript
 * interface User {
 *   readonly id: string;
 *   readonly profile: {
 *     readonly name: string;
 *   };
 * }
 *
 * type MutableUser = DeepMutable<User>;
 * // { id: string; profile: { name: string } }
 * ```
 */
export type DeepMutable<T> = {
    -readonly [K in keyof T]: T[K] extends object ? DeepMutable<T[K]> : T[K];
};
/**
 * Merges two types, with second type taking precedence
 *
 * @example
 * ```typescript
 * type A = { a: string; b: number };
 * type B = { b: string; c: boolean };
 * type C = Merge<A, B>; // { a: string; b: string; c: boolean }
 * ```
 */
export type Merge<T, U> = Omit<T, keyof U> & U;
/**
 * Creates a type with only specified keys
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 * }
 *
 * type PublicUser = PickByValue<User, string>;
 * // { id: string; name: string; email: string }
 * ```
 */
export type PickByValue<T, ValueType> = Pick<T, {
    [K in keyof T]: T[K] extends ValueType ? K : never;
}[keyof T]>;
/**
 * Omits keys by value type
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   age: number;
 *   isActive: boolean;
 * }
 *
 * type StringUser = OmitByValue<User, number | boolean>;
 * // { id: string }
 * ```
 */
export type OmitByValue<T, ValueType> = Omit<T, {
    [K in keyof T]: T[K] extends ValueType ? K : never;
}[keyof T]>;
/**
 * Makes specified keys readonly
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   name: string;
 * }
 *
 * type UserWithReadonlyId = ReadonlyBy<User, 'id'>;
 * // { readonly id: string; name: string }
 * ```
 */
export type ReadonlyBy<T, K extends keyof T> = Omit<T, K> & Readonly<Pick<T, K>>;
/**
 * Converts string literal to uppercase
 *
 * @example
 * ```typescript
 * type UpperHello = Uppercase<'hello'>; // 'HELLO'
 * ```
 */
export type Uppercase<T extends string> = Intrinsic;
/**
 * Converts string literal to lowercase
 *
 * @example
 * ```typescript
 * type LowerHello = Lowercase<'HELLO'>; // 'hello'
 * ```
 */
export type Lowercase<T extends string> = Intrinsic;
/**
 * Capitalizes first character of string literal
 *
 * @example
 * ```typescript
 * type CapitalHello = Capitalize<'hello'>; // 'Hello'
 * ```
 */
export type Capitalize<T extends string> = Intrinsic;
/**
 * Uncapitalizes first character of string literal
 *
 * @example
 * ```typescript
 * type UncapitalHello = Uncapitalize<'Hello'>; // 'hello'
 * ```
 */
export type Uncapitalize<T extends string> = Intrinsic;
/**
 * Creates event name from entity and action
 *
 * @example
 * ```typescript
 * type UserCreated = EventName<'user', 'created'>; // 'user:created'
 * type UserUpdated = EventName<'user', 'updated'>; // 'user:updated'
 * ```
 */
export type EventName<Entity extends string, Action extends string> = `${Entity}:${Action}`;
/**
 * Creates getter name from property name
 *
 * @example
 * ```typescript
 * type GetName = GetterName<'name'>; // 'getName'
 * type GetEmail = GetterName<'email'>; // 'getEmail'
 * ```
 */
export type GetterName<T extends string> = `get${Capitalize<T>}`;
/**
 * Creates setter name from property name
 *
 * @example
 * ```typescript
 * type SetName = SetterName<'name'>; // 'setName'
 * type SetEmail = SetterName<'email'>; // 'setEmail'
 * ```
 */
export type SetterName<T extends string> = `set${Capitalize<T>}`;
/**
 * Creates handler name from event name
 *
 * @example
 * ```typescript
 * type OnClick = HandlerName<'click'>; // 'onClick'
 * type OnSubmit = HandlerName<'submit'>; // 'onSubmit'
 * ```
 */
export type HandlerName<T extends string> = `on${Capitalize<T>}`;
/**
 * Converts camelCase to snake_case
 *
 * @example
 * ```typescript
 * type SnakeName = CamelToSnake<'userName'>; // 'user_name'
 * type SnakeEmail = CamelToSnake<'userEmail'>; // 'user_email'
 * ```
 */
export type CamelToSnake<S extends string> = S extends `${infer T}${infer U}` ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelToSnake<U>}` : S;
/**
 * Extracts route parameters from path
 *
 * @example
 * ```typescript
 * type Params = RouteParams<'/users/:id/posts/:postId'>;
 * // { id: string; postId: string }
 * ```
 */
export type RouteParams<T extends string> = T extends `${infer _Start}:${infer Param}/${infer Rest}` ? {
    [K in Param | keyof RouteParams<`/${Rest}`>]: string;
} : T extends `${infer _Start}:${infer Param}` ? {
    [K in Param]: string;
} : {};
/**
 * Creates a singleton instance of a class.
 * Ensures only one instance exists throughout the application lifecycle.
 *
 * @template T - Class type
 * @param {Constructor<T>} constructor - Class constructor
 * @returns {T} Singleton instance
 *
 * @example
 * ```typescript
 * class DatabaseConnection {
 *   connect() { console.log('Connected'); }
 * }
 *
 * const db1 = createSingleton(DatabaseConnection);
 * const db2 = createSingleton(DatabaseConnection);
 * console.log(db1 === db2); // true
 * ```
 */
export declare function createSingleton<T>(constructor: Constructor<T>): T;
/**
 * Singleton decorator for classes.
 * Converts a class into a singleton automatically.
 *
 * @returns {ClassDecorator} Class decorator
 *
 * @example
 * ```typescript
 * @Singleton
 * class Logger {
 *   log(message: string) {
 *     console.log(message);
 *   }
 * }
 *
 * const logger1 = new Logger();
 * const logger2 = new Logger();
 * console.log(logger1 === logger2); // true
 * ```
 */
export declare function Singleton<T extends Constructor>(): (target: T) => T;
/**
 * Lazy singleton that creates instance only when first accessed.
 *
 * @template T - Instance type
 * @param {() => T} factory - Factory function to create instance
 * @returns {() => T} Getter function for singleton instance
 *
 * @example
 * ```typescript
 * const getConfig = lazySingleton(() => ({
 *   apiUrl: 'https://api.example.com',
 *   timeout: 5000
 * }));
 *
 * const config1 = getConfig();
 * const config2 = getConfig();
 * console.log(config1 === config2); // true
 * ```
 */
export declare function lazySingleton<T>(factory: () => T): () => T;
/**
 * Simple factory for creating instances based on type.
 *
 * @template T - Base type
 * @param {Record<string, Constructor<T>>} types - Map of type names to constructors
 * @returns {(type: string, ...args: any[]) => T} Factory function
 *
 * @example
 * ```typescript
 * interface Shape { draw(): void; }
 * class Circle implements Shape { draw() { console.log('Circle'); } }
 * class Square implements Shape { draw() { console.log('Square'); } }
 *
 * const shapeFactory = createFactory<Shape>({
 *   circle: Circle,
 *   square: Square
 * });
 *
 * const circle = shapeFactory('circle');
 * circle.draw(); // 'Circle'
 * ```
 */
export declare function createFactory<T>(types: Record<string, Constructor<T>>): (type: string, ...args: any[]) => T;
/**
 * Abstract factory for creating families of related objects.
 *
 * @template T - Product family type
 * @param {Record<string, Constructor<T>>} factories - Map of factory names to constructors
 * @returns {AbstractFactory<T>} Abstract factory instance
 *
 * @example
 * ```typescript
 * interface UIFactory {
 *   createButton(): Button;
 *   createInput(): Input;
 * }
 *
 * const factory = createAbstractFactory<UIFactory>({
 *   modern: ModernUIFactory,
 *   classic: ClassicUIFactory
 * });
 *
 * const modernUI = factory.create('modern');
 * const button = modernUI.createButton();
 * ```
 */
export declare function createAbstractFactory<T>(factories: Record<string, Constructor<T>>): {
    create(type: string): T;
    register(type: string, factory: Constructor<T>): void;
};
/**
 * Factory method pattern implementation.
 *
 * @template T - Product type
 * @param {() => T} factoryMethod - Factory method
 * @returns {T} Created instance
 *
 * @example
 * ```typescript
 * abstract class Dialog {
 *   abstract createButton(): Button;
 *
 *   render() {
 *     const button = this.createButton();
 *     button.onClick();
 *   }
 * }
 *
 * class WindowsDialog extends Dialog {
 *   createButton() {
 *     return factoryMethod(() => new WindowsButton());
 *   }
 * }
 * ```
 */
export declare function factoryMethod<T>(factoryMethod: () => T): T;
/**
 * Fluent builder interface
 */
export interface FluentBuilder<T> {
    build(): T;
}
/**
 * Creates a fluent builder for complex object construction.
 *
 * @template T - Object type to build
 * @returns {FluentBuilder<T>} Builder instance
 *
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   name: string;
 *   email: string;
 *   age?: number;
 * }
 *
 * const user = createFluentBuilder<User>()
 *   .set('id', '123')
 *   .set('name', 'John Doe')
 *   .set('email', 'john@example.com')
 *   .build();
 * ```
 */
export declare function createFluentBuilder<T extends object>(): any;
/**
 * Step builder for enforcing build order.
 *
 * @template T - Final type
 * @param {Partial<T>} initial - Initial values
 * @returns {any} Step builder
 *
 * @example
 * ```typescript
 * const user = createStepBuilder<User>({})
 *   .withId('123')
 *   .withName('John')
 *   .withEmail('john@example.com')
 *   .build();
 * ```
 */
export declare function createStepBuilder<T extends object>(initial?: Partial<T>): any;
/**
 * Director for managing complex builder workflows.
 *
 * @template T - Built object type
 * @param {FluentBuilder<T>} builder - Builder instance
 * @param {(builder: FluentBuilder<T>) => void} recipe - Build recipe
 * @returns {T} Built object
 *
 * @example
 * ```typescript
 * const builder = createFluentBuilder<Config>();
 * const config = buildWithDirector(builder, (b) => {
 *   b.set('host', 'localhost')
 *    .set('port', 3000)
 *    .set('timeout', 5000);
 * });
 * ```
 */
export declare function buildWithDirector<T>(builder: FluentBuilder<T> & any, recipe: (builder: any) => void): T;
/**
 * Observable subject for event-driven architecture.
 *
 * @template T - Event data type
 * @returns {Observable<T>} Observable instance
 *
 * @example
 * ```typescript
 * interface UserEvent {
 *   userId: string;
 *   action: string;
 * }
 *
 * const userEvents = createObservable<UserEvent>();
 *
 * userEvents.subscribe((event) => {
 *   console.log(`User ${event.userId} performed ${event.action}`);
 * });
 *
 * userEvents.notify({ userId: '123', action: 'login' });
 * ```
 */
export declare function createObservable<T>(): {
    subscribe(callback: ObserverCallback<T>): () => void;
    notify(data: T): void;
    clear(): void;
    count(): number;
};
/**
 * Event emitter with typed events.
 *
 * @template TEvents - Event map type
 * @returns {EventEmitter<TEvents>} Event emitter instance
 *
 * @example
 * ```typescript
 * interface Events {
 *   'user:login': { userId: string };
 *   'user:logout': { userId: string };
 * }
 *
 * const emitter = createEventEmitter<Events>();
 *
 * emitter.on('user:login', (data) => {
 *   console.log(`User ${data.userId} logged in`);
 * });
 *
 * emitter.emit('user:login', { userId: '123' });
 * ```
 */
export declare function createEventEmitter<TEvents extends Record<string, any>>(): {
    on<K extends keyof TEvents>(event: K, callback: (data: TEvents[K]) => void): () => void;
    once<K extends keyof TEvents>(event: K, callback: (data: TEvents[K]) => void): void;
    emit<K extends keyof TEvents>(event: K, data: TEvents[K]): void;
    off<K extends keyof TEvents>(event: K, callback?: (data: TEvents[K]) => void): void;
};
//# sourceMappingURL=typescript-patterns-kit.d.ts.map
/**
 * Jest Setup for SAN Testing
 *
 * This file runs after the test framework is initialized but before tests run.
 * Use it to configure global test settings, polyfills, and custom matchers.
 */
declare global {
    namespace jest {
        interface Matchers<R> {
            toBeValidSANVolumeId(): R;
            toBeValidLUNNumber(): R;
            toBeValidWWN(): R;
            toBeValidIQN(): R;
            toBeWithinPerformanceThreshold(expected: number, tolerance?: number): R;
            toHaveRequiredVolumeProperties(): R;
        }
    }
}
declare global {
    var testHelpers: {
        wait: (ms: number) => Promise<void>;
        randomString: (length?: number) => string;
        mockDate: (isoString: string) => void;
        restoreDate: () => void;
    };
}
export declare const setupTestEnvironment: () => void;
export declare const teardownTestEnvironment: () => void;
//# sourceMappingURL=jest.setup.d.ts.map
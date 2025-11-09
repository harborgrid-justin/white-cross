/**
 * Jest Test Setup
 * Global test configuration and setup
 */
declare global {
    namespace NodeJS {
        interface Global {
            testUtils: {
                wait: (ms: number) => Promise<void>;
                mockDate: (date: Date) => void;
                restoreDate: () => void;
            };
        }
    }
}
//# sourceMappingURL=setup.d.ts.map
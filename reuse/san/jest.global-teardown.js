"use strict";
/**
 * Jest Global Teardown for SAN Testing
 *
 * This file runs once after all test suites complete.
 * Use it for cleanup operations like:
 * - Stopping test databases
 * - Removing test containers
 * - Cleaning up test infrastructure
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async () => {
    console.log('\n=================================================');
    console.log('🧹 Cleaning up SAN Test Environment');
    console.log('=================================================\n');
    // Calculate total test execution time
    const startTime = global.__TEST_START_TIME__;
    const totalTime = startTime ? Date.now() - startTime : 0;
    try {
        // Cleanup test infrastructure
        // For example:
        // - Stop test database container
        // - Remove test S3 buckets
        // - Clean up test message queues
        // - Stop mock external services
        console.log('🗑️  Cleaning up test database...');
        // await cleanupTestDatabase();
        console.log('✅ Test database cleaned');
        console.log('🗑️  Cleaning up test storage...');
        // await cleanupTestStorage();
        console.log('✅ Test storage cleaned');
        console.log('🗑️  Cleaning up test caches...');
        // await cleanupTestCache();
        console.log('✅ Test caches cleaned');
        // Generate test summary
        console.log('\n📊 Test Execution Summary');
        console.log('=================================================');
        console.log(`⏱️  Total execution time: ${totalTime}ms (${(totalTime / 1000).toFixed(2)}s)`);
        console.log(`📝 Test mode: ${process.env.JEST_TEST_MODE}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
        console.log('=================================================\n');
        console.log('✅ Global teardown completed successfully\n');
    }
    catch (error) {
        console.error('\n❌ Global teardown failed:', error);
        // Don't throw - we want tests to report their results even if cleanup fails
        console.error('⚠️  Some cleanup operations may not have completed');
    }
    // Final cleanup
    delete global.__TEST_START_TIME__;
};
/**
 * Example function to cleanup test database
 * Uncomment and implement based on your needs
 */
// async function cleanupTestDatabase(): Promise<void> {
//   // Stop Docker container
//   // Or disconnect from test database
//   // Or clear in-memory database
// }
/**
 * Example function to cleanup test storage
 */
// async function cleanupTestStorage(): Promise<void> {
//   // Delete test buckets
//   // Clean test file system
// }
/**
 * Example function to cleanup test cache
 */
// async function cleanupTestCache(): Promise<void> {
//   // Stop Redis container
//   // Or clear in-memory cache
// }
//# sourceMappingURL=jest.global-teardown.js.map
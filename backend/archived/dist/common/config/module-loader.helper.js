"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureFlags = void 0;
exports.loadConditionalModules = loadConditionalModules;
function loadConditionalModules(configs) {
    const loadedModules = [];
    for (const config of configs) {
        if (config.condition()) {
            loadedModules.push(config.module);
        }
    }
    return loadedModules;
}
exports.FeatureFlags = {
    isAnalyticsEnabled: () => process.env.ENABLE_ANALYTICS !== 'false',
    isReportingEnabled: () => process.env.ENABLE_REPORTING !== 'false',
    isDashboardEnabled: () => process.env.ENABLE_DASHBOARD !== 'false',
    isAdvancedFeaturesEnabled: () => process.env.ENABLE_ADVANCED_FEATURES !== 'false',
    isEnterpriseEnabled: () => process.env.ENABLE_ENTERPRISE !== 'false',
    isDiscoveryEnabled: () => process.env.NODE_ENV === 'development' &&
        process.env.ENABLE_DISCOVERY === 'true',
    isCliModeEnabled: () => process.env.CLI_MODE === 'true',
};
//# sourceMappingURL=module-loader.helper.js.map
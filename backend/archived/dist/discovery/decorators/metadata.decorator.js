"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Monitored = exports.Cacheable = exports.Domain = exports.Analytics = exports.ExperimentalFeature = exports.FeatureFlag = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const FeatureFlag = (flag) => (0, common_1.SetMetadata)('feature-flag', flag);
exports.FeatureFlag = FeatureFlag;
exports.ExperimentalFeature = core_1.DiscoveryService.createDecorator();
const Analytics = (enabled = true) => (0, common_1.SetMetadata)('analytics-enabled', enabled);
exports.Analytics = Analytics;
const Domain = (domain) => (0, common_1.SetMetadata)('domain', domain);
exports.Domain = Domain;
const Cacheable = (ttl) => (0, common_1.SetMetadata)('cacheable', { enabled: true, ttl });
exports.Cacheable = Cacheable;
const Monitored = (level = 'basic') => (0, common_1.SetMetadata)('monitoring-level', level);
exports.Monitored = Monitored;
//# sourceMappingURL=metadata.decorator.js.map
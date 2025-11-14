"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureUriVersioning = configureUriVersioning;
exports.configureHeaderVersioning = configureHeaderVersioning;
exports.configureMediaTypeVersioning = configureMediaTypeVersioning;
exports.configureCustomVersioning = configureCustomVersioning;
exports.buildVersionConfig = buildVersionConfig;
exports.parseVersionString = parseVersionString;
exports.compareVersions = compareVersions;
exports.findBestMatchingVersion = findBestMatchingVersion;
exports.validateVersion = validateVersion;
exports.extractVersionFromHeaders = extractVersionFromHeaders;
exports.buildVersionResponseHeaders = buildVersionResponseHeaders;
exports.createDeprecationPolicy = createDeprecationPolicy;
exports.calculateDeprecationTimeline = calculateDeprecationTimeline;
exports.generateDeprecationWarning = generateDeprecationWarning;
exports.isVersionDeprecated = isVersionDeprecated;
exports.buildSunsetHeaders = buildSunsetHeaders;
exports.createMigrationPath = createMigrationPath;
exports.findMigrationPath = findMigrationPath;
exports.generateMigrationDocs = generateMigrationDocs;
exports.validateMigrationCompatibility = validateMigrationCompatibility;
exports.calculateMigrationComplexity = calculateMigrationComplexity;
exports.generateMigrationScript = generateMigrationScript;
exports.createVersionMetadata = createVersionMetadata;
exports.generateVersionDocs = generateVersionDocs;
exports.buildVersionComparisonMatrix = buildVersionComparisonMatrix;
exports.generateChangelog = generateChangelog;
exports.exportVersionToOpenApi = exportVersionToOpenApi;
exports.checkBackwardCompatibility = checkBackwardCompatibility;
exports.createCompatibilityAdapter = createCompatibilityAdapter;
exports.validateAgainstVersionSchema = validateAgainstVersionSchema;
exports.generateCompatibilityReport = generateCompatibilityReport;
exports.createVersionFallbackChain = createVersionFallbackChain;
exports.createVersionTestSuite = createVersionTestSuite;
exports.validateVersionEndpoint = validateVersionEndpoint;
exports.generateCompatibilityTest = generateCompatibilityTest;
exports.runVersionRegressionTests = runVersionRegressionTests;
exports.generateVersionTestReport = generateVersionTestReport;
exports.trackVersionUsage = trackVersionUsage;
exports.analyzeVersionAdoption = analyzeVersionAdoption;
exports.generateVersionUsageReport = generateVersionUsageReport;
const common_1 = require("@nestjs/common");
function configureUriVersioning(app, options) {
    const { defaultVersion, prefix = 'v' } = options;
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion,
        prefix,
    });
    return app;
}
function configureHeaderVersioning(app, options) {
    const { header = 'X-API-Version', defaultVersion } = options;
    app.enableVersioning({
        type: common_1.VersioningType.HEADER,
        header,
        defaultVersion,
    });
    return app;
}
function configureMediaTypeVersioning(app, options) {
    const { key = 'v', defaultVersion } = options;
    app.enableVersioning({
        type: common_1.VersioningType.MEDIA_TYPE,
        key,
        defaultVersion,
    });
    return app;
}
function configureCustomVersioning(app, extractor, defaultVersion) {
    app.enableVersioning({
        type: common_1.VersioningType.CUSTOM,
        extractor,
        defaultVersion,
    });
    return app;
}
function buildVersionConfig(current, supported, options = {}) {
    const { deprecated = [], default: defaultVersion = current, format = 'simple', } = options;
    return {
        current,
        supported,
        deprecated,
        default: defaultVersion,
        format,
    };
}
function parseVersionString(versionString) {
    const versionRegex = /^([vV])?(\d+)(?:\.(\d+))?(?:\.(\d+))?$/;
    const match = versionString.match(versionRegex);
    if (!match) {
        throw new Error(`Invalid version format: ${versionString}`);
    }
    const [, prefix = '', major, minor = '0', patch = '0'] = match;
    return {
        major: parseInt(major, 10),
        minor: parseInt(minor, 10),
        patch: parseInt(patch, 10),
        prefix,
        full: versionString,
    };
}
function compareVersions(version1, version2) {
    const v1 = parseVersionString(version1);
    const v2 = parseVersionString(version2);
    if (v1.major !== v2.major)
        return v1.major - v2.major;
    if (v1.minor !== v2.minor)
        return v1.minor - v2.minor;
    return v1.patch - v2.patch;
}
function findBestMatchingVersion(requestedVersion, availableVersions, strategy = 'nearest') {
    const requested = parseVersionString(requestedVersion);
    if (strategy === 'exact') {
        return availableVersions.find(v => compareVersions(v, requestedVersion) === 0) || null;
    }
    const sorted = [...availableVersions].sort(compareVersions);
    if (strategy === 'major') {
        return sorted.reverse().find(v => {
            const parsed = parseVersionString(v);
            return parsed.major === requested.major && compareVersions(v, requestedVersion) <= 0;
        }) || null;
    }
    if (strategy === 'minor') {
        return sorted.reverse().find(v => {
            const parsed = parseVersionString(v);
            return parsed.major === requested.major &&
                parsed.minor === requested.minor &&
                compareVersions(v, requestedVersion) <= 0;
        }) || null;
    }
    let nearest = null;
    let minDiff = Infinity;
    for (const version of sorted) {
        const cmp = compareVersions(version, requestedVersion);
        if (cmp <= 0) {
            const diff = Math.abs(cmp);
            if (diff < minDiff) {
                minDiff = diff;
                nearest = version;
            }
        }
    }
    return nearest;
}
function validateVersion(version, config) {
    if (config.supported.includes(version)) {
        const isDeprecated = config.deprecated.includes(version);
        return {
            valid: true,
            message: isDeprecated ? `Version ${version} is deprecated` : `Version ${version} is valid`,
            isDeprecated,
        };
    }
    const suggestion = findBestMatchingVersion(version, config.supported, 'nearest');
    return {
        valid: false,
        message: `Version ${version} is not supported`,
        suggestion: suggestion || config.current,
    };
}
function extractVersionFromHeaders(headers, config) {
    const { header = 'x-api-version', default: defaultVersion } = config;
    const headerValue = headers[header.toLowerCase()];
    if (Array.isArray(headerValue)) {
        return headerValue[0] || defaultVersion;
    }
    return headerValue || defaultVersion;
}
function buildVersionResponseHeaders(actualVersion, config) {
    const headers = {
        'X-API-Version': actualVersion,
        'X-API-Version-Current': config.current,
        'X-API-Versions-Supported': config.supported.join(', '),
    };
    if (config.deprecated.includes(actualVersion)) {
        headers['X-API-Version-Deprecated'] = 'true';
        headers['Deprecation'] = 'true';
        headers['Sunset'] = new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toUTCString();
    }
    if (config.deprecated.length > 0) {
        headers['X-API-Versions-Deprecated'] = config.deprecated.join(', ');
    }
    return headers;
}
function createDeprecationPolicy(version, options) {
    const { reason, alternativeVersion, sunsetDate, migrationGuide, deprecatedAt = new Date(), } = options;
    return {
        version,
        deprecatedAt,
        sunsetDate,
        alternativeVersion,
        reason,
        migrationGuide,
    };
}
function calculateDeprecationTimeline(deprecationDate, sunsetPeriodDays) {
    const now = new Date();
    const sunsetDate = new Date(deprecationDate.getTime() + sunsetPeriodDays * 24 * 60 * 60 * 1000);
    const totalDays = sunsetPeriodDays;
    const elapsed = Math.floor((now.getTime() - deprecationDate.getTime()) / (24 * 60 * 60 * 1000));
    const daysRemaining = Math.max(0, totalDays - elapsed);
    const percentComplete = Math.min(100, (elapsed / totalDays) * 100);
    let status;
    if (now < deprecationDate) {
        status = 'active';
    }
    else if (now < sunsetDate) {
        status = 'deprecated';
    }
    else {
        status = 'sunset';
    }
    return {
        deprecatedAt: deprecationDate,
        sunsetDate,
        daysRemaining,
        percentComplete,
        status,
    };
}
function generateDeprecationWarning(policy) {
    let message = `API version ${policy.version} is deprecated. ${policy.reason}.`;
    if (policy.alternativeVersion) {
        message += ` Please migrate to version ${policy.alternativeVersion}.`;
    }
    if (policy.sunsetDate) {
        const daysUntilSunset = Math.ceil((policy.sunsetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
        if (daysUntilSunset > 0) {
            message += ` This version will be removed in ${daysUntilSunset} days (${policy.sunsetDate.toISOString().split('T')[0]}).`;
        }
        else {
            message += ` This version should have been removed on ${policy.sunsetDate.toISOString().split('T')[0]}.`;
        }
    }
    if (policy.migrationGuide) {
        message += ` Migration guide: ${policy.migrationGuide}`;
    }
    return message;
}
function isVersionDeprecated(version, deprecationPolicies) {
    const policy = deprecationPolicies.find(p => p.version === version);
    if (!policy) {
        return { deprecated: false };
    }
    const warning = generateDeprecationWarning(policy);
    let daysUntilSunset;
    if (policy.sunsetDate) {
        daysUntilSunset = Math.ceil((policy.sunsetDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    }
    return {
        deprecated: true,
        policy,
        warning,
        daysUntilSunset,
    };
}
function buildSunsetHeaders(policy) {
    const headers = {
        'Deprecation': 'true',
    };
    if (policy.sunsetDate) {
        headers['Sunset'] = policy.sunsetDate.toUTCString();
    }
    if (policy.alternativeVersion) {
        headers['X-API-Deprecated-Replacement'] = policy.alternativeVersion;
    }
    if (policy.migrationGuide) {
        headers['Link'] = `<${policy.migrationGuide}>; rel="deprecation"; type="text/html"`;
    }
    return headers;
}
function createMigrationPath(from, to, changes) {
    const { breakingChanges, steps, automatable = false, estimatedTime } = changes;
    return {
        from,
        to,
        breakingChanges,
        steps,
        automatable,
        estimatedTime,
    };
}
function findMigrationPath(from, to, availablePaths) {
    return availablePaths.find(path => path.from === from && path.to === to) || null;
}
function generateMigrationDocs(path) {
    let docs = `# Migration Guide: ${path.from} → ${path.to}\n\n`;
    if (path.estimatedTime) {
        docs += `**Estimated Time:** ${path.estimatedTime}\n\n`;
    }
    docs += `**Automated Migration:** ${path.automatable ? 'Yes' : 'No'}\n\n`;
    docs += `## Breaking Changes\n\n`;
    path.breakingChanges.forEach((change, i) => {
        docs += `${i + 1}. ${change}\n`;
    });
    docs += `\n## Migration Steps\n\n`;
    path.steps.forEach((step, i) => {
        docs += `${i + 1}. ${step}\n`;
    });
    return docs;
}
function validateMigrationCompatibility(from, to, config) {
    const fromParsed = parseVersionString(from);
    const toParsed = parseVersionString(to);
    const warnings = [];
    const majorDiff = Math.abs(toParsed.major - fromParsed.major);
    if (!config.supported.includes(from)) {
        return {
            compatible: false,
            message: `Source version ${from} is not supported`,
            warnings: [],
            requiresIntermediate: false,
        };
    }
    if (!config.supported.includes(to)) {
        return {
            compatible: false,
            message: `Target version ${to} is not supported`,
            warnings: [],
            requiresIntermediate: false,
        };
    }
    if (compareVersions(from, to) === 0) {
        return {
            compatible: true,
            message: 'Source and target versions are the same',
            warnings: [],
            requiresIntermediate: false,
        };
    }
    if (compareVersions(from, to) > 0) {
        warnings.push('Downgrading may cause data loss or compatibility issues');
    }
    const requiresIntermediate = majorDiff > 1;
    if (requiresIntermediate) {
        warnings.push(`Large version jump detected. Consider migrating incrementally: ${from} → ${fromParsed.major + 1}.0 → ${to}`);
    }
    if (config.deprecated.includes(to)) {
        warnings.push(`Target version ${to} is deprecated`);
    }
    return {
        compatible: true,
        message: 'Migration is possible',
        warnings,
        requiresIntermediate,
        suggestedPath: requiresIntermediate
            ? [`${fromParsed.major + 1}.0`, to]
            : [to],
    };
}
function calculateMigrationComplexity(path) {
    const factors = [];
    let score = 0;
    const breakingChangesWeight = path.breakingChanges.length * 1.5;
    if (path.breakingChanges.length > 0) {
        factors.push({
            factor: 'Breaking Changes',
            weight: breakingChangesWeight,
            description: `${path.breakingChanges.length} breaking changes`,
        });
        score += breakingChangesWeight;
    }
    const stepsWeight = path.steps.length * 0.5;
    factors.push({
        factor: 'Migration Steps',
        weight: stepsWeight,
        description: `${path.steps.length} migration steps`,
    });
    score += stepsWeight;
    if (!path.automatable) {
        factors.push({
            factor: 'Manual Migration',
            weight: 3,
            description: 'No automated migration available',
        });
        score += 3;
    }
    const fromParsed = parseVersionString(path.from);
    const toParsed = parseVersionString(path.to);
    const majorDiff = Math.abs(toParsed.major - fromParsed.major);
    const versionDistanceWeight = majorDiff * 2;
    if (majorDiff > 0) {
        factors.push({
            factor: 'Version Distance',
            weight: versionDistanceWeight,
            description: `${majorDiff} major version(s) apart`,
        });
        score += versionDistanceWeight;
    }
    let level;
    if (score <= 3)
        level = 'low';
    else if (score <= 7)
        level = 'medium';
    else if (score <= 12)
        level = 'high';
    else
        level = 'critical';
    return {
        score: Math.round(score * 10) / 10,
        level,
        factors,
    };
}
function generateMigrationScript(path, format = 'bash') {
    if (!path.automatable) {
        return `# Migration from ${path.from} to ${path.to} requires manual intervention\n# See migration guide for details`;
    }
    let script = '';
    if (format === 'bash') {
        script += `#!/bin/bash\n`;
        script += `# Automated migration from ${path.from} to ${path.to}\n\n`;
        script += `echo "Starting migration..."\n\n`;
        path.steps.forEach((step, i) => {
            script += `echo "Step ${i + 1}: ${step}"\n`;
            script += `# TODO: Implement ${step}\n\n`;
        });
        script += `echo "Migration complete!"\n`;
    }
    else if (format === 'javascript' || format === 'typescript') {
        const ext = format === 'typescript' ? ': void' : '';
        script += `// Automated migration from ${path.from} to ${path.to}\n\n`;
        script += `async function migrate()${ext} {\n`;
        script += `  console.log('Starting migration...');\n\n`;
        path.steps.forEach((step, i) => {
            script += `  // Step ${i + 1}: ${step}\n`;
            script += `  await migrateStep${i + 1}();\n\n`;
        });
        script += `  console.log('Migration complete!');\n`;
        script += `}\n`;
    }
    return script;
}
function createVersionMetadata(version, options) {
    const { releasedAt, status, hasBreakingChanges, description, changelogUrl } = options;
    return {
        version,
        releasedAt,
        status,
        hasBreakingChanges,
        description,
        changelogUrl,
    };
}
function generateVersionDocs(versions) {
    let docs = `# API Version Documentation\n\n`;
    const current = versions.find(v => v.status === 'current');
    if (current) {
        docs += `**Current Version:** ${current.version}\n\n`;
    }
    docs += `## Version History\n\n`;
    const sorted = [...versions].sort((a, b) => compareVersions(b.version, a.version));
    sorted.forEach(v => {
        docs += `### Version ${v.version}\n\n`;
        docs += `- **Status:** ${v.status}\n`;
        docs += `- **Released:** ${v.releasedAt.toISOString().split('T')[0]}\n`;
        docs += `- **Breaking Changes:** ${v.hasBreakingChanges ? 'Yes' : 'No'}\n`;
        if (v.description) {
            docs += `- **Description:** ${v.description}\n`;
        }
        if (v.changelogUrl) {
            docs += `- **Changelog:** [View Details](${v.changelogUrl})\n`;
        }
        docs += `\n`;
    });
    return docs;
}
function buildVersionComparisonMatrix(versions, features) {
    const matrix = {};
    versions.forEach(version => {
        matrix[version] = {};
        features.forEach(feature => {
            matrix[version][feature] = true;
        });
    });
    return {
        versions,
        features,
        matrix,
    };
}
function generateChangelog(versions, format = 'markdown') {
    if (format === 'json') {
        return JSON.stringify(versions, null, 2);
    }
    const sorted = [...versions].sort((a, b) => compareVersions(b.version, a.version));
    if (format === 'markdown') {
        let changelog = `# Changelog\n\n`;
        sorted.forEach(v => {
            changelog += `## [${v.version}] - ${v.releasedAt.toISOString().split('T')[0]}\n\n`;
            if (v.hasBreakingChanges) {
                changelog += `### ⚠️ BREAKING CHANGES\n\n`;
            }
            if (v.description) {
                changelog += `${v.description}\n\n`;
            }
            changelog += `---\n\n`;
        });
        return changelog;
    }
    let html = `<div class="changelog">\n`;
    html += `<h1>Changelog</h1>\n`;
    sorted.forEach(v => {
        html += `<div class="version">\n`;
        html += `  <h2>${v.version} <span class="date">${v.releasedAt.toISOString().split('T')[0]}</span></h2>\n`;
        if (v.hasBreakingChanges) {
            html += `  <div class="breaking-changes">⚠️ BREAKING CHANGES</div>\n`;
        }
        if (v.description) {
            html += `  <p>${v.description}</p>\n`;
        }
        html += `</div>\n`;
    });
    html += `</div>\n`;
    return html;
}
function exportVersionToOpenApi(document, metadata) {
    const updated = { ...document };
    if (!updated.info) {
        updated.info = { title: '', description: '', version: '' };
    }
    updated.info.version = metadata.version;
    updated['x-api-version-metadata'] = {
        version: metadata.version,
        releasedAt: metadata.releasedAt.toISOString(),
        status: metadata.status,
        hasBreakingChanges: metadata.hasBreakingChanges,
        description: metadata.description,
        changelogUrl: metadata.changelogUrl,
    };
    return updated;
}
function checkBackwardCompatibility(oldVersion, newVersion, breakingChanges) {
    const oldParsed = parseVersionString(oldVersion);
    const newParsed = parseVersionString(newVersion);
    const warnings = [];
    if (newParsed.major > oldParsed.major) {
        if (breakingChanges.length === 0) {
            warnings.push('Major version change without documented breaking changes');
        }
        return {
            compatible: false,
            level: 'none',
            warnings,
            breakingChanges,
        };
    }
    if (newParsed.minor > oldParsed.minor) {
        if (breakingChanges.length > 0) {
            warnings.push('Minor version has breaking changes (should be avoided)');
            return {
                compatible: false,
                level: 'partial',
                warnings,
                breakingChanges,
            };
        }
        return {
            compatible: true,
            level: 'full',
            warnings: [],
            breakingChanges: [],
        };
    }
    return {
        compatible: breakingChanges.length === 0,
        level: breakingChanges.length === 0 ? 'full' : 'none',
        warnings: breakingChanges.length > 0 ? ['Patch version should not have breaking changes'] : [],
        breakingChanges,
    };
}
function createCompatibilityAdapter(oldVersion, newVersion, transformations) {
    return (data) => {
        let transformed = { ...data };
        Object.entries(transformations).forEach(([path, transform]) => {
            const keys = path.split('.');
            let current = transformed;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }
            const lastKey = keys[keys.length - 1];
            if (current[lastKey] !== undefined) {
                const result = transform(current[lastKey]);
                if (typeof result === 'object' && !Array.isArray(result)) {
                    Object.assign(current, result);
                    delete current[lastKey];
                }
                else {
                    current[lastKey] = result;
                }
            }
        });
        return transformed;
    };
}
function validateAgainstVersionSchema(data, version, schemas) {
    const schema = schemas[version];
    if (!schema) {
        return {
            valid: false,
            errors: [{ field: '_version', message: `No schema found for version ${version}` }],
            warnings: [],
        };
    }
    const errors = [];
    const warnings = [];
    if (schema.required) {
        schema.required.forEach((field) => {
            if (!(field in data)) {
                errors.push({ field, message: `Required field '${field}' is missing` });
            }
        });
    }
    return {
        valid: errors.length === 0,
        errors,
        warnings,
    };
}
function generateCompatibilityReport(oldVersion, newVersion, analysis) {
    let report = `# Compatibility Report: ${oldVersion} → ${newVersion}\n\n`;
    report += `## Summary\n\n`;
    report += `- Breaking Changes: ${analysis.breakingChanges.length}\n`;
    report += `- Deprecations: ${analysis.deprecations.length}\n`;
    report += `- New Features: ${analysis.additions.length}\n`;
    report += `- Removed Features: ${analysis.removals.length}\n\n`;
    if (analysis.breakingChanges.length > 0) {
        report += `## ⚠️ Breaking Changes\n\n`;
        analysis.breakingChanges.forEach((change, i) => {
            report += `${i + 1}. ${change}\n`;
        });
        report += `\n`;
    }
    if (analysis.deprecations.length > 0) {
        report += `## ⏰ Deprecations\n\n`;
        analysis.deprecations.forEach((dep, i) => {
            report += `${i + 1}. ${dep}\n`;
        });
        report += `\n`;
    }
    if (analysis.additions.length > 0) {
        report += `## ✨ New Features\n\n`;
        analysis.additions.forEach((add, i) => {
            report += `${i + 1}. ${add}\n`;
        });
        report += `\n`;
    }
    if (analysis.removals.length > 0) {
        report += `## 🗑️ Removed Features\n\n`;
        analysis.removals.forEach((rem, i) => {
            report += `${i + 1}. ${rem}\n`;
        });
        report += `\n`;
    }
    return report;
}
function createVersionFallbackChain(requestedVersion, availableVersions) {
    const requested = parseVersionString(requestedVersion);
    const sorted = [...availableVersions]
        .map(v => ({ version: v, parsed: parseVersionString(v) }))
        .filter(v => v.parsed.major <= requested.major)
        .sort((a, b) => compareVersions(b.version, a.version));
    return sorted.map(v => v.version);
}
function createVersionTestSuite(versions, testCases) {
    return {
        versions,
        testCases,
        totalTests: versions.length * testCases.length,
    };
}
function validateVersionEndpoint(version, endpoint, expectedBehavior) {
    const issues = [];
    return {
        valid: issues.length === 0,
        issues,
    };
}
function generateCompatibilityTest(versions, features) {
    const matrix = {};
    versions.forEach(version => {
        matrix[version] = {};
        features.forEach(feature => {
            matrix[version][feature] = {
                tested: false,
                passed: false,
            };
        });
    });
    return matrix;
}
function runVersionRegressionTests(oldVersion, newVersion, testSuite) {
    const results = {
        passed: 0,
        failed: 0,
        regressions: [],
    };
    return results;
}
function generateVersionTestReport(testResults) {
    let report = `# Version ${testResults.version} Test Report\n\n`;
    report += `## Summary\n\n`;
    report += `- Total Tests: ${testResults.totalTests}\n`;
    report += `- Passed: ${testResults.passed} (${Math.round((testResults.passed / testResults.totalTests) * 100)}%)\n`;
    report += `- Failed: ${testResults.failed}\n`;
    report += `- Skipped: ${testResults.skipped}\n`;
    report += `- Duration: ${testResults.duration}ms\n\n`;
    if (testResults.failed > 0) {
        report += `## ❌ Failed Tests\n\n`;
        testResults.details
            .filter(d => d.status === 'failed')
            .forEach((detail, i) => {
            report += `${i + 1}. **${detail.test}**\n`;
            if (detail.message) {
                report += `   - ${detail.message}\n`;
            }
        });
        report += `\n`;
    }
    return report;
}
function trackVersionUsage(version, requestCount, timestamp = new Date()) {
    return {
        version,
        requestCount,
        timestamp,
    };
}
function analyzeVersionAdoption(versionStats) {
    const totalRequests = versionStats.reduce((sum, stat) => sum + stat.requestCount, 0);
    const versions = versionStats.map(stat => ({
        version: stat.version,
        requests: stat.requestCount,
        percentage: Math.round((stat.requestCount / totalRequests) * 100 * 10) / 10,
        trend: 'stable',
    }));
    return {
        totalRequests,
        versions,
    };
}
function generateVersionUsageReport(analysis) {
    let report = `# API Version Usage Report\n\n`;
    report += `## Overview\n\n`;
    report += `**Total Requests:** ${analysis.totalRequests.toLocaleString()}\n\n`;
    report += `## Version Distribution\n\n`;
    report += `| Version | Requests | Percentage | Trend |\n`;
    report += `|---------|----------|------------|-------|\n`;
    analysis.versions
        .sort((a, b) => b.requests - a.requests)
        .forEach(v => {
        const trendEmoji = v.trend === 'growing' ? '📈' : v.trend === 'declining' ? '📉' : '➡️';
        report += `| ${v.version} | ${v.requests.toLocaleString()} | ${v.percentage}% | ${trendEmoji} ${v.trend} |\n`;
    });
    report += `\n`;
    return report;
}
//# sourceMappingURL=api-version-management.service.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SERVER_PRESETS = void 0;
exports.buildServerConfig = buildServerConfig;
exports.buildServerVariables = buildServerVariables;
exports.buildMultipleServers = buildMultipleServers;
exports.buildServerWithAuth = buildServerWithAuth;
exports.buildDevelopmentServer = buildDevelopmentServer;
exports.buildProductionServer = buildProductionServer;
exports.buildStagingServer = buildStagingServer;
function buildServerConfig(url, description, variables) {
    if (!url || url.trim() === '') {
        throw new Error('Server URL is required');
    }
    if (variables) {
        const urlVariables = url.match(/\{([^}]+)\}/g);
        if (urlVariables) {
            urlVariables.forEach((varRef) => {
                const varName = varRef.slice(1, -1);
                if (!variables[varName]) {
                    throw new Error(`Variable '${varName}' used in URL but not defined in variables`);
                }
            });
        }
    }
    return {
        url,
        ...(description && { description }),
        ...(variables && { variables }),
    };
}
function buildServerVariables(variables) {
    Object.entries(variables).forEach(([name, variable]) => {
        if (!variable.default) {
            throw new Error(`Server variable '${name}' must have a default value`);
        }
    });
    return variables;
}
function buildMultipleServers(environments) {
    return environments.map((env) => ({
        url: env.url,
        description: env.description || `${env.name} environment`,
        ...(env.variables && { variables: env.variables }),
    }));
}
function buildServerWithAuth(url, description, authSchemes) {
    return {
        url,
        description: `${description} | Auth: ${authSchemes.join(', ')}`,
        'x-auth-schemes': authSchemes,
    };
}
function buildDevelopmentServer(port = 3000, protocol = 'http', host = 'localhost') {
    return buildServerConfig(`${protocol}://${host}:${port}`, 'Development server', {
        protocol: {
            default: protocol,
            enum: ['http', 'https'],
            description: 'The protocol to use',
        },
        host: {
            default: host,
            description: 'Host address',
        },
        port: {
            default: port.toString(),
            description: 'Server port',
        },
    });
}
function buildProductionServer(domain, version, regions) {
    const basePath = version ? `/${version}` : '';
    if (regions && regions.length > 0) {
        return buildServerConfig(`https://{region}.${domain}${basePath}`, 'Production API with regional endpoints', {
            region: {
                default: regions[0],
                enum: regions,
                description: 'Regional endpoint',
            },
        });
    }
    return buildServerConfig(`https://${domain}${basePath}`, 'Production API');
}
function buildStagingServer(domain, version) {
    const basePath = version ? `/${version}` : '';
    return buildServerConfig(`https://${domain}${basePath}`, 'Staging API');
}
exports.SERVER_PRESETS = {
    STANDARD_ENVIRONMENTS: (baseDomain, version) => [
        buildProductionServer(baseDomain, version),
        buildStagingServer(`staging.${baseDomain}`, version),
        buildDevelopmentServer(),
    ],
    REGIONAL_PRODUCTION: (baseDomain, regions, version) => [
        buildProductionServer(baseDomain, version, regions),
        buildStagingServer(`staging.${baseDomain}`, version),
        buildDevelopmentServer(),
    ],
    MICROSERVICES: (serviceName, namespace = 'default') => [
        buildServerConfig(`https://{environment}.${serviceName}.${namespace}.svc.cluster.local`, 'Kubernetes service endpoint', {
            environment: {
                default: 'prod',
                enum: ['prod', 'staging', 'dev'],
                description: 'Environment namespace',
            },
        }),
        buildDevelopmentServer(),
    ],
};
//# sourceMappingURL=server-builders.js.map
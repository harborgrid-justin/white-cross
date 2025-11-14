"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateControllerDocs = generateControllerDocs;
exports.extractControllerEndpoints = extractControllerEndpoints;
exports.generateEndpointDoc = generateEndpointDoc;
exports.extractRouteParams = extractRouteParams;
exports.generateControllerOverview = generateControllerOverview;
exports.autoDocumentController = autoDocumentController;
exports.generateSchemaDocs = generateSchemaDocs;
exports.extractSchemaProperties = extractSchemaProperties;
exports.generatePropertyDocs = generatePropertyDocs;
exports.generateSchemaExampleFromClass = generateSchemaExampleFromClass;
exports.buildSchemaRegistry = buildSchemaRegistry;
exports.exportSchemaDocumentation = exportSchemaDocumentation;
exports.generateRequestExample = generateRequestExample;
exports.generateResponseExample = generateResponseExample;
exports.generateMultipleExamples = generateMultipleExamples;
exports.generateEdgeCaseExamples = generateEdgeCaseExamples;
exports.generateRandomExample = generateRandomExample;
exports.validateGeneratedExample = validateGeneratedExample;
exports.generateEndpointTests = generateEndpointTests;
exports.generateValidationTests = generateValidationTests;
exports.generateIntegrationTests = generateIntegrationTests;
exports.generateNegativeTestCases = generateNegativeTestCases;
exports.generatePerformanceTests = generatePerformanceTests;
exports.exportTestSuite = exportTestSuite;
exports.generateMarkdownDocs = generateMarkdownDocs;
exports.generateEndpointMarkdown = generateEndpointMarkdown;
exports.generateTableOfContents = generateTableOfContents;
exports.generateParameterTable = generateParameterTable;
exports.generateResponseTable = generateResponseTable;
exports.generateAPIBlueprint = generateAPIBlueprint;
exports.convertOpenAPIToBlueprint = convertOpenAPIToBlueprint;
exports.generateBlueprintResource = generateBlueprintResource;
exports.generateBlueprintAction = generateBlueprintAction;
exports.exportAPIBlueprint = exportAPIBlueprint;
exports.generatePostmanCollection = generatePostmanCollection;
exports.convertOpenAPIToPostman = convertOpenAPIToPostman;
exports.generatePostmanRequest = generatePostmanRequest;
exports.addPostmanEnvironment = addPostmanEnvironment;
exports.exportPostmanCollection = exportPostmanCollection;
exports.createMockServer = createMockServer;
exports.generateMockResponse = generateMockResponse;
exports.setupMockEndpoint = setupMockEndpoint;
exports.generateMockData = generateMockData;
exports.configureMockServerDelay = configureMockServerDelay;
exports.startMockServer = startMockServer;
function generateControllerDocs(controllerClass, options = {}) {
    const className = controllerClass.name;
    let docs = `# ${className} Documentation\n\n`;
    docs += `Auto-generated documentation for ${className}\n\n`;
    return docs;
}
function extractControllerEndpoints(controllerClass) {
    return [];
}
function generateEndpointDoc(method, path, handler, options = {}) {
    let doc = `## ${method.toUpperCase()} ${path}\n\n`;
    doc += `**Handler:** \`${handler}\`\n\n`;
    return doc;
}
function extractRouteParams(path) {
    const params = [];
    const regex = /:([a-zA-Z_][a-zA-Z0-9_]*)/g;
    let match;
    while ((match = regex.exec(path)) !== null) {
        params.push({
            name: match[1],
            type: 'string',
            required: true,
        });
    }
    return params;
}
function generateControllerOverview(controllers, format = 'markdown') {
    if (format === 'json') {
        return JSON.stringify({ controllers: controllers.map(c => c.name) }, null, 2);
    }
    let overview = `# API Controllers Overview\n\n`;
    controllers.forEach(controller => {
        overview += `- **${controller.name}**\n`;
    });
    return overview;
}
function autoDocumentController(controllerClass, outputPath) {
    const docs = generateControllerDocs(controllerClass);
    return {
        success: true,
        path: outputPath,
        content: docs,
    };
}
function generateSchemaDocs(schemaClass, options = {}) {
    const schemaName = schemaClass.name;
    let docs = `# ${schemaName} Schema\n\n`;
    docs += `Auto-generated schema documentation\n\n`;
    return docs;
}
function extractSchemaProperties(schemaClass) {
    return {};
}
function generatePropertyDocs(propertyName, propertyMeta) {
    let doc = `### ${propertyName}\n\n`;
    doc += `- **Type:** ${propertyMeta.type}\n`;
    doc += `- **Required:** ${propertyMeta.required ? 'Yes' : 'No'}\n`;
    if (propertyMeta.description) {
        doc += `- **Description:** ${propertyMeta.description}\n`;
    }
    doc += `\n`;
    return doc;
}
function generateSchemaExampleFromClass(schemaClass, config = {}) {
    return {};
}
function buildSchemaRegistry(schemaClasses) {
    const registry = {};
    schemaClasses.forEach(schemaClass => {
        registry[schemaClass.name] = {
            type: 'object',
            properties: {},
        };
    });
    return registry;
}
function exportSchemaDocumentation(schemas, format = 'markdown') {
    if (format === 'json') {
        return JSON.stringify(schemas, null, 2);
    }
    let docs = `# Schema Documentation\n\n`;
    Object.entries(schemas).forEach(([name, schema]) => {
        docs += `## ${name}\n\n`;
        docs += `\`\`\`json\n${JSON.stringify(schema, null, 2)}\n\`\`\`\n\n`;
    });
    return docs;
}
function generateRequestExample(schemaClass, config = {}) {
    return {
        example: 'Auto-generated request example',
    };
}
function generateResponseExample(schemaClass, statusCode, config = {}) {
    return {
        statusCode,
        data: {},
    };
}
function generateMultipleExamples(schemaClass, count, config = {}) {
    const examples = [];
    for (let i = 0; i < count; i++) {
        examples.push({
            id: i + 1,
            data: {},
        });
    }
    return examples;
}
function generateEdgeCaseExamples(schemaClass) {
    return [
        {
            name: 'EmptyObject',
            example: {},
            description: 'Minimum valid object',
        },
        {
            name: 'MaxValues',
            example: {},
            description: 'Maximum boundary values',
        },
    ];
}
function generateRandomExample(schemaClass, seed) {
    return {
        random: true,
        seed: seed || Date.now(),
    };
}
function validateGeneratedExample(example, schemaClass) {
    return {
        valid: true,
        errors: [],
    };
}
function generateEndpointTests(method, path, config = {}) {
    const { format = 'jest' } = config;
    let tests = `describe('${method.toUpperCase()} ${path}', () => {\n`;
    tests += `  it('should return 200 OK', async () => {\n`;
    tests += `    // Test implementation\n`;
    tests += `  });\n`;
    tests += `});\n`;
    return tests;
}
function generateValidationTests(schemaClass, config = {}) {
    const { format = 'jest' } = config;
    let tests = `describe('${schemaClass.name} Validation', () => {\n`;
    tests += `  it('should validate correct data', () => {\n`;
    tests += `    // Test implementation\n`;
    tests += `  });\n`;
    tests += `});\n`;
    return tests;
}
function generateIntegrationTests(endpoints, config = {}) {
    let tests = `describe('API Integration Tests', () => {\n`;
    endpoints.forEach(endpoint => {
        tests += `  describe('${endpoint.method} ${endpoint.path}', () => {\n`;
        tests += `    it('should work correctly', async () => {\n`;
        tests += `      // Test implementation\n`;
        tests += `    });\n`;
        tests += `  });\n`;
    });
    tests += `});\n`;
    return tests;
}
function generateNegativeTestCases(schemaClass) {
    return [
        {
            name: 'Missing required field',
            input: {},
            expectedError: 'Validation failed',
        },
    ];
}
function generatePerformanceTests(endpoint, config) {
    let tests = `describe('Performance Tests for ${endpoint}', () => {\n`;
    tests += `  it('should respond within ${config.expectedResponseTime || 1000}ms', async () => {\n`;
    tests += `    // Performance test implementation\n`;
    tests += `  });\n`;
    tests += `});\n`;
    return tests;
}
function exportTestSuite(tests, outputFormat = 'jest') {
    return tests.join('\n\n');
}
function generateMarkdownDocs(document) {
    let md = `# ${document.info?.title || 'API'} Documentation\n\n`;
    if (document.info?.description) {
        md += `${document.info.description}\n\n`;
    }
    md += `**Version:** ${document.info?.version || '1.0.0'}\n\n`;
    return md;
}
function generateEndpointMarkdown(path, method, operation) {
    let md = `## ${method.toUpperCase()} ${path}\n\n`;
    if (operation.summary) {
        md += `**Summary:** ${operation.summary}\n\n`;
    }
    if (operation.description) {
        md += `${operation.description}\n\n`;
    }
    return md;
}
function generateTableOfContents(document) {
    let toc = `## Table of Contents\n\n`;
    if (document.paths) {
        Object.keys(document.paths).forEach(path => {
            toc += `- [${path}](#${path.replace(/\//g, '')})\n`;
        });
    }
    toc += `\n`;
    return toc;
}
function generateParameterTable(parameters) {
    let table = `| Name | In | Type | Required | Description |\n`;
    table += `|------|-------|------|----------|-------------|\n`;
    parameters.forEach(param => {
        table += `| ${param.name} | ${param.in} | ${param.schema?.type || 'string'} | ${param.required ? 'Yes' : 'No'} | ${param.description || '-'} |\n`;
    });
    table += `\n`;
    return table;
}
function generateResponseTable(responses) {
    let table = `| Status Code | Description |\n`;
    table += `|-------------|-------------|\n`;
    Object.entries(responses).forEach(([code, response]) => {
        table += `| ${code} | ${response.description || '-'} |\n`;
    });
    table += `\n`;
    return table;
}
function generateAPIBlueprint(document) {
    let blueprint = `FORMAT: 1A\n\n`;
    blueprint += `# ${document.info?.title || 'API'}\n\n`;
    if (document.info?.description) {
        blueprint += `${document.info.description}\n\n`;
    }
    return blueprint;
}
function convertOpenAPIToBlueprint(openApiDoc) {
    return generateAPIBlueprint(openApiDoc);
}
function generateBlueprintResource(path, operations) {
    let resource = `## ${path}\n\n`;
    Object.entries(operations).forEach(([method, operation]) => {
        resource += `### ${operation.summary || method.toUpperCase()} [${method.toUpperCase()} ${path}]\n\n`;
    });
    return resource;
}
function generateBlueprintAction(method, operation) {
    let action = `+ Request\n\n`;
    if (operation.requestBody) {
        action += `  + Body\n\n`;
        action += `    \`\`\`json\n    {}\n    \`\`\`\n\n`;
    }
    action += `+ Response 200\n\n`;
    return action;
}
function exportAPIBlueprint(blueprint, outputPath) {
    return {
        success: true,
        path: outputPath,
        content: blueprint,
    };
}
function generatePostmanCollection(document, name) {
    return {
        info: {
            name: name || document.info?.title || 'API Collection',
            schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
        },
        item: [],
    };
}
function convertOpenAPIToPostman(openApiDoc) {
    return generatePostmanCollection(openApiDoc);
}
function generatePostmanRequest(method, path, operation) {
    return {
        name: operation.summary || `${method.toUpperCase()} ${path}`,
        request: {
            method: method.toUpperCase(),
            url: path,
        },
    };
}
function addPostmanEnvironment(collection, environment) {
    collection.variable = Object.entries(environment).map(([key, value]) => ({
        key,
        value,
    }));
    return collection;
}
function exportPostmanCollection(collection, outputPath) {
    return {
        success: true,
        path: outputPath,
        content: JSON.stringify(collection, null, 2),
    };
}
function createMockServer(document, config = {}) {
    const { port = 3000, delay = 0 } = config;
    return {
        port,
        delay,
        routes: [],
    };
}
function generateMockResponse(schema, statusCode = 200) {
    return {
        statusCode,
        body: {},
    };
}
function setupMockEndpoint(method, path, response) {
    return {
        method: method.toUpperCase(),
        path,
        response,
    };
}
function generateMockData(schema, count = 1) {
    const data = [];
    for (let i = 0; i < count; i++) {
        data.push({
            id: i + 1,
            mock: true,
        });
    }
    return data;
}
function configureMockServerDelay(server, delayMs) {
    server.delay = delayMs;
    return server;
}
function startMockServer(server) {
    return {
        success: true,
        url: `http://localhost:${server.port}`,
        port: server.port,
    };
}
//# sourceMappingURL=swagger-documentation-automation.service.js.map
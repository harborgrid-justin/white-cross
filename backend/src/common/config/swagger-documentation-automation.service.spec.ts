import { Test, TestingModule } from '@nestjs/testing';
import { Type } from '@nestjs/common';
import { OpenAPIObject, SchemaObject } from '@nestjs/swagger';
import * as SwaggerAutomation from './swagger-documentation-automation.service';

describe('Swagger Documentation Automation', () => {
  describe('Controller Documentation Generators', () => {
    class TestController {
      testMethod(): void {}
    }

    it('should generate controller documentation', () => {
      const docs = SwaggerAutomation.generateControllerDocs(TestController);

      expect(docs).toContain('TestController Documentation');
      expect(docs).toContain('Auto-generated documentation');
    });

    it('should generate controller docs with options', () => {
      const docs = SwaggerAutomation.generateControllerDocs(TestController, {
        includeExamples: true,
        includeDeprecated: false,
        format: 'markdown'
      });

      expect(typeof docs).toBe('string');
      expect(docs.length).toBeGreaterThan(0);
    });

    it('should extract controller endpoints', () => {
      const endpoints = SwaggerAutomation.extractControllerEndpoints(TestController);

      expect(Array.isArray(endpoints)).toBe(true);
    });

    it('should generate endpoint documentation', () => {
      const doc = SwaggerAutomation.generateEndpointDoc('GET', '/api/users', 'getUsers');

      expect(doc).toContain('## GET /api/users');
      expect(doc).toContain('**Handler:** `getUsers`');
    });

    it('should generate endpoint doc with options', () => {
      const doc = SwaggerAutomation.generateEndpointDoc('POST', '/api/users', 'createUser', {
        includeExamples: true,
        format: 'html'
      });

      expect(typeof doc).toBe('string');
    });

    it('should extract route params', () => {
      const params = SwaggerAutomation.extractRouteParams('/users/:id/posts/:postId');

      expect(params).toHaveLength(2);
      expect(params[0]).toEqual({ name: 'id', type: 'string', required: true });
      expect(params[1]).toEqual({ name: 'postId', type: 'string', required: true });
    });

    it('should handle routes without params', () => {
      const params = SwaggerAutomation.extractRouteParams('/users');

      expect(params).toHaveLength(0);
    });

    it('should generate controller overview in markdown', () => {
      const overview = SwaggerAutomation.generateControllerOverview([TestController], 'markdown');

      expect(overview).toContain('# API Controllers Overview');
      expect(overview).toContain('TestController');
    });

    it('should generate controller overview in JSON', () => {
      const overview = SwaggerAutomation.generateControllerOverview([TestController], 'json');
      const parsed = JSON.parse(overview);

      expect(parsed.controllers).toContain('TestController');
    });

    it('should auto-document controller', () => {
      const result = SwaggerAutomation.autoDocumentController(TestController, '/docs/test.md');

      expect(result.success).toBe(true);
      expect(result.path).toBe('/docs/test.md');
      expect(result.content).toBeDefined();
    });
  });

  describe('Schema Documentation Generators', () => {
    class TestSchema {
      id: number;
      name: string;
    }

    it('should generate schema documentation', () => {
      const docs = SwaggerAutomation.generateSchemaDocs(TestSchema);

      expect(docs).toContain('TestSchema Schema');
      expect(docs).toContain('Auto-generated schema documentation');
    });

    it('should generate schema docs with options', () => {
      const docs = SwaggerAutomation.generateSchemaDocs(TestSchema, {
        includeExamples: true
      });

      expect(typeof docs).toBe('string');
    });

    it('should extract schema properties', () => {
      const properties = SwaggerAutomation.extractSchemaProperties(TestSchema);

      expect(typeof properties).toBe('object');
    });

    it('should generate property documentation', () => {
      const doc = SwaggerAutomation.generatePropertyDocs('username', {
        type: 'string',
        required: true,
        description: 'User\'s unique username'
      });

      expect(doc).toContain('### username');
      expect(doc).toContain('**Type:** string');
      expect(doc).toContain('**Required:** Yes');
      expect(doc).toContain('**Description:** User\'s unique username');
    });

    it('should generate property doc without description', () => {
      const doc = SwaggerAutomation.generatePropertyDocs('age', {
        type: 'number',
        required: false
      });

      expect(doc).toContain('### age');
      expect(doc).toContain('**Required:** No');
      expect(doc).not.toContain('**Description:**');
    });

    it('should generate schema example from class', () => {
      const example = SwaggerAutomation.generateSchemaExampleFromClass(TestSchema);

      expect(typeof example).toBe('object');
    });

    it('should generate schema example with config', () => {
      const example = SwaggerAutomation.generateSchemaExampleFromClass(TestSchema, {
        useRealData: true,
        includeEdgeCases: true,
        randomSeed: 12345
      });

      expect(typeof example).toBe('object');
    });

    it('should build schema registry', () => {
      const registry = SwaggerAutomation.buildSchemaRegistry([TestSchema]);

      expect(registry.TestSchema).toBeDefined();
      expect(registry.TestSchema.type).toBe('object');
      expect(registry.TestSchema.properties).toBeDefined();
    });

    it('should export schema documentation in markdown', () => {
      const schemas: Record<string, SchemaObject> = {
        User: { type: 'object', properties: {} }
      };

      const docs = SwaggerAutomation.exportSchemaDocumentation(schemas, 'markdown');

      expect(docs).toContain('# Schema Documentation');
      expect(docs).toContain('## User');
    });

    it('should export schema documentation in JSON', () => {
      const schemas: Record<string, SchemaObject> = {
        User: { type: 'object', properties: {} }
      };

      const docs = SwaggerAutomation.exportSchemaDocumentation(schemas, 'json');
      const parsed = JSON.parse(docs);

      expect(parsed.User).toBeDefined();
    });
  });

  describe('Example Generators', () => {
    class TestDto {
      id: number;
      name: string;
    }

    it('should generate request example', () => {
      const example = SwaggerAutomation.generateRequestExample(TestDto);

      expect(example).toBeDefined();
      expect(example.example).toBeDefined();
    });

    it('should generate request example with config', () => {
      const example = SwaggerAutomation.generateRequestExample(TestDto, {
        useRealData: true,
        includeEdgeCases: true
      });

      expect(example).toBeDefined();
    });

    it('should generate response example', () => {
      const example = SwaggerAutomation.generateResponseExample(TestDto, 200);

      expect(example.statusCode).toBe(200);
      expect(example.data).toBeDefined();
    });

    it('should generate multiple examples', () => {
      const examples = SwaggerAutomation.generateMultipleExamples(TestDto, 5);

      expect(examples).toHaveLength(5);
      examples.forEach((ex, index) => {
        expect(ex.id).toBe(index + 1);
      });
    });

    it('should generate edge case examples', () => {
      const examples = SwaggerAutomation.generateEdgeCaseExamples(TestDto);

      expect(Array.isArray(examples)).toBe(true);
      expect(examples.length).toBeGreaterThan(0);
      expect(examples[0]).toHaveProperty('name');
      expect(examples[0]).toHaveProperty('example');
      expect(examples[0]).toHaveProperty('description');
    });

    it('should generate random example', () => {
      const example = SwaggerAutomation.generateRandomExample(TestDto);

      expect(example.random).toBe(true);
      expect(example.seed).toBeDefined();
    });

    it('should generate random example with seed', () => {
      const seed = 42;
      const example = SwaggerAutomation.generateRandomExample(TestDto, seed);

      expect(example.seed).toBe(seed);
    });

    it('should validate generated example', () => {
      const example = { id: 1, name: 'test' };
      const result = SwaggerAutomation.validateGeneratedExample(example, TestDto);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Test Case Generators', () => {
    class TestDto {
      name: string;
      age: number;
    }

    it('should generate endpoint tests', () => {
      const tests = SwaggerAutomation.generateEndpointTests('GET', '/api/users');

      expect(tests).toContain('describe(\'GET /api/users\'');
      expect(tests).toContain('it(\'should return 200 OK\'');
    });

    it('should generate endpoint tests with config', () => {
      const tests = SwaggerAutomation.generateEndpointTests('POST', '/api/users', {
        format: 'jest',
        includePositiveCases: true,
        includeNegativeCases: true
      });

      expect(typeof tests).toBe('string');
    });

    it('should generate validation tests', () => {
      const tests = SwaggerAutomation.generateValidationTests(TestDto);

      expect(tests).toContain('describe(\'TestDto Validation\'');
      expect(tests).toContain('it(\'should validate correct data\'');
    });

    it('should generate integration tests', () => {
      const endpoints = [
        { method: 'GET', path: '/users' },
        { method: 'POST', path: '/users' }
      ];

      const tests = SwaggerAutomation.generateIntegrationTests(endpoints);

      expect(tests).toContain('describe(\'API Integration Tests\'');
      expect(tests).toContain('GET /users');
      expect(tests).toContain('POST /users');
    });

    it('should generate negative test cases', () => {
      const testCases = SwaggerAutomation.generateNegativeTestCases(TestDto);

      expect(Array.isArray(testCases)).toBe(true);
      expect(testCases.length).toBeGreaterThan(0);
      expect(testCases[0]).toHaveProperty('name');
      expect(testCases[0]).toHaveProperty('input');
      expect(testCases[0]).toHaveProperty('expectedError');
    });

    it('should generate performance tests', () => {
      const tests = SwaggerAutomation.generatePerformanceTests('/api/users', {
        expectedResponseTime: 500,
        concurrentRequests: 100
      });

      expect(tests).toContain('Performance Tests');
      expect(tests).toContain('should respond within 500ms');
    });

    it('should export test suite', () => {
      const tests = ['test1', 'test2', 'test3'];
      const suite = SwaggerAutomation.exportTestSuite(tests, 'jest');

      expect(suite).toContain('test1');
      expect(suite).toContain('test2');
      expect(suite).toContain('test3');
    });
  });

  describe('Markdown Documentation', () => {
    const mockDocument: OpenAPIObject = {
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
        description: 'API for testing'
      },
      paths: {
        '/users': {
          get: {
            summary: 'Get users',
            description: 'Retrieve all users'
          }
        }
      }
    };

    it('should generate markdown docs', () => {
      const md = SwaggerAutomation.generateMarkdownDocs(mockDocument);

      expect(md).toContain('# Test API Documentation');
      expect(md).toContain('API for testing');
      expect(md).toContain('**Version:** 1.0.0');
    });

    it('should generate endpoint markdown', () => {
      const operation = {
        summary: 'Get user',
        description: 'Retrieve user by ID'
      };

      const md = SwaggerAutomation.generateEndpointMarkdown('/users/:id', 'get', operation);

      expect(md).toContain('## GET /users/:id');
      expect(md).toContain('**Summary:** Get user');
      expect(md).toContain('Retrieve user by ID');
    });

    it('should generate table of contents', () => {
      const toc = SwaggerAutomation.generateTableOfContents(mockDocument);

      expect(toc).toContain('## Table of Contents');
      expect(toc).toContain('/users');
    });

    it('should generate parameter table', () => {
      const parameters = [
        { name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'User ID' },
        { name: 'limit', in: 'query', required: false, schema: { type: 'number' }, description: 'Limit results' }
      ];

      const table = SwaggerAutomation.generateParameterTable(parameters);

      expect(table).toContain('| Name | In | Type | Required | Description |');
      expect(table).toContain('| id | path | string | Yes | User ID |');
      expect(table).toContain('| limit | query | number | No | Limit results |');
    });

    it('should generate response table', () => {
      const responses = {
        '200': { description: 'Success' },
        '404': { description: 'Not found' }
      };

      const table = SwaggerAutomation.generateResponseTable(responses);

      expect(table).toContain('| Status Code | Description |');
      expect(table).toContain('| 200 | Success |');
      expect(table).toContain('| 404 | Not found |');
    });
  });

  describe('API Blueprint Generation', () => {
    const mockDocument: OpenAPIObject = {
      openapi: '3.0.0',
      info: {
        title: 'Test API',
        version: '1.0.0',
        description: 'Test description'
      },
      paths: {}
    };

    it('should generate API blueprint', () => {
      const blueprint = SwaggerAutomation.generateAPIBlueprint(mockDocument);

      expect(blueprint).toContain('FORMAT: 1A');
      expect(blueprint).toContain('# Test API');
      expect(blueprint).toContain('Test description');
    });

    it('should convert OpenAPI to blueprint', () => {
      const blueprint = SwaggerAutomation.convertOpenAPIToBlueprint(mockDocument);

      expect(typeof blueprint).toBe('string');
      expect(blueprint).toContain('FORMAT: 1A');
    });

    it('should generate blueprint resource', () => {
      const operations = {
        get: { summary: 'Get resource' },
        post: { summary: 'Create resource' }
      };

      const resource = SwaggerAutomation.generateBlueprintResource('/users', operations);

      expect(resource).toContain('## /users');
      expect(resource).toContain('GET /users');
      expect(resource).toContain('POST /users');
    });

    it('should generate blueprint action', () => {
      const operation = {
        requestBody: { content: { 'application/json': {} } }
      };

      const action = SwaggerAutomation.generateBlueprintAction('post', operation);

      expect(action).toContain('+ Request');
      expect(action).toContain('+ Response 200');
    });

    it('should export API blueprint', () => {
      const blueprint = 'FORMAT: 1A\n# Test';
      const result = SwaggerAutomation.exportAPIBlueprint(blueprint, '/path/to/blueprint.apib');

      expect(result.success).toBe(true);
      expect(result.path).toBe('/path/to/blueprint.apib');
      expect(result.content).toBe(blueprint);
    });
  });

  describe('Postman Collection Generation', () => {
    const mockDocument: OpenAPIObject = {
      openapi: '3.0.0',
      info: { title: 'Test API', version: '1.0.0' },
      paths: {}
    };

    it('should generate Postman collection', () => {
      const collection = SwaggerAutomation.generatePostmanCollection(mockDocument);

      expect(collection.info.name).toBe('Test API');
      expect(collection.info.schema).toContain('schema.getpostman.com');
      expect(Array.isArray(collection.item)).toBe(true);
    });

    it('should generate Postman collection with custom name', () => {
      const collection = SwaggerAutomation.generatePostmanCollection(mockDocument, 'Custom Collection');

      expect(collection.info.name).toBe('Custom Collection');
    });

    it('should convert OpenAPI to Postman', () => {
      const collection = SwaggerAutomation.convertOpenAPIToPostman(mockDocument);

      expect(collection.info).toBeDefined();
    });

    it('should generate Postman request', () => {
      const operation = { summary: 'Test endpoint' };
      const request = SwaggerAutomation.generatePostmanRequest('GET', '/test', operation);

      expect(request.name).toBe('Test endpoint');
      expect(request.request.method).toBe('GET');
      expect(request.request.url).toBe('/test');
    });

    it('should add Postman environment', () => {
      const collection = { variable: [] };
      const environment = { BASE_URL: 'http://localhost:3000', API_KEY: 'test-key' };

      const result = SwaggerAutomation.addPostmanEnvironment(collection, environment);

      expect(result.variable).toHaveLength(2);
      expect(result.variable[0]).toEqual({ key: 'BASE_URL', value: 'http://localhost:3000' });
      expect(result.variable[1]).toEqual({ key: 'API_KEY', value: 'test-key' });
    });

    it('should export Postman collection', () => {
      const collection = { info: { name: 'Test' }, item: [] };
      const result = SwaggerAutomation.exportPostmanCollection(collection, '/path/to/collection.json');

      expect(result.success).toBe(true);
      expect(result.path).toBe('/path/to/collection.json');
      expect(result.content).toBe(JSON.stringify(collection, null, 2));
    });
  });

  describe('Mock Server Setup', () => {
    const mockDocument: OpenAPIObject = {
      openapi: '3.0.0',
      info: { title: 'Test', version: '1.0.0' },
      paths: {}
    };

    it('should create mock server', () => {
      const server = SwaggerAutomation.createMockServer(mockDocument);

      expect(server.port).toBe(3000);
      expect(server.delay).toBe(0);
      expect(Array.isArray(server.routes)).toBe(true);
    });

    it('should create mock server with custom config', () => {
      const server = SwaggerAutomation.createMockServer(mockDocument, {
        port: 4000,
        delay: 100
      });

      expect(server.port).toBe(4000);
      expect(server.delay).toBe(100);
    });

    it('should generate mock response', () => {
      const schema: SchemaObject = { type: 'object' };
      const response = SwaggerAutomation.generateMockResponse(schema);

      expect(response.statusCode).toBe(200);
      expect(response.body).toBeDefined();
    });

    it('should generate mock response with custom status', () => {
      const schema: SchemaObject = { type: 'object' };
      const response = SwaggerAutomation.generateMockResponse(schema, 201);

      expect(response.statusCode).toBe(201);
    });

    it('should setup mock endpoint', () => {
      const response = { status: 200, data: {} };
      const endpoint = SwaggerAutomation.setupMockEndpoint('GET', '/users', response);

      expect(endpoint.method).toBe('GET');
      expect(endpoint.path).toBe('/users');
      expect(endpoint.response).toEqual(response);
    });

    it('should generate mock data', () => {
      const schema: SchemaObject = { type: 'object' };
      const data = SwaggerAutomation.generateMockData(schema, 3);

      expect(data).toHaveLength(3);
      data.forEach((item, index) => {
        expect(item.id).toBe(index + 1);
        expect(item.mock).toBe(true);
      });
    });

    it('should configure mock server delay', () => {
      const server = { delay: 0 };
      const result = SwaggerAutomation.configureMockServerDelay(server, 500);

      expect(result.delay).toBe(500);
    });

    it('should start mock server', () => {
      const server = { port: 3000 };
      const result = SwaggerAutomation.startMockServer(server);

      expect(result.success).toBe(true);
      expect(result.url).toBe('http://localhost:3000');
      expect(result.port).toBe(3000);
    });
  });
});

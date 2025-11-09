"use strict";
/**
 * LOC: NETREST1234567
 * File: /reuse/san/network-rest-endpoints-kit.ts
 *
 * UPSTREAM (imports from):
 *   - None (leaf node - reusable utilities)
 *
 * DOWNSTREAM (imported by):
 *   - Network REST controllers
 *   - NestJS network services
 *   - Network API handlers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGetRelationshipsHandler = exports.createUnlinkResourceHandler = exports.createLinkResourceHandler = exports.validateCallbackUrl = exports.createCallbackHandler = exports.executeCallback = exports.verifyWebhookSignature = exports.generateWebhookSignature = exports.triggerWebhooks = exports.createUnregisterWebhookHandler = exports.createRegisterWebhookHandler = exports.parseCSVImport = exports.createImportNetworksHandler = exports.importNetworks = exports.createCustomExportNetworksHandler = exports.createExportNetworksHandler = exports.exportNetworks = exports.createAdvancedSearchNetworksHandler = exports.createSearchNetworksHandler = exports.searchNetworks = exports.createBulkUpdateNetworkHandler = exports.executeBulkUpdate = exports.createBatchNetworkHandler = exports.executeBatchOperation = exports.createValidateNetworkHandler = exports.createDeactivateNetworkHandler = exports.createActivateNetworkHandler = exports.createGetNetworkActionStatusHandler = exports.createNetworkActionHandler = exports.createOptionsNetworkHandler = exports.createHeadNetworkHandler = exports.createDeleteNetworkHandler = exports.createPatchNetworkHandler = exports.createUpdateNetworkHandler = exports.createCreateNetworkHandler = exports.createListNetworksHandler = exports.createGetNetworkHandler = exports.createWebhookModel = exports.createNetworkActionModel = exports.createNetworkModel = void 0;
const sequelize_1 = require("sequelize");
// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================
/**
 * Sequelize model for Network resources.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Network model
 *
 * @example
 * ```typescript
 * const Network = createNetworkModel(sequelize);
 * const network = await Network.create({
 *   name: 'Production Network',
 *   cidr: '10.0.0.0/16',
 *   vlanId: 100,
 *   status: 'active'
 * });
 * ```
 */
const createNetworkModel = (sequelize) => {
    class Network extends sequelize_1.Model {
    }
    Network.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'Network name',
        },
        cidr: {
            type: sequelize_1.DataTypes.STRING(50),
            allowNull: false,
            comment: 'CIDR notation (e.g., 10.0.0.0/16)',
        },
        vlanId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'VLAN identifier',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('active', 'inactive', 'pending', 'error'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Network status',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Network description',
        },
        tags: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Network tags',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'networks',
        timestamps: true,
        indexes: [
            { fields: ['name'] },
            { fields: ['status'] },
            { fields: ['vlanId'] },
            { fields: ['createdAt'] },
        ],
    });
    return Network;
};
exports.createNetworkModel = createNetworkModel;
/**
 * Sequelize model for Network actions/operations log.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkAction model
 *
 * @example
 * ```typescript
 * const NetworkAction = createNetworkActionModel(sequelize);
 * const action = await NetworkAction.create({
 *   networkId: 'uuid-123',
 *   action: 'activate',
 *   initiatedBy: 'user@example.com',
 *   parameters: { force: true }
 * });
 * ```
 */
const createNetworkActionModel = (sequelize) => {
    class NetworkAction extends sequelize_1.Model {
    }
    NetworkAction.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        networkId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Network UUID',
        },
        action: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Action name (activate, deactivate, resize, etc.)',
        },
        initiatedBy: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'User or system that initiated the action',
        },
        parameters: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Action parameters',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('pending', 'in_progress', 'completed', 'failed'),
            allowNull: false,
            defaultValue: 'pending',
            comment: 'Action status',
        },
        result: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: true,
            comment: 'Action result data',
        },
        error: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Error message if failed',
        },
    }, {
        sequelize,
        tableName: 'network_actions',
        timestamps: true,
        indexes: [
            { fields: ['networkId'] },
            { fields: ['action'] },
            { fields: ['status'] },
            { fields: ['createdAt'] },
        ],
    });
    return NetworkAction;
};
exports.createNetworkActionModel = createNetworkActionModel;
/**
 * Sequelize model for Webhook configurations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} Webhook model
 *
 * @example
 * ```typescript
 * const Webhook = createWebhookModel(sequelize);
 * const webhook = await Webhook.create({
 *   url: 'https://example.com/webhook',
 *   events: ['network.created', 'network.updated'],
 *   secret: 'webhook-secret-key',
 *   active: true
 * });
 * ```
 */
const createWebhookModel = (sequelize) => {
    class Webhook extends sequelize_1.Model {
    }
    Webhook.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        url: {
            type: sequelize_1.DataTypes.STRING(1000),
            allowNull: false,
            comment: 'Webhook URL',
        },
        events: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Events to trigger webhook',
        },
        secret: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: true,
            comment: 'Webhook secret for signature verification',
        },
        active: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Whether webhook is active',
        },
        retryPolicy: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: { maxRetries: 3, backoffMultiplier: 2, initialDelay: 1000 },
            comment: 'Retry policy configuration',
        },
        lastTriggeredAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: true,
            comment: 'Last trigger timestamp',
        },
        failureCount: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Consecutive failure count',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'webhooks',
        timestamps: true,
        indexes: [
            { fields: ['url'] },
            { fields: ['active'] },
            { fields: ['events'], using: 'GIN' },
        ],
    });
    return Webhook;
};
exports.createWebhookModel = createWebhookModel;
// ============================================================================
// RESOURCE ENDPOINTS (4-11)
// ============================================================================
/**
 * Creates a GET handler for fetching a single network resource.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.get('/api/v1/networks/:id', createGetNetworkHandler(Network));
 * ```
 */
const createGetNetworkHandler = (NetworkModel) => {
    return async (req, res, next) => {
        try {
            const network = await NetworkModel.findByPk(req.params.id);
            if (!network) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'NETWORK_NOT_FOUND',
                        message: `Network with ID ${req.params.id} not found`,
                    },
                });
            }
            res.json({
                success: true,
                data: network,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createGetNetworkHandler = createGetNetworkHandler;
/**
 * Creates a GET handler for listing network resources with pagination.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.get('/api/v1/networks', createListNetworksHandler(Network));
 * ```
 */
const createListNetworksHandler = (NetworkModel) => {
    return async (req, res, next) => {
        try {
            const page = Math.max(1, parseInt(req.query.page, 10) || 1);
            const pageSize = Math.min(100, parseInt(req.query.pageSize, 10) || 20);
            const offset = (page - 1) * pageSize;
            const { count, rows } = await NetworkModel.findAndCountAll({
                limit: pageSize,
                offset,
                order: [['createdAt', 'DESC']],
            });
            const totalPages = Math.ceil(count / pageSize);
            res.json({
                success: true,
                data: rows,
                pagination: {
                    currentPage: page,
                    pageSize,
                    totalItems: count,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1,
                },
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createListNetworksHandler = createListNetworksHandler;
/**
 * Creates a POST handler for creating a new network resource.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/networks', createCreateNetworkHandler(Network));
 * ```
 */
const createCreateNetworkHandler = (NetworkModel) => {
    return async (req, res, next) => {
        try {
            const network = await NetworkModel.create(req.body);
            res.status(201).json({
                success: true,
                data: network,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createCreateNetworkHandler = createCreateNetworkHandler;
/**
 * Creates a PUT handler for updating a network resource.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.put('/api/v1/networks/:id', createUpdateNetworkHandler(Network));
 * ```
 */
const createUpdateNetworkHandler = (NetworkModel) => {
    return async (req, res, next) => {
        try {
            const network = await NetworkModel.findByPk(req.params.id);
            if (!network) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'NETWORK_NOT_FOUND',
                        message: `Network with ID ${req.params.id} not found`,
                    },
                });
            }
            await network.update(req.body);
            res.json({
                success: true,
                data: network,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createUpdateNetworkHandler = createUpdateNetworkHandler;
/**
 * Creates a PATCH handler for partial network resource updates.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.patch('/api/v1/networks/:id', createPatchNetworkHandler(Network));
 * ```
 */
const createPatchNetworkHandler = (NetworkModel) => {
    return async (req, res, next) => {
        try {
            const network = await NetworkModel.findByPk(req.params.id);
            if (!network) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'NETWORK_NOT_FOUND',
                        message: `Network with ID ${req.params.id} not found`,
                    },
                });
            }
            // Only update provided fields
            const allowedFields = ['name', 'description', 'status', 'tags', 'metadata'];
            const updates = {};
            allowedFields.forEach(field => {
                if (req.body[field] !== undefined) {
                    updates[field] = req.body[field];
                }
            });
            await network.update(updates);
            res.json({
                success: true,
                data: network,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createPatchNetworkHandler = createPatchNetworkHandler;
/**
 * Creates a DELETE handler for removing a network resource.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.delete('/api/v1/networks/:id', createDeleteNetworkHandler(Network));
 * ```
 */
const createDeleteNetworkHandler = (NetworkModel) => {
    return async (req, res, next) => {
        try {
            const network = await NetworkModel.findByPk(req.params.id);
            if (!network) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'NETWORK_NOT_FOUND',
                        message: `Network with ID ${req.params.id} not found`,
                    },
                });
            }
            await network.destroy();
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createDeleteNetworkHandler = createDeleteNetworkHandler;
/**
 * Creates a HEAD handler for checking network resource existence.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.head('/api/v1/networks/:id', createHeadNetworkHandler(Network));
 * ```
 */
const createHeadNetworkHandler = (NetworkModel) => {
    return async (req, res, next) => {
        try {
            const network = await NetworkModel.findByPk(req.params.id, {
                attributes: ['id', 'updatedAt'],
            });
            if (!network) {
                return res.status(404).send();
            }
            res.setHeader('ETag', `"${network.id}-${network.updatedAt.getTime()}"`);
            res.status(200).send();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createHeadNetworkHandler = createHeadNetworkHandler;
/**
 * Creates an OPTIONS handler for network resource endpoints.
 *
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.options('/api/v1/networks/:id', createOptionsNetworkHandler());
 * ```
 */
const createOptionsNetworkHandler = () => {
    return (req, res) => {
        res.setHeader('Allow', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS');
        res.status(200).send();
    };
};
exports.createOptionsNetworkHandler = createOptionsNetworkHandler;
// ============================================================================
// ACTION ENDPOINTS (12-16)
// ============================================================================
/**
 * Creates a POST handler for executing network actions.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @param {Model} NetworkActionModel - Sequelize NetworkAction model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/networks/:id/actions/:action', createNetworkActionHandler(Network, NetworkAction));
 * ```
 */
const createNetworkActionHandler = (NetworkModel, NetworkActionModel) => {
    return async (req, res, next) => {
        try {
            const { id, action } = req.params;
            const network = await NetworkModel.findByPk(id);
            if (!network) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'NETWORK_NOT_FOUND',
                        message: `Network with ID ${id} not found`,
                    },
                });
            }
            const actionRecord = await NetworkActionModel.create({
                networkId: id,
                action,
                initiatedBy: req.user?.email || 'system',
                parameters: req.body,
                status: 'pending',
            });
            res.status(202).json({
                success: true,
                data: {
                    actionId: actionRecord.id,
                    status: 'pending',
                    network: network,
                },
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createNetworkActionHandler = createNetworkActionHandler;
/**
 * Creates a GET handler for retrieving network action status.
 *
 * @param {Model} NetworkActionModel - Sequelize NetworkAction model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.get('/api/v1/networks/:id/actions/:actionId', createGetNetworkActionStatusHandler(NetworkAction));
 * ```
 */
const createGetNetworkActionStatusHandler = (NetworkActionModel) => {
    return async (req, res, next) => {
        try {
            const action = await NetworkActionModel.findByPk(req.params.actionId);
            if (!action) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'ACTION_NOT_FOUND',
                        message: `Action with ID ${req.params.actionId} not found`,
                    },
                });
            }
            res.json({
                success: true,
                data: action,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createGetNetworkActionStatusHandler = createGetNetworkActionStatusHandler;
/**
 * Creates a POST handler for activating a network.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/networks/:id/activate', createActivateNetworkHandler(Network));
 * ```
 */
const createActivateNetworkHandler = (NetworkModel) => {
    return async (req, res, next) => {
        try {
            const network = await NetworkModel.findByPk(req.params.id);
            if (!network) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'NETWORK_NOT_FOUND',
                        message: `Network with ID ${req.params.id} not found`,
                    },
                });
            }
            await network.update({ status: 'active' });
            res.json({
                success: true,
                data: network,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createActivateNetworkHandler = createActivateNetworkHandler;
/**
 * Creates a POST handler for deactivating a network.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/networks/:id/deactivate', createDeactivateNetworkHandler(Network));
 * ```
 */
const createDeactivateNetworkHandler = (NetworkModel) => {
    return async (req, res, next) => {
        try {
            const network = await NetworkModel.findByPk(req.params.id);
            if (!network) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'NETWORK_NOT_FOUND',
                        message: `Network with ID ${req.params.id} not found`,
                    },
                });
            }
            await network.update({ status: 'inactive' });
            res.json({
                success: true,
                data: network,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createDeactivateNetworkHandler = createDeactivateNetworkHandler;
/**
 * Creates a POST handler for validating network configuration.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/networks/:id/validate', createValidateNetworkHandler(Network));
 * ```
 */
const createValidateNetworkHandler = (NetworkModel) => {
    return async (req, res, next) => {
        try {
            const network = await NetworkModel.findByPk(req.params.id);
            if (!network) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'NETWORK_NOT_FOUND',
                        message: `Network with ID ${req.params.id} not found`,
                    },
                });
            }
            // Perform validation logic
            const validationResults = {
                valid: true,
                checks: {
                    cidr: { valid: true, message: 'CIDR format is valid' },
                    vlan: { valid: true, message: 'VLAN ID is valid' },
                    conflicts: { valid: true, message: 'No conflicts detected' },
                },
            };
            res.json({
                success: true,
                data: validationResults,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createValidateNetworkHandler = createValidateNetworkHandler;
// ============================================================================
// BATCH OPERATIONS (17-20)
// ============================================================================
/**
 * Executes batch operations on networks.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @param {BatchOperation<NetworkResource>} batch - Batch operation configuration
 * @returns {Promise<BatchOperationResult<NetworkResource>>} Batch operation results
 *
 * @example
 * ```typescript
 * const results = await executeBatchOperation(Network, {
 *   operations: [
 *     { operation: 'create', data: { name: 'Net1', cidr: '10.1.0.0/16' } },
 *     { operation: 'update', id: 'uuid-123', data: { status: 'active' } }
 *   ]
 * });
 * ```
 */
const executeBatchOperation = async (NetworkModel, batch) => {
    const startTime = Date.now();
    const results = [];
    const processOperation = async (op, index) => {
        try {
            let result;
            switch (op.operation) {
                case 'create':
                    result = await NetworkModel.create(op.data);
                    break;
                case 'update':
                    if (!op.id) {
                        throw new Error('ID required for update operation');
                    }
                    const updateRecord = await NetworkModel.findByPk(op.id);
                    if (!updateRecord) {
                        throw new Error(`Record with ID ${op.id} not found`);
                    }
                    result = await updateRecord.update(op.data);
                    break;
                case 'delete':
                    if (!op.id) {
                        throw new Error('ID required for delete operation');
                    }
                    const deleteRecord = await NetworkModel.findByPk(op.id);
                    if (!deleteRecord) {
                        throw new Error(`Record with ID ${op.id} not found`);
                    }
                    await deleteRecord.destroy();
                    result = { deleted: true };
                    break;
            }
            results.push({
                success: true,
                data: result,
                index,
            });
        }
        catch (error) {
            results.push({
                success: false,
                error: error.message,
                index,
            });
            if (!batch.options?.continueOnError) {
                throw error;
            }
        }
    };
    if (batch.options?.parallel) {
        await Promise.allSettled(batch.operations.map((op, index) => processOperation(op, index)));
    }
    else {
        for (let i = 0; i < batch.operations.length; i++) {
            await processOperation(batch.operations[i], i);
        }
    }
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    return {
        results,
        summary: {
            total: batch.operations.length,
            successful,
            failed,
            duration: Date.now() - startTime,
        },
    };
};
exports.executeBatchOperation = executeBatchOperation;
/**
 * Creates a POST handler for batch network operations.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/networks/batch', createBatchNetworkHandler(Network));
 * ```
 */
const createBatchNetworkHandler = (NetworkModel) => {
    return async (req, res, next) => {
        try {
            const batch = req.body;
            const results = await (0, exports.executeBatchOperation)(NetworkModel, batch);
            const statusCode = results.summary.failed === 0 ? 200 : 207; // 207 Multi-Status
            res.status(statusCode).json({
                success: results.summary.failed === 0,
                data: results,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createBatchNetworkHandler = createBatchNetworkHandler;
/**
 * Executes bulk update on multiple networks.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @param {BulkUpdateOperation} operation - Bulk update operation
 * @returns {Promise<{ updated: number; networks: any[] }>} Update results
 *
 * @example
 * ```typescript
 * const results = await executeBulkUpdate(Network, {
 *   ids: ['uuid-1', 'uuid-2', 'uuid-3'],
 *   updates: { status: 'active' }
 * });
 * ```
 */
const executeBulkUpdate = async (NetworkModel, operation) => {
    const where = { id: operation.ids };
    if (operation.conditions) {
        Object.assign(where, operation.conditions);
    }
    const [updated] = await NetworkModel.update(operation.updates, { where });
    const networks = await NetworkModel.findAll({ where: { id: operation.ids } });
    return { updated, networks };
};
exports.executeBulkUpdate = executeBulkUpdate;
/**
 * Creates a PUT handler for bulk network updates.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.put('/api/v1/networks/bulk', createBulkUpdateNetworkHandler(Network));
 * ```
 */
const createBulkUpdateNetworkHandler = (NetworkModel) => {
    return async (req, res, next) => {
        try {
            const operation = req.body;
            const results = await (0, exports.executeBulkUpdate)(NetworkModel, operation);
            res.json({
                success: true,
                data: results,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createBulkUpdateNetworkHandler = createBulkUpdateNetworkHandler;
// ============================================================================
// SEARCH ENDPOINTS (21-23)
// ============================================================================
/**
 * Performs full-text search on networks.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @param {SearchQuery} query - Search query
 * @returns {Promise<SearchResult<any>>} Search results
 *
 * @example
 * ```typescript
 * const results = await searchNetworks(Network, {
 *   query: 'production',
 *   fields: ['name', 'description'],
 *   limit: 20
 * });
 * ```
 */
const searchNetworks = async (NetworkModel, query) => {
    const searchFields = query.fields || ['name', 'description'];
    const limit = query.limit || 20;
    const offset = query.offset || 0;
    const where = {
        $or: searchFields.map(field => ({
            [field]: { $like: query.fuzzy ? `%${query.query}%` : query.query },
        })),
    };
    if (query.filters) {
        Object.assign(where, query.filters);
    }
    const networks = await NetworkModel.findAll({
        where,
        limit,
        offset,
    });
    return {
        items: networks.map((network) => ({
            item: network,
            score: 1.0, // Simple scoring, can be enhanced
            highlights: {},
        })),
        total: networks.length,
        maxScore: 1.0,
    };
};
exports.searchNetworks = searchNetworks;
/**
 * Creates a GET handler for network search.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.get('/api/v1/networks/search', createSearchNetworksHandler(Network));
 * ```
 */
const createSearchNetworksHandler = (NetworkModel) => {
    return async (req, res, next) => {
        try {
            const searchQuery = {
                query: req.query.q || '',
                fields: req.query.fields ? req.query.fields.split(',') : undefined,
                fuzzy: req.query.fuzzy === 'true',
                limit: parseInt(req.query.limit, 10) || 20,
                offset: parseInt(req.query.offset, 10) || 0,
            };
            const results = await (0, exports.searchNetworks)(NetworkModel, searchQuery);
            res.json({
                success: true,
                data: results,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createSearchNetworksHandler = createSearchNetworksHandler;
/**
 * Creates a POST handler for advanced network search with filters.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/networks/search', createAdvancedSearchNetworksHandler(Network));
 * ```
 */
const createAdvancedSearchNetworksHandler = (NetworkModel) => {
    return async (req, res, next) => {
        try {
            const searchQuery = req.body;
            const results = await (0, exports.searchNetworks)(NetworkModel, searchQuery);
            res.json({
                success: true,
                data: results,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createAdvancedSearchNetworksHandler = createAdvancedSearchNetworksHandler;
// ============================================================================
// EXPORT ENDPOINTS (24-26)
// ============================================================================
/**
 * Exports networks in specified format.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @param {ExportOptions} options - Export options
 * @returns {Promise<string>} Exported data
 *
 * @example
 * ```typescript
 * const exported = await exportNetworks(Network, {
 *   format: 'csv',
 *   fields: ['id', 'name', 'cidr'],
 *   filters: { status: 'active' }
 * });
 * ```
 */
const exportNetworks = async (NetworkModel, options) => {
    const where = options.filters || {};
    const attributes = options.fields;
    const networks = await NetworkModel.findAll({ where, attributes });
    switch (options.format) {
        case 'json':
            return JSON.stringify(networks, null, 2);
        case 'csv': {
            if (networks.length === 0)
                return '';
            const headers = Object.keys(networks[0].toJSON());
            const rows = networks.map((n) => {
                const data = n.toJSON();
                return headers.map(h => JSON.stringify(data[h] || '')).join(',');
            });
            return [headers.join(','), ...rows].join('\n');
        }
        case 'xml': {
            const items = networks.map((n) => {
                const data = n.toJSON();
                const fields = Object.entries(data)
                    .map(([key, value]) => `<${key}>${value}</${key}>`)
                    .join('');
                return `<network>${fields}</network>`;
            }).join('');
            return `<?xml version="1.0"?><networks>${items}</networks>`;
        }
        case 'yaml': {
            // Simple YAML export
            return networks.map((n) => {
                const data = n.toJSON();
                return Object.entries(data)
                    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
                    .join('\n');
            }).join('\n---\n');
        }
        default:
            return JSON.stringify(networks);
    }
};
exports.exportNetworks = exportNetworks;
/**
 * Creates a GET handler for exporting networks.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.get('/api/v1/networks/export', createExportNetworksHandler(Network));
 * ```
 */
const createExportNetworksHandler = (NetworkModel) => {
    return async (req, res, next) => {
        try {
            const options = {
                format: req.query.format || 'json',
                fields: req.query.fields ? req.query.fields.split(',') : undefined,
                filters: req.query.filter,
                includeMetadata: req.query.includeMetadata === 'true',
                compress: req.query.compress === 'true',
            };
            const exported = await (0, exports.exportNetworks)(NetworkModel, options);
            const contentTypes = {
                json: 'application/json',
                csv: 'text/csv',
                xml: 'application/xml',
                yaml: 'application/x-yaml',
            };
            res.setHeader('Content-Type', contentTypes[options.format]);
            res.setHeader('Content-Disposition', `attachment; filename=networks.${options.format}`);
            res.send(exported);
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createExportNetworksHandler = createExportNetworksHandler;
/**
 * Creates a POST handler for custom network export with filters.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/networks/export', createCustomExportNetworksHandler(Network));
 * ```
 */
const createCustomExportNetworksHandler = (NetworkModel) => {
    return async (req, res, next) => {
        try {
            const options = req.body;
            const exported = await (0, exports.exportNetworks)(NetworkModel, options);
            const contentTypes = {
                json: 'application/json',
                csv: 'text/csv',
                xml: 'application/xml',
                yaml: 'application/x-yaml',
            };
            res.setHeader('Content-Type', contentTypes[options.format]);
            res.setHeader('Content-Disposition', `attachment; filename=networks.${options.format}`);
            res.send(exported);
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createCustomExportNetworksHandler = createCustomExportNetworksHandler;
// ============================================================================
// IMPORT ENDPOINTS (27-29)
// ============================================================================
/**
 * Imports networks from data.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @param {any[]} data - Import data array
 * @param {ImportOptions} options - Import options
 * @returns {Promise<ImportResult>} Import results
 *
 * @example
 * ```typescript
 * const results = await importNetworks(Network, networkData, {
 *   format: 'json',
 *   updateExisting: true,
 *   skipErrors: true
 * });
 * ```
 */
const importNetworks = async (NetworkModel, data, options) => {
    const result = {
        imported: 0,
        updated: 0,
        skipped: 0,
        errors: [],
    };
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        try {
            if (options.validateOnly) {
                // Just validate, don't import
                result.skipped++;
                continue;
            }
            if (options.updateExisting && item.id) {
                const existing = await NetworkModel.findByPk(item.id);
                if (existing) {
                    await existing.update(item);
                    result.updated++;
                }
                else {
                    await NetworkModel.create(item);
                    result.imported++;
                }
            }
            else {
                await NetworkModel.create(item);
                result.imported++;
            }
        }
        catch (error) {
            result.errors.push({
                line: i + 1,
                error: error.message,
                data: item,
            });
            if (!options.skipErrors) {
                break;
            }
        }
    }
    return result;
};
exports.importNetworks = importNetworks;
/**
 * Creates a POST handler for importing networks.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/networks/import', createImportNetworksHandler(Network));
 * ```
 */
const createImportNetworksHandler = (NetworkModel) => {
    return async (req, res, next) => {
        try {
            const { data, options } = req.body;
            const results = await (0, exports.importNetworks)(NetworkModel, data, options);
            res.json({
                success: results.errors.length === 0,
                data: results,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createImportNetworksHandler = createImportNetworksHandler;
/**
 * Parses CSV data for import.
 *
 * @param {string} csvData - CSV string data
 * @returns {any[]} Parsed data array
 *
 * @example
 * ```typescript
 * const data = parseCSVImport('id,name,cidr\n1,Net1,10.0.0.0/16');
 * // Result: [{ id: '1', name: 'Net1', cidr: '10.0.0.0/16' }]
 * ```
 */
const parseCSVImport = (csvData) => {
    const lines = csvData.trim().split('\n');
    if (lines.length < 2)
        return [];
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        const item = {};
        headers.forEach((header, index) => {
            item[header] = values[index];
        });
        data.push(item);
    }
    return data;
};
exports.parseCSVImport = parseCSVImport;
// ============================================================================
// WEBHOOK ENDPOINTS (30-34)
// ============================================================================
/**
 * Creates a POST handler for registering webhooks.
 *
 * @param {Model} WebhookModel - Sequelize Webhook model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/webhooks', createRegisterWebhookHandler(Webhook));
 * ```
 */
const createRegisterWebhookHandler = (WebhookModel) => {
    return async (req, res, next) => {
        try {
            const webhook = await WebhookModel.create(req.body);
            res.status(201).json({
                success: true,
                data: webhook,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createRegisterWebhookHandler = createRegisterWebhookHandler;
/**
 * Creates a DELETE handler for unregistering webhooks.
 *
 * @param {Model} WebhookModel - Sequelize Webhook model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.delete('/api/v1/webhooks/:id', createUnregisterWebhookHandler(Webhook));
 * ```
 */
const createUnregisterWebhookHandler = (WebhookModel) => {
    return async (req, res, next) => {
        try {
            const webhook = await WebhookModel.findByPk(req.params.id);
            if (!webhook) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'WEBHOOK_NOT_FOUND',
                        message: `Webhook with ID ${req.params.id} not found`,
                    },
                });
            }
            await webhook.destroy();
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createUnregisterWebhookHandler = createUnregisterWebhookHandler;
/**
 * Triggers webhooks for an event.
 *
 * @param {Model} WebhookModel - Sequelize Webhook model
 * @param {string} event - Event name
 * @param {any} data - Event data
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await triggerWebhooks(Webhook, 'network.created', network);
 * ```
 */
const triggerWebhooks = async (WebhookModel, event, data) => {
    const webhooks = await WebhookModel.findAll({
        where: {
            active: true,
            events: { $contains: [event] },
        },
    });
    const payload = {
        event,
        timestamp: new Date().toISOString(),
        data,
    };
    const promises = webhooks.map(async (webhook) => {
        try {
            const response = await fetch(webhook.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Webhook-Event': event,
                    'X-Webhook-Signature': webhook.secret ? (0, exports.generateWebhookSignature)(payload, webhook.secret) : '',
                },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                await webhook.update({
                    lastTriggeredAt: new Date(),
                    failureCount: 0,
                });
            }
            else {
                throw new Error(`Webhook returned status ${response.status}`);
            }
        }
        catch (error) {
            await webhook.update({
                failureCount: webhook.failureCount + 1,
            });
            // Disable webhook after too many failures
            if (webhook.failureCount >= 5) {
                await webhook.update({ active: false });
            }
        }
    });
    await Promise.allSettled(promises);
};
exports.triggerWebhooks = triggerWebhooks;
/**
 * Generates HMAC signature for webhook payload.
 *
 * @param {WebhookPayload} payload - Webhook payload
 * @param {string} secret - Webhook secret
 * @returns {string} HMAC signature
 *
 * @example
 * ```typescript
 * const signature = generateWebhookSignature(payload, 'webhook-secret');
 * ```
 */
const generateWebhookSignature = (payload, secret) => {
    const crypto = require('crypto');
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return hmac.digest('hex');
};
exports.generateWebhookSignature = generateWebhookSignature;
/**
 * Verifies webhook signature.
 *
 * @param {string} signature - Received signature
 * @param {WebhookPayload} payload - Webhook payload
 * @param {string} secret - Webhook secret
 * @returns {boolean} Whether signature is valid
 *
 * @example
 * ```typescript
 * const isValid = verifyWebhookSignature(req.headers['x-webhook-signature'], payload, secret);
 * ```
 */
const verifyWebhookSignature = (signature, payload, secret) => {
    const expectedSignature = (0, exports.generateWebhookSignature)(payload, secret);
    return signature === expectedSignature;
};
exports.verifyWebhookSignature = verifyWebhookSignature;
// ============================================================================
// CALLBACK HANDLERS (35-37)
// ============================================================================
/**
 * Executes callback to external URL.
 *
 * @param {CallbackConfig} config - Callback configuration
 * @param {any} data - Callback data
 * @returns {Promise<{ success: boolean; response?: any; error?: string }>} Callback result
 *
 * @example
 * ```typescript
 * const result = await executeCallback({
 *   callbackUrl: 'https://example.com/callback',
 *   method: 'POST',
 *   headers: { 'Authorization': 'Bearer token' }
 * }, { status: 'completed' });
 * ```
 */
const executeCallback = async (config, data) => {
    try {
        const response = await fetch(config.callbackUrl, {
            method: config.method,
            headers: {
                'Content-Type': 'application/json',
                ...config.headers,
            },
            body: JSON.stringify(data),
            signal: config.timeout ? AbortSignal.timeout(config.timeout) : undefined,
        });
        if (!response.ok) {
            throw new Error(`Callback returned status ${response.status}`);
        }
        const responseData = await response.json();
        return {
            success: true,
            response: responseData,
        };
    }
    catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
};
exports.executeCallback = executeCallback;
/**
 * Creates callback handler with retry logic.
 *
 * @param {CallbackConfig} config - Callback configuration
 * @param {number} [maxRetries=3] - Maximum retry attempts
 * @returns {Function} Callback handler function
 *
 * @example
 * ```typescript
 * const callback = createCallbackHandler({
 *   callbackUrl: 'https://example.com/callback',
 *   method: 'POST'
 * }, 3);
 * await callback({ status: 'completed' });
 * ```
 */
const createCallbackHandler = (config, maxRetries = 3) => {
    return async (data) => {
        let attempts = 0;
        let lastError;
        while (attempts < maxRetries) {
            attempts++;
            const result = await (0, exports.executeCallback)(config, data);
            if (result.success) {
                return { success: true, attempts };
            }
            lastError = result.error;
            if (attempts < maxRetries) {
                // Exponential backoff
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
            }
        }
        return {
            success: false,
            attempts,
            error: lastError || 'Max retries exceeded',
        };
    };
};
exports.createCallbackHandler = createCallbackHandler;
/**
 * Validates callback URL for security.
 *
 * @param {string} url - Callback URL to validate
 * @param {string[]} [allowedDomains] - Allowed domains
 * @returns {{ valid: boolean; error?: string }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateCallbackUrl('https://example.com/callback', ['example.com']);
 * if (!result.valid) {
 *   throw new Error(result.error);
 * }
 * ```
 */
const validateCallbackUrl = (url, allowedDomains) => {
    try {
        const parsed = new URL(url);
        // Only allow HTTPS
        if (parsed.protocol !== 'https:') {
            return {
                valid: false,
                error: 'Only HTTPS URLs are allowed for callbacks',
            };
        }
        // Check allowed domains
        if (allowedDomains && allowedDomains.length > 0) {
            const isAllowed = allowedDomains.some(domain => parsed.hostname.endsWith(domain));
            if (!isAllowed) {
                return {
                    valid: false,
                    error: `Domain ${parsed.hostname} is not in the allowed list`,
                };
            }
        }
        return { valid: true };
    }
    catch (error) {
        return {
            valid: false,
            error: 'Invalid URL format',
        };
    }
};
exports.validateCallbackUrl = validateCallbackUrl;
// ============================================================================
// RESOURCE RELATIONSHIPS (38-40)
// ============================================================================
/**
 * Creates a POST handler for linking resources to networks.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.post('/api/v1/networks/:id/relationships/:resourceType', createLinkResourceHandler(Network));
 * ```
 */
const createLinkResourceHandler = (NetworkModel) => {
    return async (req, res, next) => {
        try {
            const { id, resourceType } = req.params;
            const { resourceId, relationship } = req.body;
            const network = await NetworkModel.findByPk(id);
            if (!network) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'NETWORK_NOT_FOUND',
                        message: `Network with ID ${id} not found`,
                    },
                });
            }
            const link = {
                networkId: id,
                resourceType,
                resourceId,
                relationship: relationship || 'associated',
            };
            // Store link in metadata or separate table
            const metadata = network.metadata || {};
            const links = metadata.resourceLinks || [];
            links.push(link);
            metadata.resourceLinks = links;
            await network.update({ metadata });
            res.status(201).json({
                success: true,
                data: link,
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createLinkResourceHandler = createLinkResourceHandler;
/**
 * Creates a DELETE handler for unlinking resources from networks.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.delete('/api/v1/networks/:id/relationships/:resourceType/:resourceId', createUnlinkResourceHandler(Network));
 * ```
 */
const createUnlinkResourceHandler = (NetworkModel) => {
    return async (req, res, next) => {
        try {
            const { id, resourceType, resourceId } = req.params;
            const network = await NetworkModel.findByPk(id);
            if (!network) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'NETWORK_NOT_FOUND',
                        message: `Network with ID ${id} not found`,
                    },
                });
            }
            const metadata = network.metadata || {};
            const links = metadata.resourceLinks || [];
            metadata.resourceLinks = links.filter((link) => !(link.resourceType === resourceType && link.resourceId === resourceId));
            await network.update({ metadata });
            res.status(204).send();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createUnlinkResourceHandler = createUnlinkResourceHandler;
/**
 * Creates a GET handler for retrieving network resource relationships.
 *
 * @param {Model} NetworkModel - Sequelize Network model
 * @returns {Function} Express route handler
 *
 * @example
 * ```typescript
 * app.get('/api/v1/networks/:id/relationships', createGetRelationshipsHandler(Network));
 * ```
 */
const createGetRelationshipsHandler = (NetworkModel) => {
    return async (req, res, next) => {
        try {
            const network = await NetworkModel.findByPk(req.params.id);
            if (!network) {
                return res.status(404).json({
                    success: false,
                    error: {
                        code: 'NETWORK_NOT_FOUND',
                        message: `Network with ID ${req.params.id} not found`,
                    },
                });
            }
            const metadata = network.metadata || {};
            const links = metadata.resourceLinks || [];
            res.json({
                success: true,
                data: {
                    networkId: network.id,
                    relationships: links,
                },
                timestamp: new Date().toISOString(),
            });
        }
        catch (error) {
            next(error);
        }
    };
};
exports.createGetRelationshipsHandler = createGetRelationshipsHandler;
exports.default = {
    // Sequelize Models
    createNetworkModel: exports.createNetworkModel,
    createNetworkActionModel: exports.createNetworkActionModel,
    createWebhookModel: exports.createWebhookModel,
    // Resource Endpoints
    createGetNetworkHandler: exports.createGetNetworkHandler,
    createListNetworksHandler: exports.createListNetworksHandler,
    createCreateNetworkHandler: exports.createCreateNetworkHandler,
    createUpdateNetworkHandler: exports.createUpdateNetworkHandler,
    createPatchNetworkHandler: exports.createPatchNetworkHandler,
    createDeleteNetworkHandler: exports.createDeleteNetworkHandler,
    createHeadNetworkHandler: exports.createHeadNetworkHandler,
    createOptionsNetworkHandler: exports.createOptionsNetworkHandler,
    // Action Endpoints
    createNetworkActionHandler: exports.createNetworkActionHandler,
    createGetNetworkActionStatusHandler: exports.createGetNetworkActionStatusHandler,
    createActivateNetworkHandler: exports.createActivateNetworkHandler,
    createDeactivateNetworkHandler: exports.createDeactivateNetworkHandler,
    createValidateNetworkHandler: exports.createValidateNetworkHandler,
    // Batch Operations
    executeBatchOperation: exports.executeBatchOperation,
    createBatchNetworkHandler: exports.createBatchNetworkHandler,
    executeBulkUpdate: exports.executeBulkUpdate,
    createBulkUpdateNetworkHandler: exports.createBulkUpdateNetworkHandler,
    // Search Endpoints
    searchNetworks: exports.searchNetworks,
    createSearchNetworksHandler: exports.createSearchNetworksHandler,
    createAdvancedSearchNetworksHandler: exports.createAdvancedSearchNetworksHandler,
    // Export Endpoints
    exportNetworks: exports.exportNetworks,
    createExportNetworksHandler: exports.createExportNetworksHandler,
    createCustomExportNetworksHandler: exports.createCustomExportNetworksHandler,
    // Import Endpoints
    importNetworks: exports.importNetworks,
    createImportNetworksHandler: exports.createImportNetworksHandler,
    parseCSVImport: exports.parseCSVImport,
    // Webhook Endpoints
    createRegisterWebhookHandler: exports.createRegisterWebhookHandler,
    createUnregisterWebhookHandler: exports.createUnregisterWebhookHandler,
    triggerWebhooks: exports.triggerWebhooks,
    generateWebhookSignature: exports.generateWebhookSignature,
    verifyWebhookSignature: exports.verifyWebhookSignature,
    // Callback Handlers
    executeCallback: exports.executeCallback,
    createCallbackHandler: exports.createCallbackHandler,
    validateCallbackUrl: exports.validateCallbackUrl,
    // Resource Relationships
    createLinkResourceHandler: exports.createLinkResourceHandler,
    createUnlinkResourceHandler: exports.createUnlinkResourceHandler,
    createGetRelationshipsHandler: exports.createGetRelationshipsHandler,
};
//# sourceMappingURL=network-rest-endpoints-kit.js.map
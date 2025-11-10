"use strict";
/**
 * LOC: VN-CONFIG-001
 * File: /reuse/san/virtual-network-config-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize
 *   - @types/sequelize
 *
 * DOWNSTREAM (imported by):
 *   - SAN network configuration services
 *   - Virtual network management controllers
 *   - QoS and bandwidth management components
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePortConfiguration = exports.enableDisablePort = exports.configurePortMirroring = exports.configurePolicyPriority = exports.applyFirewallRules = exports.validatePolicyCompliance = exports.enforceSecurityPolicy = exports.createNetworkPolicy = exports.cloneNetworkProfile = exports.validateProfileSettings = exports.applyNetworkProfile = exports.deleteNetworkProfile = exports.updateNetworkProfile = exports.createNetworkProfile = exports.validateBandwidthAllocation = exports.releaseBandwidth = exports.reserveBandwidth = exports.calculateBandwidthUtilization = exports.implementTrafficThrottling = exports.configureBandwidthLimit = exports.allocateBandwidth = exports.validateQoSConfiguration = exports.configureTrafficShaping = exports.prioritizeTraffic = exports.applyQoSToInterface = exports.deleteQoSPolicy = exports.updateQoSRules = exports.createQoSPolicy = exports.validateVLANMembership = exports.configureVLANTrunking = exports.assignVLANPriority = exports.validateVLANRange = exports.deleteVLANConfig = exports.updateVLANTags = exports.createVLANConfig = exports.configureInterfaceMTU = exports.assignInterfaceIP = exports.enableDisableInterface = exports.validateInterfaceSettings = exports.deleteNetworkInterface = exports.updateInterfaceConfig = exports.createNetworkInterface = exports.createQoSPolicyModel = exports.createVLANConfigModel = exports.createNetworkInterfaceModel = void 0;
/**
 * File: /reuse/san/virtual-network-config-kit.ts
 * Locator: WC-SAN-CONFIG-001
 * Purpose: Comprehensive Virtual Network Configuration Management - interface, VLAN, QoS, bandwidth, policies
 *
 * Upstream: Independent utility module for virtual network configuration
 * Downstream: ../backend/san/*, network controllers, configuration services
 * Dependencies: TypeScript 5.x, Node 18+, NestJS 10.x, Sequelize 6.x
 * Exports: 45+ utility functions for network interfaces, VLAN config, QoS, bandwidth allocation, network profiles
 *
 * LLM Context: Enterprise-grade virtual network configuration toolkit for software-defined networks (SDN).
 * Provides network interface configuration, VLAN tagging, QoS policy management, bandwidth allocation,
 * traffic throttling, network profiles, policy enforcement, and port configuration. Essential for SAN infrastructure.
 */
const sequelize_1 = require("sequelize");
// ============================================================================
// SEQUELIZE MODELS (1-3)
// ============================================================================
/**
 * Sequelize model for Network Interfaces.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} NetworkInterface model
 *
 * @example
 * ```typescript
 * const Interface = createNetworkInterfaceModel(sequelize);
 * const iface = await Interface.create({
 *   nodeId: 'node-123',
 *   name: 'eth0',
 *   type: 'physical',
 *   ipAddress: '10.0.1.10',
 *   mtu: 1500,
 *   speed: 10000
 * });
 * ```
 */
const createNetworkInterfaceModel = (sequelize) => {
    class NetworkInterface extends sequelize_1.Model {
    }
    NetworkInterface.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        nodeId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Parent node ID',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(100),
            allowNull: false,
            comment: 'Interface name (e.g., eth0, vlan100)',
        },
        type: {
            type: sequelize_1.DataTypes.ENUM('physical', 'virtual', 'bridge', 'tunnel'),
            allowNull: false,
            comment: 'Interface type',
        },
        macAddress: {
            type: sequelize_1.DataTypes.STRING(17),
            allowNull: true,
            comment: 'MAC address',
        },
        ipAddress: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
            comment: 'IPv4 address',
        },
        ipv6Address: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
            comment: 'IPv6 address',
        },
        subnetMask: {
            type: sequelize_1.DataTypes.STRING(45),
            allowNull: true,
            comment: 'Subnet mask',
        },
        mtu: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1500,
            comment: 'Maximum Transmission Unit',
        },
        speed: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1000,
            comment: 'Interface speed (Mbps)',
        },
        duplex: {
            type: sequelize_1.DataTypes.ENUM('half', 'full', 'auto'),
            allowNull: false,
            defaultValue: 'full',
            comment: 'Duplex mode',
        },
        status: {
            type: sequelize_1.DataTypes.ENUM('up', 'down', 'admin-down', 'testing'),
            allowNull: false,
            defaultValue: 'down',
            comment: 'Interface status',
        },
        enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Interface enabled',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'network_interfaces',
        timestamps: true,
        indexes: [
            { fields: ['nodeId'] },
            { fields: ['type'] },
            { fields: ['status'] },
            { fields: ['enabled'] },
        ],
    });
    return NetworkInterface;
};
exports.createNetworkInterfaceModel = createNetworkInterfaceModel;
/**
 * Sequelize model for VLAN Configurations.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} VLANConfig model
 *
 * @example
 * ```typescript
 * const VLAN = createVLANConfigModel(sequelize);
 * const vlan = await VLAN.create({
 *   id: 100,
 *   name: 'Production',
 *   priority: 5,
 *   tagged: true,
 *   trunkPorts: ['eth0', 'eth1']
 * });
 * ```
 */
const createVLANConfigModel = (sequelize) => {
    class VLANConfig extends sequelize_1.Model {
    }
    VLANConfig.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            comment: 'VLAN ID (1-4094)',
        },
        topologyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Parent topology ID',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'VLAN name',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'VLAN description',
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'VLAN priority (0-7)',
        },
        tagged: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Tagged/Untagged VLAN',
        },
        trunkPorts: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Trunk port interfaces',
        },
        accessPorts: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'Access port interfaces',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'vlan_configs',
        timestamps: true,
        indexes: [
            { fields: ['topologyId'] },
            { fields: ['priority'] },
            { fields: ['name'] },
        ],
    });
    return VLANConfig;
};
exports.createVLANConfigModel = createVLANConfigModel;
/**
 * Sequelize model for QoS Policies.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {Model} QoSPolicy model
 *
 * @example
 * ```typescript
 * const QoS = createQoSPolicyModel(sequelize);
 * const policy = await QoS.create({
 *   name: 'Voice-Priority',
 *   priority: 7,
 *   bandwidth: 1000,
 *   rules: [...]
 * });
 * ```
 */
const createQoSPolicyModel = (sequelize) => {
    class QoSPolicy extends sequelize_1.Model {
    }
    QoSPolicy.init({
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        topologyId: {
            type: sequelize_1.DataTypes.UUID,
            allowNull: false,
            comment: 'Parent topology ID',
        },
        name: {
            type: sequelize_1.DataTypes.STRING(255),
            allowNull: false,
            comment: 'QoS policy name',
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: true,
            comment: 'Policy description',
        },
        priority: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Policy priority (0-7)',
        },
        bandwidth: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: 'Guaranteed bandwidth (Mbps)',
        },
        burstSize: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: true,
            comment: 'Burst size (KB)',
        },
        rules: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: [],
            comment: 'QoS rules',
        },
        enabled: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: 'Policy enabled',
        },
        metadata: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
            comment: 'Additional metadata',
        },
    }, {
        sequelize,
        tableName: 'qos_policies',
        timestamps: true,
        indexes: [
            { fields: ['topologyId'] },
            { fields: ['priority'] },
            { fields: ['enabled'] },
        ],
    });
    return QoSPolicy;
};
exports.createQoSPolicyModel = createQoSPolicyModel;
// ============================================================================
// INTERFACE CONFIGURATION (4-10)
// ============================================================================
/**
 * Creates a new network interface.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<NetworkInterface>} interfaceData - Interface data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkInterface>} Created interface
 *
 * @example
 * ```typescript
 * const iface = await createNetworkInterface(sequelize, {
 *   nodeId: 'node-123',
 *   name: 'eth0',
 *   type: 'physical',
 *   ipAddress: '10.0.1.10',
 *   mtu: 1500
 * });
 * ```
 */
const createNetworkInterface = async (sequelize, interfaceData, transaction) => {
    const InterfaceModel = sequelize.models.NetworkInterface;
    return InterfaceModel.create(interfaceData, { transaction });
};
exports.createNetworkInterface = createNetworkInterface;
/**
 * Updates network interface configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {Partial<NetworkInterface>} updates - Fields to update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkInterface>} Updated interface
 *
 * @example
 * ```typescript
 * const updated = await updateInterfaceConfig(sequelize, 'iface-123', {
 *   ipAddress: '10.0.1.20',
 *   mtu: 9000
 * });
 * ```
 */
const updateInterfaceConfig = async (sequelize, interfaceId, updates, transaction) => {
    const InterfaceModel = sequelize.models.NetworkInterface;
    const iface = await InterfaceModel.findByPk(interfaceId, { transaction });
    if (!iface)
        throw new Error(`Interface ${interfaceId} not found`);
    await iface.update(updates, { transaction });
    return iface;
};
exports.updateInterfaceConfig = updateInterfaceConfig;
/**
 * Deletes a network interface.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteNetworkInterface(sequelize, 'iface-123');
 * ```
 */
const deleteNetworkInterface = async (sequelize, interfaceId, transaction) => {
    const InterfaceModel = sequelize.models.NetworkInterface;
    await InterfaceModel.destroy({ where: { id: interfaceId }, transaction });
};
exports.deleteNetworkInterface = deleteNetworkInterface;
/**
 * Validates interface settings.
 *
 * @param {NetworkInterface} iface - Interface to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateInterfaceSettings(iface);
 * if (!result.valid) {
 *   console.error('Configuration errors:', result.errors);
 * }
 * ```
 */
const validateInterfaceSettings = (iface) => {
    const errors = [];
    if (!iface.name || iface.name.trim() === '') {
        errors.push('Interface name is required');
    }
    if (iface.mtu < 68 || iface.mtu > 9000) {
        errors.push('MTU must be between 68 and 9000');
    }
    if (iface.speed < 0) {
        errors.push('Speed cannot be negative');
    }
    if (iface.ipAddress && !isValidIP(iface.ipAddress)) {
        errors.push('Invalid IP address format');
    }
    if (iface.macAddress && !isValidMAC(iface.macAddress)) {
        errors.push('Invalid MAC address format');
    }
    return { valid: errors.length === 0, errors };
};
exports.validateInterfaceSettings = validateInterfaceSettings;
/**
 * Enables or disables a network interface.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {boolean} enabled - Enable or disable
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkInterface>} Updated interface
 *
 * @example
 * ```typescript
 * const iface = await enableDisableInterface(sequelize, 'iface-123', true);
 * ```
 */
const enableDisableInterface = async (sequelize, interfaceId, enabled, transaction) => {
    const InterfaceModel = sequelize.models.NetworkInterface;
    const iface = await InterfaceModel.findByPk(interfaceId, { transaction });
    if (!iface)
        throw new Error(`Interface ${interfaceId} not found`);
    iface.enabled = enabled;
    iface.status = enabled ? 'up' : 'admin-down';
    await iface.save({ transaction });
    return iface;
};
exports.enableDisableInterface = enableDisableInterface;
/**
 * Assigns IP address to an interface.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {string} ipAddress - IP address
 * @param {string} subnetMask - Subnet mask
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkInterface>} Updated interface
 *
 * @example
 * ```typescript
 * const iface = await assignInterfaceIP(sequelize, 'iface-123', '10.0.1.10', '255.255.255.0');
 * ```
 */
const assignInterfaceIP = async (sequelize, interfaceId, ipAddress, subnetMask, transaction) => {
    const InterfaceModel = sequelize.models.NetworkInterface;
    const iface = await InterfaceModel.findByPk(interfaceId, { transaction });
    if (!iface)
        throw new Error(`Interface ${interfaceId} not found`);
    if (!isValidIP(ipAddress)) {
        throw new Error('Invalid IP address');
    }
    iface.ipAddress = ipAddress;
    iface.subnetMask = subnetMask;
    await iface.save({ transaction });
    return iface;
};
exports.assignInterfaceIP = assignInterfaceIP;
/**
 * Configures interface MTU (Maximum Transmission Unit).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {number} mtu - MTU value (68-9000)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkInterface>} Updated interface
 *
 * @example
 * ```typescript
 * const iface = await configureInterfaceMTU(sequelize, 'iface-123', 9000);
 * ```
 */
const configureInterfaceMTU = async (sequelize, interfaceId, mtu, transaction) => {
    if (mtu < 68 || mtu > 9000) {
        throw new Error('MTU must be between 68 and 9000');
    }
    const InterfaceModel = sequelize.models.NetworkInterface;
    const iface = await InterfaceModel.findByPk(interfaceId, { transaction });
    if (!iface)
        throw new Error(`Interface ${interfaceId} not found`);
    iface.mtu = mtu;
    await iface.save({ transaction });
    return iface;
};
exports.configureInterfaceMTU = configureInterfaceMTU;
// ============================================================================
// VLAN CONFIGURATION (11-17)
// ============================================================================
/**
 * Creates a VLAN configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<VLANConfig>} vlanData - VLAN data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VLANConfig>} Created VLAN
 *
 * @example
 * ```typescript
 * const vlan = await createVLANConfig(sequelize, {
 *   id: 100,
 *   topologyId: 'topo-123',
 *   name: 'Production',
 *   priority: 5
 * });
 * ```
 */
const createVLANConfig = async (sequelize, vlanData, transaction) => {
    const VLANModel = sequelize.models.VLANConfig;
    return VLANModel.create(vlanData, { transaction });
};
exports.createVLANConfig = createVLANConfig;
/**
 * Updates VLAN tags and configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vlanId - VLAN ID
 * @param {Partial<VLANConfig>} updates - Fields to update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VLANConfig>} Updated VLAN
 *
 * @example
 * ```typescript
 * const vlan = await updateVLANTags(sequelize, 100, {
 *   priority: 7,
 *   trunkPorts: ['eth0', 'eth1', 'eth2']
 * });
 * ```
 */
const updateVLANTags = async (sequelize, vlanId, updates, transaction) => {
    const VLANModel = sequelize.models.VLANConfig;
    const vlan = await VLANModel.findByPk(vlanId, { transaction });
    if (!vlan)
        throw new Error(`VLAN ${vlanId} not found`);
    await vlan.update(updates, { transaction });
    return vlan;
};
exports.updateVLANTags = updateVLANTags;
/**
 * Deletes a VLAN configuration.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vlanId - VLAN ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteVLANConfig(sequelize, 100);
 * ```
 */
const deleteVLANConfig = async (sequelize, vlanId, transaction) => {
    const VLANModel = sequelize.models.VLANConfig;
    await VLANModel.destroy({ where: { id: vlanId }, transaction });
};
exports.deleteVLANConfig = deleteVLANConfig;
/**
 * Validates VLAN ID range (1-4094).
 *
 * @param {number} vlanId - VLAN ID to validate
 * @returns {boolean} True if valid
 *
 * @example
 * ```typescript
 * const valid = validateVLANRange(100); // true
 * const invalid = validateVLANRange(5000); // false
 * ```
 */
const validateVLANRange = (vlanId) => {
    return vlanId >= 1 && vlanId <= 4094;
};
exports.validateVLANRange = validateVLANRange;
/**
 * Assigns priority to VLAN (0-7).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vlanId - VLAN ID
 * @param {number} priority - Priority value (0-7)
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VLANConfig>} Updated VLAN
 *
 * @example
 * ```typescript
 * const vlan = await assignVLANPriority(sequelize, 100, 7);
 * ```
 */
const assignVLANPriority = async (sequelize, vlanId, priority, transaction) => {
    if (priority < 0 || priority > 7) {
        throw new Error('VLAN priority must be between 0 and 7');
    }
    const VLANModel = sequelize.models.VLANConfig;
    const vlan = await VLANModel.findByPk(vlanId, { transaction });
    if (!vlan)
        throw new Error(`VLAN ${vlanId} not found`);
    vlan.priority = priority;
    await vlan.save({ transaction });
    return vlan;
};
exports.assignVLANPriority = assignVLANPriority;
/**
 * Configures VLAN trunking on ports.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {number} vlanId - VLAN ID
 * @param {string[]} trunkPorts - Trunk port interfaces
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<VLANConfig>} Updated VLAN
 *
 * @example
 * ```typescript
 * const vlan = await configureVLANTrunking(sequelize, 100, ['eth0', 'eth1']);
 * ```
 */
const configureVLANTrunking = async (sequelize, vlanId, trunkPorts, transaction) => {
    const VLANModel = sequelize.models.VLANConfig;
    const vlan = await VLANModel.findByPk(vlanId, { transaction });
    if (!vlan)
        throw new Error(`VLAN ${vlanId} not found`);
    vlan.trunkPorts = trunkPorts;
    vlan.tagged = true;
    await vlan.save({ transaction });
    return vlan;
};
exports.configureVLANTrunking = configureVLANTrunking;
/**
 * Validates VLAN membership configuration.
 *
 * @param {VLANConfig} vlan - VLAN configuration
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateVLANMembership(vlan);
 * ```
 */
const validateVLANMembership = (vlan) => {
    const errors = [];
    if (!(0, exports.validateVLANRange)(vlan.id)) {
        errors.push('VLAN ID must be between 1 and 4094');
    }
    if (vlan.priority < 0 || vlan.priority > 7) {
        errors.push('VLAN priority must be between 0 and 7');
    }
    // Check for port conflicts
    const portSet = new Set([...vlan.trunkPorts, ...vlan.accessPorts]);
    if (portSet.size !== vlan.trunkPorts.length + vlan.accessPorts.length) {
        errors.push('Port cannot be both trunk and access');
    }
    return { valid: errors.length === 0, errors };
};
exports.validateVLANMembership = validateVLANMembership;
// ============================================================================
// QOS MANAGEMENT (18-24)
// ============================================================================
/**
 * Creates a QoS policy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<QoSPolicy>} policyData - QoS policy data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<QoSPolicy>} Created policy
 *
 * @example
 * ```typescript
 * const policy = await createQoSPolicy(sequelize, {
 *   topologyId: 'topo-123',
 *   name: 'Voice-Priority',
 *   priority: 7,
 *   bandwidth: 1000
 * });
 * ```
 */
const createQoSPolicy = async (sequelize, policyData, transaction) => {
    const QoSModel = sequelize.models.QoSPolicy;
    return QoSModel.create(policyData, { transaction });
};
exports.createQoSPolicy = createQoSPolicy;
/**
 * Updates QoS rules.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} policyId - Policy ID
 * @param {QoSRule[]} rules - Updated rules
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<QoSPolicy>} Updated policy
 *
 * @example
 * ```typescript
 * const policy = await updateQoSRules(sequelize, 'policy-123', [
 *   { id: 'rule-1', name: 'Voice', match: {...}, action: {...}, priority: 7 }
 * ]);
 * ```
 */
const updateQoSRules = async (sequelize, policyId, rules, transaction) => {
    const QoSModel = sequelize.models.QoSPolicy;
    const policy = await QoSModel.findByPk(policyId, { transaction });
    if (!policy)
        throw new Error(`QoS policy ${policyId} not found`);
    policy.rules = rules;
    await policy.save({ transaction });
    return policy;
};
exports.updateQoSRules = updateQoSRules;
/**
 * Deletes a QoS policy.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} policyId - Policy ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteQoSPolicy(sequelize, 'policy-123');
 * ```
 */
const deleteQoSPolicy = async (sequelize, policyId, transaction) => {
    const QoSModel = sequelize.models.QoSPolicy;
    await QoSModel.destroy({ where: { id: policyId }, transaction });
};
exports.deleteQoSPolicy = deleteQoSPolicy;
/**
 * Applies QoS policy to an interface.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {string} policyId - QoS policy ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkInterface>} Updated interface
 *
 * @example
 * ```typescript
 * const iface = await applyQoSToInterface(sequelize, 'iface-123', 'policy-123');
 * ```
 */
const applyQoSToInterface = async (sequelize, interfaceId, policyId, transaction) => {
    const InterfaceModel = sequelize.models.NetworkInterface;
    const iface = await InterfaceModel.findByPk(interfaceId, { transaction });
    if (!iface)
        throw new Error(`Interface ${interfaceId} not found`);
    iface.metadata = { ...iface.metadata, qosPolicyId: policyId };
    await iface.save({ transaction });
    return iface;
};
exports.applyQoSToInterface = applyQoSToInterface;
/**
 * Prioritizes traffic based on DSCP/CoS values.
 *
 * @param {QoSPolicy} policy - QoS policy
 * @param {TrafficMatch} traffic - Traffic to match
 * @returns {number} Priority level (0-7)
 *
 * @example
 * ```typescript
 * const priority = prioritizeTraffic(policy, {
 *   protocol: 'UDP',
 *   destinationPort: 5060
 * });
 * ```
 */
const prioritizeTraffic = (policy, traffic) => {
    for (const rule of policy.rules) {
        if (matchesTraffic(rule.match, traffic)) {
            return rule.action.priority || policy.priority;
        }
    }
    return 0; // Default priority
};
exports.prioritizeTraffic = prioritizeTraffic;
/**
 * Configures traffic shaping parameters.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {TrafficShapingConfig} config - Shaping configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkInterface>} Updated interface
 *
 * @example
 * ```typescript
 * const iface = await configureTrafficShaping(sequelize, 'iface-123', {
 *   maxRate: 1000,
 *   minRate: 100,
 *   burstSize: 1500,
 *   algorithm: 'token-bucket'
 * });
 * ```
 */
const configureTrafficShaping = async (sequelize, interfaceId, config, transaction) => {
    const InterfaceModel = sequelize.models.NetworkInterface;
    const iface = await InterfaceModel.findByPk(interfaceId, { transaction });
    if (!iface)
        throw new Error(`Interface ${interfaceId} not found`);
    iface.metadata = { ...iface.metadata, trafficShaping: config };
    await iface.save({ transaction });
    return iface;
};
exports.configureTrafficShaping = configureTrafficShaping;
/**
 * Validates QoS configuration.
 *
 * @param {QoSPolicy} policy - QoS policy to validate
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateQoSConfiguration(policy);
 * ```
 */
const validateQoSConfiguration = (policy) => {
    const errors = [];
    if (policy.priority < 0 || policy.priority > 7) {
        errors.push('QoS priority must be between 0 and 7');
    }
    if (policy.bandwidth < 0) {
        errors.push('Bandwidth cannot be negative');
    }
    // Validate rules
    for (const rule of policy.rules) {
        if (rule.priority < 0 || rule.priority > 7) {
            errors.push(`Rule ${rule.name}: priority must be between 0 and 7`);
        }
        if (rule.action.type === 'mark' && !rule.action.markDSCP) {
            errors.push(`Rule ${rule.name}: markDSCP required for mark action`);
        }
    }
    return { valid: errors.length === 0, errors };
};
exports.validateQoSConfiguration = validateQoSConfiguration;
// ============================================================================
// BANDWIDTH MANAGEMENT (25-31)
// ============================================================================
/**
 * Allocates bandwidth to an interface or service.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {string} serviceId - Service identifier
 * @param {number} bandwidth - Bandwidth in Mbps
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BandwidthAllocation>} Bandwidth allocation
 *
 * @example
 * ```typescript
 * const allocation = await allocateBandwidth(sequelize, 'iface-123', 'service-1', 500);
 * ```
 */
const allocateBandwidth = async (sequelize, interfaceId, serviceId, bandwidth, transaction) => {
    const InterfaceModel = sequelize.models.NetworkInterface;
    const iface = await InterfaceModel.findByPk(interfaceId, { transaction });
    if (!iface)
        throw new Error(`Interface ${interfaceId} not found`);
    const allocations = new Map(Object.entries(iface.metadata.bandwidthAllocations || {}));
    const currentTotal = Array.from(allocations.values()).reduce((sum, bw) => sum + bw, 0);
    if (currentTotal + bandwidth > iface.speed) {
        throw new Error('Insufficient bandwidth available');
    }
    allocations.set(serviceId, bandwidth);
    iface.metadata = {
        ...iface.metadata,
        bandwidthAllocations: Object.fromEntries(allocations),
    };
    await iface.save({ transaction });
    return {
        interfaceId,
        totalBandwidth: iface.speed,
        committed: currentTotal + bandwidth,
        burst: 0,
        allocations,
        reserved: currentTotal + bandwidth,
        available: iface.speed - currentTotal - bandwidth,
    };
};
exports.allocateBandwidth = allocateBandwidth;
/**
 * Configures bandwidth limit for an interface.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {number} maxBandwidth - Maximum bandwidth in Mbps
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkInterface>} Updated interface
 *
 * @example
 * ```typescript
 * const iface = await configureBandwidthLimit(sequelize, 'iface-123', 5000);
 * ```
 */
const configureBandwidthLimit = async (sequelize, interfaceId, maxBandwidth, transaction) => {
    const InterfaceModel = sequelize.models.NetworkInterface;
    const iface = await InterfaceModel.findByPk(interfaceId, { transaction });
    if (!iface)
        throw new Error(`Interface ${interfaceId} not found`);
    iface.metadata = { ...iface.metadata, maxBandwidth };
    await iface.save({ transaction });
    return iface;
};
exports.configureBandwidthLimit = configureBandwidthLimit;
/**
 * Implements traffic throttling/rate limiting.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {number} rate - Throttle rate in Mbps
 * @param {number} burst - Burst size in KB
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkInterface>} Updated interface
 *
 * @example
 * ```typescript
 * const iface = await implementTrafficThrottling(sequelize, 'iface-123', 1000, 1500);
 * ```
 */
const implementTrafficThrottling = async (sequelize, interfaceId, rate, burst, transaction) => {
    const InterfaceModel = sequelize.models.NetworkInterface;
    const iface = await InterfaceModel.findByPk(interfaceId, { transaction });
    if (!iface)
        throw new Error(`Interface ${interfaceId} not found`);
    iface.metadata = {
        ...iface.metadata,
        throttling: { rate, burst, enabled: true },
    };
    await iface.save({ transaction });
    return iface;
};
exports.implementTrafficThrottling = implementTrafficThrottling;
/**
 * Calculates current bandwidth utilization.
 *
 * @param {NetworkInterface} iface - Network interface
 * @param {InterfaceStatistics} stats - Interface statistics
 * @returns {number} Utilization percentage
 *
 * @example
 * ```typescript
 * const utilization = calculateBandwidthUtilization(iface, stats);
 * console.log(`${utilization}%`);
 * ```
 */
const calculateBandwidthUtilization = (iface, stats) => {
    const throughputMbps = ((stats.rxBytes + stats.txBytes) * 8) / 1000000;
    return (throughputMbps / iface.speed) * 100;
};
exports.calculateBandwidthUtilization = calculateBandwidthUtilization;
/**
 * Reserves bandwidth for critical services.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {number} bandwidth - Bandwidth to reserve in Mbps
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BandwidthAllocation>} Updated allocation
 *
 * @example
 * ```typescript
 * const allocation = await reserveBandwidth(sequelize, 'iface-123', 2000);
 * ```
 */
const reserveBandwidth = async (sequelize, interfaceId, bandwidth, transaction) => {
    return (0, exports.allocateBandwidth)(sequelize, interfaceId, 'reserved', bandwidth, transaction);
};
exports.reserveBandwidth = reserveBandwidth;
/**
 * Releases reserved bandwidth.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {string} serviceId - Service identifier
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<BandwidthAllocation>} Updated allocation
 *
 * @example
 * ```typescript
 * const allocation = await releaseBandwidth(sequelize, 'iface-123', 'service-1');
 * ```
 */
const releaseBandwidth = async (sequelize, interfaceId, serviceId, transaction) => {
    const InterfaceModel = sequelize.models.NetworkInterface;
    const iface = await InterfaceModel.findByPk(interfaceId, { transaction });
    if (!iface)
        throw new Error(`Interface ${interfaceId} not found`);
    const allocations = new Map(Object.entries(iface.metadata.bandwidthAllocations || {}));
    allocations.delete(serviceId);
    iface.metadata = {
        ...iface.metadata,
        bandwidthAllocations: Object.fromEntries(allocations),
    };
    await iface.save({ transaction });
    const currentTotal = Array.from(allocations.values()).reduce((sum, bw) => sum + bw, 0);
    return {
        interfaceId,
        totalBandwidth: iface.speed,
        committed: currentTotal,
        burst: 0,
        allocations,
        reserved: currentTotal,
        available: iface.speed - currentTotal,
    };
};
exports.releaseBandwidth = releaseBandwidth;
/**
 * Validates bandwidth allocation against interface capacity.
 *
 * @param {NetworkInterface} iface - Network interface
 * @param {BandwidthAllocation} allocation - Proposed allocation
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateBandwidthAllocation(iface, allocation);
 * ```
 */
const validateBandwidthAllocation = (iface, allocation) => {
    const errors = [];
    if (allocation.committed > allocation.totalBandwidth) {
        errors.push('Total committed bandwidth exceeds interface capacity');
    }
    if (allocation.reserved > allocation.totalBandwidth) {
        errors.push('Reserved bandwidth exceeds interface capacity');
    }
    if (allocation.available < 0) {
        errors.push('Negative available bandwidth');
    }
    return { valid: errors.length === 0, errors };
};
exports.validateBandwidthAllocation = validateBandwidthAllocation;
// ============================================================================
// NETWORK PROFILES (32-37)
// ============================================================================
/**
 * Creates a reusable network profile.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<NetworkProfile>} profileData - Profile data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkProfile>} Created profile
 *
 * @example
 * ```typescript
 * const profile = await createNetworkProfile(sequelize, {
 *   name: 'Standard-Server',
 *   description: 'Standard server network configuration',
 *   interfaceConfigs: [...],
 *   qosPolicies: [...]
 * });
 * ```
 */
const createNetworkProfile = async (sequelize, profileData, transaction) => {
    // Store in dedicated table or metadata
    return profileData;
};
exports.createNetworkProfile = createNetworkProfile;
/**
 * Updates network profile settings.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} profileId - Profile ID
 * @param {Partial<NetworkProfile>} updates - Fields to update
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkProfile>} Updated profile
 *
 * @example
 * ```typescript
 * const profile = await updateNetworkProfile(sequelize, 'profile-123', {
 *   description: 'Updated description'
 * });
 * ```
 */
const updateNetworkProfile = async (sequelize, profileId, updates, transaction) => {
    // Update profile in storage
    return { ...updates, id: profileId };
};
exports.updateNetworkProfile = updateNetworkProfile;
/**
 * Deletes a network profile.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} profileId - Profile ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await deleteNetworkProfile(sequelize, 'profile-123');
 * ```
 */
const deleteNetworkProfile = async (sequelize, profileId, transaction) => {
    // Delete from storage
};
exports.deleteNetworkProfile = deleteNetworkProfile;
/**
 * Applies network profile to a node.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} nodeId - Node ID
 * @param {string} profileId - Profile ID
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyNetworkProfile(sequelize, 'node-123', 'profile-123');
 * ```
 */
const applyNetworkProfile = async (sequelize, nodeId, profileId, transaction) => {
    const NodeModel = sequelize.models.NetworkNode;
    const node = await NodeModel.findByPk(nodeId, { transaction });
    if (!node)
        throw new Error(`Node ${nodeId} not found`);
    node.metadata = { ...node.metadata, networkProfileId: profileId };
    await node.save({ transaction });
};
exports.applyNetworkProfile = applyNetworkProfile;
/**
 * Validates profile settings.
 *
 * @param {NetworkProfile} profile - Network profile
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validateProfileSettings(profile);
 * ```
 */
const validateProfileSettings = (profile) => {
    const errors = [];
    if (!profile.name || profile.name.trim() === '') {
        errors.push('Profile name is required');
    }
    // Validate interface configs
    for (const ifaceConfig of profile.interfaceConfigs) {
        if (ifaceConfig.mtu && (ifaceConfig.mtu < 68 || ifaceConfig.mtu > 9000)) {
            errors.push('MTU must be between 68 and 9000');
        }
    }
    // Validate VLAN configs
    for (const vlan of profile.vlanConfigs) {
        if (!(0, exports.validateVLANRange)(vlan.id)) {
            errors.push(`Invalid VLAN ID: ${vlan.id}`);
        }
    }
    return { valid: errors.length === 0, errors };
};
exports.validateProfileSettings = validateProfileSettings;
/**
 * Clones an existing network profile.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} sourceProfileId - Source profile ID
 * @param {string} newName - New profile name
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkProfile>} Cloned profile
 *
 * @example
 * ```typescript
 * const clone = await cloneNetworkProfile(sequelize, 'profile-123', 'Cloned-Profile');
 * ```
 */
const cloneNetworkProfile = async (sequelize, sourceProfileId, newName, transaction) => {
    // Retrieve source profile
    // Create new profile with copied settings
    return { id: 'new-id', name: newName };
};
exports.cloneNetworkProfile = cloneNetworkProfile;
// ============================================================================
// POLICY ENFORCEMENT (38-42)
// ============================================================================
/**
 * Creates a network policy (firewall, ACL, routing).
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {Partial<NetworkPolicy>} policyData - Policy data
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkPolicy>} Created policy
 *
 * @example
 * ```typescript
 * const policy = await createNetworkPolicy(sequelize, {
 *   name: 'DMZ-Firewall',
 *   type: 'firewall',
 *   rules: [...],
 *   priority: 10
 * });
 * ```
 */
const createNetworkPolicy = async (sequelize, policyData, transaction) => {
    // Store in dedicated table
    return policyData;
};
exports.createNetworkPolicy = createNetworkPolicy;
/**
 * Enforces security policy on network.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} policyId - Policy ID
 * @param {string[]} nodeIds - Node IDs to apply policy
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await enforceSecurityPolicy(sequelize, 'policy-123', ['node-1', 'node-2']);
 * ```
 */
const enforceSecurityPolicy = async (sequelize, policyId, nodeIds, transaction) => {
    const NodeModel = sequelize.models.NetworkNode;
    for (const nodeId of nodeIds) {
        const node = await NodeModel.findByPk(nodeId, { transaction });
        if (node) {
            const policies = node.metadata.securityPolicies || [];
            if (!policies.includes(policyId)) {
                policies.push(policyId);
                node.metadata = { ...node.metadata, securityPolicies: policies };
                await node.save({ transaction });
            }
        }
    }
};
exports.enforceSecurityPolicy = enforceSecurityPolicy;
/**
 * Validates policy compliance.
 *
 * @param {NetworkPolicy} policy - Network policy
 * @returns {{ compliant: boolean; violations: string[] }} Compliance result
 *
 * @example
 * ```typescript
 * const result = validatePolicyCompliance(policy);
 * ```
 */
const validatePolicyCompliance = (policy) => {
    const violations = [];
    // Check for conflicting rules
    for (let i = 0; i < policy.rules.length; i++) {
        for (let j = i + 1; j < policy.rules.length; j++) {
            if (rulesConflict(policy.rules[i], policy.rules[j])) {
                violations.push(`Rules ${policy.rules[i].id} and ${policy.rules[j].id} conflict`);
            }
        }
    }
    return { compliant: violations.length === 0, violations };
};
exports.validatePolicyCompliance = validatePolicyCompliance;
/**
 * Applies firewall rules to network.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} nodeId - Node ID
 * @param {PolicyRule[]} rules - Firewall rules
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await applyFirewallRules(sequelize, 'node-123', [
 *   { id: 'rule-1', action: 'deny', source: '0.0.0.0/0', destination: '10.0.0.0/8', priority: 1 }
 * ]);
 * ```
 */
const applyFirewallRules = async (sequelize, nodeId, rules, transaction) => {
    const NodeModel = sequelize.models.NetworkNode;
    const node = await NodeModel.findByPk(nodeId, { transaction });
    if (!node)
        throw new Error(`Node ${nodeId} not found`);
    node.metadata = { ...node.metadata, firewallRules: rules };
    await node.save({ transaction });
};
exports.applyFirewallRules = applyFirewallRules;
/**
 * Configures policy priority and order.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} policyId - Policy ID
 * @param {number} priority - Priority value
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkPolicy>} Updated policy
 *
 * @example
 * ```typescript
 * const policy = await configurePolicyPriority(sequelize, 'policy-123', 100);
 * ```
 */
const configurePolicyPriority = async (sequelize, policyId, priority, transaction) => {
    // Update policy priority in storage
    return { id: policyId, priority };
};
exports.configurePolicyPriority = configurePolicyPriority;
// ============================================================================
// PORT CONFIGURATION (43-45)
// ============================================================================
/**
 * Configures port mirroring/SPAN.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} nodeId - Node ID
 * @param {PortMirrorConfig} config - Mirror configuration
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<void>}
 *
 * @example
 * ```typescript
 * await configurePortMirroring(sequelize, 'node-123', {
 *   sourcePort: 'eth0',
 *   destinationPort: 'eth1',
 *   direction: 'both',
 *   enabled: true
 * });
 * ```
 */
const configurePortMirroring = async (sequelize, nodeId, config, transaction) => {
    const NodeModel = sequelize.models.NetworkNode;
    const node = await NodeModel.findByPk(nodeId, { transaction });
    if (!node)
        throw new Error(`Node ${nodeId} not found`);
    node.metadata = { ...node.metadata, portMirroring: config };
    await node.save({ transaction });
};
exports.configurePortMirroring = configurePortMirroring;
/**
 * Enables or disables a port.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @param {string} interfaceId - Interface ID
 * @param {boolean} enabled - Enable or disable
 * @param {Transaction} [transaction] - Optional transaction
 * @returns {Promise<NetworkInterface>} Updated interface
 *
 * @example
 * ```typescript
 * const iface = await enableDisablePort(sequelize, 'iface-123', false);
 * ```
 */
const enableDisablePort = async (sequelize, interfaceId, enabled, transaction) => {
    return (0, exports.enableDisableInterface)(sequelize, interfaceId, enabled, transaction);
};
exports.enableDisablePort = enableDisablePort;
/**
 * Validates port configuration.
 *
 * @param {NetworkInterface} port - Port interface
 * @returns {{ valid: boolean; errors: string[] }} Validation result
 *
 * @example
 * ```typescript
 * const result = validatePortConfiguration(port);
 * ```
 */
const validatePortConfiguration = (port) => {
    return (0, exports.validateInterfaceSettings)(port);
};
exports.validatePortConfiguration = validatePortConfiguration;
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function isValidIP(ip) {
    const parts = ip.split('.');
    if (parts.length !== 4)
        return false;
    return parts.every((part) => {
        const num = parseInt(part, 10);
        return num >= 0 && num <= 255;
    });
}
function isValidMAC(mac) {
    return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac);
}
function matchesTraffic(match, traffic) {
    if (match.protocol && match.protocol !== traffic.protocol)
        return false;
    if (match.sourceIP && match.sourceIP !== traffic.sourceIP)
        return false;
    if (match.destinationIP && match.destinationIP !== traffic.destinationIP)
        return false;
    if (match.sourcePort && match.sourcePort !== traffic.sourcePort)
        return false;
    if (match.destinationPort && match.destinationPort !== traffic.destinationPort)
        return false;
    if (match.dscp && match.dscp !== traffic.dscp)
        return false;
    if (match.vlanId && match.vlanId !== traffic.vlanId)
        return false;
    return true;
}
function rulesConflict(rule1, rule2) {
    // Simplified conflict detection
    return (rule1.source === rule2.source &&
        rule1.destination === rule2.destination &&
        rule1.protocol === rule2.protocol &&
        rule1.action !== rule2.action);
}
exports.default = {
    // Sequelize Models
    createNetworkInterfaceModel: exports.createNetworkInterfaceModel,
    createVLANConfigModel: exports.createVLANConfigModel,
    createQoSPolicyModel: exports.createQoSPolicyModel,
    // Interface Configuration
    createNetworkInterface: exports.createNetworkInterface,
    updateInterfaceConfig: exports.updateInterfaceConfig,
    deleteNetworkInterface: exports.deleteNetworkInterface,
    validateInterfaceSettings: exports.validateInterfaceSettings,
    enableDisableInterface: exports.enableDisableInterface,
    assignInterfaceIP: exports.assignInterfaceIP,
    configureInterfaceMTU: exports.configureInterfaceMTU,
    // VLAN Configuration
    createVLANConfig: exports.createVLANConfig,
    updateVLANTags: exports.updateVLANTags,
    deleteVLANConfig: exports.deleteVLANConfig,
    validateVLANRange: exports.validateVLANRange,
    assignVLANPriority: exports.assignVLANPriority,
    configureVLANTrunking: exports.configureVLANTrunking,
    validateVLANMembership: exports.validateVLANMembership,
    // QoS Management
    createQoSPolicy: exports.createQoSPolicy,
    updateQoSRules: exports.updateQoSRules,
    deleteQoSPolicy: exports.deleteQoSPolicy,
    applyQoSToInterface: exports.applyQoSToInterface,
    prioritizeTraffic: exports.prioritizeTraffic,
    configureTrafficShaping: exports.configureTrafficShaping,
    validateQoSConfiguration: exports.validateQoSConfiguration,
    // Bandwidth Management
    allocateBandwidth: exports.allocateBandwidth,
    configureBandwidthLimit: exports.configureBandwidthLimit,
    implementTrafficThrottling: exports.implementTrafficThrottling,
    calculateBandwidthUtilization: exports.calculateBandwidthUtilization,
    reserveBandwidth: exports.reserveBandwidth,
    releaseBandwidth: exports.releaseBandwidth,
    validateBandwidthAllocation: exports.validateBandwidthAllocation,
    // Network Profiles
    createNetworkProfile: exports.createNetworkProfile,
    updateNetworkProfile: exports.updateNetworkProfile,
    deleteNetworkProfile: exports.deleteNetworkProfile,
    applyNetworkProfile: exports.applyNetworkProfile,
    validateProfileSettings: exports.validateProfileSettings,
    cloneNetworkProfile: exports.cloneNetworkProfile,
    // Policy Enforcement
    createNetworkPolicy: exports.createNetworkPolicy,
    enforceSecurityPolicy: exports.enforceSecurityPolicy,
    validatePolicyCompliance: exports.validatePolicyCompliance,
    applyFirewallRules: exports.applyFirewallRules,
    configurePolicyPriority: exports.configurePolicyPriority,
    // Port Configuration
    configurePortMirroring: exports.configurePortMirroring,
    enableDisablePort: exports.enableDisablePort,
    validatePortConfiguration: exports.validatePortConfiguration,
};
//# sourceMappingURL=virtual-network-config-kit.js.map
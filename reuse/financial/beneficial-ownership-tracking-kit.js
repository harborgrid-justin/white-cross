"use strict";
/**
 * LOC: BO-TRACK-001
 * File: /reuse/financial/beneficial-ownership-tracking-kit.ts
 *
 * UPSTREAM (imports from):
 *   - sequelize (Model, DataTypes, Transaction, Op)
 *   - @nestjs/common (Injectable)
 *
 * DOWNSTREAM (imported by):
 *   - backend/compliance/beneficial-ownership-service.ts
 *   - backend/aml/ubo-verification.service.ts
 *   - backend/compliance/ownership-disclosure.service.ts
 *   - backend/controllers/beneficial-owner.controller.ts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifyBeneficialOwners = identifyBeneficialOwners;
exports.registerBeneficialOwner = registerBeneficialOwner;
exports.updateBeneficialOwner = updateBeneficialOwner;
exports.verifyBeneficialOwnerIdentity = verifyBeneficialOwnerIdentity;
exports.calculateUBOProbability = calculateUBOProbability;
exports.mapOwnershipStructure = mapOwnershipStructure;
exports.buildOwnershipHierarchy = buildOwnershipHierarchy;
exports.traceOwnershipPath = traceOwnershipPath;
exports.getDirectOwners = getDirectOwners;
exports.getIndirectOwners = getIndirectOwners;
exports.determineControlPerson = determineControlPerson;
exports.analyzeControlMechanisms = analyzeControlMechanisms;
exports.verifyControlAuthority = verifyControlAuthority;
exports.identifyControllingOwners = identifyControllingOwners;
exports.analyzeLayeredOwnership = analyzeLayeredOwnership;
exports.calculateUltimateOwners = calculateUltimateOwners;
exports.detectCircularOwnership = detectCircularOwnership;
exports.analyzeOwnershipRisk = analyzeOwnershipRisk;
exports.detectNomineeShareholders = detectNomineeShareholders;
exports.verifyNomineeStatus = verifyNomineeStatus;
exports.identifyBeneficialOwnerBehindNominee = identifyBeneficialOwnerBehindNominee;
exports.trackTrustBeneficiaries = trackTrustBeneficiaries;
exports.analyzeTrustControl = analyzeTrustControl;
exports.analyzeDiscretionaryTrustElements = analyzeDiscretionaryTrustElements;
exports.calculateTrustBeneficialOwnership = calculateTrustBeneficialOwnership;
exports.analyzeCorporateVeil = analyzeCorporateVeil;
exports.identifyVeilPenetrationRisk = identifyVeilPenetrationRisk;
exports.validateCorporateStructureIntegrity = validateCorporateStructureIntegrity;
exports.identifyUBOs = identifyUBOs;
exports.verifyUBOIdentity = verifyUBOIdentity;
exports.generateUBOReport = generateUBOReport;
exports.validateOwnershipChain = validateOwnershipChain;
exports.reconcileOwnershipSources = reconcileOwnershipSources;
exports.documentOwnershipChangeHistory = documentOwnershipChangeHistory;
exports.calculateTotalOwnershipPercentage = calculateTotalOwnershipPercentage;
exports.calculateFullyDilutedOwnership = calculateFullyDilutedOwnership;
exports.analyzeVotingRights = analyzeVotingRights;
exports.detectDifferentialVoting = detectDifferentialVoting;
exports.detectControlChanges = detectControlChanges;
exports.monitorThresholdBreaches = monitorThresholdBreaches;
exports.calculateTransparencyScore = calculateTransparencyScore;
exports.generateTransparencyImprovementPlan = generateTransparencyImprovementPlan;
exports.analyzeShellCompanyIndicators = analyzeShellCompanyIndicators;
exports.matchShellCompanyPatterns = matchShellCompanyPatterns;
exports.analyzeComplexStructure = analyzeComplexStructure;
exports.generateSimplificationRecommendations = generateSimplificationRecommendations;
// ============================================================================
// BENEFICIAL OWNER IDENTIFICATION FUNCTIONS (5)
// ============================================================================
/**
 * Identifies and validates beneficial owners for an entity
 * @param entityId - The entity identifier
 * @param ownershipRecords - Array of ownership records
 * @returns Array of identified beneficial owners
 */
function identifyBeneficialOwners(entityId, ownershipRecords) {
    if (!entityId || !Array.isArray(ownershipRecords)) {
        throw new Error('Invalid entityId or ownershipRecords');
    }
    const beneficialOwners = [];
    const significanceThreshold = 0.05; // 5% ownership
    for (const record of ownershipRecords) {
        if (record.ownershipPercentage >= significanceThreshold ||
            record.hasControlRights) {
            const owner = {
                ownerId: record.ownerId || `BO-${entityId}-${Date.now()}`,
                entityId,
                ownerName: record.ownerName,
                ownerType: record.ownerType || 'individual',
                ownershipPercentage: record.ownershipPercentage,
                votingRightsPercentage: record.votingRightsPercentage || record.ownershipPercentage,
                controlRights: record.controlRights || record.ownershipPercentage,
                isUBO: record.ownershipPercentage > 0.25 || record.hasControlRights,
                uboProbability: calculateUBOProbability(record),
                disclosureDate: new Date(),
                verificationStatus: 'pending',
            };
            beneficialOwners.push(owner);
        }
    }
    return beneficialOwners.sort((a, b) => b.ownershipPercentage - a.ownershipPercentage);
}
/**
 * Registers a new beneficial owner
 * @param ownerData - Beneficial owner data
 * @returns Registered beneficial owner with ID
 */
function registerBeneficialOwner(ownerData) {
    if (!ownerData.entityId || !ownerData.ownerName) {
        throw new Error('Missing required fields: entityId and ownerName');
    }
    const owner = {
        ownerId: ownerData.ownerId || `BO-${Date.now()}`,
        entityId: ownerData.entityId,
        ownerName: ownerData.ownerName,
        ownerType: ownerData.ownerType || 'individual',
        nationalId: ownerData.nationalId,
        taxId: ownerData.taxId,
        ownershipPercentage: ownerData.ownershipPercentage || 0,
        votingRightsPercentage: ownerData.votingRightsPercentage || ownerData.ownershipPercentage || 0,
        controlRights: ownerData.controlRights || ownerData.ownershipPercentage || 0,
        isUBO: ownerData.isUBO || false,
        uboProbability: ownerData.uboProbability || 0,
        disclosureDate: new Date(),
        verificationStatus: 'unverified',
        metadata: ownerData.metadata || {},
    };
    return owner;
}
/**
 * Updates beneficial owner information
 * @param ownerId - Beneficial owner ID
 * @param updates - Partial updates to apply
 * @returns Updated beneficial owner
 */
function updateBeneficialOwner(ownerId, updates) {
    if (!ownerId) {
        throw new Error('ownerId is required');
    }
    // In production, would fetch from database
    const owner = {
        ownerId,
        entityId: updates.entityId || '',
        ownerName: updates.ownerName || '',
        ownerType: updates.ownerType || 'individual',
        ownershipPercentage: updates.ownershipPercentage ?? 0,
        votingRightsPercentage: updates.votingRightsPercentage ?? 0,
        controlRights: updates.controlRights ?? 0,
        isUBO: updates.isUBO ?? false,
        uboProbability: updates.uboProbability ?? 0,
        disclosureDate: updates.disclosureDate || new Date(),
        verificationStatus: updates.verificationStatus || 'pending',
        verificationDate: updates.verificationDate,
        metadata: updates.metadata || {},
    };
    return owner;
}
/**
 * Verifies beneficial owner identity and documentation
 * @param ownerId - Beneficial owner ID
 * @param verificationData - Verification documents and information
 * @returns Verification result
 */
function verifyBeneficialOwnerIdentity(ownerId, verificationData) {
    if (!ownerId || !verificationData) {
        throw new Error('ownerId and verificationData are required');
    }
    const issues = [];
    let scoreComponents = 0;
    let scoreSum = 0;
    // Check document authenticity
    if (verificationData.documentAuthentic) {
        scoreSum += 40;
        scoreComponents++;
    }
    else {
        issues.push('Document authenticity could not be verified');
    }
    // Check identity match
    if (verificationData.identityMatch >= 0.95) {
        scoreSum += 30;
        scoreComponents++;
    }
    else if (verificationData.identityMatch < 0.7) {
        issues.push('Identity match below acceptable threshold');
    }
    // Check sanctions/PEP status
    if (!verificationData.onSanctionsList && !verificationData.isPEP) {
        scoreSum += 20;
        scoreComponents++;
    }
    else {
        issues.push('Owner appears on sanctions list or is PEP');
    }
    // Check address verification
    if (verificationData.addressVerified) {
        scoreSum += 10;
        scoreComponents++;
    }
    const score = scoreComponents > 0 ? scoreSum / scoreComponents : 0;
    const verified = score >= 70 && issues.length === 0;
    return {
        verified,
        status: verified ? 'verified' : 'failed',
        score,
        issues: issues.length > 0 ? issues : undefined,
    };
}
/**
 * Calculates UBO probability based on ownership characteristics
 * @param ownershipRecord - Ownership record data
 * @returns Probability score (0-1)
 */
function calculateUBOProbability(ownershipRecord) {
    let probability = 0;
    // Ownership percentage factor
    if (ownershipRecord.ownershipPercentage > 0.25) {
        probability += 0.4;
    }
    else if (ownershipRecord.ownershipPercentage > 0.1) {
        probability += 0.25;
    }
    else if (ownershipRecord.ownershipPercentage > 0.05) {
        probability += 0.15;
    }
    // Control rights factor
    if (ownershipRecord.hasControlRights) {
        probability += 0.35;
    }
    // Board position factor
    if (ownershipRecord.boardMember) {
        probability += 0.15;
    }
    // Decision-making authority
    if (ownershipRecord.decisionMakingAuthority) {
        probability += 0.1;
    }
    return Math.min(probability, 1);
}
// ============================================================================
// OWNERSHIP STRUCTURE MAPPING FUNCTIONS (5)
// ============================================================================
/**
 * Maps ownership structure from flat records into hierarchical nodes
 * @param entityId - Primary entity ID
 * @param ownershipRecords - Flat list of ownership records
 * @returns OwnershipStructure with nodes and edges
 */
function mapOwnershipStructure(entityId, ownershipRecords) {
    if (!entityId || !Array.isArray(ownershipRecords)) {
        throw new Error('Invalid entityId or ownershipRecords');
    }
    const nodes = [];
    const edges = [];
    const nodeMap = new Map();
    // Create root node
    const rootNode = {
        entityId,
        entityName: ownershipRecords[0]?.entityName || entityId,
        entityType: 'corporate',
        ownershipPercentage: 100,
        depth: 0,
    };
    nodeMap.set(entityId, rootNode);
    nodes.push(rootNode);
    // Process ownership records
    for (const record of ownershipRecords) {
        if (!nodeMap.has(record.ownerId)) {
            const ownerNode = {
                entityId: record.ownerId,
                entityName: record.ownerName,
                entityType: record.ownerType || 'individual',
                ownershipPercentage: record.ownershipPercentage,
                depth: 1,
                isNominee: record.isNominee || false,
                isTrust: record.ownerType === 'trust',
                jurisdictionOfIncorporation: record.jurisdiction,
            };
            nodeMap.set(record.ownerId, ownerNode);
            nodes.push(ownerNode);
        }
        edges.push({
            from: entityId,
            to: record.ownerId,
            percentage: record.ownershipPercentage,
        });
    }
    // Build parent-child relationships
    for (const node of nodes) {
        const childEdges = edges.filter((e) => e.from === node.entityId);
        if (childEdges.length > 0) {
            node.children = childEdges.map((e) => e.to);
        }
        const parentEdges = edges.filter((e) => e.to === node.entityId);
        if (parentEdges.length > 0) {
            node.parent = parentEdges[0].from;
        }
    }
    const depth = calculateStructureDepth(nodes);
    const complexityScore = calculateComplexityScore(nodes, edges);
    return {
        entityId,
        nodes,
        edges,
        depth,
        isComplex: complexityScore > 0.6,
        complexityScore,
    };
}
/**
 * Builds ownership hierarchy tree structure
 * @param ownershipStructure - Base ownership structure
 * @returns Tree representation suitable for traversal
 */
function buildOwnershipHierarchy(ownershipStructure) {
    const hierarchy = new Map();
    // Group nodes by depth level
    const nodesByDepth = new Map();
    for (const node of ownershipStructure.nodes) {
        const depth = node.depth || 0;
        if (!nodesByDepth.has(depth)) {
            nodesByDepth.set(depth, []);
        }
        nodesByDepth.get(depth).push(node);
    }
    // Convert to map
    for (const [depth, nodes] of nodesByDepth) {
        hierarchy.set(`level_${depth}`, nodes);
    }
    return hierarchy;
}
/**
 * Traces ownership path from entity to owner
 * @param entityId - Starting entity ID
 * @param ownerId - Target owner ID
 * @param structure - Ownership structure
 * @returns Path array showing ownership chain
 */
function traceOwnershipPath(entityId, ownerId, structure) {
    const path = [];
    const visited = new Set();
    function traverse(currentId) {
        if (visited.has(currentId)) {
            return false;
        }
        visited.add(currentId);
        if (currentId === ownerId) {
            return true;
        }
        const node = structure.nodes.find((n) => n.entityId === currentId);
        if (!node || !node.children) {
            return false;
        }
        for (const childId of node.children) {
            const edge = structure.edges.find((e) => e.from === currentId && e.to === childId);
            if (traverse(childId)) {
                path.unshift({ entityId: currentId, percentage: edge?.percentage || 0 });
                return true;
            }
        }
        return false;
    }
    traverse(entityId);
    return path;
}
/**
 * Identifies all direct owners of an entity
 * @param entityId - Entity to find owners for
 * @param structure - Ownership structure
 * @returns Array of direct owners
 */
function getDirectOwners(entityId, structure) {
    const node = structure.nodes.find((n) => n.entityId === entityId);
    if (!node || !node.children) {
        return [];
    }
    return structure.nodes.filter((n) => node.children?.includes(n.entityId)) || [];
}
/**
 * Retrieves all indirect owners through specified layers
 * @param entityId - Entity to analyze
 * @param structure - Ownership structure
 * @param maxLayers - Maximum layers to traverse
 * @returns Map of owners by depth
 */
function getIndirectOwners(entityId, structure, maxLayers = 5) {
    const indirectOwners = new Map();
    const visited = new Set();
    function traverse(currentId, depth) {
        if (depth > maxLayers || visited.has(currentId)) {
            return;
        }
        visited.add(currentId);
        const node = structure.nodes.find((n) => n.entityId === currentId);
        if (!node || !node.children) {
            return;
        }
        const childNodes = structure.nodes.filter((n) => node.children?.includes(n.entityId)) || [];
        if (childNodes.length > 0) {
            indirectOwners.set(depth, childNodes);
        }
        for (const child of childNodes) {
            traverse(child.entityId, depth + 1);
        }
    }
    traverse(entityId, 1);
    return indirectOwners;
}
// ============================================================================
// CONTROL PERSON DETERMINATION FUNCTIONS (4)
// ============================================================================
/**
 * Determines the control person(s) of an entity
 * @param entityId - Entity to analyze
 * @param ownershipData - Ownership and control data
 * @returns ControlAnalysis result
 */
function determineControlPerson(entityId, ownershipData) {
    if (!entityId || !ownershipData) {
        throw new Error('entityId and ownershipData are required');
    }
    let controlPersonId = '';
    let controlPersonName = '';
    let controlMechanism = 'majority_ownership';
    let controlPercentage = 0;
    let controlChainLength = 0;
    // Check for majority ownership
    if (ownershipData.majorityOwner) {
        controlPersonId = ownershipData.majorityOwner.ownerId;
        controlPersonName = ownershipData.majorityOwner.ownerName;
        controlPercentage = ownershipData.majorityOwner.ownershipPercentage;
        controlMechanism = 'majority_ownership';
        controlChainLength = 1;
    }
    // Check for voting agreement
    if (ownershipData.votingAgreement) {
        controlMechanism = 'voting_agreement';
        controlChainLength = Math.max(controlChainLength, 2);
    }
    // Check for board control
    if (ownershipData.boardControl) {
        controlMechanism = ownershipData.boardControl.threshold > 0.5 ? 'board_position' : 'combination';
        controlChainLength = Math.max(controlChainLength, 1);
    }
    // Check for contractual control
    if (ownershipData.contractualControl) {
        controlMechanism = 'contractual';
        controlChainLength = Math.max(controlChainLength, 2);
    }
    return {
        entityId,
        controlPersonId: controlPersonId || 'unknown',
        controlPersonName: controlPersonName || 'Unknown',
        controlMechanism,
        controlPercentage,
        directControl: controlChainLength === 1,
        indirectControl: controlChainLength > 1,
        controlChainLength,
        certaintyLevel: calculateControlCertainty(ownershipData),
        verificationDate: new Date(),
    };
}
/**
 * Analyzes multiple control mechanisms
 * @param entityId - Entity to analyze
 * @param controlMechanisms - Array of control mechanisms
 * @returns Array of control analyses ranked by strength
 */
function analyzeControlMechanisms(entityId, controlMechanisms) {
    const analyses = [];
    for (const mechanism of controlMechanisms) {
        const analysis = {
            entityId,
            controlPersonId: mechanism.controlPersonId || 'unknown',
            controlPersonName: mechanism.controlPersonName || 'Unknown',
            controlMechanism: mechanism.type || 'majority_ownership',
            controlPercentage: mechanism.percentage || 0,
            directControl: mechanism.isDirect || false,
            indirectControl: mechanism.isIndirect || false,
            controlChainLength: mechanism.chainLength || 0,
            certaintyLevel: mechanism.certaintyLevel || 0,
            verificationDate: new Date(),
            notes: mechanism.notes,
        };
        analyses.push(analysis);
    }
    // Rank by certainty level
    return analyses.sort((a, b) => b.certaintyLevel - a.certaintyLevel);
}
/**
 * Verifies control person authority and rights
 * @param controlPersonId - Control person ID
 * @param entityId - Controlled entity ID
 * @param authorityDocuments - Supporting documentation
 * @returns Authority verification result
 */
function verifyControlAuthority(controlPersonId, entityId, authorityDocuments) {
    const authority = [];
    let validationScore = 0;
    // Check board minutes
    const boardMinutes = authorityDocuments.find((doc) => doc.type === 'board_minutes');
    if (boardMinutes && boardMinutes.verified) {
        authority.push('board_resolution');
        validationScore += 25;
    }
    // Check shareholder agreements
    const shareholderAgreement = authorityDocuments.find((doc) => doc.type === 'shareholder_agreement');
    if (shareholderAgreement && shareholderAgreement.verified) {
        authority.push('shareholder_agreement');
        validationScore += 25;
    }
    // Check articles of association
    const articles = authorityDocuments.find((doc) => doc.type === 'articles_of_association');
    if (articles && articles.verified) {
        authority.push('articles_of_association');
        validationScore += 20;
    }
    // Check voting records
    const votingRecords = authorityDocuments.find((doc) => doc.type === 'voting_records');
    if (votingRecords && votingRecords.verified) {
        authority.push('voting_records');
        validationScore += 15;
    }
    // Check management decisions
    const managementDecisions = authorityDocuments.find((doc) => doc.type === 'management_decisions');
    if (managementDecisions && managementDecisions.verified) {
        authority.push('management_decisions');
        validationScore += 15;
    }
    return {
        isAuthorized: validationScore >= 50,
        authority,
        validationScore: Math.min(validationScore, 100),
    };
}
/**
 * Identifies beneficial owners with significant control
 * @param entityId - Entity to analyze
 * @param ownershipRecords - Ownership records
 * @param controlThreshold - Threshold percentage (default 25%)
 * @returns Array of controlling beneficial owners
 */
function identifyControllingOwners(entityId, ownershipRecords, controlThreshold = 25) {
    const controllingOwners = [];
    for (const record of ownershipRecords) {
        if (record.ownershipPercentage >= controlThreshold || record.hasDecisionMakingControl) {
            const owner = registerBeneficialOwner({
                entityId,
                ownerId: record.ownerId,
                ownerName: record.ownerName,
                ownerType: record.ownerType,
                ownershipPercentage: record.ownershipPercentage,
                votingRightsPercentage: record.votingRightsPercentage,
                controlRights: record.controlRights,
                isUBO: true,
            });
            controllingOwners.push(owner);
        }
    }
    return controllingOwners.sort((a, b) => b.ownershipPercentage - a.ownershipPercentage);
}
// ============================================================================
// LAYERED OWNERSHIP ANALYSIS FUNCTIONS (5)
// ============================================================================
/**
 * Performs multi-layer ownership analysis
 * @param entityId - Entity to analyze
 * @param ownershipStructure - Complete ownership structure
 * @returns LayeredOwnershipAnalysis result
 */
function analyzeLayeredOwnership(entityId, ownershipStructure) {
    const layer1 = new Map();
    const layer2 = new Map();
    const layer3 = new Map();
    const layer4Plus = new Map();
    const cumulativeOwnership = new Map();
    const visited = new Set();
    function processLayer(currentEntityId, depth, ownership) {
        if (depth === 0) {
            return;
        }
        const currentNode = ownershipStructure.nodes.find((n) => n.entityId === currentEntityId);
        if (!currentNode || !currentNode.children) {
            return;
        }
        for (const childId of currentNode.children) {
            const edge = ownershipStructure.edges.find((e) => e.from === currentEntityId && e.to === childId);
            const childOwnership = (edge?.percentage || 0) * ownership;
            if (depth === 1) {
                layer1.set(childId, (layer1.get(childId) || 0) + childOwnership);
            }
            else if (depth === 2) {
                layer2.set(childId, (layer2.get(childId) || 0) + childOwnership);
            }
            else if (depth === 3) {
                layer3.set(childId, (layer3.get(childId) || 0) + childOwnership);
            }
            else if (depth >= 4) {
                layer4Plus.set(childId, (layer4Plus.get(childId) || 0) + childOwnership);
            }
            // Accumulate cumulative ownership
            cumulativeOwnership.set(childId, (cumulativeOwnership.get(childId) || 0) + childOwnership);
            processLayer(childId, depth - 1, childOwnership);
        }
    }
    processLayer(entityId, 10, 1);
    // Detect complexity indicators
    const complexityIndicators = [];
    if (layer4Plus.size > 0) {
        complexityIndicators.push('deep_ownership_layers');
    }
    if ((ownershipStructure.nodes.length || 0) > 10) {
        complexityIndicators.push('many_intermediate_entities');
    }
    if (ownershipStructure.edges.some((e) => e.percentage < 100)) {
        complexityIndicators.push('fractional_ownership');
    }
    return {
        entityId,
        analysisId: `LOA-${Date.now()}`,
        layer1,
        layer2,
        layer3,
        layer4Plus,
        cumulativeOwnership,
        analysisDate: new Date(),
        complexityIndicators,
    };
}
/**
 * Calculates ultimate owners by accumulating ownership through layers
 * @param entityId - Entity to analyze
 * @param analysis - Layered ownership analysis
 * @param ownershipThreshold - Minimum ownership percentage (default 5%)
 * @returns Map of ultimate owners with accumulated percentages
 */
function calculateUltimateOwners(entityId, analysis, ownershipThreshold = 0.05) {
    const ultimateOwners = new Map();
    // Combine all layers
    const allOwners = new Map([
        ...analysis.layer1,
        ...analysis.layer2,
        ...analysis.layer3,
        ...analysis.layer4Plus,
    ]);
    // Filter by threshold
    for (const [ownerId, percentage] of allOwners) {
        const accumulated = analysis.cumulativeOwnership.get(ownerId) || 0;
        if (accumulated >= ownershipThreshold) {
            ultimateOwners.set(ownerId, accumulated);
        }
    }
    return ultimateOwners;
}
/**
 * Detects circular ownership patterns
 * @param ownershipStructure - Complete ownership structure
 * @returns Array of circular ownership paths if detected
 */
function detectCircularOwnership(ownershipStructure) {
    const cycles = [];
    const visited = new Set();
    const recursionStack = new Set();
    function dfs(nodeId, path) {
        visited.add(nodeId);
        recursionStack.add(nodeId);
        path.push(nodeId);
        const node = ownershipStructure.nodes.find((n) => n.entityId === nodeId);
        if (node && node.children) {
            for (const childId of node.children) {
                if (!visited.has(childId)) {
                    dfs(childId, [...path]);
                }
                else if (recursionStack.has(childId)) {
                    // Cycle detected
                    const cycleStart = path.indexOf(childId);
                    if (cycleStart !== -1) {
                        cycles.push(path.slice(cycleStart));
                    }
                }
            }
        }
        recursionStack.delete(nodeId);
    }
    for (const node of ownershipStructure.nodes) {
        if (!visited.has(node.entityId)) {
            dfs(node.entityId, []);
        }
    }
    return cycles;
}
/**
 * Analyzes ownership risk based on structure complexity
 * @param analysis - Layered ownership analysis
 * @param structure - Ownership structure
 * @returns Risk assessment with recommendations
 */
function analyzeOwnershipRisk(analysis, structure) {
    const riskFactors = [];
    const recommendations = [];
    let riskScore = 0;
    // Deep layers indicate higher risk
    if (analysis.layer4Plus.size > 0) {
        riskFactors.push('Very deep ownership structure');
        riskScore += 3;
        recommendations.push('Conduct enhanced UBO tracing analysis');
    }
    // Many entities indicate complexity risk
    if ((structure.nodes.length || 0) > 20) {
        riskFactors.push('Large number of intermediate entities');
        riskScore += 2;
        recommendations.push('Simplify ownership structure if possible');
    }
    // Fractional ownership
    if (structure.edges.some((e) => e.percentage > 0 && e.percentage < 1)) {
        riskFactors.push('Complex fractional ownership');
        riskScore += 2;
        recommendations.push('Document rationale for fractional ownership');
    }
    // Nominees detection
    if (analysis.complexityIndicators.includes('nominee_shareholders')) {
        riskFactors.push('Potential nominee shareholders detected');
        riskScore += 3;
        recommendations.push('Verify beneficial ownership of nominee entities');
    }
    let riskLevel = 'low';
    if (riskScore >= 5) {
        riskLevel = 'high';
    }
    else if (riskScore >= 2) {
        riskLevel = 'medium';
    }
    return { riskLevel, riskFactors, recommendations };
}
// ============================================================================
// NOMINEE SHAREHOLDER DETECTION FUNCTIONS (3)
// ============================================================================
/**
 * Detects potential nominee shareholders
 * @param entityId - Entity to analyze
 * @param shareholders - Array of shareholder records
 * @returns Array of nominee detection results
 */
function detectNomineeShareholders(entityId, shareholders) {
    const detections = [];
    for (const shareholder of shareholders) {
        const indicators = [];
        let nomineeScore = 0;
        // Indicator: Recent acquisition with no prior relationship
        if (shareholder.recentAcquisition && !shareholder.priorRelationship) {
            indicators.push('recent_acquisition_no_prior_relationship');
            nomineeScore += 0.15;
        }
        // Indicator: Generic or company name (not personal name)
        if (shareholder.ownerName &&
            (shareholder.ownerName.includes('Corp') ||
                shareholder.ownerName.includes('Ltd') ||
                shareholder.ownerName.includes('Inc'))) {
            indicators.push('non_personal_ownership_entity');
            nomineeScore += 0.1;
        }
        // Indicator: Dormant or shell characteristics
        if (shareholder.dormantCompany ||
            !shareholder.activeOperations ||
            shareholder.minimalEmployees) {
            indicators.push('dormant_or_shell_characteristics');
            nomineeScore += 0.2;
        }
        // Indicator: Same jurisdiction as operating entity
        if (shareholder.jurisdictionOfIncorporation &&
            shareholder.operatingJurisdiction === shareholder.jurisdictionOfIncorporation) {
            indicators.push('same_jurisdiction_incorporation');
            nomineeScore += 0.05;
        }
        // Indicator: Nominee agreement exists
        if (shareholder.nomineeAgreement) {
            indicators.push('explicit_nominee_agreement');
            nomineeScore += 0.35;
        }
        // Indicator: Shares held in nominee name
        if (shareholder.sharesHeldInNomineeName) {
            indicators.push('shares_held_in_nominee_name');
            nomineeScore += 0.25;
        }
        // Indicator: Minimal dividend receipts
        if (shareholder.minimalDividends) {
            indicators.push('minimal_dividend_receipts');
            nomineeScore += 0.1;
        }
        // Indicator: No voting rights exercised
        if (shareholder.noVotingRightsExercised) {
            indicators.push('no_voting_rights_exercised');
            nomineeScore += 0.2;
        }
        const isLikelyNominee = nomineeScore >= 0.4;
        const confidenceLevel = Math.min(nomineeScore, 1);
        detections.push({
            entityId,
            shareholderId: shareholder.shareholderId,
            shareholderName: shareholder.ownerName,
            nomineeScore,
            suspiciousIndicators: indicators,
            isLikelyNominee,
            confidenceLevel,
            analysisDate: new Date(),
        });
    }
    return detections.sort((a, b) => b.nomineeScore - a.nomineeScore);
}
/**
 * Verifies nominee shareholder claims
 * @param shareholderId - Shareholder to verify
 * @param verificationDocuments - Supporting documents
 * @returns Verification result
 */
function verifyNomineeStatus(shareholderId, verificationDocuments) {
    const supportingEvidence = [];
    let verificationScore = 0;
    // Check for explicit nominee agreement
    const nomineeAgreement = verificationDocuments.find((doc) => doc.type === 'nominee_agreement');
    if (nomineeAgreement && nomineeAgreement.verified) {
        supportingEvidence.push('explicit_nominee_agreement_found');
        verificationScore += 40;
    }
    // Check for declaration
    const declaration = verificationDocuments.find((doc) => doc.type === 'nominee_declaration');
    if (declaration && declaration.verified) {
        supportingEvidence.push('nominee_declaration_on_record');
        verificationScore += 30;
    }
    // Check power of attorney
    const poa = verificationDocuments.find((doc) => doc.type === 'power_of_attorney');
    if (poa && poa.verified) {
        supportingEvidence.push('power_of_attorney_on_file');
        verificationScore += 20;
    }
    // Check beneficiary trust documentation
    const trustDocs = verificationDocuments.find((doc) => doc.type === 'trust_documentation');
    if (trustDocs && trustDocs.verified) {
        supportingEvidence.push('trust_documentation_verified');
        verificationScore += 10;
    }
    return {
        isNominee: verificationScore >= 50,
        supportingEvidence,
        verificationScore: Math.min(verificationScore, 100),
    };
}
/**
 * Identifies the true beneficial owner behind a nominee
 * @param nomineeId - Nominee shareholder ID
 * @param ownershipRecords - Related ownership records
 * @returns Identified beneficial owner information
 */
function identifyBeneficialOwnerBehindNominee(nomineeId, ownershipRecords) {
    // Find nominee record
    const nomineeRecord = ownershipRecords.find((r) => r.shareholderId === nomineeId);
    if (!nomineeRecord || !nomineeRecord.beneficialOwner) {
        return null;
    }
    const beneficialOwnerData = nomineeRecord.beneficialOwner;
    return registerBeneficialOwner({
        entityId: nomineeRecord.entityId,
        ownerId: beneficialOwnerData.ownerId,
        ownerName: beneficialOwnerData.ownerName,
        ownerType: beneficialOwnerData.ownerType,
        nationalId: beneficialOwnerData.nationalId,
        taxId: beneficialOwnerData.taxId,
        ownershipPercentage: nomineeRecord.ownershipPercentage,
        votingRightsPercentage: nomineeRecord.votingRightsPercentage,
        isUBO: true,
    });
}
// ============================================================================
// TRUST BENEFICIARY TRACKING FUNCTIONS (4)
// ============================================================================
/**
 * Tracks and identifies trust beneficiaries
 * @param trustId - Trust entity ID
 * @param trustDocuments - Trust documentation
 * @returns Array of identified beneficiaries
 */
function trackTrustBeneficiaries(trustId, trustDocuments) {
    const beneficiaries = [];
    // Parse trust deed
    const trustDeed = trustDocuments.find((doc) => doc.type === 'trust_deed');
    if (trustDeed && trustDeed.beneficiaries) {
        for (const ben of trustDeed.beneficiaries) {
            const beneficiary = {
                trustId,
                beneficiaryId: ben.beneficiaryId || `BEN-${Date.now()}`,
                beneficiaryName: ben.beneficiaryName,
                beneficiaryType: ben.beneficiaryType || 'individual',
                beneficiaryStatus: ben.status || 'current',
                interestPercentage: ben.interestPercentage || 0,
                controlRights: ben.controlRights || 0,
                districtOfTrustee: ben.trusteeJurisdiction,
                verificationDate: new Date(),
            };
            beneficiaries.push(beneficiary);
        }
    }
    // Parse supplemental documents
    const supplemental = trustDocuments.find((doc) => doc.type === 'supplemental_deed');
    if (supplemental && supplemental.modifications) {
        for (const mod of supplemental.modifications) {
            if (mod.type === 'add_beneficiary') {
                beneficiaries.push({
                    trustId,
                    beneficiaryId: mod.beneficiaryId || `BEN-${Date.now()}`,
                    beneficiaryName: mod.beneficiaryName,
                    beneficiaryType: mod.beneficiaryType || 'individual',
                    beneficiaryStatus: 'current',
                    interestPercentage: mod.interestPercentage || 0,
                    controlRights: mod.controlRights || 0,
                    verificationDate: new Date(),
                });
            }
        }
    }
    return beneficiaries;
}
/**
 * Analyzes trust control and beneficial interests
 * @param trustId - Trust entity ID
 * @param trustBeneficiaries - Array of beneficiaries
 * @returns Analysis of control and economic interests
 */
function analyzeTrustControl(trustId, trustBeneficiaries) {
    let trusteeControl = 0;
    let beneficiaryControl = 0;
    const economicInterest = new Map();
    for (const ben of trustBeneficiaries) {
        // Trustees typically have control rights even with low economic interest
        if (ben.beneficiaryType === 'corporate' && ben.beneficiaryName.includes('Trustee')) {
            trusteeControl = Math.max(trusteeControl, ben.controlRights);
        }
        else {
            beneficiaryControl += ben.controlRights;
            economicInterest.set(ben.beneficiaryId, ben.interestPercentage);
        }
    }
    const hasConflict = trusteeControl > 0 && beneficiaryControl > 0;
    return {
        trusteeControl,
        beneficiaryControl,
        economicInterest,
        hasConflict,
    };
}
/**
 * Identifies discretionary trust elements that affect beneficial ownership
 * @param trustDeed - Trust deed document
 * @returns Discretionary elements analysis
 */
function analyzeDiscretionaryTrustElements(trustDeed) {
    const distributions = [];
    const beneficiaryClass = [];
    const isDiscretionary = trustDeed.trustType === 'discretionary';
    if (trustDeed.distributionTerms) {
        if (trustDeed.distributionTerms.income) {
            distributions.push('income_discretionary');
        }
        if (trustDeed.distributionTerms.capital) {
            distributions.push('capital_discretionary');
        }
    }
    if (trustDeed.beneficiaryClass) {
        beneficiaryClass.push(...trustDeed.beneficiaryClass);
    }
    const trusteeDiscretion = isDiscretionary ? 0.8 : 0.2;
    const protectorRole = trustDeed.protectorRole || false;
    return {
        isDiscretionary,
        distributions,
        beneficiaryClass,
        trusteeDiscretion,
        protectorRole,
    };
}
/**
 * Calculates effective beneficial ownership through trust structures
 * @param trustId - Trust entity ID
 * @param trustBeneficiaries - Array of beneficiaries
 * @param trustBeneficiaryPercentage - Ownership percentage of trust
 * @returns Effective ownership calculation
 */
function calculateTrustBeneficialOwnership(trustId, trustBeneficiaries, trustBeneficiaryPercentage) {
    const effectiveOwnership = new Map();
    const currentBeneficiaries = trustBeneficiaries.filter((b) => b.beneficiaryStatus === 'current');
    const totalInterest = currentBeneficiaries.reduce((sum, b) => sum + b.interestPercentage, 0);
    for (const ben of currentBeneficiaries) {
        if (totalInterest > 0) {
            const effectivePercent = (ben.interestPercentage / totalInterest) * trustBeneficiaryPercentage;
            effectiveOwnership.set(ben.beneficiaryId, effectivePercent);
        }
    }
    return effectiveOwnership;
}
// ============================================================================
// CORPORATE VEIL PENETRATION FUNCTIONS (3)
// ============================================================================
/**
 * Analyzes corporate veil penetration risk
 * @param entityId - Entity to analyze
 * @param corporateRecords - Corporate structure records
 * @returns Corporate veil analysis result
 */
function analyzeCorporateVeil(entityId, corporateRecords) {
    const indicators = [];
    const penalizedOwners = [];
    let veilScore = 0;
    // Check for commingling of funds
    if (corporateRecords.comingling) {
        indicators.push('commingling_of_funds');
        veilScore += 0.15;
    }
    // Check for lack of corporate formalities
    if (!corporateRecords.boardMeetings || corporateRecords.boardMeetings.length === 0) {
        indicators.push('lack_board_meetings');
        veilScore += 0.15;
    }
    if (!corporateRecords.minutesRecords || corporateRecords.minutesRecords.length === 0) {
        indicators.push('lack_minutes_records');
        veilScore += 0.1;
    }
    // Check for inadequate capitalization
    if (corporateRecords.understaffed) {
        indicators.push('inadequate_capitalization');
        veilScore += 0.15;
    }
    // Check for parent control
    if (corporateRecords.parentCompanyControl) {
        indicators.push('parent_company_control');
        veilScore += 0.2;
        penalizedOwners.push(corporateRecords.parentCompanyId || 'unknown');
    }
    // Check for fraudulent transfer
    if (corporateRecords.hasUnexplainedTransfers) {
        indicators.push('unexplained_transfers');
        veilScore += 0.15;
    }
    // Check for inter-company guarantees
    if (corporateRecords.guarantees && corporateRecords.guarantees.length > 0) {
        indicators.push('inter_company_guarantees');
        veilScore += 0.1;
    }
    const hasVeilPenetrated = veilScore >= 0.4;
    const penetrationReasons = indicators.filter((ind) => ind === 'parent_company_control' ||
        ind === 'commingling_of_funds' ||
        ind === 'lack_board_meetings');
    const regulatoryRisks = hasVeilPenetrated
        ? ['personal_liability', 'joint_liability', 'successor_liability']
        : [];
    return {
        entityId,
        analysisId: `CV-${Date.now()}`,
        veilScore: Math.min(veilScore, 1),
        penalizedOwners,
        liabilityIndicators: indicators,
        hasVeilPenetrated,
        penetrationReasons,
        regulatoryRisks,
        analysisDate: new Date(),
    };
}
/**
 * Identifies entities at risk of veil penetration
 * @param structure - Ownership structure
 * @returns Array of at-risk entities with risk factors
 */
function identifyVeilPenetrationRisk(structure) {
    const atRiskEntities = [];
    for (const node of structure.nodes) {
        let riskScore = 0;
        const riskFactors = [];
        // Single shareholder (100% ownership)
        const singleOwner = structure.edges.filter((e) => e.to === node.entityId).length === 1;
        const singleOwnerPercentage = structure.edges.find((e) => e.to === node.entityId)?.percentage === 100;
        if (singleOwner && singleOwnerPercentage) {
            riskScore += 0.2;
            riskFactors.push('single_100_percent_shareholder');
        }
        // Foreign incorporation with domestic control
        if (node.jurisdictionOfIncorporation && node.entityType === 'corporate') {
            riskScore += 0.15;
            riskFactors.push('foreign_incorporation');
        }
        // Nominee shareholder
        if (node.isNominee) {
            riskScore += 0.25;
            riskFactors.push('nominee_shareholder');
        }
        if (riskScore > 0) {
            atRiskEntities.push({ entityId: node.entityId, riskScore, riskFactors });
        }
    }
    return atRiskEntities.sort((a, b) => b.riskScore - a.riskScore);
}
/**
 * Validates legitimate corporate structures against veil penetration
 * @param entityId - Entity to validate
 * @param structureDocumentation - Supporting documentation
 * @returns Validation result with recommendations
 */
function validateCorporateStructureIntegrity(entityId, structureDocumentation) {
    const issues = [];
    const recommendations = [];
    let legitimacyScore = 0;
    // Check articles of association
    const articles = structureDocumentation.find((doc) => doc.type === 'articles_of_association');
    if (articles && articles.verified) {
        legitimacyScore += 15;
    }
    else {
        issues.push('Articles of association not properly documented');
        recommendations.push('File and verify articles of association');
    }
    // Check board structure
    const boardStructure = structureDocumentation.find((doc) => doc.type === 'board_structure');
    if (boardStructure && boardStructure.independent_directors > 0) {
        legitimacyScore += 15;
    }
    else {
        issues.push('No independent board representation documented');
        recommendations.push('Establish independent board representation');
    }
    // Check meeting records
    const meetings = structureDocumentation.find((doc) => doc.type === 'board_meeting_records');
    if (meetings && meetings.records_count >= 4) {
        legitimacyScore += 15;
    }
    else {
        issues.push('Insufficient documented board meetings');
        recommendations.push('Maintain quarterly board meeting records');
    }
    // Check financial reporting
    const financialReports = structureDocumentation.find((doc) => doc.type === 'financial_reports');
    if (financialReports && financialReports.audited) {
        legitimacyScore += 15;
    }
    else {
        issues.push('No audited financial statements');
        recommendations.push('Provide audited financial statements');
    }
    // Check capital structure
    const capitalStructure = structureDocumentation.find((doc) => doc.type === 'capital_structure');
    if (capitalStructure && capitalStructure.adequately_capitalized) {
        legitimacyScore += 15;
    }
    else {
        issues.push('Questionable capitalization');
        recommendations.push('Maintain adequate capitalization levels');
    }
    // Check operational separation
    const operationalDocs = structureDocumentation.find((doc) => doc.type === 'operational_separation');
    if (operationalDocs && operationalDocs.separate_operations) {
        legitimacyScore += 15;
    }
    else {
        issues.push('Insufficient operational separation from parent');
        recommendations.push('Establish clear operational boundaries');
    }
    return {
        isLegitimate: legitimacyScore >= 60,
        issues,
        recommendations,
    };
}
// ============================================================================
// ULTIMATE BENEFICIAL OWNER (UBO) IDENTIFICATION FUNCTIONS (3)
// ============================================================================
/**
 * Identifies Ultimate Beneficial Owners
 * @param entityId - Entity to analyze
 * @param ownershipStructure - Complete ownership structure
 * @param ownershipThreshold - Minimum ownership threshold (default 25%)
 * @returns Identified UBOs
 */
function identifyUBOs(entityId, ownershipStructure, ownershipThreshold = 0.25) {
    const ubos = [];
    const visitedOwners = new Set();
    function traceUBO(currentNodeId, cumulativeOwnership, chainSoFar) {
        if (visitedOwners.has(currentNodeId)) {
            return; // Cycle detected
        }
        const currentNode = ownershipStructure.nodes.find((n) => n.entityId === currentNodeId);
        if (!currentNode) {
            return;
        }
        const edgesFromCurrent = ownershipStructure.edges.filter((e) => e.from === currentNodeId);
        // If no further edges (leaf node), this is an ultimate owner
        if (edgesFromCurrent.length === 0) {
            if (currentNode.entityType === 'individual' && cumulativeOwnership >= ownershipThreshold) {
                const ubo = {
                    entityId,
                    uboId: currentNodeId,
                    uboName: currentNode.entityName,
                    ubotype: 'individual',
                    ownershipChain: chainSoFar,
                    cumulativeOwnershipPercentage: cumulativeOwnership,
                    controlPercentage: cumulativeOwnership,
                    identificationMethod: 'ownership',
                    verificationStatus: 'pending',
                    riskRating: 'medium',
                    identificationDate: new Date(),
                    confidence: Math.min(cumulativeOwnership, 1),
                };
                ubos.push(ubo);
            }
            return;
        }
        // Continue tracing through child entities
        visitedOwners.add(currentNodeId);
        for (const edge of edgesFromCurrent) {
            const childNode = ownershipStructure.nodes.find((n) => n.entityId === edge.to);
            if (childNode) {
                const newOwnership = cumulativeOwnership * edge.percentage;
                const newChain = [
                    ...chainSoFar,
                    {
                        entityId: currentNodeId,
                        entityName: currentNode.entityName,
                        percentage: edge.percentage,
                    },
                ];
                traceUBO(edge.to, newOwnership, newChain);
            }
        }
        visitedOwners.delete(currentNodeId);
    }
    traceUBO(entityId, 1, []);
    return ubos.sort((a, b) => b.cumulativeOwnershipPercentage - a.cumulativeOwnershipPercentage);
}
/**
 * Verifies UBO identity and control
 * @param uboIdentification - UBO identification record
 * @param verificationDocuments - Supporting documents
 * @returns Verification result
 */
function verifyUBOIdentity(uboIdentification, verificationDocuments) {
    const issues = [];
    let verificationScore = 0;
    // Verify identity documents
    const idDocuments = verificationDocuments.filter((doc) => doc.type === 'identity_document');
    if (idDocuments.length > 0 && idDocuments.every((doc) => doc.verified)) {
        verificationScore += 30;
    }
    else {
        issues.push('Identity documents not verified');
    }
    // Verify ownership chain
    const ownershipDocs = verificationDocuments.filter((doc) => doc.type === 'ownership_certificate');
    if (ownershipDocs.length === uboIdentification.ownershipChain.length) {
        verificationScore += 35;
    }
    else {
        issues.push('Incomplete ownership chain documentation');
    }
    // Verify control mechanisms
    const controlDocs = verificationDocuments.filter((doc) => doc.type === 'control_documentation');
    if (controlDocs.length > 0 && controlDocs.some((doc) => doc.verified)) {
        verificationScore += 25;
    }
    else {
        issues.push('Control mechanisms not documented');
    }
    // Verify beneficial owner declaration
    const declarations = verificationDocuments.filter((doc) => doc.type === 'beneficial_owner_declaration');
    if (declarations.length > 0 && declarations[0].verified) {
        verificationScore += 10;
    }
    else {
        issues.push('No beneficial owner declaration');
    }
    let verificationStatus = 'pending';
    if (verificationScore >= 75) {
        verificationStatus = 'verified';
    }
    else if (verificationScore >= 40) {
        verificationStatus = 'partially_verified';
    }
    return {
        verified: verificationStatus === 'verified',
        verificationStatus,
        score: Math.min(verificationScore, 100),
        issues: issues.length > 0 ? issues : undefined,
    };
}
/**
 * Generates UBO report with findings and recommendations
 * @param ubos - Array of identified UBOs
 * @param riskAssessment - Risk assessment data
 * @returns UBO report
 */
function generateUBOReport(ubos, riskAssessment) {
    const recommendations = [];
    let riskLevel = 'low';
    if (ubos.length === 0) {
        recommendations.push('No UBOs identified - verify ownership structure');
    }
    else if (ubos.length > 3) {
        riskLevel = 'medium';
        recommendations.push('Multiple UBOs identified - ensure all are properly documented');
    }
    // Check for verification status
    const unverifiedUBOs = ubos.filter((u) => u.verificationStatus === 'pending');
    if (unverifiedUBOs.length > 0) {
        riskLevel = 'high';
        recommendations.push(`Complete verification for ${unverifiedUBOs.length} pending UBOs`);
    }
    // Check for high-risk ratings
    const highRiskUBOs = ubos.filter((u) => u.riskRating === 'high' || u.riskRating === 'critical');
    if (highRiskUBOs.length > 0) {
        riskLevel = 'high';
        recommendations.push(`Enhanced monitoring required for ${highRiskUBOs.length} high-risk UBOs`);
    }
    return {
        ubos,
        totalUBOs: ubos.length,
        reportDate: new Date(),
        riskLevel,
        recommendations,
    };
}
// ============================================================================
// OWNERSHIP CHAIN VALIDATION FUNCTIONS (3)
// ============================================================================
/**
 * Validates complete ownership chain integrity
 * @param entityId - Entity to validate
 * @param ownershipStructure - Ownership structure
 * @returns Validation result
 */
function validateOwnershipChain(entityId, ownershipStructure) {
    const inconsistencies = [];
    const missingDocumentation = [];
    const conflictingOwnership = [];
    let totalPercentageOwned = 0;
    let chainLength = 0;
    // Check each edge for documentation
    for (const edge of ownershipStructure.edges) {
        totalPercentageOwned += edge.percentage;
        // Check if both nodes exist
        const fromNode = ownershipStructure.nodes.find((n) => n.entityId === edge.from);
        const toNode = ownershipStructure.nodes.find((n) => n.entityId === edge.to);
        if (!fromNode || !toNode) {
            inconsistencies.push(`Missing node in edge: ${edge.from} -> ${edge.to}`);
        }
        // Check for unrealistic percentages
        if (edge.percentage > 100 || edge.percentage < 0) {
            conflictingOwnership.push(`Invalid percentage for edge: ${edge.from} -> ${edge.to}`);
        }
        chainLength++;
    }
    // Check total ownership doesn't exceed 100%
    if (totalPercentageOwned > 1.01) {
        // Allow small floating point variance
        inconsistencies.push(`Total ownership exceeds 100%: ${(totalPercentageOwned * 100).toFixed(2)}%`);
    }
    const reviewStatus = inconsistencies.length === 0 && conflictingOwnership.length === 0 ? 'passed' : 'failed';
    if (inconsistencies.length > 0 || missingDocumentation.length > 0) {
        reviewStatus === 'failed' ? 'needs_review' : 'needs_review';
    }
    return {
        entityId,
        validationId: `OCV-${Date.now()}`,
        chainLength,
        isValid: inconsistencies.length === 0 && conflictingOwnership.length === 0,
        inconsistencies,
        missingDocumentation,
        conflictingOwnership,
        totalPercentageOwned,
        validationDate: new Date(),
        reviewStatus: inconsistencies.length === 0 && conflictingOwnership.length === 0 ? 'passed' : 'failed',
    };
}
/**
 * Reconciles ownership data from multiple sources
 * @param entityId - Entity to reconcile
 * @param sourcesData - Ownership data from different sources
 * @returns Reconciliation result with discrepancies
 */
function reconcileOwnershipSources(entityId, sourcesData) {
    const discrepancies = [];
    const consensusOwners = [];
    const conflictingRecords = [];
    if (sourcesData.length === 0) {
        return {
            reconciled: false,
            discrepancies: ['No data sources provided'],
            consensusOwners: [],
            conflictingRecords: [],
        };
    }
    // Aggregate owner information
    const ownerMap = new Map();
    for (const source of sourcesData) {
        for (const owner of source.owners) {
            if (!ownerMap.has(owner.ownerId)) {
                ownerMap.set(owner.ownerId, []);
            }
            ownerMap.get(owner.ownerId).push({
                ...owner,
                source: source.source,
            });
        }
    }
    // Analyze consensus
    for (const [ownerId, records] of ownerMap) {
        const percentages = records.map((r) => r.ownershipPercentage);
        const variance = Math.max(...percentages) - Math.min(...percentages);
        if (variance > 0.05) {
            // 5% variance threshold
            discrepancies.push(`Ownership percentage variance for ${ownerId}: ${Math.min(...percentages)}-${Math.max(...percentages)}`);
            conflictingRecords.push(...records);
        }
        else if (records.length === sourcesData.length) {
            // Consensus across all sources
            const consensusRecord = records[0];
            consensusOwners.push(registerBeneficialOwner({
                entityId,
                ownerId: consensusRecord.ownerId,
                ownerName: consensusRecord.ownerName,
                ownerType: consensusRecord.ownerType,
                ownershipPercentage: consensusRecord.ownershipPercentage,
            }));
        }
    }
    return {
        reconciled: discrepancies.length === 0,
        discrepancies,
        consensusOwners,
        conflictingRecords,
    };
}
/**
 * Documents all ownership changes in chronological order
 * @param entityId - Entity to track
 * @param changeHistory - Historical change records
 * @returns Validated change history with audit trail
 */
function documentOwnershipChangeHistory(entityId, changeHistory) {
    const validHistory = [];
    const anomalies = [];
    const auditTrail = [];
    let previousControl = '';
    let previousDate = new Date(0);
    // Sort by date
    const sortedChanges = [...changeHistory].sort((a, b) => new Date(a.changeDate).getTime() - new Date(b.changeDate).getTime());
    for (const change of sortedChanges) {
        const changeDate = new Date(change.changeDate);
        // Detect anomalies
        if (changeDate < previousDate) {
            anomalies.push(`Chronological anomaly detected on ${changeDate}`);
        }
        if (change.previousControlPerson &&
            change.previousControlPerson !== previousControl &&
            previousControl !== '') {
            anomalies.push(`Control person inconsistency at ${changeDate}`);
        }
        // Detect rapid changes
        if (changeDate.getTime() - previousDate.getTime() < 30 * 24 * 60 * 60 * 1000) {
            // 30 days
            anomalies.push(`Rapid control change within 30 days of ${previousDate}`);
        }
        const controlChange = {
            entityId,
            changeId: `CC-${Date.now()}`,
            previousControlPerson: change.previousControlPerson || previousControl,
            newControlPerson: change.newControlPerson,
            changeType: change.changeType,
            changeDate,
            notificationDate: change.notificationDate,
            regulatoryNotified: change.regulatoryNotified || false,
            disclosureDate: change.disclosureDate,
            documentationComplete: change.documentationComplete || false,
        };
        validHistory.push(controlChange);
        previousControl = change.newControlPerson;
        previousDate = changeDate;
        auditTrail.push({
            date: changeDate,
            change: `${change.previousControlPerson || 'Unknown'} -> ${change.newControlPerson} (${change.changeType})`,
        });
    }
    return {
        validHistory,
        anomalies,
        auditTrail,
    };
}
// ============================================================================
// PERCENTAGE OWNERSHIP CALCULATION FUNCTIONS (2)
// ============================================================================
/**
 * Calculates total ownership percentage including all layers
 * @param entityId - Entity to analyze
 * @param ownershipStructure - Ownership structure
 * @param targetOwnerId - ID of owner to calculate percentage for
 * @returns Total ownership percentage
 */
function calculateTotalOwnershipPercentage(entityId, ownershipStructure, targetOwnerId) {
    let totalPercentage = 0;
    const visited = new Set();
    function traverse(currentId, currentPercentage) {
        if (visited.has(currentId)) {
            return;
        }
        visited.add(currentId);
        if (currentId === targetOwnerId) {
            totalPercentage += currentPercentage;
            return;
        }
        const node = ownershipStructure.nodes.find((n) => n.entityId === currentId);
        if (!node || !node.children) {
            return;
        }
        for (const childId of node.children) {
            const edge = ownershipStructure.edges.find((e) => e.from === currentId && e.to === childId);
            const childPercentage = (edge?.percentage || 0) * currentPercentage;
            traverse(childId, childPercentage);
        }
    }
    traverse(entityId, 1);
    return Math.min(totalPercentage, 1);
}
/**
 * Calculates diluted ownership accounting for options and warrants
 * @param entityId - Entity to analyze
 * @param baseOwnership - Base ownership percentage
 * @param dilutiveInstruments - Options, warrants, convertibles
 * @returns Fully diluted ownership percentage
 */
function calculateFullyDilutedOwnership(entityId, baseOwnership, dilutiveInstruments) {
    let totalDilutiveShares = 0;
    for (const instrument of dilutiveInstruments) {
        // Options in-the-money
        if (instrument.type === 'stock_options' && instrument.exercisePrice) {
            totalDilutiveShares += (instrument.quantity * instrument.exercisePrice) / instrument.currentPrice;
        }
        // Warrants
        if (instrument.type === 'warrant') {
            totalDilutiveShares += (instrument.quantity * instrument.exercisePrice) / instrument.currentPrice;
        }
        // Convertible securities
        if (instrument.type === 'convertible') {
            totalDilutiveShares += instrument.conversionQuantity;
        }
    }
    const fullyDilutedOwnership = baseOwnership / (1 + totalDilutiveShares);
    const dilutionImpact = baseOwnership - fullyDilutedOwnership;
    return {
        baseOwnership,
        fullyDilutedOwnership,
        dilutionImpact,
    };
}
// ============================================================================
// VOTING RIGHTS ANALYSIS FUNCTIONS (2)
// ============================================================================
/**
 * Analyzes voting rights structure and concentration
 * @param entityId - Entity to analyze
 * @param shareholders - Shareholder records with voting information
 * @returns Voting rights analysis
 */
function analyzeVotingRights(entityId, shareholders) {
    const shareholderVotes = [];
    let totalVotingRights = 0;
    let hasVotingAgreement = false;
    let votingAgreementTerms = '';
    for (const shareholder of shareholders) {
        const votingRights = shareholder.votingRightsPercentage || shareholder.ownershipPercentage || 0;
        shareholderVotes.push({
            shareholderId: shareholder.shareholderId,
            votingRights,
        });
        totalVotingRights += votingRights;
        if (shareholder.votingAgreement) {
            hasVotingAgreement = true;
            votingAgreementTerms += `${shareholder.shareholderId}: ${shareholder.votingAgreement}; `;
        }
    }
    const majorityThreshold = 50;
    const supermajorityRequired = shareholders.some((s) => s.supermajorityRequired);
    // Calculate voting power concentration (Herfindahl-Hirschman Index)
    let votingPowerConcentration = 0;
    for (const shareholder of shareholderVotes) {
        const share = shareholder.votingRights / totalVotingRights;
        votingPowerConcentration += share * share;
    }
    return {
        entityId,
        analysisId: `VRA-${Date.now()}`,
        shareholders: shareholderVotes,
        totalVotingRights,
        majorityThreshold,
        hasVotingAgreement,
        votingAgreementTerms: votingAgreementTerms || undefined,
        supermajorityRequired,
        votingPowerConcentration,
        analysisDate: new Date(),
    };
}
/**
 * Detects differential voting structures (different classes of shares)
 * @param entityId - Entity to analyze
 * @param shareClasses - Share class definitions
 * @returns Analysis of voting disparities
 */
function detectDifferentialVoting(entityId, shareClasses) {
    const classAnalysis = [];
    let maxVotingRights = 0;
    let minVotingRights = Infinity;
    for (const shareClass of shareClasses) {
        const votingRights = shareClass.votingRightsPerShare || 1;
        const economicRights = shareClass.economicRightsPerShare || 1;
        classAnalysis.push({
            class: shareClass.className,
            votingRights,
            economicRights,
        });
        maxVotingRights = Math.max(maxVotingRights, votingRights);
        minVotingRights = Math.min(minVotingRights, votingRights);
    }
    const votingDisparityRatio = minVotingRights > 0 ? maxVotingRights / minVotingRights : 1;
    const hasDifferentialVoting = votingDisparityRatio > 1.1;
    let riskLevel = 'low';
    if (votingDisparityRatio > 10) {
        riskLevel = 'high';
    }
    else if (votingDisparityRatio > 2) {
        riskLevel = 'medium';
    }
    return {
        hasDifferentialVoting,
        shareClasses: classAnalysis,
        votingDisparityRatio,
        riskLevel,
    };
}
// ============================================================================
// CONTROL CHANGE DETECTION FUNCTIONS (2)
// ============================================================================
/**
 * Detects and analyzes changes in control
 * @param entityId - Entity to monitor
 * @param historicalOwnership - Historical ownership records
 * @returns Detected control changes
 */
function detectControlChanges(entityId, historicalOwnership) {
    const changes = [];
    const sortedHistory = [...historicalOwnership].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    let previousController = '';
    for (let i = 0; i < sortedHistory.length; i++) {
        const currentRecord = sortedHistory[i];
        const currentController = currentRecord.primaryOwner;
        if (previousController && previousController !== currentController) {
            changes.push({
                entityId,
                changeId: `CC-${Date.now()}-${i}`,
                previousControlPerson: previousController,
                newControlPerson: currentController,
                changeType: classifyControlChange(sortedHistory[i - 1], currentRecord),
                changeDate: new Date(currentRecord.date),
                regulatoryNotified: currentRecord.regulatoryNotified || false,
                documentationComplete: currentRecord.documentationComplete || false,
            });
        }
        previousController = currentController;
    }
    return changes;
}
/**
 * Monitors for changes exceeding regulatory thresholds
 * @param entityId - Entity to monitor
 * @param currentOwnership - Current ownership structure
 * @param previousOwnership - Previous ownership structure
 * @param thresholds - Regulatory thresholds to monitor (default [5%, 10%, 25%, 50%])
 * @returns Threshold breaches and required notifications
 */
function monitorThresholdBreaches(entityId, currentOwnership, previousOwnership, thresholds = [0.05, 0.1, 0.25, 0.5]) {
    const breaches = [];
    for (const [ownerId, currentValue] of currentOwnership) {
        const previousValue = previousOwnership.get(ownerId) || 0;
        for (const threshold of thresholds) {
            // Upward breach
            if (previousValue < threshold && currentValue >= threshold) {
                breaches.push(`${ownerId} crossed ${(threshold * 100).toFixed(1)}% threshold (upward)`);
            }
            // Downward breach
            if (previousValue >= threshold && currentValue < threshold) {
                breaches.push(`${ownerId} fell below ${(threshold * 100).toFixed(1)}% threshold (downward)`);
            }
        }
    }
    const notificationRequired = breaches.length > 0;
    const disclosureDeadline = new Date();
    disclosureDeadline.setDate(disclosureDeadline.getDate() + 5); // Typically 5 trading days
    return {
        breaches,
        notificationRequired,
        disclosureDeadline,
    };
}
// ============================================================================
// OWNERSHIP TRANSPARENCY SCORING FUNCTIONS (2)
// ============================================================================
/**
 * Calculates ownership transparency score
 * @param entityId - Entity to score
 * @param ownershipData - Ownership disclosure data
 * @returns Transparency score and recommendations
 */
function calculateTransparencyScore(entityId, ownershipData) {
    let overallScore = 0;
    let ownershipDisclosureScore = 0;
    let documentationCompleteScore = 0;
    let beneficiaryIdentificationScore = 0;
    let controlIdentificationScore = 0;
    let uboVerificationScore = 0;
    const riskIndicators = [];
    const recommendations = [];
    // Ownership Disclosure Score (0-20)
    if (ownershipData.disclosuresComplete) {
        ownershipDisclosureScore = 20;
    }
    else if (ownershipData.disclosuresPartial) {
        ownershipDisclosureScore = 10;
        riskIndicators.push('incomplete_ownership_disclosure');
        recommendations.push('Complete all ownership disclosures');
    }
    else {
        riskIndicators.push('missing_ownership_disclosure');
        recommendations.push('File all required ownership disclosures');
    }
    // Documentation Completeness Score (0-20)
    const documentationCompleteness = ownershipData.documentationCompleteness || 0;
    documentationCompleteScore = documentationCompleteness * 20;
    if (documentationCompleteness < 0.8) {
        riskIndicators.push('incomplete_documentation');
        recommendations.push('Complete supporting documentation');
    }
    // Beneficial Beneficiary Identification Score (0-20)
    const beneficiaryCount = (ownershipData.identifiedBeneficiaries || []).length;
    if (beneficiaryCount >= ownershipData.expectedBeneficiaryCount) {
        beneficiaryIdentificationScore = 20;
    }
    else if (beneficiaryCount > 0) {
        beneficiaryIdentificationScore = 10;
        riskIndicators.push('incomplete_beneficiary_identification');
        recommendations.push('Identify all beneficial owners');
    }
    else {
        riskIndicators.push('no_beneficiary_identification');
        recommendations.push('Document all beneficial owners');
    }
    // Control Identification Score (0-20)
    if (ownershipData.controlPersonIdentified) {
        controlIdentificationScore = 20;
    }
    else if (ownershipData.controlMechanismDocumented) {
        controlIdentificationScore = 10;
        riskIndicators.push('control_person_not_clearly_identified');
        recommendations.push('Clearly identify control person');
    }
    else {
        riskIndicators.push('no_control_identification');
        recommendations.push('Document control mechanisms');
    }
    // UBO Verification Score (0-20)
    if (ownershipData.uboVerified) {
        uboVerificationScore = 20;
    }
    else if (ownershipData.uboIdentified) {
        uboVerificationScore = 10;
        riskIndicators.push('ubo_not_verified');
        recommendations.push('Complete UBO verification');
    }
    else {
        riskIndicators.push('ubo_not_identified');
        recommendations.push('Identify ultimate beneficial owner');
    }
    overallScore =
        ownershipDisclosureScore +
            documentationCompleteScore +
            beneficiaryIdentificationScore +
            controlIdentificationScore +
            uboVerificationScore;
    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + 365); // Annual review
    return {
        entityId,
        scoreId: `TS-${Date.now()}`,
        overallScore,
        ownershipDisclosureScore,
        documentationCompleteScore,
        beneficiaryIdentificationScore,
        controlIdentificationScore,
        uboVerificationScore,
        riskIndicators,
        recommendations,
        scoringDate: new Date(),
        nextReviewDate,
    };
}
/**
 * Generates transparency improvement plan
 * @param transparencyScore - Current transparency score
 * @returns Prioritized improvement recommendations
 */
function generateTransparencyImprovementPlan(transparencyScore) {
    const plan = [];
    const today = new Date();
    let actionIndex = 1;
    // Prioritize improvements with lowest scores
    if (transparencyScore.uboVerificationScore < 15) {
        const deadline = new Date(today);
        deadline.setDate(deadline.getDate() + 30);
        plan.push({
            priority: actionIndex++,
            action: 'Complete UBO identification and verification',
            targetDate: deadline,
            owner: 'Compliance Officer',
        });
    }
    if (transparencyScore.controlIdentificationScore < 15) {
        const deadline = new Date(today);
        deadline.setDate(deadline.getDate() + 20);
        plan.push({
            priority: actionIndex++,
            action: 'Document and verify control mechanisms',
            targetDate: deadline,
            owner: 'Legal Counsel',
        });
    }
    if (transparencyScore.beneficiaryIdentificationScore < 15) {
        const deadline = new Date(today);
        deadline.setDate(deadline.getDate() + 25);
        plan.push({
            priority: actionIndex++,
            action: 'Identify all beneficial owners',
            targetDate: deadline,
            owner: 'Company Secretary',
        });
    }
    if (transparencyScore.documentationCompleteScore < 15) {
        const deadline = new Date(today);
        deadline.setDate(deadline.getDate() + 40);
        plan.push({
            priority: actionIndex++,
            action: 'Compile and organize ownership documentation',
            targetDate: deadline,
            owner: 'Document Manager',
        });
    }
    if (transparencyScore.ownershipDisclosureScore < 15) {
        const deadline = new Date(today);
        deadline.setDate(deadline.getDate() + 15);
        plan.push({
            priority: actionIndex++,
            action: 'File all required ownership disclosures',
            targetDate: deadline,
            owner: 'Regulatory Compliance',
        });
    }
    // Calculate estimated completion date
    const estimatedCompletionDate = new Date(today);
    estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + 50);
    return {
        plan,
        estimatedCompletionDate,
        targetScore: 90,
    };
}
// ============================================================================
// SHELL COMPANY IDENTIFICATION FUNCTIONS (2)
// ============================================================================
/**
 * Analyzes entity characteristics to detect shell company indicators
 * @param entityId - Entity to analyze
 * @param entityData - Entity information and operations
 * @returns Shell company analysis result
 */
function analyzeShellCompanyIndicators(entityId, entityData) {
    const indicators = [];
    let shellScore = 0;
    // Check for significant assets
    const noSignificantAssets = (entityData.totalAssets === undefined || entityData.totalAssets < 100000) &&
        (entityData.realEstateOwnings === undefined || entityData.realEstateOwnings === 0);
    if (noSignificantAssets) {
        indicators.push('no_significant_assets');
        shellScore += 0.2;
    }
    // Check for active operations
    const noActiveOperations = entityData.revenue === undefined ||
        entityData.revenue === 0 ||
        (entityData.employees === undefined || entityData.employees === 0);
    if (noActiveOperations) {
        indicators.push('no_active_operations');
        shellScore += 0.25;
    }
    // Check for employees
    const miniminalEmployees = entityData.employees === undefined || entityData.employees < 2;
    if (miniminalEmployees) {
        indicators.push('minimal_employees');
        shellScore += 0.15;
    }
    // Check for complex ownership
    const obscuredBeneficialOwnership = entityData.ownershipStructureComplexity === 'high' ||
        entityData.unusualShareholderBase === true ||
        entityData.nomineePresence === true;
    if (obscuredBeneficialOwnership) {
        indicators.push('obscured_beneficial_ownership');
        shellScore += 0.2;
    }
    // Check for unusual structure
    const unusualOwnershipStructure = entityData.unusualShareClasses === true ||
        entityData.frequentOwnershipChanges === true ||
        entityData.offshoreOwners === true;
    if (unusualOwnershipStructure) {
        indicators.push('unusual_ownership_structure');
        shellScore += 0.15;
    }
    const isLikelyShell = shellScore >= 0.5;
    return {
        entityId,
        analysisId: `SC-${Date.now()}`,
        shellScore: Math.min(shellScore, 1),
        isLikelyShell,
        suspiciousFeatures: indicators,
        noSignificantAssets,
        noActiveOperations,
        miniminalEmployees,
        obscuredBeneficialOwnership,
        unusualOwnershipStructure,
        analysisDate: new Date(),
        recommendations: isLikelyShell ? ['Enhanced due diligence required', 'Verify ultimate beneficial owner'] : undefined,
    };
}
/**
 * Compares entity against known shell company patterns
 * @param entityData - Entity information
 * @param patternLibrary - Known shell company patterns
 * @returns Pattern match analysis
 */
function matchShellCompanyPatterns(entityData, patternLibrary) {
    const matchedPatterns = [];
    let totalMatches = 0;
    for (const pattern of patternLibrary) {
        let patternMatches = 0;
        const indicators = pattern.indicators || [];
        for (const indicator of indicators) {
            if (entityData[indicator.field] === indicator.value ||
                (indicator.operator === 'range' &&
                    entityData[indicator.field] >= indicator.min &&
                    entityData[indicator.field] <= indicator.max)) {
                patternMatches++;
            }
        }
        if (patternMatches >= indicators.length * 0.7) {
            // 70% match threshold
            matchedPatterns.push(pattern.name);
            totalMatches++;
        }
    }
    const matchScore = totalMatches / patternLibrary.length;
    let riskRating = 'low';
    if (matchScore > 0.7) {
        riskRating = 'critical';
    }
    else if (matchScore > 0.5) {
        riskRating = 'high';
    }
    else if (matchScore > 0.3) {
        riskRating = 'medium';
    }
    return {
        matchedPatterns,
        matchScore,
        riskRating,
    };
}
// ============================================================================
// COMPLEX STRUCTURE ANALYSIS FUNCTIONS (2)
// ============================================================================
/**
 * Analyzes complexity of ownership structure
 * @param ownershipStructure - Complete ownership structure
 * @returns Complex structure analysis
 */
function analyzeComplexStructure(ownershipStructure) {
    const totalNodes = ownershipStructure.nodes.length;
    const totalEdges = ownershipStructure.edges.length;
    const totalLayers = ownershipStructure.depth;
    // Detect cycles
    const cycles = detectCircularOwnership(ownershipStructure);
    const cycleDetected = cycles.length > 0;
    // Calculate chain lengths
    const chainLengths = [];
    for (const node of ownershipStructure.nodes) {
        let depth = 0;
        let current = node.entityId;
        while (current) {
            const parent = ownershipStructure.nodes.find((n) => n.entityId === current)?.parent;
            if (!parent) {
                break;
            }
            current = parent;
            depth++;
        }
        chainLengths.push(depth);
    }
    const averageChainLength = chainLengths.length > 0 ? chainLengths.reduce((a, b) => a + b) / chainLengths.length : 0;
    const maxChainLength = Math.max(...chainLengths, 0);
    // Identify jurisdictions
    const jurisdictions = new Set();
    for (const node of ownershipStructure.nodes) {
        if (node.jurisdictionOfIncorporation) {
            jurisdictions.add(node.jurisdictionOfIncorporation);
        }
    }
    // Count entity types
    let trusts = 0;
    let partnerships = 0;
    for (const node of ownershipStructure.nodes) {
        if (node.isTrust) {
            trusts++;
        }
        if (node.entityType === 'partnership') {
            partnerships++;
        }
    }
    // Determine complexity rating
    let complexityRating = 'simple';
    if (totalLayers >= 5 && totalNodes >= 15) {
        complexityRating = 'highly_complex';
    }
    else if (totalLayers >= 4 && totalNodes >= 10) {
        complexityRating = 'complex';
    }
    else if (totalLayers >= 3 || totalNodes >= 7) {
        complexityRating = 'moderate';
    }
    if (cycleDetected || jurisdictions.size > 3) {
        if (complexityRating === 'simple') {
            complexityRating = 'moderate';
        }
        else if (complexityRating === 'moderate') {
            complexityRating = 'complex';
        }
    }
    return {
        entityId: ownershipStructure.entityId,
        analysisId: `CSA-${Date.now()}`,
        totalLayers,
        totalNodes,
        totalEdges,
        cycleDetected,
        cyclePaths: cycleDetected ? cycles : undefined,
        averageChainLength,
        maxChainLength,
        jurisdictionalDiversity: Array.from(jurisdictions),
        trusts,
        partnerships,
        complexityRating,
        analysisDate: new Date(),
    };
}
/**
 * Generates recommendations for simplifying complex structures
 * @param analysis - Complex structure analysis
 * @returns Simplification recommendations
 */
function generateSimplificationRecommendations(analysis) {
    const recommendations = [];
    const potentialBenefits = [];
    let implementationComplexity = 'low';
    let estimatedTimeline = '3-6 months';
    if (analysis.totalLayers >= 5) {
        recommendations.push('Consider eliminating intermediate holding entities');
        potentialBenefits.push('Reduced administrative burden');
        implementationComplexity = 'high';
        estimatedTimeline = '12-18 months';
    }
    if (analysis.cycleDetected && analysis.cyclePaths) {
        recommendations.push('Restructure to eliminate circular ownership');
        potentialBenefits.push('Improved ownership clarity');
        potentialBenefits.push('Reduced regulatory risk');
        implementationComplexity = 'high';
    }
    if (analysis.jurisdictionalDiversity.length > 3) {
        recommendations.push('Consolidate holding entities into primary jurisdiction');
        potentialBenefits.push('Simplified tax compliance');
        potentialBenefits.push('Reduced regulatory compliance costs');
        implementationComplexity = 'medium';
    }
    if (analysis.trusts >= 2) {
        recommendations.push('Review trust consolidation opportunities');
        potentialBenefits.push('Clearer beneficial ownership');
        implementationComplexity = 'medium';
    }
    if (analysis.totalNodes >= 20) {
        recommendations.push('Merge related entities');
        potentialBenefits.push('Reduced maintenance costs');
        potentialBenefits.push('Easier UBO identification');
    }
    if (recommendations.length === 0) {
        recommendations.push('Structure is relatively straightforward');
    }
    return {
        recommendations,
        potentialBenefits,
        implementationComplexity,
        estimatedTimeline,
    };
}
// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function calculateStructureDepth(nodes) {
    const depths = nodes.map((n) => n.depth || 0);
    return Math.max(...depths, 0);
}
function calculateComplexityScore(nodes, edges) {
    let score = 0;
    // Nodes factor
    score += Math.min((nodes.length || 0) / 20, 0.3);
    // Edges factor
    score += Math.min((edges.length || 0) / 30, 0.3);
    // Depth factor
    const maxDepth = Math.max(...(nodes.map((n) => n.depth) || [0]));
    score += Math.min(maxDepth / 5, 0.4);
    return Math.min(score, 1);
}
function calculateControlCertainty(ownershipData) {
    let certainty = 0;
    if (ownershipData.majorityOwner) {
        certainty += 0.4;
    }
    if (ownershipData.boardControl) {
        certainty += 0.3;
    }
    if (ownershipData.votingAgreement) {
        certainty += 0.2;
    }
    if (ownershipData.documentation) {
        certainty += 0.1;
    }
    return Math.min(certainty, 1);
}
function classifyControlChange(previous, current) {
    if (current.transactionType === 'merger') {
        return 'merger';
    }
    else if (current.isAcquisition) {
        return 'acquisition';
    }
    else if (current.isRestructuring) {
        return 'restructuring';
    }
    return 'transfer';
}
exports.default = {
    // Beneficial Owner Identification
    identifyBeneficialOwners,
    registerBeneficialOwner,
    updateBeneficialOwner,
    verifyBeneficialOwnerIdentity,
    calculateUBOProbability,
    // Ownership Structure Mapping
    mapOwnershipStructure,
    buildOwnershipHierarchy,
    traceOwnershipPath,
    getDirectOwners,
    getIndirectOwners,
    // Control Person Determination
    determineControlPerson,
    analyzeControlMechanisms,
    verifyControlAuthority,
    identifyControllingOwners,
    // Layered Ownership Analysis
    analyzeLayeredOwnership,
    calculateUltimateOwners,
    detectCircularOwnership,
    analyzeOwnershipRisk,
    // Nominee Shareholder Detection
    detectNomineeShareholders,
    verifyNomineeStatus,
    identifyBeneficialOwnerBehindNominee,
    // Trust Beneficiary Tracking
    trackTrustBeneficiaries,
    analyzeTrustControl,
    analyzeDiscretionaryTrustElements,
    calculateTrustBeneficialOwnership,
    // Corporate Veil Penetration
    analyzeCorporateVeil,
    identifyVeilPenetrationRisk,
    validateCorporateStructureIntegrity,
    // Ultimate Beneficial Owner Identification
    identifyUBOs,
    verifyUBOIdentity,
    generateUBOReport,
    // Ownership Chain Validation
    validateOwnershipChain,
    reconcileOwnershipSources,
    documentOwnershipChangeHistory,
    // Percentage Ownership Calculation
    calculateTotalOwnershipPercentage,
    calculateFullyDilutedOwnership,
    // Voting Rights Analysis
    analyzeVotingRights,
    detectDifferentialVoting,
    // Control Change Detection
    detectControlChanges,
    monitorThresholdBreaches,
    // Ownership Transparency Scoring
    calculateTransparencyScore,
    generateTransparencyImprovementPlan,
    // Shell Company Identification
    analyzeShellCompanyIndicators,
    matchShellCompanyPatterns,
    // Complex Structure Analysis
    analyzeComplexStructure,
    generateSimplificationRecommendations,
};
//# sourceMappingURL=beneficial-ownership-tracking-kit.js.map
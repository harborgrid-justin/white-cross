/**
 * LOC: DOC-CHAIN-001
 * File: /reuse/document/document-blockchain-kit.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - sequelize (v6.x)
 *   - crypto (Node.js)
 *   - ethers (Ethereum integration)
 *   - web3 (Ethereum Web3)
 *   - ipfs-http-client (IPFS integration)
 *   - hyperledger-fabric-sdk-node (Hyperledger integration)
 *
 * DOWNSTREAM (imported by):
 *   - Blockchain verification controllers
 *   - Smart contract services
 *   - Document immutability modules
 *   - NFT minting services
 *   - Compliance and audit handlers
 */
/**
 * File: /reuse/document/document-blockchain-kit.ts
 * Locator: WC-UTL-BLOCKCHAIN-001
 * Purpose: Blockchain Document Verification Kit - Blockchain anchoring, smart contracts, immutable records, NFT minting, consensus, verification
 *
 * Upstream: @nestjs/common, sequelize, crypto, ethers, web3, ipfs-http-client, hyperledger-fabric-sdk-node
 * Downstream: Blockchain controllers, smart contract services, NFT modules, immutability handlers, verification services
 * Dependencies: NestJS 10.x, Sequelize 6.x, TypeScript 5.x, ethers 6.x, web3 4.x, ipfs-http-client 60.x, fabric-network 2.x
 * Exports: 40 utility functions for blockchain anchoring, smart contracts, verification, NFT minting, consensus, immutability proofs
 *
 * LLM Context: Production-grade blockchain verification utilities for White Cross healthcare platform.
 * Provides document anchoring to Ethereum/Hyperledger blockchains, IPFS distributed storage, smart contract
 * creation and management, NFT minting for document ownership, consensus mechanism integration, immutability
 * proofs, cryptographic verification, on-chain audit trails, and decentralized document verification.
 * Exceeds DocuSign capabilities with blockchain-backed immutability, smart contract automation, and
 * decentralized trust. Essential for tamper-proof medical records, legal document verification, and
 * HIPAA-compliant blockchain audit trails.
 */
import { Sequelize } from 'sequelize';
/**
 * Supported blockchain networks
 */
export type BlockchainNetwork = 'ethereum-mainnet' | 'ethereum-sepolia' | 'ethereum-goerli' | 'polygon' | 'polygon-mumbai' | 'hyperledger-fabric' | 'hyperledger-besu' | 'binance-smart-chain' | 'avalanche';
/**
 * Smart contract standards
 */
export type ContractStandard = 'ERC-721' | 'ERC-1155' | 'ERC-5192' | 'custom';
/**
 * Consensus algorithm types
 */
export type ConsensusAlgorithm = 'proof-of-work' | 'proof-of-stake' | 'proof-of-authority' | 'practical-byzantine-fault-tolerance' | 'raft';
/**
 * Hash algorithms for blockchain
 */
export type BlockchainHashAlgorithm = 'SHA-256' | 'SHA-512' | 'SHA3-256' | 'Keccak-256';
/**
 * Blockchain configuration
 */
export interface BlockchainConfig {
    network: BlockchainNetwork;
    nodeUrl: string;
    chainId?: number;
    privateKey?: string;
    contractAddress?: string;
    gasLimit?: number;
    gasPrice?: string;
    confirmations?: number;
    timeout?: number;
}
/**
 * IPFS configuration
 */
export interface IPFSConfig {
    host: string;
    port: number;
    protocol: 'http' | 'https';
    apiPath?: string;
    gateway?: string;
    pinningService?: string;
    timeout?: number;
}
/**
 * Hyperledger Fabric configuration
 */
export interface HyperledgerConfig {
    channelName: string;
    chaincodeName: string;
    connectionProfile: string;
    walletPath: string;
    userId: string;
    mspId: string;
    peers?: string[];
    orderers?: string[];
}
/**
 * Document hash record
 */
export interface DocumentHash {
    documentId: string;
    hash: string;
    algorithm: BlockchainHashAlgorithm;
    timestamp: Date;
    metadata?: Record<string, any>;
}
/**
 * Blockchain anchor record
 */
export interface BlockchainAnchor {
    documentId: string;
    blockchainTxHash: string;
    network: BlockchainNetwork;
    blockNumber: number;
    contractAddress?: string;
    anchorTimestamp: Date;
    documentHash: string;
    merkleRoot?: string;
    merkleProof?: string[];
    gasUsed?: string;
    confirmations: number;
}
/**
 * Smart contract deployment info
 */
export interface SmartContractDeployment {
    contractAddress: string;
    network: BlockchainNetwork;
    deploymentTxHash: string;
    deployer: string;
    blockNumber: number;
    abi: any[];
    bytecode: string;
    standard: ContractStandard;
    deployedAt: Date;
    verified?: boolean;
}
/**
 * Smart contract function call
 */
export interface ContractFunctionCall {
    contractAddress: string;
    functionName: string;
    parameters: any[];
    txHash?: string;
    gasLimit?: number;
    value?: string;
    from?: string;
}
/**
 * NFT metadata for document
 */
export interface DocumentNFTMetadata {
    name: string;
    description: string;
    documentType: string;
    documentHash: string;
    issuer: string;
    issuedAt: Date;
    properties?: Record<string, any>;
    image?: string;
    externalUrl?: string;
    attributes?: Array<{
        trait_type: string;
        value: string | number;
    }>;
}
/**
 * Minted NFT information
 */
export interface MintedNFT {
    tokenId: string;
    contractAddress: string;
    network: BlockchainNetwork;
    owner: string;
    mintTxHash: string;
    metadata: DocumentNFTMetadata;
    tokenUri: string;
    mintedAt: Date;
    transferable: boolean;
}
/**
 * Blockchain verification result
 */
export interface BlockchainVerification {
    valid: boolean;
    documentHash: string;
    blockchainTxHash: string;
    blockNumber: number;
    blockTimestamp: Date;
    confirmations: number;
    network: BlockchainNetwork;
    verified: boolean;
    tampered: boolean;
    errors?: string[];
    warnings?: string[];
}
/**
 * Immutability proof
 */
export interface ImmutabilityProof {
    documentHash: string;
    blockchainTxHash: string;
    blockNumber: number;
    blockTimestamp: Date;
    merkleRoot: string;
    merkleProof: string[];
    contractAddress?: string;
    proofType: 'merkle-tree' | 'direct-anchor' | 'batch-anchor';
    verifiable: boolean;
    chainOfCustody?: ChainOfCustodyEntry[];
}
/**
 * Chain of custody entry
 */
export interface ChainOfCustodyEntry {
    timestamp: Date;
    action: string;
    actor: string;
    txHash: string;
    blockNumber: number;
    previousHash: string;
    currentHash: string;
}
/**
 * Consensus validation result
 */
export interface ConsensusValidation {
    valid: boolean;
    consensusAlgorithm: ConsensusAlgorithm;
    validatorCount: number;
    approvalCount: number;
    threshold: number;
    validators: string[];
    timestamp: Date;
    finalityReached: boolean;
}
/**
 * Merkle tree node
 */
export interface MerkleNode {
    hash: string;
    left?: MerkleNode;
    right?: MerkleNode;
    isLeaf: boolean;
}
/**
 * Merkle tree structure
 */
export interface MerkleTree {
    root: string;
    leaves: string[];
    levels: number;
    nodes: MerkleNode[];
}
/**
 * IPFS storage result
 */
export interface IPFSStorageResult {
    cid: string;
    size: number;
    path: string;
    pinned: boolean;
    gateway_url: string;
    timestamp: Date;
}
/**
 * Blockchain transaction receipt
 */
export interface TransactionReceipt {
    txHash: string;
    blockNumber: number;
    blockHash: string;
    from: string;
    to?: string;
    contractAddress?: string;
    gasUsed: string;
    effectiveGasPrice?: string;
    status: boolean;
    confirmations: number;
    logs?: any[];
}
/**
 * Document ownership record
 */
export interface DocumentOwnership {
    documentId: string;
    owner: string;
    previousOwners: string[];
    tokenId?: string;
    contractAddress?: string;
    acquiredAt: Date;
    transferHistory: Array<{
        from: string;
        to: string;
        timestamp: Date;
        txHash: string;
    }>;
}
/**
 * Smart contract event
 */
export interface SmartContractEvent {
    eventName: string;
    contractAddress: string;
    txHash: string;
    blockNumber: number;
    timestamp: Date;
    parameters: Record<string, any>;
    topics: string[];
}
/**
 * Batch anchor result
 */
export interface BatchAnchorResult {
    merkleRoot: string;
    documentCount: number;
    txHash: string;
    blockNumber: number;
    network: BlockchainNetwork;
    gasUsed: string;
    documentsAnchored: Array<{
        documentId: string;
        hash: string;
        merkleProof: string[];
    }>;
}
/**
 * Blockchain record model attributes
 */
export interface BlockchainRecordAttributes {
    id: string;
    documentId: string;
    documentHash: string;
    hashAlgorithm: string;
    blockchainTxHash: string;
    network: string;
    blockNumber: number;
    blockTimestamp: Date;
    contractAddress?: string;
    merkleRoot?: string;
    merkleProof?: string[];
    gasUsed?: string;
    confirmations: number;
    verified: boolean;
    verifiedAt?: Date;
    ipfsCid?: string;
    metadata?: Record<string, any>;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Smart contract model attributes
 */
export interface SmartContractAttributes {
    id: string;
    name: string;
    description?: string;
    contractAddress: string;
    network: string;
    standard: string;
    abi: any[];
    bytecode?: string;
    deploymentTxHash: string;
    deployer: string;
    blockNumber: number;
    deployedAt: Date;
    verified: boolean;
    sourceCode?: string;
    compilerVersion?: string;
    optimizationEnabled?: boolean;
    isActive: boolean;
    pausedAt?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Blockchain audit log model attributes
 */
export interface BlockchainAuditAttributes {
    id: string;
    documentId?: string;
    contractId?: string;
    action: string;
    txHash: string;
    network: string;
    blockNumber: number;
    blockTimestamp: Date;
    performedBy: string;
    fromAddress?: string;
    toAddress?: string;
    value?: string;
    gasUsed?: string;
    status: string;
    eventData?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
}
/**
 * Creates BlockchainRecord model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<BlockchainRecordAttributes>>} BlockchainRecord model
 *
 * @example
 * ```typescript
 * const BlockchainModel = createBlockchainRecordModel(sequelize);
 * const record = await BlockchainModel.create({
 *   documentId: 'doc-uuid',
 *   documentHash: 'abc123...',
 *   blockchainTxHash: '0x123...',
 *   network: 'ethereum-mainnet',
 *   blockNumber: 12345678,
 *   createdBy: 'user-uuid'
 * });
 * ```
 */
export declare const createBlockchainRecordModel: (sequelize: Sequelize) => any;
/**
 * Creates SmartContract model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<SmartContractAttributes>>} SmartContract model
 *
 * @example
 * ```typescript
 * const ContractModel = createSmartContractModel(sequelize);
 * const contract = await ContractModel.create({
 *   name: 'DocumentVerification',
 *   contractAddress: '0x123...',
 *   network: 'ethereum-mainnet',
 *   standard: 'ERC-721',
 *   abi: [...],
 *   deploymentTxHash: '0xabc...',
 *   deployer: '0xdef...'
 * });
 * ```
 */
export declare const createSmartContractModel: (sequelize: Sequelize) => any;
/**
 * Creates BlockchainAudit model for Sequelize.
 *
 * @param {Sequelize} sequelize - Sequelize instance
 * @returns {ModelStatic<Model<BlockchainAuditAttributes>>} BlockchainAudit model
 *
 * @example
 * ```typescript
 * const AuditModel = createBlockchainAuditModel(sequelize);
 * const log = await AuditModel.create({
 *   documentId: 'doc-uuid',
 *   action: 'anchored',
 *   txHash: '0x123...',
 *   network: 'ethereum-mainnet',
 *   performedBy: 'user-uuid'
 * });
 * ```
 */
export declare const createBlockchainAuditModel: (sequelize: Sequelize) => any;
/**
 * 1. Anchors document hash to blockchain.
 *
 * @param {string} documentId - Document identifier
 * @param {Buffer} documentBuffer - Document content
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<BlockchainAnchor>} Anchor record
 *
 * @example
 * ```typescript
 * const anchor = await anchorDocumentToBlockchain('doc-123', documentBuffer, {
 *   network: 'ethereum-mainnet',
 *   nodeUrl: 'https://mainnet.infura.io/v3/YOUR-KEY',
 *   privateKey: '0x...',
 *   contractAddress: '0x123...'
 * });
 * console.log('Anchored at block:', anchor.blockNumber);
 * ```
 */
export declare const anchorDocumentToBlockchain: (documentId: string, documentBuffer: Buffer, config: BlockchainConfig) => Promise<BlockchainAnchor>;
/**
 * 2. Stores document content on IPFS.
 *
 * @param {Buffer} documentBuffer - Document content
 * @param {IPFSConfig} config - IPFS configuration
 * @returns {Promise<IPFSStorageResult>} IPFS storage result
 *
 * @example
 * ```typescript
 * const result = await storeDocumentOnIPFS(documentBuffer, {
 *   host: 'ipfs.infura.io',
 *   port: 5001,
 *   protocol: 'https'
 * });
 * console.log('IPFS CID:', result.cid);
 * console.log('Gateway URL:', result.gateway_url);
 * ```
 */
export declare const storeDocumentOnIPFS: (documentBuffer: Buffer, config: IPFSConfig) => Promise<IPFSStorageResult>;
/**
 * 3. Retrieves document from IPFS.
 *
 * @param {string} cid - IPFS content identifier
 * @param {IPFSConfig} config - IPFS configuration
 * @returns {Promise<Buffer>} Document content
 *
 * @example
 * ```typescript
 * const document = await retrieveDocumentFromIPFS('QmXxx...', ipfsConfig);
 * ```
 */
export declare const retrieveDocumentFromIPFS: (cid: string, config: IPFSConfig) => Promise<Buffer>;
/**
 * 4. Anchors multiple documents in batch (Merkle tree).
 *
 * @param {DocumentHash[]} documents - Array of documents to anchor
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<BatchAnchorResult>} Batch anchor result
 *
 * @example
 * ```typescript
 * const result = await batchAnchorDocuments([
 *   { documentId: 'doc-1', hash: 'abc...', algorithm: 'SHA-256', timestamp: new Date() },
 *   { documentId: 'doc-2', hash: 'def...', algorithm: 'SHA-256', timestamp: new Date() }
 * ], blockchainConfig);
 * console.log('Merkle root:', result.merkleRoot);
 * ```
 */
export declare const batchAnchorDocuments: (documents: DocumentHash[], config: BlockchainConfig) => Promise<BatchAnchorResult>;
/**
 * 5. Anchors document to Hyperledger Fabric.
 *
 * @param {string} documentId - Document identifier
 * @param {string} documentHash - Document hash
 * @param {HyperledgerConfig} config - Hyperledger configuration
 * @returns {Promise<{ txId: string; blockNumber: number; timestamp: Date }>} Transaction result
 *
 * @example
 * ```typescript
 * const result = await anchorToHyperledger('doc-123', 'abc123...', {
 *   channelName: 'medical-records',
 *   chaincodeName: 'document-verification',
 *   connectionProfile: './connection-profile.json',
 *   walletPath: './wallet',
 *   userId: 'admin',
 *   mspId: 'Org1MSP'
 * });
 * ```
 */
export declare const anchorToHyperledger: (documentId: string, documentHash: string, config: HyperledgerConfig) => Promise<{
    txId: string;
    blockNumber: number;
    timestamp: Date;
}>;
/**
 * 6. Gets blockchain transaction receipt.
 *
 * @param {string} txHash - Transaction hash
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<TransactionReceipt>} Transaction receipt
 *
 * @example
 * ```typescript
 * const receipt = await getTransactionReceipt('0x123...', blockchainConfig);
 * console.log('Block number:', receipt.blockNumber);
 * console.log('Status:', receipt.status ? 'success' : 'failed');
 * ```
 */
export declare const getTransactionReceipt: (txHash: string, config: BlockchainConfig) => Promise<TransactionReceipt>;
/**
 * 7. Waits for transaction confirmations.
 *
 * @param {string} txHash - Transaction hash
 * @param {number} requiredConfirmations - Required confirmations
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<TransactionReceipt>} Confirmed transaction receipt
 *
 * @example
 * ```typescript
 * const receipt = await waitForConfirmations('0x123...', 12, blockchainConfig);
 * console.log('Confirmed with', receipt.confirmations, 'confirmations');
 * ```
 */
export declare const waitForConfirmations: (txHash: string, requiredConfirmations: number, config: BlockchainConfig) => Promise<TransactionReceipt>;
/**
 * 8. Deploys document verification smart contract.
 *
 * @param {string} contractCode - Solidity contract code
 * @param {any[]} constructorArgs - Constructor arguments
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<SmartContractDeployment>} Deployment result
 *
 * @example
 * ```typescript
 * const deployment = await deployVerificationContract(contractCode, ['WhiteCross'], {
 *   network: 'ethereum-sepolia',
 *   nodeUrl: 'https://sepolia.infura.io/v3/YOUR-KEY',
 *   privateKey: '0x...'
 * });
 * console.log('Contract deployed at:', deployment.contractAddress);
 * ```
 */
export declare const deployVerificationContract: (contractCode: string, constructorArgs: any[], config: BlockchainConfig) => Promise<SmartContractDeployment>;
/**
 * 9. Deploys ERC-721 NFT contract for documents.
 *
 * @param {string} name - Token name
 * @param {string} symbol - Token symbol
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<SmartContractDeployment>} Deployment result
 *
 * @example
 * ```typescript
 * const deployment = await deployERC721Contract('WhiteCrossDocuments', 'WCD', blockchainConfig);
 * ```
 */
export declare const deployERC721Contract: (name: string, symbol: string, config: BlockchainConfig) => Promise<SmartContractDeployment>;
/**
 * 10. Calls smart contract function.
 *
 * @param {ContractFunctionCall} call - Function call parameters
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<TransactionReceipt>} Transaction receipt
 *
 * @example
 * ```typescript
 * const receipt = await callContractFunction({
 *   contractAddress: '0x123...',
 *   functionName: 'verifyDocument',
 *   parameters: ['0xabc...', 'QmXxx...']
 * }, blockchainConfig);
 * ```
 */
export declare const callContractFunction: (call: ContractFunctionCall, config: BlockchainConfig) => Promise<TransactionReceipt>;
/**
 * 11. Reads data from smart contract (view function).
 *
 * @param {string} contractAddress - Contract address
 * @param {string} functionName - Function name
 * @param {any[]} parameters - Function parameters
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<any>} Function result
 *
 * @example
 * ```typescript
 * const documentHash = await readContractData('0x123...', 'getDocumentHash', ['doc-123'], config);
 * ```
 */
export declare const readContractData: (contractAddress: string, functionName: string, parameters: any[], config: BlockchainConfig) => Promise<any>;
/**
 * 12. Creates access control smart contract.
 *
 * @param {string[]} authorizedAddresses - Authorized addresses
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<SmartContractDeployment>} Deployment result
 *
 * @example
 * ```typescript
 * const deployment = await createAccessControlContract(
 *   ['0x123...', '0xabc...'],
 *   blockchainConfig
 * );
 * ```
 */
export declare const createAccessControlContract: (authorizedAddresses: string[], config: BlockchainConfig) => Promise<SmartContractDeployment>;
/**
 * 13. Upgrades smart contract (proxy pattern).
 *
 * @param {string} proxyAddress - Proxy contract address
 * @param {string} newImplementation - New implementation address
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<TransactionReceipt>} Upgrade transaction receipt
 *
 * @example
 * ```typescript
 * const receipt = await upgradeContract('0x123...', '0xabc...', blockchainConfig);
 * ```
 */
export declare const upgradeContract: (proxyAddress: string, newImplementation: string, config: BlockchainConfig) => Promise<TransactionReceipt>;
/**
 * 14. Pauses smart contract operations.
 *
 * @param {string} contractAddress - Contract address
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<TransactionReceipt>} Transaction receipt
 *
 * @example
 * ```typescript
 * const receipt = await pauseContract('0x123...', blockchainConfig);
 * ```
 */
export declare const pauseContract: (contractAddress: string, config: BlockchainConfig) => Promise<TransactionReceipt>;
/**
 * 15. Verifies document against blockchain record.
 *
 * @param {Buffer} documentBuffer - Document to verify
 * @param {string} blockchainTxHash - Blockchain transaction hash
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<BlockchainVerification>} Verification result
 *
 * @example
 * ```typescript
 * const verification = await verifyDocumentOnBlockchain(
 *   documentBuffer,
 *   '0x123...',
 *   blockchainConfig
 * );
 * if (verification.valid && !verification.tampered) {
 *   console.log('Document is authentic and untampered');
 * }
 * ```
 */
export declare const verifyDocumentOnBlockchain: (documentBuffer: Buffer, blockchainTxHash: string, config: BlockchainConfig) => Promise<BlockchainVerification>;
/**
 * 16. Verifies Merkle proof for batched document.
 *
 * @param {string} documentHash - Document hash
 * @param {string[]} merkleProof - Merkle proof path
 * @param {string} merkleRoot - Merkle root on blockchain
 * @returns {Promise<boolean>} True if proof is valid
 *
 * @example
 * ```typescript
 * const isValid = await verifyMerkleProof(
 *   'abc123...',
 *   ['0xdef...', '0x456...'],
 *   '0x789...'
 * );
 * ```
 */
export declare const verifyMerkleProof: (documentHash: string, merkleProof: string[], merkleRoot: string) => Promise<boolean>;
/**
 * 17. Verifies document existence on IPFS.
 *
 * @param {string} cid - IPFS content identifier
 * @param {string} expectedHash - Expected document hash
 * @param {IPFSConfig} config - IPFS configuration
 * @returns {Promise<{ exists: boolean; hashMatches: boolean }>} Verification result
 *
 * @example
 * ```typescript
 * const result = await verifyIPFSDocument('QmXxx...', 'abc123...', ipfsConfig);
 * ```
 */
export declare const verifyIPFSDocument: (cid: string, expectedHash: string, config: IPFSConfig) => Promise<{
    exists: boolean;
    hashMatches: boolean;
}>;
/**
 * 18. Queries blockchain for document history.
 *
 * @param {string} documentId - Document identifier
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<ChainOfCustodyEntry[]>} Document history
 *
 * @example
 * ```typescript
 * const history = await queryDocumentHistory('doc-123', blockchainConfig);
 * history.forEach(entry => {
 *   console.log(`${entry.action} by ${entry.actor} at ${entry.timestamp}`);
 * });
 * ```
 */
export declare const queryDocumentHistory: (documentId: string, config: BlockchainConfig) => Promise<ChainOfCustodyEntry[]>;
/**
 * 19. Verifies smart contract event logs.
 *
 * @param {string} contractAddress - Contract address
 * @param {string} eventName - Event name
 * @param {number} fromBlock - Starting block number
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<SmartContractEvent[]>} Contract events
 *
 * @example
 * ```typescript
 * const events = await verifyContractEvents(
 *   '0x123...',
 *   'DocumentVerified',
 *   1000000,
 *   blockchainConfig
 * );
 * ```
 */
export declare const verifyContractEvents: (contractAddress: string, eventName: string, fromBlock: number, config: BlockchainConfig) => Promise<SmartContractEvent[]>;
/**
 * 20. Validates blockchain transaction integrity.
 *
 * @param {string} txHash - Transaction hash
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<{ valid: boolean; tampered: boolean; confirmations: number }>} Integrity check
 *
 * @example
 * ```typescript
 * const integrity = await validateTransactionIntegrity('0x123...', blockchainConfig);
 * ```
 */
export declare const validateTransactionIntegrity: (txHash: string, config: BlockchainConfig) => Promise<{
    valid: boolean;
    tampered: boolean;
    confirmations: number;
}>;
/**
 * 21. Verifies cross-chain document anchoring.
 *
 * @param {string} documentHash - Document hash
 * @param {BlockchainConfig[]} configs - Multiple blockchain configurations
 * @returns {Promise<Map<BlockchainNetwork, BlockchainVerification>>} Verification per chain
 *
 * @example
 * ```typescript
 * const verifications = await verifyCrossChain('abc123...', [ethereumConfig, polygonConfig]);
 * ```
 */
export declare const verifyCrossChain: (documentHash: string, configs: BlockchainConfig[]) => Promise<Map<BlockchainNetwork, BlockchainVerification>>;
/**
 * 22. Mints NFT for document ownership.
 *
 * @param {string} documentId - Document identifier
 * @param {string} owner - Owner address
 * @param {DocumentNFTMetadata} metadata - NFT metadata
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<MintedNFT>} Minted NFT information
 *
 * @example
 * ```typescript
 * const nft = await mintDocumentNFT('doc-123', '0xabc...', {
 *   name: 'Medical Consent Form',
 *   description: 'Patient consent for treatment',
 *   documentType: 'consent-form',
 *   documentHash: 'abc123...',
 *   issuer: 'WhiteCross Medical',
 *   issuedAt: new Date()
 * }, blockchainConfig);
 * console.log('NFT minted with token ID:', nft.tokenId);
 * ```
 */
export declare const mintDocumentNFT: (documentId: string, owner: string, metadata: DocumentNFTMetadata, config: BlockchainConfig) => Promise<MintedNFT>;
/**
 * 23. Mints soulbound token (non-transferable) for document.
 *
 * @param {string} documentId - Document identifier
 * @param {string} owner - Owner address
 * @param {DocumentNFTMetadata} metadata - NFT metadata
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<MintedNFT>} Minted soulbound token
 *
 * @example
 * ```typescript
 * const sbt = await mintSoulboundToken('doc-123', '0xabc...', metadata, config);
 * // This token cannot be transferred
 * ```
 */
export declare const mintSoulboundToken: (documentId: string, owner: string, metadata: DocumentNFTMetadata, config: BlockchainConfig) => Promise<MintedNFT>;
/**
 * 24. Transfers document NFT ownership.
 *
 * @param {string} tokenId - Token identifier
 * @param {string} from - Current owner address
 * @param {string} to - New owner address
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<TransactionReceipt>} Transfer transaction receipt
 *
 * @example
 * ```typescript
 * const receipt = await transferDocumentNFT('token-123', '0xabc...', '0xdef...', config);
 * ```
 */
export declare const transferDocumentNFT: (tokenId: string, from: string, to: string, config: BlockchainConfig) => Promise<TransactionReceipt>;
/**
 * 25. Burns document NFT (permanent revocation).
 *
 * @param {string} tokenId - Token identifier
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<TransactionReceipt>} Burn transaction receipt
 *
 * @example
 * ```typescript
 * const receipt = await burnDocumentNFT('token-123', blockchainConfig);
 * ```
 */
export declare const burnDocumentNFT: (tokenId: string, config: BlockchainConfig) => Promise<TransactionReceipt>;
/**
 * 26. Gets NFT ownership information.
 *
 * @param {string} tokenId - Token identifier
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<DocumentOwnership>} Ownership information
 *
 * @example
 * ```typescript
 * const ownership = await getNFTOwnership('token-123', blockchainConfig);
 * console.log('Current owner:', ownership.owner);
 * console.log('Transfer history:', ownership.transferHistory);
 * ```
 */
export declare const getNFTOwnership: (tokenId: string, config: BlockchainConfig) => Promise<DocumentOwnership>;
/**
 * 27. Updates NFT metadata URI.
 *
 * @param {string} tokenId - Token identifier
 * @param {string} newTokenUri - New metadata URI
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<TransactionReceipt>} Update transaction receipt
 *
 * @example
 * ```typescript
 * const receipt = await updateNFTMetadata('token-123', 'ipfs://QmNew...', config);
 * ```
 */
export declare const updateNFTMetadata: (tokenId: string, newTokenUri: string, config: BlockchainConfig) => Promise<TransactionReceipt>;
/**
 * 28. Validates transaction through consensus.
 *
 * @param {string} txHash - Transaction hash
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<ConsensusValidation>} Consensus validation result
 *
 * @example
 * ```typescript
 * const validation = await validateConsensus('0x123...', blockchainConfig);
 * if (validation.finalityReached) {
 *   console.log('Transaction is final');
 * }
 * ```
 */
export declare const validateConsensus: (txHash: string, config: BlockchainConfig) => Promise<ConsensusValidation>;
/**
 * 29. Gets validator nodes for consensus.
 *
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<string[]>} Validator addresses
 *
 * @example
 * ```typescript
 * const validators = await getConsensusValidators(blockchainConfig);
 * ```
 */
export declare const getConsensusValidators: (config: BlockchainConfig) => Promise<string[]>;
/**
 * 30. Checks finality of blockchain transaction.
 *
 * @param {string} txHash - Transaction hash
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<{ finalized: boolean; confirmations: number; timeToFinality?: number }>} Finality status
 *
 * @example
 * ```typescript
 * const finality = await checkTransactionFinality('0x123...', blockchainConfig);
 * ```
 */
export declare const checkTransactionFinality: (txHash: string, config: BlockchainConfig) => Promise<{
    finalized: boolean;
    confirmations: number;
    timeToFinality?: number;
}>;
/**
 * 31. Validates multi-signature transaction.
 *
 * @param {string} txHash - Transaction hash
 * @param {string[]} requiredSigners - Required signer addresses
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<{ valid: boolean; signerCount: number; signatures: string[] }>} Multi-sig validation
 *
 * @example
 * ```typescript
 * const validation = await validateMultiSigTransaction(
 *   '0x123...',
 *   ['0xabc...', '0xdef...'],
 *   blockchainConfig
 * );
 * ```
 */
export declare const validateMultiSigTransaction: (txHash: string, requiredSigners: string[], config: BlockchainConfig) => Promise<{
    valid: boolean;
    signerCount: number;
    signatures: string[];
}>;
/**
 * 32. Submits document for validator approval.
 *
 * @param {string} documentHash - Document hash
 * @param {string[]} validators - Validator addresses
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<{ submissionTxHash: string; approvalThreshold: number }>} Submission result
 *
 * @example
 * ```typescript
 * const result = await submitForValidatorApproval('abc123...', validators, config);
 * ```
 */
export declare const submitForValidatorApproval: (documentHash: string, validators: string[], config: BlockchainConfig) => Promise<{
    submissionTxHash: string;
    approvalThreshold: number;
}>;
/**
 * 33. Gets consensus participation rate.
 *
 * @param {number} fromBlock - Starting block
 * @param {number} toBlock - Ending block
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<{ rate: number; activeValidators: number; totalValidators: number }>} Participation stats
 *
 * @example
 * ```typescript
 * const stats = await getConsensusParticipation(1000000, 1001000, blockchainConfig);
 * ```
 */
export declare const getConsensusParticipation: (fromBlock: number, toBlock: number, config: BlockchainConfig) => Promise<{
    rate: number;
    activeValidators: number;
    totalValidators: number;
}>;
/**
 * 34. Generates immutability proof for document.
 *
 * @param {string} documentHash - Document hash
 * @param {BlockchainAnchor} anchor - Blockchain anchor record
 * @returns {Promise<ImmutabilityProof>} Immutability proof
 *
 * @example
 * ```typescript
 * const proof = await generateImmutabilityProof('abc123...', anchorRecord);
 * // Store proof for long-term verification
 * ```
 */
export declare const generateImmutabilityProof: (documentHash: string, anchor: BlockchainAnchor) => Promise<ImmutabilityProof>;
/**
 * 35. Verifies immutability proof.
 *
 * @param {ImmutabilityProof} proof - Immutability proof
 * @param {Buffer} documentBuffer - Document content
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<{ valid: boolean; tampered: boolean; timestamp: Date }>} Verification result
 *
 * @example
 * ```typescript
 * const result = await verifyImmutabilityProof(proof, documentBuffer, blockchainConfig);
 * if (result.valid && !result.tampered) {
 *   console.log('Document is immutable and untampered since', result.timestamp);
 * }
 * ```
 */
export declare const verifyImmutabilityProof: (proof: ImmutabilityProof, documentBuffer: Buffer, config: BlockchainConfig) => Promise<{
    valid: boolean;
    tampered: boolean;
    timestamp: Date;
}>;
/**
 * 36. Creates chain of custody record.
 *
 * @param {string} documentId - Document identifier
 * @param {string} action - Action performed
 * @param {string} actor - Actor address
 * @param {BlockchainConfig} config - Blockchain configuration
 * @returns {Promise<ChainOfCustodyEntry>} Chain of custody entry
 *
 * @example
 * ```typescript
 * const entry = await createChainOfCustodyRecord(
 *   'doc-123',
 *   'signed',
 *   '0xabc...',
 *   blockchainConfig
 * );
 * ```
 */
export declare const createChainOfCustodyRecord: (documentId: string, action: string, actor: string, config: BlockchainConfig) => Promise<ChainOfCustodyEntry>;
/**
 * 37. Builds Merkle tree for documents.
 *
 * @param {string[]} documentHashes - Array of document hashes
 * @returns {MerkleTree} Merkle tree structure
 *
 * @example
 * ```typescript
 * const tree = buildMerkleTree(['abc...', 'def...', 'ghi...']);
 * console.log('Merkle root:', tree.root);
 * ```
 */
export declare const buildMerkleTree: (documentHashes: string[]) => MerkleTree;
/**
 * 38. Gets Merkle proof for document.
 *
 * @param {MerkleTree} tree - Merkle tree
 * @param {number} leafIndex - Leaf index
 * @returns {string[]} Merkle proof path
 *
 * @example
 * ```typescript
 * const tree = buildMerkleTree(hashes);
 * const proof = getMerkleProof(tree, 2);
 * // Use proof to verify document inclusion
 * ```
 */
export declare const getMerkleProof: (tree: MerkleTree, leafIndex: number) => string[];
/**
 * 39. Generates tamper-evident seal.
 *
 * @param {Buffer} documentBuffer - Document content
 * @param {string} privateKey - Private key for signing
 * @param {BlockchainAnchor} anchor - Blockchain anchor
 * @returns {Promise<{ seal: string; signature: string; timestamp: Date }>} Tamper-evident seal
 *
 * @example
 * ```typescript
 * const seal = await generateTamperEvidentSeal(documentBuffer, privateKey, anchor);
 * // Seal contains cryptographic proof of document state at time of anchoring
 * ```
 */
export declare const generateTamperEvidentSeal: (documentBuffer: Buffer, privateKey: string, anchor: BlockchainAnchor) => Promise<{
    seal: string;
    signature: string;
    timestamp: Date;
}>;
/**
 * 40. Verifies tamper-evident seal.
 *
 * @param {string} seal - Tamper-evident seal
 * @param {string} signature - Seal signature
 * @param {string} publicKey - Public key for verification
 * @param {Buffer} documentBuffer - Current document content
 * @returns {Promise<{ valid: boolean; tampered: boolean; anchorTimestamp: Date }>} Verification result
 *
 * @example
 * ```typescript
 * const result = await verifyTamperEvidentSeal(seal, signature, publicKey, documentBuffer);
 * if (result.valid && !result.tampered) {
 *   console.log('Document sealed at:', result.anchorTimestamp);
 * }
 * ```
 */
export declare const verifyTamperEvidentSeal: (seal: string, signature: string, publicKey: string, documentBuffer: Buffer) => Promise<{
    valid: boolean;
    tampered: boolean;
    anchorTimestamp: Date;
}>;
declare const _default: {
    createBlockchainRecordModel: (sequelize: Sequelize) => any;
    createSmartContractModel: (sequelize: Sequelize) => any;
    createBlockchainAuditModel: (sequelize: Sequelize) => any;
    anchorDocumentToBlockchain: (documentId: string, documentBuffer: Buffer, config: BlockchainConfig) => Promise<BlockchainAnchor>;
    storeDocumentOnIPFS: (documentBuffer: Buffer, config: IPFSConfig) => Promise<IPFSStorageResult>;
    retrieveDocumentFromIPFS: (cid: string, config: IPFSConfig) => Promise<Buffer>;
    batchAnchorDocuments: (documents: DocumentHash[], config: BlockchainConfig) => Promise<BatchAnchorResult>;
    anchorToHyperledger: (documentId: string, documentHash: string, config: HyperledgerConfig) => Promise<{
        txId: string;
        blockNumber: number;
        timestamp: Date;
    }>;
    getTransactionReceipt: (txHash: string, config: BlockchainConfig) => Promise<TransactionReceipt>;
    waitForConfirmations: (txHash: string, requiredConfirmations: number, config: BlockchainConfig) => Promise<TransactionReceipt>;
    deployVerificationContract: (contractCode: string, constructorArgs: any[], config: BlockchainConfig) => Promise<SmartContractDeployment>;
    deployERC721Contract: (name: string, symbol: string, config: BlockchainConfig) => Promise<SmartContractDeployment>;
    callContractFunction: (call: ContractFunctionCall, config: BlockchainConfig) => Promise<TransactionReceipt>;
    readContractData: (contractAddress: string, functionName: string, parameters: any[], config: BlockchainConfig) => Promise<any>;
    createAccessControlContract: (authorizedAddresses: string[], config: BlockchainConfig) => Promise<SmartContractDeployment>;
    upgradeContract: (proxyAddress: string, newImplementation: string, config: BlockchainConfig) => Promise<TransactionReceipt>;
    pauseContract: (contractAddress: string, config: BlockchainConfig) => Promise<TransactionReceipt>;
    verifyDocumentOnBlockchain: (documentBuffer: Buffer, blockchainTxHash: string, config: BlockchainConfig) => Promise<BlockchainVerification>;
    verifyMerkleProof: (documentHash: string, merkleProof: string[], merkleRoot: string) => Promise<boolean>;
    verifyIPFSDocument: (cid: string, expectedHash: string, config: IPFSConfig) => Promise<{
        exists: boolean;
        hashMatches: boolean;
    }>;
    queryDocumentHistory: (documentId: string, config: BlockchainConfig) => Promise<ChainOfCustodyEntry[]>;
    verifyContractEvents: (contractAddress: string, eventName: string, fromBlock: number, config: BlockchainConfig) => Promise<SmartContractEvent[]>;
    validateTransactionIntegrity: (txHash: string, config: BlockchainConfig) => Promise<{
        valid: boolean;
        tampered: boolean;
        confirmations: number;
    }>;
    verifyCrossChain: (documentHash: string, configs: BlockchainConfig[]) => Promise<Map<BlockchainNetwork, BlockchainVerification>>;
    mintDocumentNFT: (documentId: string, owner: string, metadata: DocumentNFTMetadata, config: BlockchainConfig) => Promise<MintedNFT>;
    mintSoulboundToken: (documentId: string, owner: string, metadata: DocumentNFTMetadata, config: BlockchainConfig) => Promise<MintedNFT>;
    transferDocumentNFT: (tokenId: string, from: string, to: string, config: BlockchainConfig) => Promise<TransactionReceipt>;
    burnDocumentNFT: (tokenId: string, config: BlockchainConfig) => Promise<TransactionReceipt>;
    getNFTOwnership: (tokenId: string, config: BlockchainConfig) => Promise<DocumentOwnership>;
    updateNFTMetadata: (tokenId: string, newTokenUri: string, config: BlockchainConfig) => Promise<TransactionReceipt>;
    validateConsensus: (txHash: string, config: BlockchainConfig) => Promise<ConsensusValidation>;
    getConsensusValidators: (config: BlockchainConfig) => Promise<string[]>;
    checkTransactionFinality: (txHash: string, config: BlockchainConfig) => Promise<{
        finalized: boolean;
        confirmations: number;
        timeToFinality?: number;
    }>;
    validateMultiSigTransaction: (txHash: string, requiredSigners: string[], config: BlockchainConfig) => Promise<{
        valid: boolean;
        signerCount: number;
        signatures: string[];
    }>;
    submitForValidatorApproval: (documentHash: string, validators: string[], config: BlockchainConfig) => Promise<{
        submissionTxHash: string;
        approvalThreshold: number;
    }>;
    getConsensusParticipation: (fromBlock: number, toBlock: number, config: BlockchainConfig) => Promise<{
        rate: number;
        activeValidators: number;
        totalValidators: number;
    }>;
    generateImmutabilityProof: (documentHash: string, anchor: BlockchainAnchor) => Promise<ImmutabilityProof>;
    verifyImmutabilityProof: (proof: ImmutabilityProof, documentBuffer: Buffer, config: BlockchainConfig) => Promise<{
        valid: boolean;
        tampered: boolean;
        timestamp: Date;
    }>;
    createChainOfCustodyRecord: (documentId: string, action: string, actor: string, config: BlockchainConfig) => Promise<ChainOfCustodyEntry>;
    buildMerkleTree: (documentHashes: string[]) => MerkleTree;
    getMerkleProof: (tree: MerkleTree, leafIndex: number) => string[];
    generateTamperEvidentSeal: (documentBuffer: Buffer, privateKey: string, anchor: BlockchainAnchor) => Promise<{
        seal: string;
        signature: string;
        timestamp: Date;
    }>;
    verifyTamperEvidentSeal: (seal: string, signature: string, publicKey: string, documentBuffer: Buffer) => Promise<{
        valid: boolean;
        tampered: boolean;
        anchorTimestamp: Date;
    }>;
};
export default _default;
//# sourceMappingURL=document-blockchain-kit.d.ts.map
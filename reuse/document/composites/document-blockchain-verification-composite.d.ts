/**
 * LOC: DOCBLOCKVERIF001
 * File: /reuse/document/composites/document-blockchain-verification-composite.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - @nestjs/swagger
 *   - sequelize-typescript
 *   - sequelize
 *   - crypto (Node.js built-in)
 *   - ethers
 *   - web3
 *   - ipfs-http-client
 *   - ../document-blockchain-kit
 *   - ../document-signing-kit
 *   - ../document-audit-trail-advanced-kit
 *   - ../document-compliance-advanced-kit
 *   - ../document-security-kit
 *
 * DOWNSTREAM (imported by):
 *   - Blockchain verification services
 *   - Immutable document storage systems
 *   - Smart contract management modules
 *   - NFT minting services
 *   - Compliance audit services
 *   - Healthcare blockchain dashboards
 */
/**
 * File: /reuse/document/composites/document-blockchain-verification-composite.ts
 * Locator: WC-BLOCKCHAIN-VERIFICATION-COMPOSITE-001
 * Purpose: Comprehensive Blockchain Verification Composite - Production-ready blockchain timestamping, proof generation, and immutable records
 *
 * Upstream: Composed from document-blockchain-kit, document-signing-kit, document-audit-trail-advanced-kit, document-compliance-advanced-kit, document-security-kit
 * Downstream: ../backend/*, Blockchain services, NFT modules, Compliance systems, Immutability handlers
 * Dependencies: TypeScript 5.x, Node 18+, @nestjs/common, @nestjs/swagger, sequelize-typescript, ethers 6.x, web3 4.x, ipfs-http-client 60.x
 * Exports: 45 utility functions for blockchain anchoring, verification, proof generation, NFT minting, smart contracts, immutable audit trails
 *
 * LLM Context: Enterprise-grade blockchain verification composite for White Cross healthcare platform.
 * Provides comprehensive blockchain document verification including Ethereum/Polygon/Hyperledger anchoring,
 * IPFS distributed storage, cryptographic proof generation, NFT minting for document ownership, smart contract
 * automation, immutability verification, tamper detection, on-chain audit trails, consensus validation, and
 * HIPAA-compliant blockchain integration. Exceeds DocuSign capabilities with decentralized trust, cryptographic
 * guarantees, and blockchain-backed immutability. Composes functions from blockchain, signing, audit, compliance,
 * and security kits to provide unified blockchain verification operations for medical records, legal documents,
 * insurance claims, and regulatory filings.
 */
import { Model } from 'sequelize-typescript';
/**
 * Blockchain network types
 */
export declare enum BlockchainNetwork {
    ETHEREUM_MAINNET = "ETHEREUM_MAINNET",
    ETHEREUM_SEPOLIA = "ETHEREUM_SEPOLIA",
    POLYGON = "POLYGON",
    POLYGON_MUMBAI = "POLYGON_MUMBAI",
    HYPERLEDGER_FABRIC = "HYPERLEDGER_FABRIC",
    HYPERLEDGER_BESU = "HYPERLEDGER_BESU",
    BINANCE_SMART_CHAIN = "BINANCE_SMART_CHAIN",
    AVALANCHE = "AVALANCHE",
    CUSTOM = "CUSTOM"
}
/**
 * Blockchain anchor status
 */
export declare enum AnchorStatus {
    PENDING = "PENDING",
    SUBMITTED = "SUBMITTED",
    CONFIRMED = "CONFIRMED",
    VERIFIED = "VERIFIED",
    FAILED = "FAILED",
    REVOKED = "REVOKED"
}
/**
 * Smart contract standards
 */
export declare enum ContractStandard {
    ERC721 = "ERC721",// NFT standard
    ERC1155 = "ERC1155",// Multi-token standard
    ERC5192 = "ERC5192",// Soulbound token
    CUSTOM = "CUSTOM"
}
/**
 * Proof types
 */
export declare enum ProofType {
    MERKLE_PROOF = "MERKLE_PROOF",
    EXISTENCE_PROOF = "EXISTENCE_PROOF",
    TIMESTAMP_PROOF = "TIMESTAMP_PROOF",
    OWNERSHIP_PROOF = "OWNERSHIP_PROOF",
    INTEGRITY_PROOF = "INTEGRITY_PROOF",
    SIGNATURE_PROOF = "SIGNATURE_PROOF"
}
/**
 * Hash algorithms
 */
export declare enum HashAlgorithm {
    SHA256 = "SHA256",
    SHA512 = "SHA512",
    SHA3_256 = "SHA3_256",
    KECCAK256 = "KECCAK256"
}
/**
 * Blockchain anchor configuration
 */
export interface BlockchainAnchorConfig {
    id: string;
    network: BlockchainNetwork;
    contractAddress?: string;
    nodeUrl: string;
    chainId?: number;
    gasLimit?: number;
    maxFeePerGas?: string;
    priorityFee?: string;
    metadata?: Record<string, any>;
}
/**
 * Blockchain anchor result
 */
export interface BlockchainAnchorResult {
    id: string;
    documentId: string;
    documentHash: string;
    network: BlockchainNetwork;
    transactionHash: string;
    blockNumber: number;
    blockTimestamp: Date;
    contractAddress?: string;
    tokenId?: string;
    status: AnchorStatus;
    confirmations: number;
    gasUsed?: string;
    txFee?: string;
    proof: BlockchainProof;
    metadata?: Record<string, any>;
}
/**
 * Blockchain proof structure
 */
export interface BlockchainProof {
    id: string;
    proofType: ProofType;
    documentHash: string;
    algorithm: HashAlgorithm;
    transactionHash: string;
    blockNumber: number;
    blockTimestamp: Date;
    merkleRoot?: string;
    merkleProof?: string[];
    signature?: string;
    publicKey?: string;
    metadata?: Record<string, any>;
}
/**
 * NFT metadata structure
 */
export interface NFTMetadata {
    name: string;
    description: string;
    image?: string;
    external_url?: string;
    attributes: Array<{
        trait_type: string;
        value: string | number;
    }>;
    properties?: Record<string, any>;
}
/**
 * Smart contract deployment configuration
 */
export interface SmartContractConfig {
    name: string;
    symbol?: string;
    standard: ContractStandard;
    network: BlockchainNetwork;
    owner: string;
    baseUri?: string;
    royaltyPercentage?: number;
    transferable: boolean;
    metadata?: Record<string, any>;
}
/**
 * Verification result
 */
export interface VerificationResult {
    isValid: boolean;
    documentHash: string;
    onChainHash: string;
    transactionHash: string;
    blockNumber: number;
    timestamp: Date;
    confirmations: number;
    tamperedDetected: boolean;
    verifiedAt: Date;
    metadata?: Record<string, any>;
}
/**
 * IPFS upload result
 */
export interface IPFSUploadResult {
    cid: string;
    path: string;
    size: number;
    url: string;
    gateway: string;
    pinned: boolean;
    metadata?: Record<string, any>;
}
/**
 * Consensus validation result
 */
export interface ConsensusValidationResult {
    isValid: boolean;
    consensusType: string;
    validatorCount: number;
    approvalCount: number;
    consensusReached: boolean;
    confidence: number;
    timestamp: Date;
    metadata?: Record<string, any>;
}
/**
 * Blockchain Anchor Model
 * Stores blockchain anchor records
 */
export declare class BlockchainAnchorModel extends Model {
    id: string;
    documentId: string;
    documentHash: string;
    network: BlockchainNetwork;
    transactionHash: string;
    blockNumber: number;
    blockTimestamp: Date;
    contractAddress?: string;
    tokenId?: string;
    status: AnchorStatus;
    confirmations: number;
    gasUsed?: string;
    txFee?: string;
    proof: BlockchainProof;
    metadata?: Record<string, any>;
}
/**
 * Smart Contract Model
 * Stores deployed smart contract information
 */
export declare class SmartContractModel extends Model {
    id: string;
    name: string;
    symbol?: string;
    contractAddress: string;
    network: BlockchainNetwork;
    standard: ContractStandard;
    owner: string;
    baseUri?: string;
    royaltyPercentage?: number;
    transferable: boolean;
    deploymentTx: string;
    deploymentBlock: number;
    metadata?: Record<string, any>;
}
/**
 * NFT Token Model
 * Stores minted NFT information
 */
export declare class NFTTokenModel extends Model {
    id: string;
    contractAddress: string;
    tokenId: string;
    documentId: string;
    owner: string;
    metadata: NFTMetadata;
    tokenUri: string;
    mintTx: string;
    burnTx?: string;
    isBurned: boolean;
}
/**
 * Anchors document hash to blockchain with transaction creation and confirmation.
 * Creates immutable timestamp proof on distributed ledger.
 *
 * @param {string} documentId - Document identifier
 * @param {Buffer} documentContent - Document content buffer
 * @param {BlockchainAnchorConfig} config - Blockchain configuration
 * @returns {Promise<BlockchainAnchorResult>} Anchor result with transaction details
 *
 * @example
 * REST API: POST /api/v1/blockchain/anchors
 * Request:
 * {
 *   "documentId": "doc123",
 *   "documentContent": "base64_encoded_content",
 *   "network": "ETHEREUM_MAINNET",
 *   "nodeUrl": "https://eth-mainnet.g.alchemy.com/v2/API_KEY"
 * }
 * Response: 200 OK
 * {
 *   "id": "anchor_uuid",
 *   "transactionHash": "0x123...",
 *   "blockNumber": 18500000,
 *   "status": "CONFIRMED",
 *   "proof": {...}
 * }
 */
export declare const anchorDocumentToBlockchain: (documentId: string, documentContent: Buffer, config: BlockchainAnchorConfig) => Promise<BlockchainAnchorResult>;
/**
 * Verifies document integrity against blockchain anchor.
 * Compares current document hash with on-chain hash.
 *
 * @param {string} documentId - Document identifier
 * @param {Buffer} currentContent - Current document content
 * @param {string} transactionHash - Original anchor transaction hash
 * @returns {Promise<VerificationResult>} Verification result with tamper detection
 *
 * @example
 * REST API: POST /api/v1/blockchain/verify
 * Request:
 * {
 *   "documentId": "doc123",
 *   "currentContent": "base64_encoded_content",
 *   "transactionHash": "0x123..."
 * }
 * Response: 200 OK
 * {
 *   "isValid": true,
 *   "tamperedDetected": false,
 *   "confirmations": 1500,
 *   "timestamp": "2025-01-15T10:30:00Z"
 * }
 */
export declare const verifyDocumentIntegrity: (documentId: string, currentContent: Buffer, transactionHash: string) => Promise<VerificationResult>;
/**
 * Generates cryptographic proof of document existence at specific timestamp.
 *
 * @param {string} documentHash - Document hash
 * @param {string} transactionHash - Blockchain transaction hash
 * @returns {Promise<BlockchainProof>} Cryptographic proof
 */
export declare const generateExistenceProof: (documentHash: string, transactionHash: string) => Promise<BlockchainProof>;
/**
 * Creates Merkle tree proof for batch document verification.
 *
 * @param {string[]} documentHashes - Array of document hashes
 * @param {string} targetHash - Target document hash to prove
 * @returns {Promise<BlockchainProof>} Merkle proof with path
 */
export declare const generateMerkleProof: (documentHashes: string[], targetHash: string) => Promise<BlockchainProof>;
/**
 * Uploads document to IPFS distributed storage.
 *
 * @param {Buffer} documentContent - Document content
 * @param {Record<string, any>} metadata - Document metadata
 * @returns {Promise<IPFSUploadResult>} IPFS upload result with CID
 */
export declare const uploadToIPFS: (documentContent: Buffer, metadata?: Record<string, any>) => Promise<IPFSUploadResult>;
/**
 * Retrieves document from IPFS by CID.
 *
 * @param {string} cid - IPFS content identifier
 * @returns {Promise<Buffer>} Document content buffer
 */
export declare const retrieveFromIPFS: (cid: string) => Promise<Buffer>;
/**
 * Deploys smart contract for document management.
 *
 * @param {SmartContractConfig} config - Contract configuration
 * @returns {Promise<SmartContractModel>} Deployed contract information
 */
export declare const deploySmartContract: (config: SmartContractConfig) => Promise<any>;
/**
 * Mints NFT representing document ownership.
 *
 * @param {string} contractAddress - Smart contract address
 * @param {string} documentId - Document identifier
 * @param {string} owner - NFT owner address
 * @param {NFTMetadata} metadata - NFT metadata
 * @returns {Promise<any>} Minted NFT information
 */
export declare const mintDocumentNFT: (contractAddress: string, documentId: string, owner: string, metadata: NFTMetadata) => Promise<any>;
/**
 * Transfers NFT ownership to new address.
 *
 * @param {string} tokenId - Token identifier
 * @param {string} from - Current owner address
 * @param {string} to - New owner address
 * @returns {Promise<string>} Transfer transaction hash
 */
export declare const transferNFTOwnership: (tokenId: string, from: string, to: string) => Promise<string>;
/**
 * Burns NFT to revoke document ownership.
 *
 * @param {string} tokenId - Token identifier
 * @returns {Promise<string>} Burn transaction hash
 */
export declare const burnDocumentNFT: (tokenId: string) => Promise<string>;
/**
 * Validates blockchain transaction confirmation.
 *
 * @param {string} transactionHash - Transaction hash
 * @param {number} requiredConfirmations - Minimum confirmations required
 * @returns {Promise<boolean>} Whether transaction is confirmed
 */
export declare const validateTransactionConfirmation: (transactionHash: string, requiredConfirmations?: number) => Promise<boolean>;
/**
 * Retrieves blockchain transaction details.
 *
 * @param {string} transactionHash - Transaction hash
 * @returns {Promise<any>} Transaction details
 */
export declare const getTransactionDetails: (transactionHash: string) => Promise<any>;
/**
 * Calculates transaction gas estimate.
 *
 * @param {string} contractAddress - Contract address
 * @param {string} method - Contract method
 * @param {any[]} params - Method parameters
 * @returns {Promise<string>} Gas estimate
 */
export declare const estimateTransactionGas: (contractAddress: string, method: string, params: any[]) => Promise<string>;
/**
 * Monitors blockchain transaction status.
 *
 * @param {string} transactionHash - Transaction hash
 * @returns {Promise<AnchorStatus>} Current transaction status
 */
export declare const monitorTransactionStatus: (transactionHash: string) => Promise<AnchorStatus>;
/**
 * Validates consensus mechanism approval.
 *
 * @param {string} transactionHash - Transaction hash
 * @param {BlockchainNetwork} network - Blockchain network
 * @returns {Promise<ConsensusValidationResult>} Consensus validation result
 */
export declare const validateConsensus: (transactionHash: string, network: BlockchainNetwork) => Promise<ConsensusValidationResult>;
/**
 * Generates timestamp proof certificate.
 *
 * @param {BlockchainAnchorResult} anchorResult - Anchor result
 * @returns {Promise<Buffer>} PDF certificate
 */
export declare const generateTimestampCertificate: (anchorResult: BlockchainAnchorResult) => Promise<Buffer>;
/**
 * Verifies Merkle proof validity.
 *
 * @param {BlockchainProof} proof - Merkle proof
 * @returns {Promise<boolean>} Whether proof is valid
 */
export declare const verifyMerkleProof: (proof: BlockchainProof) => Promise<boolean>;
/**
 * Retrieves block information from blockchain.
 *
 * @param {number} blockNumber - Block number
 * @param {BlockchainNetwork} network - Blockchain network
 * @returns {Promise<any>} Block information
 */
export declare const getBlockInfo: (blockNumber: number, network: BlockchainNetwork) => Promise<any>;
/**
 * Creates batch anchor for multiple documents.
 *
 * @param {Array<{documentId: string, content: Buffer}>} documents - Documents to anchor
 * @param {BlockchainAnchorConfig} config - Blockchain configuration
 * @returns {Promise<BlockchainAnchorResult[]>} Batch anchor results
 */
export declare const batchAnchorDocuments: (documents: Array<{
    documentId: string;
    content: Buffer;
}>, config: BlockchainAnchorConfig) => Promise<BlockchainAnchorResult[]>;
/**
 * Revokes blockchain anchor.
 *
 * @param {string} anchorId - Anchor identifier
 * @param {string} reason - Revocation reason
 * @returns {Promise<string>} Revocation transaction hash
 */
export declare const revokeAnchor: (anchorId: string, reason: string) => Promise<string>;
/**
 * Retrieves anchor history for document.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<BlockchainAnchorResult[]>} Anchor history
 */
export declare const getAnchorHistory: (documentId: string) => Promise<BlockchainAnchorResult[]>;
/**
 * Validates smart contract integrity.
 *
 * @param {string} contractAddress - Contract address
 * @returns {Promise<boolean>} Whether contract is valid
 */
export declare const validateContractIntegrity: (contractAddress: string) => Promise<boolean>;
/**
 * Retrieves contract metadata from blockchain.
 *
 * @param {string} contractAddress - Contract address
 * @returns {Promise<any>} Contract metadata
 */
export declare const getContractMetadata: (contractAddress: string) => Promise<any>;
/**
 * Calculates document hash with specified algorithm.
 *
 * @param {Buffer} content - Document content
 * @param {HashAlgorithm} algorithm - Hash algorithm
 * @returns {string} Document hash
 */
export declare const calculateDocumentHash: (content: Buffer, algorithm?: HashAlgorithm) => string;
/**
 * Verifies digital signature on blockchain proof.
 *
 * @param {BlockchainProof} proof - Blockchain proof
 * @param {string} publicKey - Signer public key
 * @returns {Promise<boolean>} Whether signature is valid
 */
export declare const verifyProofSignature: (proof: BlockchainProof, publicKey: string) => Promise<boolean>;
/**
 * Generates immutability report for document.
 *
 * @param {string} documentId - Document identifier
 * @returns {Promise<any>} Immutability report
 */
export declare const generateImmutabilityReport: (documentId: string) => Promise<any>;
/**
 * Retrieves gas price from blockchain network.
 *
 * @param {BlockchainNetwork} network - Blockchain network
 * @returns {Promise<any>} Gas price information
 */
export declare const getGasPrice: (network: BlockchainNetwork) => Promise<any>;
/**
 * Validates blockchain node connectivity.
 *
 * @param {string} nodeUrl - Node URL
 * @returns {Promise<boolean>} Whether node is reachable
 */
export declare const validateNodeConnectivity: (nodeUrl: string) => Promise<boolean>;
/**
 * Retrieves NFT ownership history.
 *
 * @param {string} tokenId - Token identifier
 * @returns {Promise<any[]>} Ownership history
 */
export declare const getNFTOwnershipHistory: (tokenId: string) => Promise<any[]>;
/**
 * Validates token ownership.
 *
 * @param {string} tokenId - Token identifier
 * @param {string} owner - Claimed owner address
 * @returns {Promise<boolean>} Whether ownership is valid
 */
export declare const validateTokenOwnership: (tokenId: string, owner: string) => Promise<boolean>;
/**
 * Retrieves blockchain transaction receipt.
 *
 * @param {string} transactionHash - Transaction hash
 * @returns {Promise<any>} Transaction receipt
 */
export declare const getTransactionReceipt: (transactionHash: string) => Promise<any>;
/**
 * Generates blockchain explorer URL for transaction.
 *
 * @param {string} transactionHash - Transaction hash
 * @param {BlockchainNetwork} network - Blockchain network
 * @returns {string} Explorer URL
 */
export declare const generateExplorerUrl: (transactionHash: string, network: BlockchainNetwork) => string;
/**
 * Validates blockchain proof authenticity.
 *
 * @param {BlockchainProof} proof - Blockchain proof
 * @returns {Promise<boolean>} Whether proof is authentic
 */
export declare const validateProofAuthenticity: (proof: BlockchainProof) => Promise<boolean>;
/**
 * Retrieves current block number from network.
 *
 * @param {BlockchainNetwork} network - Blockchain network
 * @returns {Promise<number>} Current block number
 */
export declare const getCurrentBlockNumber: (network: BlockchainNetwork) => Promise<number>;
/**
 * Calculates anchor cost estimate.
 *
 * @param {BlockchainNetwork} network - Blockchain network
 * @param {number} documentCount - Number of documents
 * @returns {Promise<any>} Cost estimate
 */
export declare const estimateAnchorCost: (network: BlockchainNetwork, documentCount: number) => Promise<any>;
/**
 * Generates QR code for blockchain verification.
 *
 * @param {BlockchainAnchorResult} anchorResult - Anchor result
 * @returns {Promise<Buffer>} QR code image buffer
 */
export declare const generateVerificationQRCode: (anchorResult: BlockchainAnchorResult) => Promise<Buffer>;
/**
 * Validates IPFS content identifier format.
 *
 * @param {string} cid - IPFS CID
 * @returns {boolean} Whether CID is valid
 */
export declare const validateIPFSCID: (cid: string) => boolean;
/**
 * Retrieves IPFS pinning status.
 *
 * @param {string} cid - IPFS content identifier
 * @returns {Promise<any>} Pinning status
 */
export declare const getIPFSPinningStatus: (cid: string) => Promise<any>;
/**
 * Archives blockchain anchor data for long-term storage.
 *
 * @param {string} anchorId - Anchor identifier
 * @returns {Promise<any>} Archive result
 */
export declare const archiveAnchorData: (anchorId: string) => Promise<any>;
/**
 * Retrieves blockchain network statistics.
 *
 * @param {BlockchainNetwork} network - Blockchain network
 * @returns {Promise<any>} Network statistics
 */
export declare const getNetworkStatistics: (network: BlockchainNetwork) => Promise<any>;
/**
 * Validates smart contract method existence.
 *
 * @param {string} contractAddress - Contract address
 * @param {string} methodName - Method name
 * @returns {Promise<boolean>} Whether method exists
 */
export declare const validateContractMethod: (contractAddress: string, methodName: string) => Promise<boolean>;
/**
 * Generates blockchain audit report.
 *
 * @param {string} documentId - Document identifier
 * @param {Date} startDate - Report start date
 * @param {Date} endDate - Report end date
 * @returns {Promise<any>} Audit report
 */
export declare const generateBlockchainAuditReport: (documentId: string, startDate: Date, endDate: Date) => Promise<any>;
/**
 * Blockchain Verification Service
 * Production-ready NestJS service for blockchain document verification
 */
export declare class BlockchainVerificationService {
    /**
     * Anchors document to blockchain
     */
    anchor(documentId: string, content: Buffer, config: BlockchainAnchorConfig): Promise<BlockchainAnchorResult>;
    /**
     * Verifies document integrity
     */
    verify(documentId: string, content: Buffer, txHash: string): Promise<VerificationResult>;
}
declare const _default: {
    BlockchainAnchorModel: typeof BlockchainAnchorModel;
    SmartContractModel: typeof SmartContractModel;
    NFTTokenModel: typeof NFTTokenModel;
    anchorDocumentToBlockchain: (documentId: string, documentContent: Buffer, config: BlockchainAnchorConfig) => Promise<BlockchainAnchorResult>;
    verifyDocumentIntegrity: (documentId: string, currentContent: Buffer, transactionHash: string) => Promise<VerificationResult>;
    generateExistenceProof: (documentHash: string, transactionHash: string) => Promise<BlockchainProof>;
    generateMerkleProof: (documentHashes: string[], targetHash: string) => Promise<BlockchainProof>;
    uploadToIPFS: (documentContent: Buffer, metadata?: Record<string, any>) => Promise<IPFSUploadResult>;
    retrieveFromIPFS: (cid: string) => Promise<Buffer>;
    deploySmartContract: (config: SmartContractConfig) => Promise<any>;
    mintDocumentNFT: (contractAddress: string, documentId: string, owner: string, metadata: NFTMetadata) => Promise<any>;
    transferNFTOwnership: (tokenId: string, from: string, to: string) => Promise<string>;
    burnDocumentNFT: (tokenId: string) => Promise<string>;
    validateTransactionConfirmation: (transactionHash: string, requiredConfirmations?: number) => Promise<boolean>;
    getTransactionDetails: (transactionHash: string) => Promise<any>;
    estimateTransactionGas: (contractAddress: string, method: string, params: any[]) => Promise<string>;
    monitorTransactionStatus: (transactionHash: string) => Promise<AnchorStatus>;
    validateConsensus: (transactionHash: string, network: BlockchainNetwork) => Promise<ConsensusValidationResult>;
    generateTimestampCertificate: (anchorResult: BlockchainAnchorResult) => Promise<Buffer>;
    verifyMerkleProof: (proof: BlockchainProof) => Promise<boolean>;
    getBlockInfo: (blockNumber: number, network: BlockchainNetwork) => Promise<any>;
    batchAnchorDocuments: (documents: Array<{
        documentId: string;
        content: Buffer;
    }>, config: BlockchainAnchorConfig) => Promise<BlockchainAnchorResult[]>;
    revokeAnchor: (anchorId: string, reason: string) => Promise<string>;
    getAnchorHistory: (documentId: string) => Promise<BlockchainAnchorResult[]>;
    validateContractIntegrity: (contractAddress: string) => Promise<boolean>;
    getContractMetadata: (contractAddress: string) => Promise<any>;
    calculateDocumentHash: (content: Buffer, algorithm?: HashAlgorithm) => string;
    verifyProofSignature: (proof: BlockchainProof, publicKey: string) => Promise<boolean>;
    generateImmutabilityReport: (documentId: string) => Promise<any>;
    getGasPrice: (network: BlockchainNetwork) => Promise<any>;
    validateNodeConnectivity: (nodeUrl: string) => Promise<boolean>;
    getNFTOwnershipHistory: (tokenId: string) => Promise<any[]>;
    validateTokenOwnership: (tokenId: string, owner: string) => Promise<boolean>;
    getTransactionReceipt: (transactionHash: string) => Promise<any>;
    generateExplorerUrl: (transactionHash: string, network: BlockchainNetwork) => string;
    validateProofAuthenticity: (proof: BlockchainProof) => Promise<boolean>;
    getCurrentBlockNumber: (network: BlockchainNetwork) => Promise<number>;
    estimateAnchorCost: (network: BlockchainNetwork, documentCount: number) => Promise<any>;
    generateVerificationQRCode: (anchorResult: BlockchainAnchorResult) => Promise<Buffer>;
    validateIPFSCID: (cid: string) => boolean;
    getIPFSPinningStatus: (cid: string) => Promise<any>;
    archiveAnchorData: (anchorId: string) => Promise<any>;
    getNetworkStatistics: (network: BlockchainNetwork) => Promise<any>;
    validateContractMethod: (contractAddress: string, methodName: string) => Promise<boolean>;
    generateBlockchainAuditReport: (documentId: string, startDate: Date, endDate: Date) => Promise<any>;
    BlockchainVerificationService: typeof BlockchainVerificationService;
};
export default _default;
//# sourceMappingURL=document-blockchain-verification-composite.d.ts.map
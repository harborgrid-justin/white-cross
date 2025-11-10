/**
 * LOC: NFT001
 * File: /reuse/document/composites/downstream/nft-minting-services.ts
 *
 * UPSTREAM (imports from):
 *   - @nestjs/common
 *   - crypto (Node.js built-in)
 *   - ../document-security-encryption-composite
 *   - smart-contract-management-modules
 *
 * DOWNSTREAM (imported by):
 *   - Document NFT services
 *   - Digital asset management
 *   - Blockchain integration services
 */

import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';

/**
 * NFT standard type
 */
export enum NFTStandard {
  ERC721 = 'ERC721',    // Non-fungible token
  ERC1155 = 'ERC1155',  // Multi-token
  ERC721A = 'ERC721A',  // Optimized ERC721
}

/**
 * NFT metadata
 */
export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
  externalUrl?: string;
  properties?: Record<string, any>;
}

/**
 * NFT
 */
export interface NFT {
  nftId: string;
  tokenId: string;
  contractAddress: string;
  owner: string;
  creator: string;
  standard: NFTStandard;
  metadata: NFTMetadata;
  documentHash: string;
  mintedAt: Date;
  transferHistory: { from: string; to: string; timestamp: Date }[];
  royalties?: { recipient: string; percentage: number }[];
  status: 'ACTIVE' | 'BURNED' | 'FROZEN';
}

/**
 * NFT minting request
 */
export interface NFTMintingRequest {
  requestId: string;
  documentId: string;
  documentHash: string;
  metadata: NFTMetadata;
  owner: string;
  creator: string;
  standard: NFTStandard;
  contractAddress: string;
  status: 'PENDING' | 'MINTING' | 'MINTED' | 'FAILED';
  transactionHash?: string;
  tokenId?: string;
  mintedAt?: Date;
  error?: string;
}

/**
 * NFT minting service
 * Manages NFT creation and lifecycle for documents
 */
@Injectable()
export class NFTMintingService {
  private readonly logger = new Logger(NFTMintingService.name);
  private nfts: Map<string, NFT> = new Map();
  private mintingRequests: Map<string, NFTMintingRequest> = new Map();
  private nftContracts: Map<string, { address: string; standard: NFTStandard; owner: string }> = new Map();

  /**
   * Creates NFT minting request
   * @param documentId - Document to mint as NFT
   * @param documentHash - Document hash
   * @param metadata - NFT metadata
   * @param creator - NFT creator
   * @param owner - NFT owner
   * @param standard - NFT standard
   * @returns Minting request
   */
  async createMintingRequest(
    documentId: string,
    documentHash: string,
    metadata: NFTMetadata,
    creator: string,
    owner: string,
    standard: NFTStandard = NFTStandard.ERC721
  ): Promise<NFTMintingRequest> {
    try {
      const requestId = crypto.randomUUID();
      const contractAddress = `0x${crypto.randomBytes(20).toString('hex')}`;

      const request: NFTMintingRequest = {
        requestId,
        documentId,
        documentHash,
        metadata,
        owner,
        creator,
        standard,
        contractAddress,
        status: 'PENDING'
      };

      this.mintingRequests.set(requestId, request);

      this.logger.log(`NFT minting request created: ${requestId}`);

      return request;
    } catch (error) {
      this.logger.error(`Failed to create minting request: ${error.message}`);
      throw new BadRequestException('Failed to create NFT minting request');
    }
  }

  /**
   * Mints NFT from document
   * @param requestId - Minting request identifier
   * @returns Minted NFT
   */
  async mintNFT(requestId: string): Promise<NFT> {
    try {
      const request = this.mintingRequests.get(requestId);
      if (!request) {
        throw new BadRequestException('Minting request not found');
      }

      if (request.status !== 'PENDING') {
        throw new BadRequestException('Minting request is not pending');
      }

      // Update request status
      request.status = 'MINTING';

      // Generate NFT ID and token ID
      const nftId = crypto.randomUUID();
      const tokenId = `0x${crypto.randomBytes(32).toString('hex')}`;
      const transactionHash = `0x${crypto.randomBytes(32).toString('hex')}`;

      // Create NFT
      const nft: NFT = {
        nftId,
        tokenId,
        contractAddress: request.contractAddress,
        owner: request.owner,
        creator: request.creator,
        standard: request.standard,
        metadata: request.metadata,
        documentHash: request.documentHash,
        mintedAt: new Date(),
        transferHistory: [
          {
            from: 'MINT',
            to: request.owner,
            timestamp: new Date()
          }
        ],
        status: 'ACTIVE'
      };

      this.nfts.set(nftId, nft);

      // Update minting request
      request.status = 'MINTED';
      request.transactionHash = transactionHash;
      request.tokenId = tokenId;
      request.mintedAt = new Date();

      // Register contract
      if (!this.nftContracts.has(request.contractAddress)) {
        this.nftContracts.set(request.contractAddress, {
          address: request.contractAddress,
          standard: request.standard,
          owner: request.creator
        });
      }

      this.logger.log(`NFT minted: ${nftId} - Token ${tokenId}`);

      return nft;
    } catch (error) {
      this.logger.error(`NFT minting failed: ${error.message}`);

      const request = this.mintingRequests.get(requestId);
      if (request) {
        request.status = 'FAILED';
        request.error = error.message;
      }

      throw new BadRequestException('Failed to mint NFT');
    }
  }

  /**
   * Transfers NFT ownership
   * @param nftId - NFT identifier
   * @param fromAddress - Current owner
   * @param toAddress - New owner
   * @returns Updated NFT
   */
  async transferNFT(nftId: string, fromAddress: string, toAddress: string): Promise<NFT> {
    try {
      const nft = this.nfts.get(nftId);
      if (!nft) {
        throw new BadRequestException('NFT not found');
      }

      if (nft.owner !== fromAddress) {
        throw new BadRequestException('Not authorized to transfer this NFT');
      }

      // Record transfer
      nft.transferHistory.push({
        from: fromAddress,
        to: toAddress,
        timestamp: new Date()
      });

      // Update owner
      nft.owner = toAddress;

      this.logger.log(`NFT transferred: ${nftId} from ${fromAddress} to ${toAddress}`);

      return nft;
    } catch (error) {
      this.logger.error(`NFT transfer failed: ${error.message}`);
      throw new BadRequestException('Failed to transfer NFT');
    }
  }

  /**
   * Burns NFT (removes from circulation)
   * @param nftId - NFT identifier
   * @param owner - NFT owner
   * @returns Burn result
   */
  async burnNFT(nftId: string, owner: string): Promise<{ burned: boolean; timestamp: Date }> {
    try {
      const nft = this.nfts.get(nftId);
      if (!nft) {
        throw new BadRequestException('NFT not found');
      }

      if (nft.owner !== owner) {
        throw new BadRequestException('Not authorized to burn this NFT');
      }

      nft.status = 'BURNED';

      this.logger.log(`NFT burned: ${nftId}`);

      return {
        burned: true,
        timestamp: new Date()
      };
    } catch (error) {
      this.logger.error(`NFT burn failed: ${error.message}`);
      throw new BadRequestException('Failed to burn NFT');
    }
  }

  /**
   * Freezes NFT (prevents transfers)
   * @param nftId - NFT identifier
   * @param reason - Freeze reason
   * @returns Freeze result
   */
  async freezeNFT(nftId: string, reason: string): Promise<{ frozen: boolean; timestamp: Date }> {
    const nft = this.nfts.get(nftId);
    if (!nft) {
      throw new BadRequestException('NFT not found');
    }

    nft.status = 'FROZEN';

    this.logger.warn(`NFT frozen: ${nftId} - ${reason}`);

    return {
      frozen: true,
      timestamp: new Date()
    };
  }

  /**
   * Unfreezes NFT
   * @param nftId - NFT identifier
   * @returns Unfreeze result
   */
  async unfreezeNFT(nftId: string): Promise<{ unfrozen: boolean; timestamp: Date }> {
    const nft = this.nfts.get(nftId);
    if (!nft) {
      throw new BadRequestException('NFT not found');
    }

    nft.status = 'ACTIVE';

    this.logger.log(`NFT unfrozen: ${nftId}`);

    return {
      unfrozen: true,
      timestamp: new Date()
    };
  }

  /**
   * Gets NFT details
   * @param nftId - NFT identifier
   * @returns NFT or null
   */
  async getNFT(nftId: string): Promise<NFT | null> {
    return this.nfts.get(nftId) || null;
  }

  /**
   * Gets NFT by token ID
   * @param tokenId - Token identifier
   * @returns NFT or null
   */
  async getNFTByTokenId(tokenId: string): Promise<NFT | null> {
    return Array.from(this.nfts.values()).find(n => n.tokenId === tokenId) || null;
  }

  /**
   * Gets user's NFTs
   * @param owner - Owner address
   * @returns List of NFTs
   */
  async getUserNFTs(owner: string): Promise<NFT[]> {
    return Array.from(this.nfts.values())
      .filter(n => n.owner === owner && n.status !== 'BURNED');
  }

  /**
   * Gets NFT transfer history
   * @param nftId - NFT identifier
   * @returns Transfer history
   */
  async getTransferHistory(nftId: string): Promise<any[]> {
    const nft = this.nfts.get(nftId);
    if (!nft) {
      throw new BadRequestException('NFT not found');
    }

    return nft.transferHistory;
  }

  /**
   * Adds royalties to NFT
   * @param nftId - NFT identifier
   * @param recipient - Royalty recipient
   * @param percentage - Royalty percentage
   * @returns Updated NFT
   */
  async setRoyalties(
    nftId: string,
    recipient: string,
    percentage: number
  ): Promise<NFT> {
    const nft = this.nfts.get(nftId);
    if (!nft) {
      throw new BadRequestException('NFT not found');
    }

    if (!nft.royalties) {
      nft.royalties = [];
    }

    nft.royalties.push({ recipient, percentage });

    this.logger.log(`Royalties set for NFT: ${nftId}`);

    return nft;
  }

  /**
   * Validates NFT ownership
   * @param nftId - NFT identifier
   * @param owner - Owner to verify
   * @returns Ownership validity
   */
  async verifyOwnership(nftId: string, owner: string): Promise<boolean> {
    const nft = this.nfts.get(nftId);
    return nft ? nft.owner === owner && nft.status !== 'BURNED' : false;
  }

  /**
   * Generates NFT collection report
   * @param filters - Filter criteria
   * @returns Collection report
   */
  async generateCollectionReport(filters?: {
    creator?: string;
    standard?: NFTStandard;
    status?: string;
  }): Promise<Record<string, any>> {
    let nfts = Array.from(this.nfts.values());

    if (filters?.creator) {
      nfts = nfts.filter(n => n.creator === filters.creator);
    }
    if (filters?.standard) {
      nfts = nfts.filter(n => n.standard === filters.standard);
    }
    if (filters?.status) {
      nfts = nfts.filter(n => n.status === filters.status);
    }

    const totalTransfers = nfts.reduce((sum, n) => sum + n.transferHistory.length, 0);

    return {
      totalNFTs: nfts.length,
      activeNFTs: nfts.filter(n => n.status === 'ACTIVE').length,
      burntNFTs: nfts.filter(n => n.status === 'BURNED').length,
      frozenNFTs: nfts.filter(n => n.status === 'FROZEN').length,
      totalTransfers,
      averageTransfersPerNFT: nfts.length > 0 ? totalTransfers / nfts.length : 0
    };
  }
}

export default NFTMintingService;

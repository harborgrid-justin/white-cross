/**
 * @fileoverview AI Search Controller
 * @module ai-search/ai-search.controller
 * @description HTTP endpoints for AI-powered semantic search
 */

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AiSearchService } from './ai-search.service';
import { SearchQueryDto } from './dto/search-query.dto';
import { IndexContentDto } from './dto/index-content.dto';

@ApiTags('ai-search')
@Controller('ai-search')
// @ApiBearerAuth()
export class AiSearchController {
  constructor(private readonly aiSearchService: AiSearchService) {}

  @Post('query')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Perform AI-powered search',
    description:
      'Executes semantic search across indexed content using AI embeddings and vector similarity.',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        results: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              type: { type: 'string' },
              title: { type: 'string' },
              excerpt: { type: 'string' },
              score: { type: 'number' },
            },
          },
        },
        total: { type: 'number' },
        executionTime: { type: 'number' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid search query',
  })
  async search(@Body() queryDto: SearchQueryDto) {
    return this.aiSearchService.search(queryDto.query, queryDto.options);
  }

  @Post('index')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Index content for search',
    description:
      'Adds content to the search index with AI embeddings for semantic search.',
  })
  @ApiResponse({
    status: 201,
    description: 'Content indexed successfully',
    schema: {
      type: 'object',
      properties: {
        indexed: { type: 'boolean', example: true },
        contentId: { type: 'string' },
        contentType: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid content data',
  })
  async indexContent(@Body() indexDto: IndexContentDto) {
    await this.aiSearchService.indexContent(
      indexDto.contentType,
      indexDto.contentId,
      indexDto.content,
    );
    return {
      indexed: true,
      contentId: indexDto.contentId,
      contentType: indexDto.contentType,
    };
  }

  @Delete('index/:type/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove from index',
    description: 'Removes specific content from the search index.',
  })
  @ApiParam({
    name: 'type',
    description: 'Content type (student, health-record, etc.)',
  })
  @ApiParam({
    name: 'id',
    description: 'Content ID',
  })
  @ApiResponse({
    status: 204,
    description: 'Content removed from index successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Content not found in index',
  })
  async removeFromIndex(
    @Param('type') type: string,
    @Param('id') id: string,
  ) {
    await this.aiSearchService.deleteFromIndex(type, id);
  }

  @Post('reindex')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({
    summary: 'Reindex all content',
    description:
      'Triggers a full reindex of all searchable content. This is an async operation.',
  })
  @ApiResponse({
    status: 202,
    description: 'Reindex operation started',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'started' },
        jobId: { type: 'string' },
        estimatedTime: { type: 'string' },
      },
    },
  })
  async reindexAll() {
    await this.aiSearchService.reindexAll();
    return {
      status: 'started',
      jobId: `reindex-${Date.now()}`,
      estimatedTime: '5-10 minutes',
    };
  }

  @Get('stats')
  @ApiOperation({
    summary: 'Get search statistics',
    description: 'Retrieves statistics about the search index and usage.',
  })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        totalDocuments: { type: 'number' },
        indexSize: { type: 'string' },
        lastIndexed: { type: 'string', format: 'date-time' },
        contentTypes: {
          type: 'object',
          additionalProperties: { type: 'number' },
        },
      },
    },
  })
  async getStats() {
    // Service method getSearchStats doesn't exist, return placeholder
    return {
      totalDocuments: 0,
      indexSize: '0 KB',
      lastIndexed: new Date().toISOString(),
      contentTypes: {},
    };
  }
}

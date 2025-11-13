import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ClinicalProtocolService } from '../services/clinical-protocol.service';
import { ProtocolFiltersDto } from '../dto/protocol/protocol-filters.dto';

import { BaseController } from '@/common/base';
@ApiTags('Clinical - Protocols')
@ApiBearerAuth()
@Controller('clinical/protocols')
export class ClinicalProtocolQueryController extends BaseController {
  constructor(private readonly protocolService: ClinicalProtocolService) {}

  @Get()
  @ApiOperation({
    summary: 'Query clinical protocols',
    description: 'Retrieves clinical protocols with filtering and pagination.',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Filter by protocol category',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by protocol status',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Text search across protocol names and descriptions',
  })
  @ApiQuery({
    name: 'createdBy',
    required: false,
    type: String,
    description: 'Filter by creator ID',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of protocols per page (default: 20)',
  })
  @ApiResponse({
    status: 200,
    description: 'Clinical protocols retrieved successfully',
  })
  async findAll(@Query() filters: ProtocolFiltersDto) {
    return this.protocolService.findAll(filters);
  }

  @Get('active')
  @ApiOperation({
    summary: 'Get all active protocols',
    description: 'Retrieves all currently active clinical protocols.',
  })
  @ApiResponse({
    status: 200,
    description: 'Active protocols retrieved successfully',
  })
  async getActive() {
    return this.protocolService.getActiveProtocols();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get protocol by ID',
    description: 'Retrieves detailed information for a specific clinical protocol.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Protocol unique identifier',
  })
  @ApiResponse({
    status: 200,
    description: 'Protocol details retrieved successfully',
  })
  async findOne(@Param('id') id: string) {
    return this.protocolService.findOne(id);
  }
}

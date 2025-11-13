import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClinicalProtocolService } from '@/services/clinical-protocol.service';
import { CreateProtocolDto } from '../dto/protocol/create-protocol.dto';
import { UpdateProtocolDto } from '../dto/protocol/update-protocol.dto';
import { ActivateProtocolDto } from '../dto/protocol/activate-protocol.dto';

import { BaseController } from '@/common/base';
@ApiTags('Clinical - Protocols')
@ApiBearerAuth()
@Controller('clinical/protocols')
export class ClinicalProtocolManagementController extends BaseController {
  constructor(private readonly protocolService: ClinicalProtocolService) {}

  @Post()
  @ApiOperation({
    summary: 'Create clinical protocol',
    description: 'Creates a new clinical protocol for standardized healthcare procedures.',
  })
  @ApiResponse({
    status: 201,
    description: 'Clinical protocol created successfully',
  })
  async create(@Body() createDto: CreateProtocolDto) {
    return this.protocolService.create(createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update protocol' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateProtocolDto) {
    return this.protocolService.update(id, updateDto);
  }

  @Post(':id/activate')
  @ApiOperation({
    summary: 'Activate protocol',
    description: 'Activates a clinical protocol for immediate use.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Protocol ID to activate',
  })
  @ApiResponse({
    status: 200,
    description: 'Protocol activated successfully',
  })
  async activate(
    @Param('id') id: string,
    @Body() activateDto: ActivateProtocolDto,
  ) {
    return this.protocolService.activate(id, activateDto);
  }

  @Post(':id/deactivate')
  @ApiOperation({
    summary: 'Deactivate protocol',
    description: 'Deactivates a clinical protocol.',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Protocol ID to deactivate',
  })
  @ApiResponse({
    status: 200,
    description: 'Protocol deactivated successfully',
  })
  async deactivate(@Param('id') id: string) {
    return this.protocolService.deactivate(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete protocol' })
  async remove(@Param('id') id: string) {
    await this.protocolService.remove(id);
  }
}

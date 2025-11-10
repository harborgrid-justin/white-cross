import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Application')
@ApiBearerAuth()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check endpoint',
    description: 'Returns a simple health check message to verify the API is running',
  })
  @ApiResponse({
    status: 200,
    description: 'API is healthy and running',
    schema: {
      type: 'string',
      example: 'White Cross Healthcare API - Status: Healthy',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }
}

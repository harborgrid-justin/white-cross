import { PartialType } from '@nestjs/swagger';
import { CreateProtocolDto } from './create-protocol.dto';

/**
 * DTO for updating an existing protocol
 * All fields are optional for partial updates
 */
export class UpdateProtocolDto extends PartialType(CreateProtocolDto) {}

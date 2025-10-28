import { PartialType } from '@nestjs/swagger';
import { CreateNoteDto } from './create-note.dto';

/**
 * DTO for updating an existing clinical note
 * All fields are optional for partial updates
 */
export class UpdateNoteDto extends PartialType(CreateNoteDto) {}

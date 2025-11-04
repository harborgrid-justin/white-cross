import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';

/**
 * OAuth login DTO for Google and Microsoft OAuth providers
 */
export class OAuthLoginDto {
  @ApiProperty({
    description: 'OAuth provider (google or microsoft)',
    example: 'google',
  })
  @IsString()
  provider: 'google' | 'microsoft';

  @ApiProperty({
    description: 'OAuth access token from provider',
    example: 'ya29.a0AfH6SMB...',
  })
  @IsString()
  accessToken: string;

  @ApiProperty({
    description: 'OAuth ID token from provider (contains user info)',
    example: 'eyJhbGciOiJSUzI1NiIs...',
    required: false,
  })
  @IsOptional()
  @IsString()
  idToken?: string;
}

/**
 * OAuth callback DTO for handling OAuth redirects
 */
export class OAuthCallbackDto {
  @ApiProperty({
    description: 'Authorization code from OAuth provider',
    example: '4/0AX4XfWh...',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'State parameter for CSRF protection',
    example: 'random-state-string',
    required: false,
  })
  @IsOptional()
  @IsString()
  state?: string;
}

/**
 * OAuth user profile from provider
 */
export interface OAuthProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  picture?: string;
  provider: 'google' | 'microsoft';
}

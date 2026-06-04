import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 'raw-reset-token-from-forgot-password-response',
    description: 'Raw reset token sent to the user. Only its hash is stored in the database.',
  })
  @IsString()
  token: string;

  @ApiProperty({ example: 'NewStrongPass123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  newPassword: string;
}

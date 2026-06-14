import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class ForgotOrResetPasswordDto {
  @ApiPropertyOptional({ example: 'ravi@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: 'd3f78a2e5a4b9c1d6e5f8a2e5a4b9c1d6e5f8a2e5a4b9c1d6e5f8a2e5a4b9c1d',
    description: 'Raw reset token sent to the user. Only its hash is stored in the database.',
  })
  @IsOptional()
  @IsString()
  resetToken?: string;


  @ApiPropertyOptional({ example: 'NewStrongPass123!', minLength: 8 })
  @IsOptional()
  @IsString()
  @MinLength(8)
  newPassword?: string;
}

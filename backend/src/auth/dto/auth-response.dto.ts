import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'f20ed8ac-3c58-45f4-9a2e-9f61f3a4c1e6' })
  id: string;

  @ApiProperty({ example: 'Ravi Kumar' })
  name: string;

  @ApiProperty({ example: 'ravi@example.com' })
  email: string;

  @ApiProperty({ example: '2026-06-04T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-06-04T10:30:00.000Z' })
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;
}

export class ForgotPasswordResponseDto {
  @ApiProperty({
    example: 'If an account exists for this email, a reset token has been generated.',
  })
  message: string;

  @ApiProperty({
    required: false,
    description:
      'Development-only raw token. In production, send this token by email and remove it from the API response.',
  })
  resetToken?: string;
}

export class MessageResponseDto {
  @ApiProperty({ example: 'Password reset successfully.' })
  message: string;
}

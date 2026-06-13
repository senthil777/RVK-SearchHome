import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'f20ed8ac-3c58-45f4-9a2e-9f61f3a4c1e6' })
  id: string;

  @ApiProperty({ example: 'Ravi' })
  firstName: string;

  @ApiProperty({ example: 'Kumar' })
  lastName: string;

  @ApiProperty({ example: 'ravi@example.com' })
  email: string;

  @ApiProperty({ example: '123 Main St, Bangalore' })
  address: string;

  @ApiProperty({ example: '2026-06-04T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-06-04T10:30:00.000Z' })
  updatedAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Successfully login' })
  message: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;
}

export class ForgotPasswordResponseDto {
  @ApiProperty({ example: 200 })
  status: number;

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
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Password reset successfully.' })
  message: string;
}

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  AuthResponseDto,
  ForgotPasswordResponseDto,
  ForgotOrResetPasswordResponseDto,
  MessageResponseDto,
} from './dto/auth-response.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotOrResetPasswordDto } from './dto/forgot-or-reset-password.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiConflictResponse({ description: 'Email is already registered.' })
  @ApiBadRequestResponse({ description: 'Invalid request body.' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiOkResponse({ type: AuthResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password.' })
  @ApiBadRequestResponse({ description: 'Invalid request body.' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('forgot-or-reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate a password reset token OR reset password with a valid token' })
  @ApiOkResponse({ type: ForgotOrResetPasswordResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid request body or reset token is invalid/expired.' })
  forgotOrResetPassword(@Body() dto: ForgotOrResetPasswordDto) {
    return this.authService.forgotOrResetPassword(dto);
  }
}

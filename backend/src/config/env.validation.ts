import { plainToInstance } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {
  @IsOptional()
  @IsString()
  @MinLength(1)
  DATABASE_URL?: string;

  @IsString()
  @MinLength(32)
  JWT_SECRET: string;

  @IsString()
  @MinLength(1)
  JWT_EXPIRY: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  PORT?: number;

  @IsOptional()
  @IsString()
  CORS_ORIGIN?: string;

  @IsOptional()
  @IsString()
  DB_QUERY_LOGS?: string;

  @IsOptional()
  @IsString()
  STORAGE_PROVIDER?: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateListingMultipartDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'Property image file' })
  image: any;

  @ApiProperty({ example: 13.0110353 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 77.6487547 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: 'This is my captured villa.' })
  @IsOptional()
  @IsString()
  description?: string;
}

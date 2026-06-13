import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateListingDto {
  @ApiProperty({ example: 'http://localhost:3000/uploads/photo_123.jpg' })
  @IsNotEmpty()
  @IsString()
  imageUrl: string;

  @ApiProperty({ example: 13.0110353 })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 77.6487547 })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: 'This is my captured villa.' })
  @IsOptional()
  @IsString()
  description?: string;
}

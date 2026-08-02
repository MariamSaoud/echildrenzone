import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class AddContentAge {
  @ApiProperty({
    description: 'The starting age restriction for the content',
    minimum: 0,
    maximum: 16,
    example: 5,
  })
  @IsNotEmpty()
  @Min(0)
  @Max(16)
  @IsNumber()
  startAge: number;

  @ApiProperty({
    description: 'The ending age restriction for the content',
    minimum: 0,
    maximum: 16,
    example: 12,
  })
  @IsNotEmpty()
  @Min(0)
  @Max(16)
  @IsNumber()
  endAge: number;
}

export class UpdateContentAge extends PartialType(AddContentAge) {}

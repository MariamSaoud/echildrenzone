import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class AddContentAge {
  @IsNotEmpty()
  @Min(0)
  @Max(16)
  @IsNumber()
  startAge: number;
  @IsNotEmpty()
  @Min(0)
  @Max(16)
  @IsNumber()
  endAge: number;
}
export class UpdateContentAge extends PartialType(AddContentAge) {}

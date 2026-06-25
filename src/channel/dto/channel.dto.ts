import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateChannel {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  description: string;
}
export class UpdateChannel extends PartialType(CreateChannel) {}
export class ToggleChannel {
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;
}

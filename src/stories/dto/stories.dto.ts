import { PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class AddStories {
  @IsNotEmpty()
  @IsString()
  url: string;
  @IsOptional()
  @IsString()
  description?: string;
  @IsOptional()
  @IsUUID(7)
  contentRecord?: string;
  @IsNotEmpty()
  @IsUUID(7)
  channelId: string;
  @IsNotEmpty()
  @IsUUID(7)
  categoryId: string;
}
export class UpdateStories extends PartialType(AddStories) {}
export enum status {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
export class confirmRejectStories {
  @IsOptional()
  @IsString()
  rejectedReason?: string;
  @IsNotEmpty()
  @IsEnum(status)
  status: status;
}

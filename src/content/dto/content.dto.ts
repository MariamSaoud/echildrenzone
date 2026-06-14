import { PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum CONTENT_TYPE_ENUM {
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO',
}

export enum CONTENT_STATUS_ENUM {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED',
}
export class CreateContent {
  @IsNotEmpty()
  @IsString()
  description: string;
  @IsNotEmpty()
  @IsEnum(CONTENT_TYPE_ENUM)
  type: CONTENT_TYPE_ENUM;
  @IsNotEmpty()
  @IsString()
  url: string;
  @IsOptional()
  @IsUUID(7)
  playlistId?: string;
  @IsNotEmpty()
  @IsUUID(7)
  channelId: string;
  @IsNotEmpty()
  @IsUUID(7)
  categoryId: string;
  @IsNotEmpty()
  @IsUUID(7)
  contentAgeId: string;
}
export class UpdateContent extends PartialType(CreateContent) {}
export class ChangeContentStatus {
  @IsNotEmpty()
  @IsEnum(CONTENT_STATUS_ENUM)
  status: CONTENT_STATUS_ENUM;
  @IsOptional()
  @IsString()
  rejectedReason: string;
}

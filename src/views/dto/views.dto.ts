import { PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export enum VIEW_TYPE_ENUM {
  PHOTO = 'PHOTO',
  VIDEO = 'VIDEO',
  PLAYLIST = 'PLAYLIST',
}
export class AddView {
  @IsNotEmpty()
  @IsUUID(7)
  contentId: string;
  @IsNotEmpty()
  @IsEnum(VIEW_TYPE_ENUM)
  Type: VIEW_TYPE_ENUM;
  @IsOptional()
  @IsString()
  WatchTime?: string;
  @IsOptional()
  @IsString()
  OriginTime?: string;
}
export class UpdateView extends PartialType(AddView) {}

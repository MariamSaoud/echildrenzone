import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'The unique UUID (v7) of the target content',
    example: '0190c74b-4b11-7c5e-88b9-1f2e3d4c5b6a',
  })
  @IsNotEmpty()
  @IsUUID(7)
  contentId: string;

  @ApiProperty({
    description: 'The format type of the viewed content',
    enum: VIEW_TYPE_ENUM,
    example: VIEW_TYPE_ENUM.VIDEO,
  })
  @IsNotEmpty()
  @IsEnum(VIEW_TYPE_ENUM)
  Type: VIEW_TYPE_ENUM;

  @ApiPropertyOptional({
    description:
      'The duration the content was watched/viewed (e.g., in seconds or HH:MM:SS format)',
    example: '00:05:23',
  })
  @IsOptional()
  @IsString()
  WatchTime?: string;

  @ApiPropertyOptional({
    description:
      'The timestamp marker where the user started viewing the content',
    example: '00:00:00',
  })
  @IsOptional()
  @IsString()
  OriginTime?: string;
}

// Swagger automatically handles this class entirely thanks to PartialType!
export class UpdateView extends PartialType(AddView) {}

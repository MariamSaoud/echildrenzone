import { ApiProperty, PartialType } from '@nestjs/swagger';
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
  @ApiProperty({
    description: 'Detailed description of the content',
    example: 'An educational video about advanced TypeScript features.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The type of the content media',
    enum: CONTENT_TYPE_ENUM,
    example: CONTENT_TYPE_ENUM.VIDEO,
  })
  @IsNotEmpty()
  @IsEnum(CONTENT_TYPE_ENUM)
  type: CONTENT_TYPE_ENUM;

  @ApiProperty({
    description: 'The direct storage or cloud link URL of the file',
    example: 'https://cdn.example.com/videos/typescript-guide.mp4',
  })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({
    description:
      'The UUID (version 7) of the playlist this content belongs to (if any)',
    example: '018f43a2-7d8a-7b3f-8a1a-2b3c4d5e6f7a',
    required: false,
  })
  @IsOptional()
  @IsUUID(7)
  playlistId?: string;

  @ApiProperty({
    description: 'The UUID (version 7) of the associated channel',
    example: '018f43a2-7d8a-7b3f-8a1a-2b3c4d5e6f7b',
  })
  @IsNotEmpty()
  @IsUUID(7)
  channelId: string;

  @ApiProperty({
    description: 'The UUID (version 7) of the content category',
    example: '018f43a2-7d8a-7b3f-8a1a-2b3c4d5e6f7c',
  })
  @IsNotEmpty()
  @IsUUID(7)
  categoryId: string;

  @ApiProperty({
    description:
      'The UUID (version 7) of the targeted target age group structure',
    example: '018f43a2-7d8a-7b3f-8a1a-2b3c4d5e6f7d',
  })
  @IsNotEmpty()
  @IsUUID(7)
  contentAgeId: string;
}

export class UpdateContent extends PartialType(CreateContent) {}

export class ChangeContentStatus {
  @ApiProperty({
    description: 'The new moderation or workflow status of the content',
    enum: CONTENT_STATUS_ENUM,
    example: CONTENT_STATUS_ENUM.APPROVED,
  })
  @IsNotEmpty()
  @IsEnum(CONTENT_STATUS_ENUM)
  status: CONTENT_STATUS_ENUM;

  @ApiProperty({
    description:
      'The clear reason explaining why the content was rejected (Required if status is REJECTED)',
    example: 'Content contains inappropriate language at 02:30.',
    required: false,
  })
  @IsOptional()
  @IsString()
  rejectedReason: string;
}

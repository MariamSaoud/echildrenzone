import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class AddStories {
  @ApiProperty({
    description: 'The direct storage or cloud URL link of the story media file',
    example: 'https://cdn.example.com/stories/day-one.mp4',
  })
  @IsNotEmpty()
  @IsString()
  url: string;

  @ApiProperty({
    description: 'Optional caption or text description for the story',
    example: 'Behind the scenes looks!',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description:
      'Optional UUID (version 7) mapping to a related content record',
    example: '018f43a2-7d8a-7b3f-8a1a-2b3c4d5e6f7a',
    required: false,
  })
  @IsOptional()
  @IsUUID(7)
  contentRecord?: string;

  @ApiProperty({
    description: 'The UUID (version 7) of the channel creating this story',
    example: '018f43a2-7d8a-7b3f-8a1a-2b3c4d5e6f7b',
  })
  @IsNotEmpty()
  @IsUUID(7)
  channelId: string;

  @ApiProperty({
    description: 'The UUID (version 7) of the category this story belongs to',
    example: '018f43a2-7d8a-7b3f-8a1a-2b3c4d5e6f7c',
  })
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
  @ApiProperty({
    description:
      'The reason explaining why the story was rejected (Required if status is REJECTED)',
    example: 'The media file format is unsupported.',
    required: false,
  })
  @IsOptional()
  @IsString()
  rejectedReason?: string;

  @ApiProperty({
    description: 'The review decision status for the story',
    enum: status,
    example: status.APPROVED,
  })
  @IsNotEmpty()
  @IsEnum(status)
  status: status;
}

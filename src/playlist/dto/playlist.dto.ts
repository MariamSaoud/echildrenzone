import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddPlaylist {
  @ApiProperty({
    description: 'The name or title of the playlist',
    example: 'Learn NestJS From Scratch',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A detailed summary of what this playlist contains',
    example:
      'A complete step-by-step guide covering controllers, providers, and modules.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The UUID (version 7) of the channel this playlist belongs to',
    example: '018f43a2-7d8a-7b3f-8a1a-2b3c4d5e6f7a',
  })
  @IsNotEmpty()
  @IsUUID(7)
  channelId: string;

  @ApiProperty({
    description:
      'The UUID (version 7) of the content category linked to this playlist',
    example: '018f43a2-7d8a-7b3f-8a1a-2b3c4d5e6f7b',
  })
  @IsNotEmpty()
  @IsUUID(7)
  categoryId: string;

  @ApiProperty({
    description: 'The UUID (version 7) of the targeted age group structure',
    example: '018f43a2-7d8a-7b3f-8a1a-2b3c4d5e6f7c',
  })
  @IsNotEmpty()
  @IsUUID(7)
  contentAgeId: string;
}

export class updatePlaylist extends PartialType(AddPlaylist) {}

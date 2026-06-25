import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddPlaylist {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  description: string;
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

export class updatePlaylist extends PartialType(AddPlaylist) {}

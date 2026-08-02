import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class AddComment {
  @ApiProperty({
    description: 'The UUID (version 7) of the content being commented on',
    example: '018f43a2-7d8a-7b3f-8a1a-2b3c4d5e6f7a',
  })
  @IsNotEmpty()
  @IsUUID(7)
  contentId: string;

  @ApiProperty({
    description: 'The text content of the comment',
    example: 'This is a very helpful video, thank you!',
  })
  @IsNotEmpty()
  @IsString()
  comment: string;
}

export class UpdateComment {
  @ApiProperty({
    description: 'The updated text content of the comment',
    example: 'This is an updated comment text.',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment: string;
}

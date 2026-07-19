import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddQuestion {
  @ApiProperty({
    description: 'The question text or prompt',
    example: 'Is TypeScript a superset of JavaScript?',
  })
  @IsNotEmpty()
  @IsString()
  question: string;

  @ApiProperty({
    description: 'The correct boolean answer to the question',
    type: Boolean,
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  answer: boolean;

  @ApiProperty({
    description: 'The UUID (version 7) of the content this question belongs to',
    example: '018f43a2-7d8a-7b3f-8a1a-2b3c4d5e6f7a',
  })
  @IsNotEmpty()
  @IsUUID(7)
  contentId: string;
}

export class UpdateQuestion extends PartialType(AddQuestion) {}

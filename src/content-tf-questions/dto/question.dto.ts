import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class AddQuestion {
  @IsNotEmpty()
  @IsString()
  question: string;
  @IsNotEmpty()
  @IsBoolean()
  answer: boolean;
  @IsNotEmpty()
  @IsUUID(7)
  contentId: string;
}
export class UpdateQuestion extends PartialType(AddQuestion) {}

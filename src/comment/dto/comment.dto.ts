import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class AddComment {
  @IsNotEmpty()
  @IsUUID(7)
  contentId: string;
  @IsNotEmpty()
  @IsString()
  comment: string;
}
export class UpdateComment {
  @IsOptional()
  @IsString()
  comment: string;
}

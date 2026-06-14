import { IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export enum REACTION_TYPE_ENUM {
  LIKE = 'LIKE',
  LOVE = 'LOVE',
  FUNNY = 'FUNNY',
  INSIGHTFUL = 'INSIGHTFUL',
}
export class AddReaction {
  @IsNotEmpty()
  @IsUUID(7)
  contentId: string;
  @IsNotEmpty()
  @IsEnum(REACTION_TYPE_ENUM)
  type: REACTION_TYPE_ENUM;
}
export class UpdateReaction {
  @IsOptional()
  @IsEnum(REACTION_TYPE_ENUM)
  type: REACTION_TYPE_ENUM;
}

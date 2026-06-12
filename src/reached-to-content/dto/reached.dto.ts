import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
export enum REACHED_TYPE_ENUM {
  REACTION = 'REACTION',
  COMMENT = 'COMMENT',
  ADDTOFAV = 'ADDTOFAV',
  SUBSCRIBE = 'SUBSCRIBE',
  VIEW = 'VIEW',
}

export enum CURRENCY_ENUM {
  USD = 'USD',
}

export class ReachedToContent {
  @IsOptional()
  @IsEnum(CURRENCY_ENUM)
  currency: CURRENCY_ENUM = CURRENCY_ENUM.USD;
  @IsNotEmpty()
  @IsEnum(REACHED_TYPE_ENUM)
  type: REACHED_TYPE_ENUM;
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  paymentAmount?: number;
}
export class UpdateReachedToContent extends PartialType(ReachedToContent) {}

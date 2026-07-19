import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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

export class AddUserActionsPricing {
  @ApiPropertyOptional({
    description: 'The currency used for the pricing configuration',
    enum: CURRENCY_ENUM,
    default: CURRENCY_ENUM.USD,
    example: CURRENCY_ENUM.USD,
  })
  @IsOptional()
  @IsEnum(CURRENCY_ENUM)
  currency: CURRENCY_ENUM = CURRENCY_ENUM.USD;

  @ApiProperty({
    description: 'The specific user interaction type being priced',
    enum: REACHED_TYPE_ENUM,
    example: REACHED_TYPE_ENUM.REACTION,
  })
  @IsNotEmpty()
  @IsEnum(REACHED_TYPE_ENUM)
  type: REACHED_TYPE_ENUM;

  @ApiPropertyOptional({
    description:
      'The amount to be paid for the specific action type (max 2 decimal places)',
    type: 'number',
    example: 0.5,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  paymentAmount?: number;
}

export class UpdateUserActionsPricing {
  @ApiPropertyOptional({
    description: 'The currency used for the pricing configuration',
    enum: CURRENCY_ENUM,
    default: CURRENCY_ENUM.USD,
    example: CURRENCY_ENUM.USD,
  })
  @IsOptional()
  @IsEnum(CURRENCY_ENUM)
  currency: CURRENCY_ENUM = CURRENCY_ENUM.USD;

  @ApiPropertyOptional({
    description:
      'The updated amount to be paid for the action type (max 2 decimal places)',
    type: 'number',
    example: 0.75,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  paymentAmount?: number;
}

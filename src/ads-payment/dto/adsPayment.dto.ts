import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { CONTENT_TYPE_ENUM } from 'src/content/dto/content.dto';

export class CreateAdsPayment {
  @ApiProperty({
    description: 'The type of content for the advertisement',
    enum: CONTENT_TYPE_ENUM,
    example: CONTENT_TYPE_ENUM.VIDEO,
  })
  @IsNotEmpty()
  @IsEnum(CONTENT_TYPE_ENUM)
  type: CONTENT_TYPE_ENUM;

  @ApiProperty({
    description: 'The type or category of the payment amount',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  amountType: number;
}

export class UpdateAdsPayment extends PartialType(CreateAdsPayment) {}

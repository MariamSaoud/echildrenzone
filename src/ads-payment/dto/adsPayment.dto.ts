import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { CONTENT_TYPE_ENUM } from 'src/content/dto/content.dto';

export class CreateAdsPayment {
  @IsNotEmpty()
  @IsEnum(CONTENT_TYPE_ENUM)
  type: CONTENT_TYPE_ENUM;
  @IsNotEmpty()
  @IsNumber()
  amountType: number;
}
export class UpdateAdsPayment extends PartialType(CreateAdsPayment) {}

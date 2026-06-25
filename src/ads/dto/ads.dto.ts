import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class Ads {
  @IsNotEmpty()
  @IsString()
  url: string;
  @IsNotEmpty()
  @IsUUID(7)
  channelId: string;
  @IsNotEmpty()
  @IsUUID(7)
  paymentId: string;
  @IsNotEmpty()
  @IsUUID(7)
  contentAgeId: string;
}

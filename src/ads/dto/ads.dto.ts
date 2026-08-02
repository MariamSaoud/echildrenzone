import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class Ads {
  @ApiProperty({
    description: 'The UUID (version 7) of the channel',
    example: '018f43a2-7d8a-7b3f-8a1a-2b3c4d5e6f7a',
  })
  @IsNotEmpty()
  @IsUUID(7)
  channelId: string;

  @ApiProperty({
    description: 'The UUID (version 7) of the payment transaction',
    example: '018f43a2-7d8a-7b3f-8a1a-2b3c4d5e6f7b',
  })
  @IsNotEmpty()
  @IsUUID(7)
  paymentId: string;

  @ApiProperty({
    description: 'The UUID (version 7) of the content age rating',
    example: '018f43a2-7d8a-7b3f-8a1a-2b3c4d5e6f7c',
  })
  @IsNotEmpty()
  @IsUUID(7)
  contentAgeId: string;
}

import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateChannel {
  @ApiProperty({
    description: 'The name of the channel',
    example: 'Tech Pioneers Channel',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A brief summary or description of what the channel is about',
    example:
      'A channel dedicated to exploring future technologies and programming tutorials.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdateChannel extends PartialType(CreateChannel) {}

export class ToggleChannel {
  @ApiProperty({
    description: 'The status to activate or deactivate the channel',
    type: Boolean,
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  active: boolean;
}

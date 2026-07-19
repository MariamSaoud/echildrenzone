import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangePassword {
  @ApiProperty({
    description: 'The email address associated with the account',
    example: 'user@business.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The current password of the user',
    format: 'password',
    example: 'OldP@ssword123!',
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'The new password to be set',
    format: 'password',
    example: 'NewS3cureP@ss!',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @ApiProperty({
    description:
      'Whether to log out from all other active devices and sessions',
    type: Boolean,
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  terminateAllSessions: boolean;
}

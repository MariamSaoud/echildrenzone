import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export enum PURPOSE {
  FORGET_PASSWORD = 'FORGET_PASSWORD',
}

export class Verify {
  @ApiProperty({
    description: 'The 4-digit One-Time Password (OTP) sent to the user',
    minLength: 4,
    maxLength: 4,
    example: '1234',
  })
  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  otp: string;

  @ApiProperty({
    description: 'The email address associated with the verification request',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The intended purpose for the OTP verification',
    enum: PURPOSE,
    example: PURPOSE.FORGET_PASSWORD,
  })
  @IsString()
  @IsNotEmpty()
  purpose: PURPOSE;
}

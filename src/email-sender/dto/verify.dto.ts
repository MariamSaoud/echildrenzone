import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class Verify {
  @IsString()
  @IsNotEmpty()
  @Length(4, 4)
  otp: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  purpose: PURPOSE;
}
export enum PURPOSE {
  FORGET_PASSWORD = 'FORGET_PASSWORD',
}

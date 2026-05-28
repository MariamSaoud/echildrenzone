import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class BusinessLogin {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsNotEmpty()
  @IsString()
  pin: string;
}

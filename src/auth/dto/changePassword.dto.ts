import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class changePassword {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  oldPassword: string;
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

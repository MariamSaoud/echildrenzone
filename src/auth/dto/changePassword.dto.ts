import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ChangePassword {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  oldPassword: string;
  @IsNotEmpty()
  @IsString()
  newPassword: string;
  @IsBoolean()
  @IsNotEmpty()
  terminateAllSessions: boolean;
}

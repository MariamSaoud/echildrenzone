import { IsNotEmpty, IsString } from 'class-validator';

export class Logout {
  @IsNotEmpty()
  @IsString()
  authId: string;
}
export class LogoutAll {
  @IsNotEmpty()
  @IsString()
  accountId: string;
}

import { IsNotEmpty, IsString } from 'class-validator';

export class Logout {
  @IsNotEmpty()
  @IsString()
  accountId: string;
  @IsNotEmpty()
  @IsString()
  userId: string;
}

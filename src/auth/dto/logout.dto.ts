import { IsNotEmpty, IsNumber } from 'class-validator';

export class Logout {
  @IsNotEmpty()
  @IsNumber()
  accountId: number;
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}

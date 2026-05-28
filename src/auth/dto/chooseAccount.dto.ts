import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class MainRequestchooseAccount {
  @IsNotEmpty()
  @IsNotEmpty()
  @IsString()
  id: string;
  @IsNotEmpty()
  @IsString()
  token: string;
  @IsOptional()
  @IsString()
  pin: string;
}

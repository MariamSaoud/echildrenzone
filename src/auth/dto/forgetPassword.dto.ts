import { IsNotEmpty, IsString } from 'class-validator';
export class forgetPassword {
  @IsNotEmpty()
  @IsString()
  token: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}

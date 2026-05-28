import { IsEmail, IsNotEmpty } from 'class-validator';

export class Send {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

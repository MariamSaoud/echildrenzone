import { IsNotEmpty, IsString } from 'class-validator';

export class refreshToken {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

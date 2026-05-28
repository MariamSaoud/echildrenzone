import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
export class chooseAccount {
  @IsNotEmpty()
  @IsInt()
  id: number;
  @IsNotEmpty()
  @IsString()
  fullName: string;
  @IsNotEmpty()
  @IsBoolean()
  requiredPin: boolean;
}
export class MainRequestchooseAccount {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => chooseAccount)
  account: chooseAccount;

  @IsNotEmpty()
  @IsString()
  token: string;
  @IsOptional()
  @IsString()
  pin: string;
}

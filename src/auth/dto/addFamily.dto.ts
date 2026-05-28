import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { gender, Role } from './register.dto';
import { Type } from 'class-transformer';

export class addFamily {
  @IsNotEmpty()
  @IsString()
  fullName: string;
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birthdayDate: Date;
  @IsNotEmpty()
  @IsString()
  gender: gender;
  @IsOptional()
  @IsString()
  @Length(4, 4)
  pin: string;
  @IsNotEmpty()
  @IsString()
  role: Role;
}

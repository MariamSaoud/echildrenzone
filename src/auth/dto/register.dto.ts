import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
export class Register {
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
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
  @IsOptional()
  @IsString()
  @Length(4, 4)
  pin: string;
  @IsNotEmpty()
  @IsString()
  role: Role;
}
export enum gender {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
}
export enum Role {
  ADMIN = 'ADMIN',
  CREATOR = 'CREATOR',
  PARENT = 'PARENT',
  CHILD = 'CHILD',
}

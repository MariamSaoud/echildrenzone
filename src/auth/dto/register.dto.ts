import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

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

export class Register {
  @ApiProperty({
    description: 'The full name of the user',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'The user birth date',
    type: String,
    format: 'date-time',
    example: '2000-01-01T00:00:00.000Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birthdayDate: Date;

  @ApiProperty({
    description: 'The gender of the user',
    enum: gender,
    example: gender.MALE,
  })
  @IsNotEmpty()
  @IsString()
  gender: gender;

  @ApiProperty({
    description: 'The unique email address for registration',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'A secure password for the account',
    format: 'password',
    example: 'S3cureP@ssword!',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'A 4-digit security PIN code',
    minLength: 4,
    maxLength: 4,
    example: '1234',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(4, 4)
  pin: string;

  @ApiProperty({
    description: 'The account system role',
    enum: Role,
    example: Role.CREATOR,
  })
  @IsNotEmpty()
  @IsString()
  role: Role;

  @ApiProperty({
    description: 'The URL of the profile picture',
    example: 'https://example.com/profiles/john.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  profileUrl: string;
}

export class UpdateProfile extends PartialType(
  OmitType(Register, ['password', 'role'] as const),
) {}

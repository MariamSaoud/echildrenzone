import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { gender, Role } from '../../auth/dto/register.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddFamily {
  @ApiProperty({
    description: 'The full name of the family member',
    example: 'John Doe',
  })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({
    description: 'The birthday date of the family member',
    type: 'string',
    format: 'date-time',
    example: '1995-06-15T00:00:00.000Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birthdayDate: Date;

  @ApiProperty({
    description: 'The gender of the family member',
    enum: gender,
    example: gender.MALE,
  })
  @IsNotEmpty()
  @IsString()
  gender: gender;

  @ApiPropertyOptional({
    description: 'A 4-digit security PIN number',
    minLength: 4,
    maxLength: 4,
    example: '1234',
  })
  @IsOptional()
  @IsString()
  @Length(4, 4)
  pin: string;

  @ApiProperty({
    description: 'The system role assigned to the family member',
    enum: Role, // Automatically extracts values if Role is a TypeScript enum
    example: Role.PARENT,
  })
  @IsNotEmpty()
  @IsString()
  role: Role;
}

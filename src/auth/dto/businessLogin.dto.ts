import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class BusinessLogin {
  @ApiProperty({
    description: 'The business email address used for login',
    example: 'company@business.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The secure password for the business account',
    format: 'password',
    example: 'P@ssword123!',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

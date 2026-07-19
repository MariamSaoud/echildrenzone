import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class forgetPassword {
  @ApiProperty({
    description: 'The password reset token received via email or SMS',
    example: 'reset-token-abc-123',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    description: 'The new secure password to set for the account',
    format: 'password', // يخفي الأحرف أثناء الكتابة في Swagger
    example: 'NewS3cureP@ss!',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}

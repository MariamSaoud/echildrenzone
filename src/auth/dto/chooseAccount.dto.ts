import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MainRequestchooseAccount {
  @ApiProperty({
    description: 'The unique identifier (ID) of the account',
    example: 'acc_123456',
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The access token required for account switching/validation',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsNotEmpty()
  @IsString()
  token: string;

  @ApiProperty({
    description: 'The security PIN code for the account (if enabled)',
    format: 'password', // اختياري: لإخفاء الأرقام أثناء الكتابة في Swagger
    example: '1234',
    required: false, // يخبر Swagger بأن هذا الحقل اختياري
  })
  @IsOptional()
  @IsString()
  pin: string;
}

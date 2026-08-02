import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class Logout {
  @ApiProperty({
    description: 'The unique authentication session ID to be terminated',
    example: 'auth_sess_98765',
  })
  @IsNotEmpty()
  @IsString()
  authId: string;
}

export class LogoutAll {
  @ApiProperty({
    description:
      'The unique account ID to terminate all of its active sessions',
    example: 'acc_550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsString()
  accountId: string;
}

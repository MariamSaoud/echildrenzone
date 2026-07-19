import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { Role } from 'src/auth/dto/register.dto';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserBalanceService } from './user-balance.service';
import { GetUser } from 'src/decorators/getUser.decorator';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('user-balance')
export class UserBalanceController {
  constructor(private userBalanceService: UserBalanceService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Put(':id')
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The ID of the user balance',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          example: 30,
          description: 'withdraw creator',
        },
      },
      required: ['channelId'],
    },
  })
  withdrawCreator(@Param('id') id: string, @Body('amount') amount: number) {
    return this.userBalanceService.withdrawCreator(id, amount);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Get()
  getCreatorBalance(@GetUser('id') id: string) {
    return this.userBalanceService.getCreatorBalance(id);
  }
}

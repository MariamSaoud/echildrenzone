import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { Role } from 'src/auth/dto/register.dto';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { UserBalanceService } from './user-balance.service';
import { GetUser } from 'src/decorators/getUser.decorator';

@Controller('user-balance')
export class UserBalanceController {
  constructor(private userBalanceService: UserBalanceService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Put(':id')
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

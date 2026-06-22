import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AddFamily } from './dto/addFamily.dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Register, Role } from '../auth/dto/register.dto';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { hasPIN } from 'src/guards/hasPin.guard';
import { GetAccountId } from 'src/decorators/getAccountId.decorator';
import { GetUser } from 'src/decorators/getUser.decorator';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @Get()
  profile(@GetUser('id') userId: string, @GetUser('role') role: Role) {
    return this.userService.getProfile(userId, role);
  }
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard, IsntBlocked)
  @Post('admin')
  addAdmin(@Body() dto: Register) {
    return this.userService.addAdmin(dto);
  }
  @Roles(Role.PARENT)
  @UseGuards(RolesGuard, IsntBlocked, hasPIN)
  @Post('family')
  addFamily(
    @Body() dto: AddFamily,
    @GetAccountId() accountId: string,
    @GetUser('id') userId: string,
  ) {
    return this.userService.addFamily(dto, accountId, userId);
  }
  @Roles(Role.PARENT)
  @UseGuards(RolesGuard, IsntBlocked, hasPIN)
  @Get()
  children(@GetUser('id') userId: string) {
    return this.userService.getChildren(userId);
  }
}

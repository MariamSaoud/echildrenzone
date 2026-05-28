import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Register, Role } from './dto/register.dto';
import { AuthService } from './auth.service';
import { Login } from './dto/login.dto';
import { MainRequestchooseAccount } from './dto/chooseAccount.dto';
import { Public } from 'src/decorators/jwt.ispublic.decorator';
import { BusinessLogin } from './dto/businessLogin.dto';
import { changePassword } from './dto/changePassword.dto';
import { GetUser } from 'src/decorators/getUser.decorator';
import { GetAccountId } from 'src/decorators/getAccountId.decorator';
import { addFamily } from './dto/addFamily.dto';
import { rolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { hasPIN } from 'src/guards/hasPin.guard';
import { refreshToken } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('sign-up')
  usersRegister(@Body() dto: Register) {
    return this.authService.register(dto);
  }
  @Public()
  @Post('login-s1')
  firstSteplogin(@Body() dto: Login) {
    return this.authService.login(dto);
  }
  @Public()
  @Post('login-s2')
  secondSteplogin(@Body() dto: MainRequestchooseAccount) {
    return this.authService.chooseAccount(dto);
  }
  @Public()
  @Post('business-login')
  businessLogin(@Body() dto: BusinessLogin) {
    return this.authService.businessLogin(dto);
  }
  @UseGuards(IsntBlocked, hasPIN)
  @Post('change-password')
  changePassword(@Body() dto: changePassword) {
    return this.authService.changePassword(dto);
  }
  @Post('logout')
  logout(@GetUser('id') userId: number, @GetAccountId() accountId: number) {
    return this.authService.logout({ accountId, userId });
  }
  @Roles(Role.ADMIN)
  @UseGuards(rolesGuard, IsntBlocked, hasPIN)
  @Post('admin')
  addAdmin(@Body() dto: Register) {
    return this.authService.addAdmin(dto);
  }
  @Roles(Role.PARENT)
  @UseGuards(rolesGuard, IsntBlocked, hasPIN)
  @Post('family')
  addFamily(
    @Body() dto: addFamily,
    @GetAccountId() accountId: number,
    @GetUser('id') userId: number,
  ) {
    return this.authService.addFamily(dto, accountId, userId);
  }
  @Public()
  @Post('refresh')
  refreshToken(@Body() dto: refreshToken) {
    return this.authService.refreshToken(dto);
  }
}

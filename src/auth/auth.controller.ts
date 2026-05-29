import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Register } from './dto/register.dto';
import { AuthService } from './auth.service';
import { Login } from './dto/login.dto';
import { MainRequestchooseAccount } from './dto/chooseAccount.dto';
import { Public } from 'src/decorators/jwt.ispublic.decorator';
import { BusinessLogin } from './dto/businessLogin.dto';
import { ChangePassword } from './dto/changePassword.dto';
import { GetUser } from 'src/decorators/getUser.decorator';
import { GetAccountId } from 'src/decorators/getAccountId.decorator';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { hasPIN } from 'src/guards/hasPin.guard';
import { RefreshToken } from './dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('sign-up')
  usersRegister(@Body() dto: Register) {
    return this.authService.register(dto);
  }
  @Public()
  @Post('login')
  login(@Body() dto: Login) {
    return this.authService.login(dto);
  }
  @Public()
  @Post('choose-account')
  chooseAccount(@Body() dto: MainRequestchooseAccount) {
    return this.authService.chooseAccount(dto);
  }
  @Public()
  @Post('business-login')
  businessLogin(@Body() dto: BusinessLogin) {
    return this.authService.businessLogin(dto);
  }
  @UseGuards(IsntBlocked)
  @Post('change-password')
  changeBusinessPassword(@GetUser('accountId') id:string,@Body() dto: ChangePassword) {
    return this.authService.changePassword(id,dto);
  }
  @UseGuards(IsntBlocked, hasPIN)
  @Post('change-password')
  changePassword(@GetUser('accountId') id:string,@Body() dto: ChangePassword) {
    return this.authService.changePassword(id,dto);
  }
  @Post('logout')
  logout(@GetUser('id') userId: string, @GetAccountId() accountId: string) {
    return this.authService.logout({ accountId, userId });
  }
  @Public()
  @Post('refresh')
  refreshToken(@Body() dto: RefreshToken) {
    return this.authService.refreshToken(dto);
  }
}

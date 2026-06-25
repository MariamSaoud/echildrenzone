import { Body, Controller, Post, UseGuards, Delete } from '@nestjs/common';
import { Register, Role } from './dto/register.dto';
import { AuthService } from './auth.service';
import { Login } from './dto/login.dto';
import { MainRequestchooseAccount } from './dto/chooseAccount.dto';
import { Public } from 'src/decorators/jwt.ispublic.decorator';
import { BusinessLogin } from './dto/businessLogin.dto';
import { ChangePassword } from './dto/changePassword.dto';
import { GetUser } from 'src/decorators/getUser.decorator';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { hasPIN } from 'src/guards/hasPin.guard';
import { RefreshToken } from './dto/refreshToken.dto';
import { GetAuthId } from 'src/decorators/getAuthId.decorators';
import { GetAccountId } from 'src/decorators/getAccountId.decorator';
import { Send } from 'src/email-sender/dto/send.dto';
import { Verify } from 'src/email-sender/dto/verify.dto';
import { forgetPassword } from './dto/forgetPassword.dto';

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
  changeBusinessPassword(
    @GetUser('accountId') id: string,
    @Body() dto: ChangePassword,
  ) {
    return this.authService.changePassword(id, dto);
  }
  @UseGuards(IsntBlocked, hasPIN)
  @Post('users/change-password')
  changePassword(
    @GetUser('accountId') id: string,
    @Body() dto: ChangePassword,
  ) {
    return this.authService.changePassword(id, dto);
  }
  @Post('logout')
  logout(@GetAuthId() authId: string) {
    return this.authService.logout({ authId });
  }
  @Post('logout-all')
  logoutAll(@GetAccountId() accountId: string) {
    return this.authService.logoutAll({ accountId });
  }
  @Public()
  @Post('refresh')
  refreshToken(@Body() dto: RefreshToken) {
    return this.authService.refreshToken(dto);
  }
  @Public()
  @Post('send')
  sendOtp(@Body() dto: Send) {
    return this.authService.sendOTP(dto);
  }
  @Public()
  @Post('verify')
  verifyOtp(@Body() dto: Verify) {
    return this.authService.verifyOTP(dto);
  }
  @Public()
  @Post('forget-password')
  forgetPassword(@Body() dto: forgetPassword) {
    return this.authService.forgetPassword(dto);
  }
  @Delete()
  deleteUser(
    @GetUser('id') id: string,
    @GetUser('role') role: Role,
    @GetAccountId() accId: string,
  ) {
    return this.authService.deleteUser(id, role, accId);
  }
}

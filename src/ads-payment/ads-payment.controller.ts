import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Role } from 'src/auth/dto/register.dto';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { AdsPaymentService } from './ads-payment.service';
import { CreateAdsPayment, UpdateAdsPayment } from './dto/adsPayment.dto';

@Controller('ads-payment')
export class AdsPaymentController {
  constructor(private adsPaymentService: AdsPaymentService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Post()
  createAdsPayment(@Body() dto: CreateAdsPayment) {
    return this.adsPaymentService.createAdsPayment(dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Put(':id')
  updateAdsPayment(@Param('id') id: string, @Body() dto: UpdateAdsPayment) {
    return this.adsPaymentService.updateAdsPayment(id, dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN, Role.CREATOR)
  @Get()
  getAds(@Query('page') page: number, @Query('limit') limit: number) {
    return this.adsPaymentService.getAds(page, limit);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN, Role.CREATOR)
  @Get(':id')
  getAdsDetails(@Param('id') id: string) {
    return this.adsPaymentService.getAdsDetails(id);
  }
}

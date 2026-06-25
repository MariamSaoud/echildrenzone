import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdsService } from './ads.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { Role } from 'src/auth/dto/register.dto';
import { Ads, CONTENT_STATUS_ENUM } from 'generated/prisma/browser';

@Controller('ads')
export class AdsController {
  constructor(private adsService: AdsService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Post()
  addAds(@Body() dto: Ads) {
    return this.adsService.addAds(dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Put(':id')
  changeAdsStatus(
    @Param('id') id: string,
    @Body('status') status: CONTENT_STATUS_ENUM,
  ) {
    return this.adsService.changeAdsStatus(id, status);
  }
}

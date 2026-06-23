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
import { userActionsPricingService } from './user-actions-pricing-config.service';
import {
  AddUserActionsPricing,
  UpdateUserActionsPricing,
} from './dto/user-actions-pricing-config';

@Controller('reached-to-content')
export class userActionsPricingController {
  constructor(private userActionsPricingServier: userActionsPricingService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Post()
  createReachedTo(@Body() dto: AddUserActionsPricing) {
    return this.userActionsPricingServier.createReachedTo(dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Put(':id')
  updateReachedTo(
    @Param('id') id: string,
    @Body() dto: UpdateUserActionsPricing,
  ) {
    return this.userActionsPricingServier.updateReachedTo(id, dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Get()
  getReachedTo(@Query('page') page: number, @Query('limit') limit: number) {
    return this.userActionsPricingServier.getReachedTo(page, limit);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Get(':id')
  getReachedToDetails(@Param('id') id: string) {
    return this.userActionsPricingServier.getReachedToDetails(id);
  }
}

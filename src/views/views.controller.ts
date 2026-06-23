import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Role } from 'src/auth/dto/register.dto';
import { GetUser } from 'src/decorators/getUser.decorator';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { AddView } from './dto/views.dto';
import { ViewsService } from './views.service';

@Controller('views')
export class ViewsController {
  constructor(private viewsService: ViewsService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CHILD)
  @Post()
  addView(@GetUser('id') childId: string, @Body() dto: AddView) {
    return this.viewsService.addView(childId, dto);
  }
}

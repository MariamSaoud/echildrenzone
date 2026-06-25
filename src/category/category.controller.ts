import {
  Body,
  Controller,
  Delete,
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
import { CategoryService } from './category.service';
import { AddCategory, updateCategory } from './dto/category.dto';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Post()
  createCategory(@Body() dto: AddCategory) {
    return this.categoryService.createCategory(dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Put(':id')
  updateCategory(@Param('id') categoryId: string, @Body() dto: updateCategory) {
    return this.categoryService.updateCategory(categoryId, dto);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN)
  @Delete(':id')
  deleteCategory(@Param('id') categoryId: string) {
    return this.categoryService.deleteCategory(categoryId);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN, Role.CREATOR)
  @Get()
  getCategory(@Query('page') page: number, @Query('limit') limit: number) {
    return this.categoryService.getCategory(page, limit);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN, Role.CREATOR)
  @Get('/archived')
  getArchivedCategory(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.categoryService.getArchivedCategory(page, limit);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN, Role.CREATOR)
  @Get(':id')
  getCategoryDetails(@Param('id') categoryId: string) {
    return this.categoryService.getCategoryDetails(categoryId);
  }
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.ADMIN, Role.CREATOR)
  @Post(':id/archive')
  archiveToggle(@Param('id') categoryId: string) {
    return this.categoryService.archiveToggle(categoryId);
  }
}

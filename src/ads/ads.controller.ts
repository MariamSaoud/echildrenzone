import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdsService } from './ads.service';
import { RolesGuard } from 'src/guards/roles.guard';
import { IsntBlocked } from 'src/guards/isntBlocked.guard';
import { Roles } from 'src/decorators/rolesGuard.decorator';
import { Role } from 'src/auth/dto/register.dto';
import { Ads } from './dto/ads.dto';
import { CONTENT_STATUS_ENUM } from 'src/content/dto/content.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
@ApiBearerAuth('access-token')
@ApiExtraModels(Ads)
@Controller('ads')
export class AdsController {
  constructor(private adsService: AdsService) {}
  @UseGuards(RolesGuard, IsntBlocked)
  @Roles(Role.CREATOR)
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      allOf: [
        { $ref: getSchemaPath(Ads) },
        {
          type: 'object',
          properties: {
            file: { type: 'string', format: 'binary' },
          },
        },
      ],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  addAds(@Body() dto: Ads, @UploadedFile('file') file: Express.Multer.File) {
    return this.adsService.addAds(dto, file);
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

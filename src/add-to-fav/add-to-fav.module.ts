import { Module } from '@nestjs/common';
import { AddToFavController } from './add-to-fav.controller';
import { AddToFavService } from './add-to-fav.service';

@Module({
  controllers: [AddToFavController],
  providers: [AddToFavService]
})
export class AddToFavModule {}

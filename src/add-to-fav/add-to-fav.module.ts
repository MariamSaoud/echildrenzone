import { Module } from '@nestjs/common';
import { AddToFavController } from './add-to-fav.controller';
import { AddToFavService } from './add-to-fav.service';
import { UserBalanceModule } from 'src/user-balance/user-balance.module';

@Module({
  controllers: [AddToFavController],
  providers: [AddToFavService],
  imports: [UserBalanceModule],
})
export class AddToFavModule {}

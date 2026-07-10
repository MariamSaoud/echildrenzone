import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { UserBalanceModule } from 'src/user-balance/user-balance.module';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  imports: [UserBalanceModule],
})
export class FavoritesModule {}

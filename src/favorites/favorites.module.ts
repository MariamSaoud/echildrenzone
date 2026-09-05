import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { UserBalanceModule } from 'src/user-balance/user-balance.module';
import { UserCategoryScoreModule } from 'src/user-category-score/user-category-score.module';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService],
  imports: [UserBalanceModule, UserCategoryScoreModule],
})
export class FavoritesModule {}

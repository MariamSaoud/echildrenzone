import { Module } from '@nestjs/common';
import { ViewsController } from './views.controller';
import { ViewsService } from './views.service';
import { UserBalanceModule } from 'src/user-balance/user-balance.module';

@Module({
  controllers: [ViewsController],
  providers: [ViewsService],
  imports: [UserBalanceModule],
})
export class ViewsModule {}

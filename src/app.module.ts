import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from '@/base/common/configs/app.config';
import { DatabaseModule } from '@/base/database/database.module';
import { ProductModule } from './modules/product/product.module';
import { StoreModule } from './modules/store/store.module';
import { UserModule } from './modules/user/user.module';
import { OrderModule } from './modules/order/order.module';
import { OrderDetailsModule } from './modules/order-details/order-details.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { ChartModule } from './modules/chart/chart.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
    }),
    DatabaseModule,
    ProductModule,
    StoreModule,
    UserModule,
    OrderModule,
    OrderDetailsModule,
    DashboardModule,
    ReviewsModule,
    ChartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

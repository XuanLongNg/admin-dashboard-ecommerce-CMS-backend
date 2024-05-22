import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/modules/product/entities/product.entity';
import { OrderDetail } from '@/modules/order-details/entities/order-detail.entity';
import { Review } from '@/modules/reviews/entities/review.entity';
import { Order } from '@/modules/order/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, OrderDetail, Review, Order])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Product } from '@/modules/product/entities/product.entity';
import { Order } from '@/modules/order/entities/order.entity';

@Entity({
  name: 'order_details',
})
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.orderDetails)
  @JoinColumn({
    name: 'product_id',
  })
  product: Product;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  @JoinColumn({
    name: 'order_id',
  })
  order: Order;

  @Column({
    type: Number,
    nullable: true,
  })
  quantity: number;

  @Column({
    type: Number,
    nullable: true,
  })
  total: number;

  @Column({
    type: Date,
    nullable: true,
    name: 'created_at',
  })
  createdAt: Date;
}

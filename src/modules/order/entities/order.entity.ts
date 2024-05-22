import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { EOrder } from '@/modules/order/enums/order.enum';
import { OrderDetail } from '@/modules/order-details/entities/order-detail.entity';

@Entity({
  name: 'orders',
})
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    enum: EOrder,
    nullable: true,
  })
  status: EOrder;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @Column({
    type: Date,
    nullable: true,
    name: 'created_at',
  })
  createdAt: Date;

  @OneToMany(() => OrderDetail, (orderDetails) => orderDetails.order)
  orderDetails: OrderDetail[];
}

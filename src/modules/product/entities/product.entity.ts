import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Store } from '@/modules/store/entities/store.entity';
import { OrderDetail } from '@/modules/order-details/entities/order-detail.entity';

@Entity({
  name: 'products',
})
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: String,
    nullable: true,
  })
  name?: string | null;

  @Column({
    type: String,
    nullable: true,
  })
  description: string;

  @Column({
    type: Number,
    nullable: true,
  })
  price: number;

  @Column({
    type: Number,
    nullable: true,
  })
  quantity: number;

  @Column({
    type: Number,
    nullable: true,
  })
  views: number;

  @ManyToOne(() => Store, (store) => store.products)
  @JoinColumn([
    {
      name: 'store_id',
      referencedColumnName: 'id',
    },
  ])
  store: Store;

  @OneToMany(() => OrderDetail, (orderDetails) => orderDetails.product)
  orderDetails: OrderDetail[];

  // @ManyToMany(() => Review, (review) => review.products)
  // reviews: Review[];
}

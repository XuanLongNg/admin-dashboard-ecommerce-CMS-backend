import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Store } from '@/modules/store/entities/store.entity';
import { Order } from '@/modules/order/entities/order.entity';

// import { Order } from '@/modules/order/entities/order.entity';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: String,
    nullable: false,
  })
  username?: string | null;

  @Column({
    type: String,
    nullable: false,
  })
  email: string;

  @Column({
    type: String,
    nullable: false,
  })
  password: string;

  @Column({
    type: String,
    nullable: true,
  })
  address: string;

  @Column({
    type: String,
    nullable: true,
  })
  phone_number: string;

  @Column({
    type: String,
    nullable: true,
  })
  role: string;

  @OneToMany(() => Store, (store) => store.user)
  stores: Store[];

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  // @ManyToMany(() => Review, (review) => review.users)
  // reviews: Review[];
}

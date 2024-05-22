import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { Product } from '@/modules/product/entities/product.entity';

@Entity({
  name: 'store',
})
export class Store {
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
  email: string;

  @Column({
    type: String,
    nullable: true,
  })
  phone: string;

  @Column({
    type: String,
    nullable: true,
  })
  address: string;

  @Column({
    type: String,
    nullable: true,
  })
  logo: string;

  @Column({
    type: String,
    nullable: true,
  })
  description: string;

  @Column({
    type: Number,
    nullable: true,
  })
  quantity: number;

  @OneToMany(() => Product, (product) => product.store)
  products: Product[];

  @ManyToOne(() => User, (user) => user.stores)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;
}

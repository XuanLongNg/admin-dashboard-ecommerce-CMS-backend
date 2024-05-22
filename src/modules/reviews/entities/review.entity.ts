import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { EReview } from '@/modules/reviews/enums/review.enum';

@Entity({
  name: 'reviews',
})
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: Number,
    nullable: false,
  })
  rating: number;

  @Column({
    type: String,
    nullable: true,
  })
  comment: string;

  @Column({
    nullable: false,
    enum: EReview,
  })
  status: EReview;

  @Column({
    nullable: false,
    type: Date,
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    nullable: true,
    type: Date,
    name: 'updated_at',
  })
  updatedAt: Date;

  @Column({
    nullable: true,
    type: String,
  })
  images: string;

  // @ManyToMany(() => User, (user) => user.reviews)
  // @JoinColumn([
  //   {
  //     name: 'user_id',
  //     referencedColumnName: 'id',
  //   },
  // ])
  // users: User[];

  // @ManyToMany(() => Product, (product) => product.reviews)
  // @JoinColumn([
  //   {
  //     name: 'product_id',
  //     referencedColumnName: 'id',
  //   },
  // ])

  @Column({})
  product_id: number;

  @Column({})
  user_id: number;
  // @ManyToMany(() => Product, (product) => product.reviews)
  // @JoinTable({
  //   name: 'products', // Tên bảng liên kết
  //   joinColumn: {
  //     name: 'product_id', // Tên cột trong bảng liên kết liên kết với Product
  //     referencedColumnName: 'product_id', // Tên cột trong Product
  //   },
  //   inverseJoinColumn: {
  //     name: 'id', // Tên cột trong bảng liên kết liên kết với Review
  //     referencedColumnName: 'id', // Tên cột trong Review
  //   },
  // })
  // products: Product[];

  // products: Product[];
}

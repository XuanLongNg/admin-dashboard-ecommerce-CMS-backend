import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@/modules/product/entities/product.entity';
import { Repository } from 'typeorm';
import { OrderDetail } from '@/modules/order-details/entities/order-detail.entity';
import {
  DashBoardProductQuery,
  DashBoardRatingQuery,
} from '@/modules/dashboard/dto/query.dto';
import { Review } from '@/modules/reviews/entities/review.entity';
import {
  EFilterOption,
  ERatingField,
} from '@/modules/dashboard/enums/dashboard-product.enum';
import { Order } from '@/modules/order/entities/order.entity';
import { Document, Packer, Paragraph, TextRun } from 'docx';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async productSummary(query: DashBoardProductQuery) {
    const data = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.orderDetails', 'orderDetails') // This will load related orderDetails
      .select([
        'product.id',
        'product.name',
        'product.description',
        'product.price',
        'product.quantity',
        'product.views',
        'orderDetails.quantity', // Add the fields you want from orderDetails
        'orderDetails.total',
      ])
      .orderBy(`product.${query.orderBy}`, query.order)
      .getMany();
    const transform = data.map((data) => {
      const { orderDetails, ...other } = data;
      const output = orderDetails.reduce((total, currentValue) => {
        return total + currentValue.quantity;
      }, 0);

      const total = orderDetails.reduce((total, currentValue) => {
        return total + currentValue.total;
      }, 0);
      return {
        ...other,
        output,
        total,
      };
    });
    const totalProduct = transform.reduce((total, currentValue) => {
      return total + currentValue.quantity;
    }, 0);
    const totalProductSold = transform.reduce((total, currentValue) => {
      return total + currentValue.output;
    }, 0);
    const IOProduct = transform.slice(0, query.size).map((data) => ({
      label: data.name,
      input: data.quantity,
      output: data.output,
    }));

    const ViewProduct = transform.slice(0, query.size).map((data) => ({
      label: data.name,
      views: data.views,
      price: data.price,
    }));
    return {
      data: {
        IOProduct,
        ViewProduct,
        totalProduct,
        totalProductSold,
      },
      meta: {
        orderBy: query.orderBy,
        order: query.order,
        size: query.size,
      },
    };
  }

  async calculateAverageRating(query: DashBoardRatingQuery) {
    const data = await this.reviewRepository.find({});

    const averageRatings = {};
    data.map((review) => {
      const { product_id, rating } = review;
      if (!averageRatings[product_id]) {
        averageRatings[product_id] = {
          totalRating: rating,
          count: 1,
          name: product_id,
          id: product_id,
        };
      } else {
        averageRatings[product_id].totalRating += rating;
        averageRatings[product_id].count += 1;
      }
    });

    const averageArray = [];
    for (const product_id in averageRatings) {
      const { totalRating, count } = averageRatings[product_id];
      averageRatings[product_id].averageRating = totalRating / count;
      averageArray.push(averageRatings[product_id]);
    }

    const promiseAverageArray = averageArray.map(async (data) => {
      const product = await this.productRepository.findOneBy({ id: data.id });
      return {
        ...data,
        name: product.name,
        price: product.price,
      };
    });
    return (await Promise.all(promiseAverageArray))
      .sort((a, b) => {
        switch (query.orderBy) {
          case ERatingField.NAME:
            if (query.order === 'ASC') return a.name.localeCompare(b.name);
            else return b.name.localeCompare(a.name);
          case ERatingField.PRICE:
            if (query.order === 'ASC') return a - b;
            else return b - a;
          case ERatingField.AVG_RATING:
            if (query.order === 'ASC') return a.avgRating - b.avgRating;
            return b.avgRating - a.avgRating;
          case ERatingField.COMMENT_COUNT:
            if (query.order === 'ASC') return a.commentCount - b.commentCount;
            return b.commentCount - a.commentCount;
          default:
            if (query.order === 'ASC') return a.id - b.id;
            else return b.id - a.id;
        }
      })
      .slice(0, query.size);
  }

  async calculateViewsPer(option: EFilterOption) {
    switch (option) {
      case EFilterOption.DAILY:
        return await this.reviewRepository
          .createQueryBuilder('review')
          .select([
            "DATE_FORMAT(review.createdAt, '%Y-%m-%d') as date",
            'COUNT(review.id) as count',
          ])
          .groupBy("DATE_FORMAT(review.createdAt, '%Y-%m-%d')")
          .getRawMany();
      case EFilterOption.MONTHLY:
        return await this.reviewRepository
          .createQueryBuilder('review')
          .select([
            "DATE_FORMAT(review.createdAt, '%Y-%m-01') as date",
            'COUNT(review.id) as count',
          ])
          .groupBy("DATE_FORMAT(review.createdAt, '%Y-%m-01')")
          .getRawMany();
      case EFilterOption.YEARLY:
        return await this.reviewRepository
          .createQueryBuilder('review')
          .select([
            "DATE_FORMAT(review.createdAt, '%Y-01-01') as date",
            'COUNT(review.id) as count',
          ])
          .groupBy("DATE_FORMAT(review.createdAt, '%Y-01-01')")
          .getRawMany();
      default:
        return await this.reviewRepository
          .createQueryBuilder('review')
          .select([
            "DATE_FORMAT(review.createdAt, '%Y-%m-%d') as date",
            'COUNT(review.id) as count',
          ])
          .groupBy("DATE_FORMAT(review.createdAt, '%Y-%m-%d')")
          .getRawMany();
    }
  }

  async top10TotalUserReview(query: DashBoardRatingQuery) {
    const data = await this.reviewRepository
      .createQueryBuilder('review')
      .select('review.user_id as id')
      .addSelect('COUNT(review.comment) as commentCount')
      .addSelect('(SUM(review.rating) / COUNT(review.comment)) as avgRating')
      .groupBy('review.user_id')
      .getRawMany();
    return data
      .sort((a, b) => {
        switch (query.orderBy) {
          case ERatingField.AVG_RATING:
            if (query.order === 'ASC') return a.avgRating - b.avgRating;
            return b.avgRating - a.avgRating;
          case ERatingField.COMMENT_COUNT:
            if (query.order === 'ASC') return a.commentCount - b.commentCount;
            return b.commentCount - a.commentCount;
          default:
            if (query.order === 'ASC') return a.id - b.id;
            else return b.id - a.id;
        }
      })
      .slice(0, query.size);
  }

  async ratingSummary(query: DashBoardRatingQuery) {
    return {
      data: {
        top10Review: await this.top10TotalUserReview(query),
        averageRatings: await this.calculateAverageRating(query),
        viewPerDay: await this.calculateViewsPer(query.filterBy),
      },
      meta: {
        orderBy: query.orderBy,
        order: query.order,
        size: query.size,
        filterBy: query.filterBy,
      },
    };
  }

  async orderSummary(size: number) {
    const data = await this.orderDetailRepository
      .createQueryBuilder('od')
      .leftJoinAndSelect('od.order', 'order')
      .select('order.id as id')
      .addSelect('SUM(od.total) as total')
      .addSelect('SUM(od.quantity) as quantity')
      .groupBy('order.id')
      .getRawMany();

    const totalProfit = data.reduce((total, currentValue) => {
      return total + parseInt(currentValue.total);
    }, 0);

    const numberOfProductSold = data.reduce((total, currentValue) => {
      return total + parseInt(currentValue.quantity);
    }, 0);

    const revenuePerProduct = await this.orderDetailRepository
      .createQueryBuilder('od')
      .leftJoinAndSelect('od.product', 'product')
      .select('product.id as id')
      .addSelect('SUM(od.total) as total')
      .groupBy('product.id')
      .orderBy('SUM(od.total)', 'DESC')
      .getRawMany();

    const top10Revenue = [];
    let totalOtherRevenue = 0;
    for (let i = 0; i < revenuePerProduct.length; i++) {
      if (i < 10) top10Revenue.push(revenuePerProduct[i]);
      else totalOtherRevenue += revenuePerProduct[i].total;
    }

    top10Revenue.push({ id: 'other', total: totalOtherRevenue });

    const orderStatusRate = await this.orderRepository
      .createQueryBuilder('order')
      .select('COUNT(order.status) as count')
      .addSelect('order.status')
      .groupBy('order.status')
      .getRawMany();

    return {
      data: {
        totalProfit,
        numberOfOrder: data.length,
        numberOfProductSold: numberOfProductSold,
        totalMoneyPerOrder: data,
        top10Revenue,
        orderStatusRate,
      },
      meta: {
        size: size,
      },
    };
  }

  async createTemplate() {
    // Tạo tài liệu mới
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ bold: true, text: 'Product Summary' })],
            }),
            new Paragraph({
              children: [new TextRun('This is a summary of the products.')],
            }),
            // Thêm các thông tin khác của Product Summary nếu cần
          ],
        },
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ bold: true, text: 'Rating Summary' })],
            }),
            new Paragraph({
              children: [new TextRun('This is a summary of the ratings.')],
            }),
            // Thêm các thông tin khác của Rating Summary nếu cần
          ],
        },
        {
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ bold: true, text: 'Order Summary' })],
            }),
            new Paragraph({
              children: [new TextRun('This is a summary of the orders.')],
            }),
            // Thêm các thông tin khác của Order Summary nếu cần
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    return buffer;
  }

  async createReport() {
    // const query = {
    //   size: 10000,
    //   orderBy: '',
    //   order: ESort.ASC,
    //   filterBy: EFilterOption.DAILY,
    // };
    // const order = await this.orderSummary(query.size);
    // const product = await this.productSummary(query as DashBoardProductQuery);
    // const rating = await this.ratingSummary(query as DashBoardRatingQuery);

    return {
      file: await this.createTemplate(),
    };
  }
}

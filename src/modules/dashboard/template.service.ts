import { Inject, Injectable } from '@nestjs/common';
import { Document, ImageRun, Paragraph } from 'docx';
import { ITemplate } from '@/modules/dashboard/templates/template';
import { IChart } from '@/base/common/utils/image-chart.util';
import { TextTemplate } from '@/modules/dashboard/templates/common/text.template';
import { ChartService } from '@/modules/chart/chart.service';

@Injectable()
export class TemplateService {
  constructor(
    @Inject(ChartService)
    private chartService: ChartService,
  ) {}

  async report(data: ITemplate) {
    const { product, order, rating } = data;
    const companyInformation = {
      name: 'Công ty trách nhiệm hữu hạn P',
      phoneNumber: '0xxx xxx xxx',
      address: 'xxx Hà Đông - Hà Nội - Việt Nam',
      taxCode: 'xxxxxxxxxxxxx',
      email: 'contact@xxx.com.vn',
    };

    const productViewChart: IChart = {
      labels: product.ViewProduct.map((data) => data.label),
      chartName: 'Bảng thống kê nhập xuất hàng',
      datasets: [
        {
          labelName: 'Giá cả',
          data: product.ViewProduct.map((data) => data.price),
        },
        {
          labelName: 'Lượt xem',
          data: product.ViewProduct.map((data) => data.views),
        },
      ],
    };

    const productIOChart: IChart = {
      labels: product.IOProduct.map((data) => data.label),
      chartName: 'Bảng thống kê lượt xem mặt hàng',
      datasets: [
        {
          labelName: 'Số lượng bán ra',
          data: product.IOProduct.map((data) => data.output),
        },
        {
          labelName: 'Số lượng nhập về',
          data: product.IOProduct.map((data) => data.input),
        },
      ],
    };

    const averageRatingsChart: IChart = {
      labels: rating.averageRatings.map((data) => data.name),
      chartName: 'Thống kê điểm đánh giá trung bình của Top 10 món hàng',
      datasets: [
        {
          labelName: 'Số lượng đánh giá',
          data: rating.averageRatings.map((data) => data.totalRating),
        },
        {
          labelName: 'Điểm đánh giá trung bình',
          data: rating.averageRatings.map((data) => data.count),
        },
      ],
    };

    const ratingTop10ReviewChart: IChart = {
      labels: rating.top10Review.map((data) => data.id),
      chartName: 'Số lượng đánh giá từng người dùng',
      datasets: [
        {
          labelName: 'Số lượng đánh giá từng người dùng',
          data: rating.top10Review.map((data) => data.commentCount),
        },
      ],
    };

    const ratingViewPerDayChart: IChart = {
      labels: rating.viewPerDay.map((data) => data.date),
      chartName: 'Thống kê lượt đánh giá trong 1 ngày',
      datasets: [
        {
          labelName: 'Số lượt đánh giá trong 1 ngày',
          data: rating.viewPerDay.map((data) => data.count),
        },
      ],
    };

    const orderTotalMoneyPerOrderChart: IChart = {
      labels: order.totalMoneyPerOrder.map((data) => data.id),
      chartName: 'Bảng thống kê nhập xuất hàng',
      datasets: [
        {
          labelName: 'Tổng số tiền mỗi đơn hàng',
          data: order.totalMoneyPerOrder.map((data) => data.total),
        },
      ],
    };

    const orderTop10RevenueChart: IChart = {
      labels: order.top10Revenue.map((data) => data.id),
      chartName: 'Doanh thu từng mặt hàng',
      datasets: [
        {
          labelName: 'Doanh thu từng mặt hàng',
          data: order.top10Revenue.map((data) => data.total),
        },
      ],
    };

    const orderStatusRateChart: IChart = {
      labels: order.orderStatusRate.map((data) => data.order_status),
      chartName: 'Tỉ lệ trạng thái đơn hàng',
      datasets: [
        {
          labelName: 'Số lượng đơn hàng',
          data: order.orderStatusRate.map((data) => data.count),
        },
      ],
    };

    const top1WithCountHighest = (() => {
      let top = {
        name: '',
        totalRating: 0,
      };
      rating.averageRatings.map((data) => {
        if (data.totalRating > top.totalRating) {
          top = {
            ...data,
          };
        }
      });
      return top;
    })();

    const top1WithAverageHighest = (() => {
      let top = {
        name: '',
        count: 0,
      };
      rating.averageRatings.map((data) => {
        if (data.count > top.count) {
          top = {
            ...data,
          };
        }
      });
      return top;
    })();

    return new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                TextTemplate({
                  text: 'Báo cáo tổng quan',
                  isBold: true,
                  size: 50,
                }),
              ],
              alignment: 'center',
            }),
            new Paragraph({}),
            new Paragraph({
              children: [
                TextTemplate({
                  text: `Tên công ty: `,
                }),
                TextTemplate({
                  isBold: true,
                  text: companyInformation.name,
                  isUppercase: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                TextTemplate({
                  text: `Địa chỉ: `,
                }),
                TextTemplate({
                  isBold: true,
                  text: companyInformation.address,
                  isUppercase: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                TextTemplate({
                  text: `Số điện thoại: `,
                }),
                TextTemplate({
                  isBold: true,
                  text: companyInformation.phoneNumber,
                  isUppercase: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                TextTemplate({
                  text: `Email: `,
                  isUppercase: true,
                }),
                TextTemplate({
                  text: companyInformation.email,
                  isUppercase: true,
                  isBold: true,
                }),
              ],
            }),
            new Paragraph({
              children: [
                TextTemplate({
                  text: `Mã số thuế: `,
                }),
                TextTemplate({
                  text: companyInformation.taxCode,
                  isUppercase: true,
                  isBold: true,
                }),
              ],
            }),
            new Paragraph({}),
            new Paragraph({
              children: [
                TextTemplate({
                  isBold: true,
                  text: 'Tổng quan về mặt hàng',
                  size: 36,
                }),
              ],
            }),
            new Paragraph({
              children: [
                TextTemplate({
                  text: `- Tổng số lượng hàng trong kho: ${product.totalProduct}`,
                }),
              ],
            }),
            new Paragraph({
              children: [
                TextTemplate({
                  text: `- Tổng số lượng hàng đã bán: ${product.totalProductSold}`,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new ImageRun({
                  data: await this.chartService.createBarChart(productIOChart, {
                    indexAxis: 'y' as const,
                  }),
                  transformation: {
                    width: 600,
                    height: 300,
                  },
                }),
              ],
            }),
            new Paragraph({
              children: [
                new ImageRun({
                  data: await this.chartService.createMixBarChart(
                    productViewChart,
                  ),
                  transformation: {
                    width: 600,
                    height: 300,
                  },
                }),
              ],
            }),
          ],
        },
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                TextTemplate({
                  isBold: true,
                  text: 'Tổng quan rating',
                  size: 36,
                }),
              ],
            }),
            new Paragraph({
              children: [
                TextTemplate({
                  text: `- Mặt hàng có nhiều lượt đánh giá nhất: ${top1WithCountHighest.name}`,
                }),
              ],
            }),
            new Paragraph({
              children: [
                TextTemplate({
                  text: `- Mặt hàng có điểm đánh giá trung bình cao nhất: ${top1WithAverageHighest.name}`,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new ImageRun({
                  data: await this.chartService.createBarChart(
                    averageRatingsChart,
                    {
                      indexAxis: 'y' as const,
                    },
                  ),
                  transformation: {
                    width: 600,
                    height: 400,
                  },
                }),
              ],
            }),
            new Paragraph({
              children: [
                new ImageRun({
                  data: await this.chartService.createLineChart(
                    ratingViewPerDayChart,
                  ),
                  transformation: {
                    width: 300,
                    height: 200,
                  },
                }),
                new ImageRun({
                  data: await this.chartService.createBarChart(
                    ratingTop10ReviewChart,
                    {
                      indexAxis: 'y' as const,
                    },
                  ),
                  transformation: {
                    width: 300,
                    height: 200,
                  },
                }),
              ],
            }),
            // Thêm các thông tin khác của Rating Summary nếu cần
          ],
        },
        {
          properties: {},
          children: [
            new Paragraph({
              children: [
                TextTemplate({
                  isBold: true,
                  text: 'Tổng quan đơn hàng',
                  size: 36,
                }),
              ],
            }),
            new Paragraph({
              children: [
                TextTemplate({
                  text: `- Tổng doanh thu: ${order.totalProfit}`,
                }),
              ],
            }),
            new Paragraph({
              children: [
                TextTemplate({
                  text: `- Số lượng đơn hàng: ${order.numberOfOrder}`,
                }),
              ],
            }),
            new Paragraph({
              children: [
                TextTemplate({
                  text: `- Số lượng hàng dã bán: ${order.numberOfProductSold}`,
                }),
              ],
            }),
            new Paragraph({
              children: [
                new ImageRun({
                  data: await this.chartService.createBarChart(
                    orderTotalMoneyPerOrderChart,
                  ),
                  transformation: {
                    width: 600,
                    height: 400,
                  },
                }),
              ],
            }),
            new Paragraph({
              children: [
                new ImageRun({
                  data: await this.chartService.createPieChart(
                    orderTop10RevenueChart,
                  ),
                  transformation: {
                    width: 300,
                    height: 200,
                  },
                }),
                new ImageRun({
                  data: await this.chartService.createPieChart(
                    orderStatusRateChart,
                  ),
                  transformation: {
                    width: 300,
                    height: 200,
                  },
                }),
              ],
            }),
            // Thêm các thông tin khác của Order Summary nếu cần
          ],
        },
      ],
    });
  }
}

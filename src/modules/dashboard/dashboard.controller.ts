import { Controller, Get, ParseIntPipe, Query, Res } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import {
  DashBoardProductQuery,
  DashBoardRatingQuery,
} from '@/modules/dashboard/dto/query.dto';
import { Response } from 'express';

@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('product-summary')
  productSummary(@Query() query: DashBoardProductQuery) {
    return this.dashboardService.productSummary(query);
  }

  @Get('rating-summary')
  ratingSummary(@Query() query: DashBoardRatingQuery) {
    return this.dashboardService.ratingSummary(query);
  }

  @Get('order-summary')
  orderSummary(@Query('size', ParseIntPipe) size: number) {
    return this.dashboardService.orderSummary(size);
  }

  @Get('export-report')
  async exportReport(@Res() res: Response) {
    res.setHeader('Content-Disposition', 'attachment; filename=Template.docx');
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    );
    const { file } = await this.dashboardService.createReport();
    res.send(file);
    return 'hello';
  }
}

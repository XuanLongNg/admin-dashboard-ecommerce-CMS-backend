import { Document, ImageRun, Paragraph, TextRun } from 'docx';
import { TextTemplate } from '@/modules/dashboard/templates/common/text.template';
import {
  IOrderSummary,
  IProductSummary,
  IRatingSummary,
} from '@/modules/dashboard/interfaces/dashboard.interface';
import { IChart } from '@/base/common/utils/image-chart.util';

interface ITemplate {
  product: IProductSummary;
  order: IOrderSummary;
  rating: IRatingSummary;
}



export { ITemplate };

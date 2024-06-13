import {
  EFilterOption,
  ESort,
} from '@/modules/dashboard/enums/dashboard-product.enum';

interface IText {
  text: string;
  isBold?: boolean;
  isUppercase?: boolean;
  isLowercase?: boolean;
  size?: number;
}

interface IDataChart {
  label: string;
}

interface IIOProduct extends IDataChart {
  input: number;
  output: number;
}

interface IViewProduct extends IDataChart {
  views: number;
  price: number;
}

interface IProductSummary {
  IOProduct: IIOProduct[];
  ViewProduct: IViewProduct[];
  totalProduct: number;
  totalProductSold: number;
}

interface IResponse<T> {
  data: T;
  meta: {
    orderBy: any;
    order: ESort;
    size: number;
    filterBy: EFilterOption;
  };
}

interface IResponseProductSummary extends IResponse<IProductSummary> {}

interface IRatingSummary {
  top10Review: any;
  averageRatings: any;
  viewPerDay: any;
}

interface IResponseRatingSummary extends IResponse<IRatingSummary> {}

interface IOrderSummary {
  totalProfit: number;
  numberOfOrder: number;
  numberOfProductSold: number;
  totalMoneyPerOrder: any;
  top10Revenue: any;
  orderStatusRate: any;
}

interface IResponseOrderSummary extends IResponse<IOrderSummary> {}

export {
  IText,
  IResponse,
  IProductSummary,
  IRatingSummary,
  IOrderSummary,
  IResponseProductSummary,
  IResponseRatingSummary,
  IResponseOrderSummary,
};

import { Transform } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';
import {
  EFilterOption,
  EProductField,
  ERatingField,
  ESort,
} from '@/modules/dashboard/enums/dashboard-product.enum';

export class DashBoardProductQuery {
  @Transform((value) => parseInt(value.value, 10))
  @IsNumber()
  size: number;

  @IsEnum(EProductField)
  orderBy: EProductField;

  @IsEnum(ESort)
  order: ESort;
}

export class DashBoardRatingQuery {
  @Transform((value) => parseInt(value.value, 10))
  @IsNumber()
  size: number;

  @IsEnum(ERatingField)
  orderBy: ERatingField;

  @IsEnum(ESort)
  order: ESort;

  @IsEnum(EFilterOption)
  filterBy: EFilterOption;
}

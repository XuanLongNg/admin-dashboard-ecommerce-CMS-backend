enum EProductField {
  NAME = 'name',
  PRICE = 'price',
  QUANTITY = 'quantity',
  VIEWS = 'views',
}

enum ERatingField {
  NAME = 'name',
  PRICE = 'price',
  COMMENT_COUNT = 'commentCount',
  AVG_RATING = 'avgRating',
}

enum ESort {
  ASC = 'ASC',
  DESC = 'DESC',
}

enum EFilterOption {
  DEFAULT = 'default',
  DAILY = 'daily',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export { EProductField, ESort, EFilterOption, ERatingField };

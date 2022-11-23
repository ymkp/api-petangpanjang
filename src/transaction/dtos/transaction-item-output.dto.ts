import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TransactionItemOutputDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  tax: number;

  @Expose()
  totalPrice: number;

  @Expose()
  totalTax: number;

  @Expose()
  total: number;

  @Expose()
  quantity: number;
}

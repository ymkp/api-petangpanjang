import { Exclude, Expose, Type } from 'class-transformer';
import { ItemOutputDTO } from 'src/item/dtos/item-output.dto';
import { MemberOutputDTO } from 'src/member/dtos/member-output.dto';

@Exclude()
export class TransactionOutputDTO {
  @Expose()
  id: number;

  @Expose()
  @Type(() => ItemOutputDTO)
  items: ItemOutputDTO[];

  @Expose()
  price: number;

  @Expose()
  tax: number;

  @Expose()
  taxPctg: number;

  @Expose()
  service: number;

  @Expose()
  servicePctg: number;

  @Expose()
  total: number;

  @Expose()
  @Type(() => MemberOutputDTO)
  member: MemberOutputDTO;

  @Expose()
  closedAt: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
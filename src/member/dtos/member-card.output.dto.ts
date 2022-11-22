import { Exclude, Expose, Type } from 'class-transformer';
import { MemberOutputDTO } from './member-output.dto';

@Exclude()
export class MemberCardOutputDTO {
  @Expose()
  id: number;

  @Expose()
  cardNo: string;

  @Expose()
  @Type(() => MemberOutputDTO)
  member: MemberOutputDTO;

  @Expose()
  publishedAt: Date;

  @Expose()
  expiredAt: Date;
}

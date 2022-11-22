import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class MemberOutputDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  memberNo: string;
}

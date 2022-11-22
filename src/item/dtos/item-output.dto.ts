import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ItemOutputDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  avatarDir: string;
}

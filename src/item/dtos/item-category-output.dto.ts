import { Exclude, Expose, Type } from 'class-transformer';
import { ItemOutputDTO } from './item-output.dto';

@Exclude()
export class ItemCategoryOutputDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  avatarDir: string;
}

@Exclude()
export class ItemCategoryWithMenusOutputDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  avatarDir: string;

  @Expose()
  @Type(() => ItemOutputDTO)
  items: ItemOutputDTO[];
}

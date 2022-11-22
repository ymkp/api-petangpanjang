import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  ItemCategoryOutputDTO,
  ItemCategoryWithMenusOutputDTO,
} from '../dtos/item-category-output.dto';
import { ItemOutputDTO } from '../dtos/item-output.dto';
import { ItemCategoryRepository } from '../repositories/item-category.repository';
import { ItemRepository } from '../repositories/item.repository';

@Injectable()
export class ItemService {
  constructor(
    private readonly itemRepo: ItemRepository,
    private readonly itemCategoryRepo: ItemCategoryRepository,
  ) {}

  public async getAllCategory(): Promise<ItemCategoryOutputDTO[]> {
    const cats = await this.itemCategoryRepo.find();
    return plainToInstance(ItemCategoryOutputDTO, cats);
  }

  public async getAllMenuByCategory(
    categoryId: number,
  ): Promise<ItemOutputDTO[]> {
    const menus = await this.itemRepo.find({ where: { categoryId } });
    return plainToInstance(ItemOutputDTO, menus);
  }

  public async getAllCategoryWithItsMenu(): Promise<
    ItemCategoryWithMenusOutputDTO[]
  > {
    const cats = await this.itemCategoryRepo.find({
      relations: ['items'],
    });
    return plainToInstance(ItemCategoryWithMenusOutputDTO, cats);
  }
}

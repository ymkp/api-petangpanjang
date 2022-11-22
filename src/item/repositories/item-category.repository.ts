import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/shared/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { ItemCategory } from '../entities/item-category.entity';

@CustomRepository(ItemCategory)
export class ItemCategoryRepository extends Repository<ItemCategory> {
  async getById(id: number): Promise<ItemCategory> {
    const d = await this.findOne({ where: { id } });
    if (!d) {
      throw new NotFoundException();
    }

    return d;
  }
}

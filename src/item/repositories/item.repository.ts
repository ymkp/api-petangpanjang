import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/shared/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Item } from '../entities/item.entity';

@CustomRepository(Item)
export class ItemRepository extends Repository<Item> {
  async getById(id: number): Promise<Item> {
    const d = await this.findOne({ where: { id } });
    if (!d) {
      throw new NotFoundException();
    }

    return d;
  }
}

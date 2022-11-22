import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/shared/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Shop } from '../entities/shop.entity';

@CustomRepository(Shop)
export class ShopRepository extends Repository<Shop> {
  async getById(id: number): Promise<Shop> {
    const d = await this.findOne({ where: { id } });
    if (!d) {
      throw new NotFoundException();
    }

    return d;
  }
}

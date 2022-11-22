import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/shared/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { TransactionItem } from '../entities/transaction-item.entity';

@CustomRepository(TransactionItem)
export class TransactionItemRepository extends Repository<TransactionItem> {
  async getById(id: number): Promise<TransactionItem> {
    const d = await this.findOne({ where: { id } });
    if (!d) {
      throw new NotFoundException();
    }

    return d;
  }
}

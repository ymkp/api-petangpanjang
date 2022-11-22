import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/shared/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';

@CustomRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
  async getById(id: number): Promise<Transaction> {
    const d = await this.findOne({ where: { id } });
    if (!d) {
      throw new NotFoundException();
    }

    return d;
  }
}

import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/shared/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { TransactionPaymentType } from '../entities/transaction-payment-type.entity';

@CustomRepository(TransactionPaymentType)
export class TransactionPaymentTypeRepository extends Repository<TransactionPaymentType> {
  async getById(id: number): Promise<TransactionPaymentType> {
    const d = await this.findOne({ where: { id } });
    if (!d) {
      throw new NotFoundException();
    }

    return d;
  }
}

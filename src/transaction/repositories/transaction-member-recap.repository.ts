import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/shared/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { TransactionMemberRecap } from '../entities/transaction-member-recap.entity';

@CustomRepository(TransactionMemberRecap)
export class TransactionMemberRecapRepository extends Repository<TransactionMemberRecap> {
  async getById(id: number): Promise<TransactionMemberRecap> {
    const d = await this.findOne({ where: { id } });
    if (!d) {
      throw new NotFoundException();
    }

    return d;
  }
}

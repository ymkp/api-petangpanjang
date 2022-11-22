import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/shared/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { MemberCard } from '../entities/member-card.entity';

@CustomRepository(MemberCard)
export class MemberCardRepository extends Repository<MemberCard> {
  async getById(id: number): Promise<MemberCard> {
    const d = await this.findOne({ where: { id } });
    if (!d) {
      throw new NotFoundException();
    }

    return d;
  }
}

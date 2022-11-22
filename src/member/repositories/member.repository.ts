import { NotFoundException } from '@nestjs/common';
import { CustomRepository } from 'src/shared/decorators/typeorm-ex.decorator';
import { Repository } from 'typeorm';
import { Member } from '../entities/member.entity';

@CustomRepository(Member)
export class MemberRepository extends Repository<Member> {
  async getById(id: number): Promise<Member> {
    const d = await this.findOne({ where: { id } });
    if (!d) {
      throw new NotFoundException('Member tidak ditemukan');
    }

    return d;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { MemberInputRegisterDTO } from '../dtos/member-input.dto';
import { MemberOutputDTO } from '../dtos/member-output.dto';
import { MemberCardRepository } from '../repositories/member-card.repository';
import { MemberRepository } from '../repositories/member.repository';

@Injectable()
export class MemberService {
  constructor(
    private readonly memberRepo: MemberRepository,
    private readonly cardRepo: MemberCardRepository,
  ) {}

  public async createMember(input: MemberInputRegisterDTO) {
    const memberNo = await this.generatememberNo();
    const res = await this.memberRepo.save({ name: input.name, memberNo });
    return plainToInstance(MemberOutputDTO, res);
  }

  public async getMemberByMemberNo(memberNo: string): Promise<MemberOutputDTO> {
    const member = await this.memberRepo.findOne({ where: { memberNo } });
    if (!member) throw new NotFoundException('Member tidak ditemukan');
    return plainToInstance(MemberOutputDTO, member);
  }

  public async getMemberByCardNo(cardNo: string): Promise<MemberOutputDTO> {
    console.log(cardNo);
    const card = await this.cardRepo.findOne({
      where: { cardNo },
      relations: ['member'],
    });
    if (!card) throw new NotFoundException('Kartu tidak ditemukan');
    if (!card.member)
      throw new NotFoundException('Kartu belum memiliki member');
    return plainToInstance(MemberOutputDTO, card.member);
  }

  private async generatememberNo(): Promise<string> {
    const m = await this.memberRepo.find({
      select: ['memberNo'],
      take: 1,
      order: { id: 'DESC' },
    });
    if (m.length === 0) {
      return 'A-0001';
    } else {
      let mid = parseInt(m[0].memberNo.replace('A-', ''));
      mid += 1;
      let o = '000';
      if (mid > 999) o = '';
      else if (mid > 99) o = '0';
      else if (mid > 9) o = '00';
      return `A-${o}${mid}`;
    }
  }
}

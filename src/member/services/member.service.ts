import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IsNull } from 'typeorm';
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

  public async getActiveMembers(): Promise<MemberOutputDTO[]> {
    const members = await this.memberRepo.find({
      where: { stoppedAt: IsNull() },
    });
    return plainToInstance(MemberOutputDTO, members);
  }

  public async createMember(input: MemberInputRegisterDTO) {
    const card = await this.cardRepo.findOne({
      where: { cardNo: input.cardNo },
    });
    if (!card) throw new NotFoundException('Kartu tidak valid');
    const res = await this.memberRepo.save({
      name: input.name,
      phone: input.phone,
      card,
      cardNo: card.cardNo,
      startedAt: new Date(Date.now()),
    });
    return plainToInstance(MemberOutputDTO, res);
  }

  public async getMemberByCardNo(cardNo: string): Promise<MemberOutputDTO> {
    console.log(cardNo);
    const member = await this.memberRepo.findOne({
      where: { cardNo, stoppedAt: IsNull() },
    });
    if (!member) throw new NotFoundException('Memmber tidak ditemukan');
    return plainToInstance(MemberOutputDTO, member);
  }
}

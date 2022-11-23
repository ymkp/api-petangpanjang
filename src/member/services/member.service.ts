import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TransactionMemberRecapRepository } from 'src/transaction/repositories/transaction-member-recap.repository';
import { IsNull, Not } from 'typeorm';
import { MemberCardOutputDTO } from '../dtos/member-card.output.dto';
import { MemberInputRegisterDTO } from '../dtos/member-input.dto';
import { MemberOutputDTO } from '../dtos/member-output.dto';
import { MemberCardRepository } from '../repositories/member-card.repository';
import { MemberRepository } from '../repositories/member.repository';

@Injectable()
export class MemberService {
  constructor(
    private readonly memberRepo: MemberRepository,
    private readonly cardRepo: MemberCardRepository,
    private readonly trxMemberRecapRepo: TransactionMemberRecapRepository,
  ) {}

  public async getAvailableCards(): Promise<MemberCardOutputDTO[]> {
    const members = await this.cardRepo.find({
      where: { isAvailable: true },
    });
    return plainToInstance(MemberCardOutputDTO, members);
  }

  public async getActiveMembers(): Promise<MemberOutputDTO[]> {
    const members = await this.memberRepo.find({
      where: { stoppedAt: IsNull() },
    });
    return plainToInstance(MemberOutputDTO, members);
  }

  public async getCompletedMembers(): Promise<MemberOutputDTO[]> {
    const members = await this.memberRepo.find({
      where: { stoppedAt: Not(IsNull()) },
    });
    return plainToInstance(MemberOutputDTO, members);
  }

  public async createMember(input: MemberInputRegisterDTO) {
    const card = await this.cardRepo.findOne({
      where: { cardNo: input.cardNo, isAvailable: true },
    });
    console.log(`create member : ${input.cardNo} : ${card}`);
    if (!card) throw new NotFoundException('Kartu tidak valid');
    const member = await this.memberRepo.save({
      name: input.name,
      phone: input.phone,
      card,
      cardNo: card.cardNo,
      startedAt: new Date(Date.now()),
    });
    const trxMemberRecap = await this.trxMemberRecapRepo.save({
      price: 0,
      tax: 0,
      taxPctg: 0,
      service: 0,
      servicePctg: 0,
      total: 0,
      member,
    });
    member.transactionRecap = trxMemberRecap;
    await this.memberRepo.save(member);
    card.isAvailable = false;
    await this.cardRepo.save(card);
    return plainToInstance(MemberOutputDTO, member);
  }

  public async getMemberByCardNo(cardNo: string): Promise<MemberOutputDTO> {
    const member = await this.memberRepo.findOne({
      where: { cardNo, stoppedAt: IsNull() },
    });
    if (!member) throw new NotFoundException('Member tidak ditemukan');
    return plainToInstance(MemberOutputDTO, member);
  }
}

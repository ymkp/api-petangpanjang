import { BadRequestException, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
  MemberCardAssignUserDTO,
  MemberCardInputCreateDTO,
} from '../dtos/member-card-input.dto';
import { MemberCardOutputDTO } from '../dtos/member-card.output.dto';
import { MemberCardRepository } from '../repositories/member-card.repository';
import { MemberRepository } from '../repositories/member.repository';

@Injectable()
export class MemberCardService {
  constructor(
    private readonly cardRepo: MemberCardRepository,
    private readonly memberRepo: MemberRepository,
  ) {}

  // create new card
  public async createNewMemberCard(
    input: MemberCardInputCreateDTO,
  ): Promise<MemberCardOutputDTO> {
    const c = await this.cardRepo.save({ cardNo: input.cardNo });
    return plainToInstance(MemberCardOutputDTO, c);
  }

  // assign a user to a card
}

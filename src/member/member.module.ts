import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmExModule } from 'src/shared/typeorm-ex.module';
import { TransactionMemberRecapRepository } from 'src/transaction/repositories/transaction-member-recap.repository';
import { MemberController } from './controllers/member.controller';
import { MemberCardRepository } from './repositories/member-card.repository';
import { MemberRepository } from './repositories/member.repository';
import { MemberService } from './services/member.service';

@Module({
  imports: [
    SharedModule,
    TypeOrmExModule.forCustomRepository([
      MemberRepository,
      MemberCardRepository,
      TransactionMemberRecapRepository,
    ]),
  ],
  providers: [MemberService],
  controllers: [MemberController],
})
export class MemberModule {}

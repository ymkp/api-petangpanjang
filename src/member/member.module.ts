import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmExModule } from 'src/shared/typeorm-ex.module';
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
    ]),
  ],
  providers: [MemberService],
  controllers: [MemberController],
})
export class MemberModule {}

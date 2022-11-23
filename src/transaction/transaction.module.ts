import { Module } from '@nestjs/common';
import { ItemRepository } from 'src/item/repositories/item.repository';
import { MemberCardRepository } from 'src/member/repositories/member-card.repository';
import { MemberRepository } from 'src/member/repositories/member.repository';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmExModule } from 'src/shared/typeorm-ex.module';
import { ShopRepository } from 'src/shop/repositories/shop.repository';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionItemRepository } from './repositories/transaction-item.repository';
import { TransactionMemberRecapRepository } from './repositories/transaction-member-recap.repository';
import { TransactionPaymentTypeRepository } from './repositories/transaction-payment-type.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionService } from './services/transaction.service';

@Module({
  imports: [
    SharedModule,
    TypeOrmExModule.forCustomRepository([
      TransactionRepository,
      ShopRepository,
      ItemRepository,
      TransactionItemRepository,
      ShopRepository,
      MemberRepository,
      TransactionMemberRecapRepository,
      TransactionPaymentTypeRepository,
      MemberCardRepository,
    ]),
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
})
export class TransactionModule {}

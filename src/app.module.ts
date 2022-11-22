import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';
import { UserModule } from './user/user.module';
import { MemberModule } from './member/member.module';
import { TransactionModule } from './transaction/transaction.module';
import { ItemModule } from './item/item.module';
import { ShopModule } from './shop/shop.module';

@Module({
  imports: [SharedModule, AuthModule, UserModule, MemberModule, TransactionModule, ItemModule, ShopModule],
})
export class AppModule {}

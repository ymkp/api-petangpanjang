import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmExModule } from 'src/shared/typeorm-ex.module';
import { ShopRepository } from './repositories/shop.repository';
import { ShopService } from './services/shop.service';

@Module({
  imports: [
    SharedModule,
    TypeOrmExModule.forCustomRepository([ShopRepository]),
  ],
  providers: [ShopService],
})
export class ShopModule {}

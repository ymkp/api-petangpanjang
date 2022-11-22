import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmExModule } from 'src/shared/typeorm-ex.module';
import { ItemController } from './controllers/item.controller';
import { ItemCategoryRepository } from './repositories/item-category.repository';
import { ItemRepository } from './repositories/item.repository';
import { ItemService } from './services/item.service';

@Module({
  imports: [
    SharedModule,
    TypeOrmExModule.forCustomRepository([
      ItemCategoryRepository,
      ItemRepository,
    ]),
  ],
  providers: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}

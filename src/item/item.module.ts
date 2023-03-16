import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';

@Module({
  controllers: [ItemController],
  providers: [ItemService],
  imports: [
    TypeOrmModule.forFeature([Item])
  ],
  exports: [
    ItemService,
    TypeOrmModule
  ]
})
export class ItemModule {}

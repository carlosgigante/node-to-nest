import { Module } from '@nestjs/common';
import { ItemService } from './presentation/services/item.service';
import { ItemController } from './infrastructure/controllers/item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './domain/entities/item.entity';
import { AuthModule } from 'src/modules/auth/auth.module';
import { GetItemUseCase, ListItemsUseCase, SaveItemUseCase, UpdateItemUseCase } from './presentation/useCases';

@Module({
  controllers: [ItemController],
  providers: [
    ItemService,
    SaveItemUseCase,
    UpdateItemUseCase,
    ListItemsUseCase,
    GetItemUseCase
  ],
  imports: [
    TypeOrmModule.forFeature([Item]),
    AuthModule
  ],
  exports: [
    ItemService,
    SaveItemUseCase,
    UpdateItemUseCase,
    ListItemsUseCase,
    GetItemUseCase,
    TypeOrmModule
  ]
})
export class ItemModule {}

import { Module } from '@nestjs/common';
import { ItemService } from './presentation/services/item.service';
import { ItemController } from './infrastructure/controllers/item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './domain/entities/item.entity';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [ItemController],
  providers: [ItemService],
  imports: [
    TypeOrmModule.forFeature([Item]),
    AuthModule
  ],
  exports: [
    ItemService,
    TypeOrmModule
  ]
})
export class ItemModule {}

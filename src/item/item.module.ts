import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { AuthModule } from 'src/auth/auth.module';

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

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ItemModule } from './modules/item/item.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    UserModule,
    ItemModule,
    CommonModule
  ],
  
})
export class AppModule {}

import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './presentation/services/user.service';
import { UserController } from './infrastructure/controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() =>AuthModule),
  ],
  exports: [
    UserService, TypeOrmModule
  ]
})
export class UserModule {}

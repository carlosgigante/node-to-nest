import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './presentation/services/auth.service';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { JwtStrategy } from './domain/strategies/jwt.strategy';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    ConfigModule,
    forwardRef(() =>UserModule),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    }),
  ],
  exports: [
    TypeOrmModule, PassportModule, JwtModule, AuthService, JwtStrategy
  ]
})
export class AuthModule {}

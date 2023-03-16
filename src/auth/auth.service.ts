import { BadRequestException, Injectable, UnauthorizedException, InternalServerErrorException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { User } from 'src/user/entities/user.entity';
import { loginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Injectable()
export class AuthService {
 
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto){
    return this.userService.create(createUserDto)
  }

  async login(loginDto: loginDto){
    const { email, password } = loginDto;
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    });
    
    if(!user)
      throw new UnauthorizedException('Credentials are not valid(email)');
    if(!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid (password)');
    return {
      ...user,
      token: this.getJwtToken({id: user.id})
    };
  }

  async checkAuthStatus(user: User){
    return{
      ...user,
      token: this.getJwtToken({id: user.id})
    }
  }

  public getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }


  public handleDbErrors(error: any): never{
    if(error.cod === '23505')
      throw new BadRequestException(error.detail);
    console.log(error);
    throw new InternalServerErrorException('Please check server logs');
  }
}

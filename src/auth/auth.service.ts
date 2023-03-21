import { BadRequestException, Injectable, UnauthorizedException, InternalServerErrorException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { User } from 'src/user/entities/user.entity';
import { loginDto } from './dto';

import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

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

  async updateMe(user: User, updateUserDto: UpdateUserDto){
    const { id } = user
    return this.userService.update(id, updateUserDto);
  }

  async findMe(user: User) {
    return user;
  }

  async changeMyPassword(user: User,changePasswordDto: ChangePasswordDto){

    const { password } = user;
    const { currentPassword, passwordConfirmation } = changePasswordDto;

    if(!bcrypt.compareSync(currentPassword, password))
      throw new UnauthorizedException('Credentials are not valid (password)');
    if(changePasswordDto.password != passwordConfirmation)
      throw new UnauthorizedException('The passwords must be exactly the same');
    return this.userService.updatePassword(user, changePasswordDto);
  }

  async refreshToken(user: User){
    return{ token: this.getJwtToken({id: user.id}) }
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

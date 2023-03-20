import { Injectable, BadRequestException, forwardRef, Inject, NotFoundException, Logger, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class UserService {
  
  private readonly logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)    
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ){}

  async create(createUserDto: CreateUserDto){

    try{
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);
      delete user.password;
      return {
        ...user,
        token: this.authService.getJwtToken({id: user.id})
      };
    } catch (error) {
      this.authService.handleDbErrors(error)
    }

  }

  async findAll(paginationDto: PaginationDto){
    const { limit = 10, offset = 0 } = paginationDto;
    const enable = true;
    const verify = false;
    const user = await this.userRepository.find({
      take: limit,
      skip: offset,
      where:{
        enable: enable,
        verify: verify
      }
    });
    return user.map((user) => ({ ...user }));
  }

  async findOne(id: string){

    let user: User;

    if(isUUID(id)){
      user = await this.userRepository.findOneBy({id: id});
    }else{
      throw new BadRequestException(`The id must be a valid UUID term`);
    }
    if(!user)
    throw new NotFoundException(`User with id #${id} not found`);
    return user;
  }

  

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    try {
      if(!user)
        throw new NotFoundException(`user with id #${id} not found`);
      await this.userRepository.update(id, updateUserDto)
      return "hola"
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if(!user)
      throw new NotFoundException(`user with id #${id} not found`);
    await this.userRepository.remove(user);
    return `user with id #${id} has been deleted`;
  }

  async restore(id: string){
    const user = await this.userRepository.findOne({
      withDeleted: true,
      where: { id: id }
    })
    if(!user)
      throw new NotFoundException(`user with id #${id} not found`);
    await this.userRepository.restore(id);
    return { user }
  }

  private handleDBExceptions(error: any){
    if(error.code === '23505')
      throw new BadRequestException(error.detail);
    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}

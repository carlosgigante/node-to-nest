import { Injectable, BadRequestException, forwardRef, Inject, NotFoundException, Logger, InternalServerErrorException, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../../auth/presentation/services/auth.service';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ChangePasswordDto } from 'src/modules/auth/presentation/dtos';

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

    
    const { password, ...userData } = createUserDto;
    const user = this.userRepository.create({
      ...userData,
      password: bcrypt.hashSync(password, 10)  
    });

    if(!bcrypt.compareSync(userData.passwordConfirmation, user.password))
      throw new UnauthorizedException('The passwords must be exactly the same');
    try{
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
      return updateUserDto;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }


  async updatePassword(user: User, changePasswordDto: ChangePasswordDto){
    
    try{
      if(!user)
        throw new NotFoundException('user not found, check server logs');
      const queryBuilder = this.userRepository.createQueryBuilder('users');
       await queryBuilder
      .update(User)
      .set({password: bcrypt.hashSync(changePasswordDto.password, 10)})
      .where("id = :id", { id: user.id })
      .execute();

      return user;
    }catch(error){
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

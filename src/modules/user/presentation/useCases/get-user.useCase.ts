import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

export class GetUserUseCase {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async handle(id: string){
        let user: User;

        if(isUUID(id)){
            user = await this.userRepository.findOneBy({id: id});
        }else{
            throw new BadRequestException('The ID must be a valid UUID term');
        }
        if(!user)
        throw new NotFoundException(`User with ID #${id} not found`);
        return user;
    }
}

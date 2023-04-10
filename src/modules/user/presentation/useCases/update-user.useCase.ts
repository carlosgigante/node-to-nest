import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../domain/entities/user.entity";
import { UpdateUserDto } from '../dtos/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { GetUserUseCase } from "./get-user.useCase";
import { UserService } from "../services/user.service";


export class UpdateUserUseCase {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly getUserUseCase: GetUserUseCase,
        private readonly userService: UserService
    ){}

    async handle(id: string, updateUserDto: UpdateUserDto){
        const user = await this.getUserUseCase.handle(id);
        try{
            if(!user)
                throw new NotFoundException(`User with ID #${id} not found`);
            await this.userRepository.update(id, updateUserDto);
            return updateUserDto;
        } catch (error){
            return this.userService.handleDBExceptions(error);
        }
    }
}
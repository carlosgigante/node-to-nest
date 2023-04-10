import { forwardRef, Inject, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthService } from "src/modules/auth/presentation/services/auth.service";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { User } from "../../domain/entities/user.entity";
import { CreateUserDto } from '../dtos/create-user.dto';


export class SaveUserUseCase {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService
    ){}

    async handle(createUserDto: CreateUserDto){
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
}
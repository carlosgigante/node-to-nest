import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../../domain/entities/user.entity";
import { PaginationDto } from '../../../../common/dtos/pagination.dto';


export class ListUsersUseCase {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async handle(paginationDto: PaginationDto){
        const { limit = 10, offset = 0 } = paginationDto;
        const user = await this.userRepository.find({
            take: limit,
            skip: offset
        });
        return user.map((user) => ({ ...user }));

    }

}
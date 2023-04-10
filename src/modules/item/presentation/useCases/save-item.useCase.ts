import { InjectRepository } from "@nestjs/typeorm";
import { Item } from "../../domain/entities/item.entity";
import { Repository } from 'typeorm';
import { CreateItemDto } from '../dtos/create-item.dto';
import { User } from "src/modules/user/domain/entities/user.entity";
import { ItemService } from '../services/item.service';


export class SaveItemUseCase {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        private readonly itemService: ItemService
    ){}

    async handle(createItemDto: CreateItemDto, createdBy: User){
        try{
            const { ...itemDetails } = createItemDto;
            const item = this.itemRepository.create({
                ...itemDetails,
                createdBy
            });
            await this.itemRepository.save(item);
            return { ...itemDetails }
        }catch(error) {
            this.itemService.handleDBExceptions(error)
        }
    }
}
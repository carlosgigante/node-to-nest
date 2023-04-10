import { InjectRepository } from "@nestjs/typeorm";
import { PaginationDto } from "src/common/dtos/pagination.dto";
import { Repository } from "typeorm";
import { Item } from "../../domain/entities/item.entity";

export class ListItemsUseCase {
    constructor(
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>
    ){}

    async handle(paginationDto: PaginationDto){
        const { limit = 10, offset = 0 } = paginationDto;
        const item = await this.itemRepository.find({
          take: limit,
          skip: offset,
          relations: {
            createdBy: true
          }
        });
        return item.map((item) => ({
          ...item,
          createdBy: item.createdBy.userName
        }));
      }
}
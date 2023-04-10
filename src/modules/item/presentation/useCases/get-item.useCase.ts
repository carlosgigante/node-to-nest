import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { isUUID } from "class-validator";
import { Repository } from "typeorm";
import { Item } from "../../domain/entities/item.entity";

export class GetItemUseCase{
    constructor(
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>
    ){}

    async handle(term: string){
      const { createdBy, ...rest } = await this.findOne(term);
      return{
        ...rest,
        createdBy: `User: ${createdBy.userName}`
      }
    }
    
    async findOne(term: string){

        let item: Item;
  
        if(isUUID(term)){
          item = await this.itemRepository.findOneBy({id: term});
        }else{
          const queryBuilder = this.itemRepository.createQueryBuilder('item');
          item = await queryBuilder
          .where('UPPER(name) =:name', { name: term.toUpperCase() })
          .leftJoinAndSelect('item.createdBy', 'itemUser')
          .getOne();
        }
        if(!item)
          throw new NotFoundException(`Product with term ${term} not found`);
        return item;
      }

}
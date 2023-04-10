import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/modules/user/domain/entities/user.entity";
import { DataSource, Repository } from "typeorm";
import { UpdateItemDto } from "../dtos/update-item.dto";
import { ItemService } from "../services/item.service";
import { Item } from "../../domain/entities/item.entity";
import { GetItemUseCase } from "./get-item.useCase";

export class UpdateItemUseCase{
    constructor(
        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,
        private readonly dataSource: DataSource,
        private readonly itemService: ItemService,
        private readonly getItemUseCase: GetItemUseCase
    ){}

    async handle(id: string, updateItemDto: UpdateItemDto, user: User) {
        const { ...toUpdate } = updateItemDto;
        const item = await this.itemRepository.preload({ id, ...toUpdate });
  
        if(!item)
          throw new NotFoundException(`Item with id #${id} not found`);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
  
        try {
          item.createdBy = user;
          await queryRunner.manager.save(item);
          await queryRunner.commitTransaction();
          await queryRunner.release();
          return this.getItemUseCase.handle(id);
        }catch(error) {
          await queryRunner.rollbackTransaction();
          await queryRunner.release();
          this.itemService.handleDBExceptions(error);
        }
      }
}
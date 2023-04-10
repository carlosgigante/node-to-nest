import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateItemDto } from '../dtos/create-item.dto';
import { Item } from '../../domain/entities/item.entity';
import { DataSource, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { UpdateItemDto } from '../dtos/update-item.dto';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ItemService {
  private readonly logger = new Logger('ItemService');

  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    private readonly dataSource: DataSource
  ){}

    async create(createItemDto: CreateItemDto, createdBy: User) {
      try{
        const { ...itemDetails } = createItemDto;
        const item = this.itemRepository.create({
          ...itemDetails,
          createdBy
        });
        await this.itemRepository.save(item);
        return { ...itemDetails }
      }catch(error){
        this.handleDBExceptions(error);
      }
    }

    async update(id: string, updateItemDto: UpdateItemDto, user: User) {
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
        return this.findOnePlain(id);
      }catch(error) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();
        this.handleDBExceptions(error);
      }
    }

    async findAll(paginationDto: PaginationDto){
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

    async findOnePlain(term: string){
      const { createdBy, ...rest } = await this.findOne(term);
      return{
        ...rest,
        createdBy: `User: ${createdBy.userName}`
      }
    }

    async remove(id: string) {
      const item = await this.findOne(id);
      await this.itemRepository.remove(item);
      return `Item with id #${id} has been deleted`;
    }

    public handleDBExceptions(error: any){
      if(error.code === '23505')
        throw new BadRequestException(error.detail);
      this.logger.error(error)
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }

}

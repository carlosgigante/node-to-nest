import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { CreateItemDto } from '../../presentation/dtos/create-item.dto';
import { UpdateItemDto } from '../../presentation/dtos/update-item.dto';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { Auth, GetUser } from 'src/modules/auth/domain/decorators';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ValidRoles } from 'src/modules/auth/domain/interfaces';
import { GetItemUseCase, ListItemsUseCase, SaveItemUseCase, UpdateItemUseCase } from '../../presentation/useCases';

@Controller('user')
export class ItemController {
  constructor(
    private readonly saveItemUseCase: SaveItemUseCase,
    private readonly updateItemUseCase: UpdateItemUseCase,
    private readonly listItemsUseCase: ListItemsUseCase,
    private readonly getItemUseCase: GetItemUseCase

  ) {}

  @Post('items')
  @Auth()
  create(
    @Body() createItemDto: CreateItemDto,
    @GetUser() user: User
  ){
    return this.saveItemUseCase.handle(createItemDto, user);
  }

  @Patch('items/:id')
  @Auth(ValidRoles.superUser)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateItemDto: UpdateItemDto,
    @GetUser() user: User
  ){
    return this.updateItemUseCase.handle(id, updateItemDto, user);
  }


  @Get('items')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.listItemsUseCase.handle(paginationDto);
  }


  @Get('items/:term')
  findeOne(@Param('term') term: string) {
    return this.getItemUseCase.handle(term);
  }

  // @Delete('items/:id')
  // @Auth(ValidRoles.superUser)
  // remove(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.itemService.remove(id);
  // }
  
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ItemService } from '../../presentation/services/item.service';
import { CreateItemDto } from '../../presentation/dtos/create-item.dto';
import { UpdateItemDto } from '../../presentation/dtos/update-item.dto';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { Auth, GetUser } from 'src/modules/auth/domain/decorators';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ValidRoles } from 'src/modules/auth/domain/interfaces';

@Controller('user')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post('items')
  @Auth()
  create(
    @Body() createItemDto: CreateItemDto,
    @GetUser() user: User
  ){
    return this.itemService.create(createItemDto, user)
  }

  @Patch('items/:id')
  @Auth(ValidRoles.superUser)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateItemDto: UpdateItemDto,
    @GetUser() user: User
  ){
    return this.itemService.update(id, updateItemDto, user);
  }


  @Get('items')
  findAll(@Query() paginationDto: PaginationDto) {
    return this.itemService.findAll(paginationDto);
  }


  @Get('items/:term')
  findeOne(@Param('term') term: string) {
    return this.itemService.findOnePlain(term);
  }

  @Delete('items/:id')
  @Auth(ValidRoles.superUser)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.itemService.remove(id);
  }
  
}

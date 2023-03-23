import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { UserService } from '../../presentation/services/user.service';
import { CreateUserDto } from '../../presentation/dtos/create-user.dto';
import { UpdateUserDto } from '../../presentation/dtos/update-user.dto';
import { ValidRoles } from 'src/modules/auth/domain/interfaces';
import { Auth } from 'src/modules/auth/domain/decorators';
import { Put, Query } from '@nestjs/common/decorators';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Auth(ValidRoles.superUser)
  createUser(@Body() createUserDto: CreateUserDto){
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @Auth(ValidRoles.superUser)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto

  ){
    return this.userService.update(id, updateUserDto);
  }


  @Get()
  @Auth(ValidRoles.superUser)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.userService.findAll(paginationDto);
  }


  @Get(':id')
  @Auth(ValidRoles.superUser)
  findeOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Delete(':id')
  @Auth(ValidRoles.superUser)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.superUser)
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.restore(id);
  }

  
}

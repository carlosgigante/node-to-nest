import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { Auth } from 'src/auth/decorators';
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

import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators';
import { loginDto } from './dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  @Post('login')
  loginUser(@Body() loginDto: loginDto) {
    return this.authService.login(loginDto)
  }

  @Patch('change-my-password')
  @Auth()
  changeMyPassword(
    @GetUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto
  ){
    return this.authService.changeMyPassword(user, changePasswordDto);
  }

  @Get('me')
  @Auth()
  findeOne(@GetUser() user: User) {
    return this.authService.findMe(user);
  }

  @Put('me')
  @Auth()
  update(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto
  ){
    return this.authService.updateMe(user, updateUserDto);
  }
  

  @Get('refresh-token')
  @Auth()
  refreshToken(
    @GetUser() user: User
  ){
    return this.authService.refreshToken(user);
  }
}

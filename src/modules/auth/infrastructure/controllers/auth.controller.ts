import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/user/presentation/dtos/create-user.dto';
import { User } from 'src/modules/user/domain/entities/user.entity';
import { AuthService } from '../../presentation/services/auth.service';
import { Auth, GetUser } from '../../domain/decorators';
import { loginDto } from 'src/modules/auth/presentation/dtos';
import { ChangePasswordDto } from '../../presentation/dtos/change-password.dto';
import { UpdateUserDto } from '../../../user/presentation/dtos/update-user.dto';

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

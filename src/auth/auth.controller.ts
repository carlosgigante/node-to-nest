import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators';
import { loginDto } from './dto/login.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

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

  @Get('me')
  @Auth()
  findeOne(@GetUser() user: User) {
    return this.authService.findMe(user);
  }

  @Get('refresh-token')
  @Auth()
  refreshToken(
    @GetUser() user: User
  ){
    return this.authService.refreshToken(user);
  }
}

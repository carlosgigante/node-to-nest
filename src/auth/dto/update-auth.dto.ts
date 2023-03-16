import { PartialType } from '@nestjs/mapped-types';
import { loginDto } from './login.dto';

export class UpdateAuthDto extends PartialType(loginDto) {}

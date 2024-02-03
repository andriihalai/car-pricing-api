import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    this.usersService.create(body.email, body.password);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.findById(parseInt(id));
    return user;
  }

  @Get()
  async getAllUsers() {
    const users = await this.usersService.findAllUsers();
    return users;
  }

  @Delete(':id')
  async removeUser(@Param('id') id: string) {
    try {
      return await this.usersService.remove(parseInt(id));
    } catch (e: any) {
      return e.message;
    }
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    try {
      await this.usersService.update(parseInt(id), body);
      return await this.usersService.findById(parseInt(id));
    } catch (e: any) {
      return e.message;
    }
  }
}

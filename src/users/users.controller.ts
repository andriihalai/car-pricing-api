import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('profile')
  async getProfile(@Session() session: any) {
    const user = await this.usersService.findById(session.userId);
    if (!user) throw new UnauthorizedException();
    return user;
  }

  @Post('/signout')
  async signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get('email')
  async getUserByEmail(@Query('email') email: string) {
    const user = await this.usersService.findByEmail(email);
    return user;
  }

  @Serialize(UserDto)
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
    return await this.usersService.remove(parseInt(id));
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    await this.usersService.update(parseInt(id), body);
    return await this.usersService.findById(parseInt(id));
  }
}

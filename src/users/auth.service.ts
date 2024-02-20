import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    //see if email in use
    const user = await this.usersService.findByEmail(email);
    if (user.length) {
      throw new BadRequestException('email is already in use');
    }

    //hash the password
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    const newUser = this.usersService.create(email, result);

    return newUser;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.findByEmail(email);
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash)
      throw new BadRequestException('Wrong password');
    return user;
  }
}

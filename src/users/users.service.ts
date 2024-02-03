import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(email: string, password: string) {
    const user = this.userRepo.create({ email, password });
    return await this.userRepo.save(user);
  }

  async findById(id: number) {
    try {
      return await this.userRepo.findOneBy({ id: id });
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async findAllUsers() {
    try {
      return await this.userRepo.query('SELECT * FROM user');
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOneBy({ email: email });
  }

  async update(id: number, attrs: Partial<User>) {
    try {
      return await this.userRepo.update(id, attrs);
    } catch (e: any) {
      throw new Error(e.message);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.findById(id);
      if (!user) throw new Error('User not found');
      return await this.userRepo.remove(user);
    } catch (e: any) {
      throw new Error(e);
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private connection: Connection
  ) {}
  
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async createMany(users: User[]) {
    //事务写法1
    await this.connection.transaction(async manager => {
      await manager.save(users[0]);
      await manager.save(users[1]);
    });

    //事务写法2
    // const queryRunner = this.connection.createQueryRunner();
  
    // await queryRunner.connect();
    // await queryRunner.startTransaction();//创建事务
    // try {
    //   await queryRunner.manager.save(users[0]);
    //   await queryRunner.manager.save(users[1]);
  
    //   await queryRunner.commitTransaction();
    // } catch (err) {
    //   //如果遇到错误，可以回滚事务
    //   await queryRunner.rollbackTransaction();
    // } finally {
    //   //你需要手动实例化并部署一个queryRunner
    //   await queryRunner.release();
    // }
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}

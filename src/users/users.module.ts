import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSubscriber } from './user.subscriber';
import { UsersRepository } from './users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UsersRepository])],
  controllers: [UsersController],
  providers: [UsersService, UserSubscriber],
  exports: [TypeOrmModule]//TypeOrmModule.forFeature 的模块之外使用存储库，则需要重新导出由其生成的提供程序
})
export class UsersModule {}

// 我们在 UserHttpModule 中导入 UsersModule ，我们可以在后一个模块的提供者中使用 @InjectRepository(User)
// import { Module } from '@nestjs/common';
// import { UsersModule } from './user.module';
// import { UsersService } from './users.service';
// import { UsersController } from './users.controller';

// @Module({
//   imports: [UsersModule],
//   providers: [UsersService],
//   controllers: [UsersController],
// })
// export class UserHttpModule {}
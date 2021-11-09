import { CacheInterceptor, CacheModule, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpExceptionFilter } from './common/filter/http-Exception.filter';
import { RolesGuard } from './common/guard/roles.guard';
import { LoggingInterceptor } from './common/interceptor/logging.interceptor';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ClassValidationPipe } from './common/pipe/class-validation.pipe';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import configuration from './config/configuration';

@Module({
  imports: [
    //module中importConfigModule，注入ConfigService可访问环境变量const dbUser = this.configService.get<string>('查找的键值'[,'键值不存在时的返回值']);
    ConfigModule.forRoot(
      {
        load: [configuration],//可加载多个配置文件[databaseConfig, authConfig, ...]
        //   envFilePath: '.development.env',//配置其它路径
        //   envFilePath: ['.env.development.local', '.env.development'],//配置多个路径
        //   ignoreEnvFile: true,//禁止加载环境变量
        //   isGlobal: true,//全局使用
      }
    ),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'test',
      entities: [User],
      synchronize: true,
      retryAttempts: 10,//重试连接数据库的次数，默认10
      retryDelay: 3000,//两次重试连接的间隔(ms)，默认：3000
      autoLoadEntities: true,//如果为true,每个通过forFeature()注册的实体都会自动添加到配置对象的entities数组中，默认：false
      keepConnectionAlive: false//如果为true，在应用程序关闭后连接不会关闭，默认：false
    }),
    //缓存
    CacheModule.register(
      // {
      //   ttl: 5, //秒
      //   max: 10, //缓存中最大和最小数量
      // }
    ),
    //定时任务
    ScheduleModule.forRoot(),
    //事件
    EventEmitterModule.forRoot(
      {
        // set this to `true` to use wildcards
        wildcard: false,
        // the delimiter used to segment namespaces
        delimiter: '.',
        // set this to `true` if you want to emit the newListener event
        newListener: false,
        // set this to `true` if you want to emit the removeListener event
        removeListener: false,
        // the maximum amount of listeners that can be assigned to an event
        maxListeners: 10,
        // show event name in memory leak message when more than maximum amount of listeners is assigned
        verboseMemoryLeak: false,
        // disable throwing uncaughtException if an error event is emitted and it has no listeners
        ignoreErrors: false,
      }
    ),
    TerminusModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ClassValidationPipe
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    //注册中间件
    //consumer.apply(LoggerMiddleware).forRoutes('users');
    //consumer.apply(LoggerMiddleware).forRoutes({ path: 'users', method: RequestMethod.GET });
    //consumer.apply(LoggerMiddleware).forRoutes({ path: 'users*', method: RequestMethod.GET });
    //consumer.apply(LoggerMiddleware).forRoutes(UsersController);
    // consumer.apply(LoggerMiddleware)
    // .exclude(
    //   { path: 'users', method: RequestMethod.GET },
    //   { path: 'users', method: RequestMethod.POST },
    //   'users/(.*)',
    // )
    // .forRoutes(UsersController);
    //consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
  }
}

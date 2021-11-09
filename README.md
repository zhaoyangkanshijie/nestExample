# nestExample

## 参考链接

* [Nest中文翻译文档](https://docs.nestjs.cn/8/introduction)
* [Nest英文文档](https://nestjs.bootcss.com/)
* [TypeORM英文文档](https://typeorm.io/)
* [Sequelize英文文档](https://sequelize.org/v5/index.html)

## 目录

* [基础](#基础)
* [项目结构](#项目结构)
* [常用属性和方法](#常用属性和方法)

---

## 基础

* 环境

    nodejs >= 10.13.0 排除 13

* 项目创建

    npm i -g @nestjs/cli

    nest new project-name

* 架构

    * module组成:

        module定义文件，可引入controller/service/其它module/数据库相关repository，controller可调用service中具体的实现方法，service/repository对dto和entities进行操作

    * main创建app，app引用各module，各module可引用子module

    * 路由

        由controller名称和装饰器控制

    * 辅助工具

        * 中间件middleware(在路由处理程序之前调用的函数)
        * 异常过滤器filter(处理整个应用程序中的所有抛出的异常)
        * 管道pipe
            * 转换:将输入数据转换为所需的数据输出
            * 验证:对输入数据进行验证，如果验证成功继续传递; 验证失败则抛出异常
        * 守卫guard(授权:根据运行时出现的某些条件（例如权限，角色，访问控制列表等）来确定给定的请求是否由路由处理程序处理)
        * 拦截器interceptor
            * 在函数执行之前/之后绑定额外的逻辑
            * 转换从函数返回的结果
            * 转换从函数抛出的异常
            * 扩展基本函数行为
            * 根据所选条件完全重写函数 (例如, 缓存目的)
        * 装饰器decorator(在不影响原对象功能的情况下，为原对象添加新功能，可以装饰的对象包括：类，属性，方法)

* 运行

    1. nest核心启动
    2. 各模块初始化OnModuleInit()
        * 等待子模块controller/service初始化
        * 等待子模块初始化
    3. 应用启动OnApplicationBootstrap()
        * 等待子模块controller/service启动
        * 等待子模块启动
    4. 开启监听器:http/ws/microservice，等待连接就绪
    5. 应用运行
    6. 收到应用停止信号
    7. 各模块注销OnModuleDestroy()
        * 等待子模块controller/service注销
        * 等待子模块注销
    8. 应用准备关闭beforeApplicationShutdown()
        * 等待子模块controller/service准备关闭
        * 等待子模块准备关闭
    9. 停止监听器，等待终止连接
    10. 应用准备关闭OnApplicationShutdown()
        * 等待子模块controller/service关闭
        * 等待子模块关闭
    11. 程序终止

* 生命周期事件

    * OnModuleInit()	初始化主模块依赖处理后调用一次
    * OnApplicationBootstrap()	在应用程序完全启动并监听连接后调用一次
    * OnModuleDestroy()	收到终止信号(例如SIGTERM)后调用
    * beforeApplicationShutdown()	在onModuleDestroy()完成(Promise被resolved或者rejected)；一旦完成，将关闭所有连接(调用app.close() 方法).
    * OnApplicationShutdown()	连接关闭处理时调用(app.close())

* 请求生命周期

    1. 收到请求
    2. 全局绑定的中间件
    3. 模块绑定的中间件
    4. 全局守卫
    5. 控制层守卫
    6. 路由守卫
    7. 全局拦截器（控制器之前）
    8. 控制器层拦截器 （控制器之前）
    9. 路由拦截器 （控制器之前）
    10. 全局管道
    11. 控制器管道
    12. 路由管道
    13. 路由参数管道
    14. 控制器（方法处理器）
    15. 服务（如果有）
    16. 路由拦截器（请求之后）
    17. 控制器拦截器 （请求之后）
    18. 全局拦截器 （请求之后）
    19. 异常过滤器 （路由，之后是控制器，之后是全局）
    20. 服务器响应

## 项目结构

cli生成
```txt
生成module下所有资源:nest g resource {name}
生成模块:nest g mo {moduleName}
生成控制器:nest g co {controllerName}
生成服务:nest g s {serviceName}
```

```txt
src
    main入口文件:启动应用，使用外部插件(swagger等)
    app模块:导入所有需要的模块/辅助工具(pipe/guard等)/缓存/数据库连接配置/其它配置
    (config相关文件)
    (日志模块)
    其它模块名/其它模块
        dto
            create的dto文件
            update的dto文件
        entities
            数据表对应的实体类
        控制器controller
        服务service
        (仓库repository)
        (entity变动订阅器subscriber)
    common
        中间件middleware
        异常过滤器filter
        管道pipe
        守卫guard:passport/jwt
        拦截器interceptor
        装饰器decorator
        工具方法util
test
    测试文件
(typeorm迁移相关文件migration)
(sequelize迁移相关文件)
package.json/tsconfig等常规配置文件
(.env项目配置文件)
```

## 常用属性和方法

```ts
//main.ts
import { NestFactory } from '@nestjs/core';
const app = await NestFactory.create(AppModule);
app.useGlobalFilters(new HttpExceptionFilter());
app.useGlobalPipes(new ClassValidationPipe());
app.useGlobalGuards(new RolesGuard());
app.useGlobalInterceptors(new LoggingInterceptor());
//app.module.ts
import { MiddlewareConsumer, Module, NestModule, RequestMethod, CacheModule, CacheInterceptor } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
//controller
import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UsePipes, UseGuards, UseInterceptors } from '@nestjs/common';//均以注解使用
//普通依赖注入
import { Injectable } from '@nestjs/common';
//middleware
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
//pipe
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
//nest内置pipe
ValidationPipe
ParseIntPipe
ParseBoolPipe
ParseArrayPipe
ParseUUIDPipe
//interceptor
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
//guard
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
//filter
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
//decorator
import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
//工具类class校验
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
//typeorm
import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { EntityRepository, Repository } from "typeorm";
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
//sequelize
import { SequelizeModule } from '@nestjs/sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Column, Model, Table } from 'sequelize-typescript';
//swagger
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
@ApiOperation()	Method
@ApiResponse()	Method / Controller
    @ApiOkResponse()
    @ApiCreatedResponse()
    @ApiBadRequestResponse()
    @ApiUnauthorizedResponse()
    @ApiNotFoundResponse()
    @ApiForbiddenResponse()
    @ApiMethodNotAllowedResponse()
    @ApiNotAcceptableResponse()
    @ApiRequestTimeoutResponse()
    @ApiConflictResponse()
    @ApiGoneResponse()
    @ApiPayloadTooLargeResponse()
    @ApiUnsupportedMediaTypeResponse()
    @ApiUnprocessableEntityResponse()
    @ApiInternalServerErrorResponse()
    @ApiNotImplementedResponse()
    @ApiBadGatewayResponse()
    @ApiServiceUnavailableResponse()
    @ApiGatewayTimeoutResponse()
    @ApiDefaultResponse()
@ApiProduces()	Method / Controller
@ApiConsumes()	Method / Controller
@ApiBearerAuth()	Method / Controller
@ApiOAuth2()	Method / Controller
@ApiBasicAuth()	Method / Controller
@ApiSecurity()	Method / Controller
@ApiExtraModels()	Method / Controller
@ApiBody()	Method
@ApiParam()	Method
@ApiQuery()	Method
@ApiHeader()	Method / Controller
@ApiExcludeEndpoint()	Method
@ApiTags()	Method / Controller
@ApiProperty()	Model
@ApiPropertyOptional()	Model
@ApiHideProperty()	Model
@ApiExtension()	Model
//config
import { ConfigModule } from '@nestjs/config';
//定时任务
import { ScheduleModule } from '@nestjs/schedule';
//队列
import { BullModule, InjectQueue } from '@nestjs/bull';
//日志
import { LoggerService, Logger, Scope } from '@nestjs/common';
//其它:joi规则验证，cookie相关，gzip压缩，session，性能fastify，passport身份认证，jwt，CSRF保护，限速express-rate-limit，microservices微服务，redis，消息队列mqtt，分布式消息队列nats，消息代理RabbitMQ，分布式流处理kafka，gRPC远程流式调用，健康检查Terminus，分布式事务Saga，GraphQL
```


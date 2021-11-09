import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UsePipes, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../common/decorator/roles.decorator';
import { User } from 'src/common/decorator/user.decorator';
//import { LoggingInterceptor } from '../common/interceptor/logging.interceptor';
//import { ClassValidationPipe } from '../common/pipe/class-validation.pipe';
//import { RolesGuard } from '../common/guard/roles.guard';
//import { HttpExceptionFilter } from '../common/filter/HttpExceptionFilter';

@Controller('users')
//@UseGuards(RolesGuard)
//@UseInterceptors(LoggingInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  //@UseFilters(new HttpExceptionFilter())
  //@UsePipes(ClassValidationPipe)
  @Roles('admin')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

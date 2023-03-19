import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/all')
  async getAll(): Promise<User[]> {
    return this.userService.findMany();
  }

  @Get('/:id')
  async findUniqueById(@Param('id') id: string): Promise<User> {
    return this.userService.findUnique({ id: Number(id) });
  }

  @Post('/create')
  async create(
    @Body() data: { name: string; email: string; password: string },
  ): Promise<User> {
    return this.userService.create(data);
  }
}

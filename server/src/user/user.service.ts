import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findUnique(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async findMany(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    let filteredParams = {};

    if (params) {
      if (params.hasOwnProperty('skip') && params.skip !== undefined) {
        filteredParams = { ...filteredParams, skip: params.skip };
      }

      if (params.hasOwnProperty('take') && params.take !== undefined) {
        filteredParams = { ...filteredParams, take: params.take };
      }

      if (params.hasOwnProperty('cursor') && params.cursor !== undefined) {
        filteredParams = { ...filteredParams, cursor: params.cursor };
      }

      if (params.hasOwnProperty('where') && params.where !== undefined) {
        filteredParams = { ...filteredParams, where: params.where };
      }

      if (params.hasOwnProperty('orderBy') && params.orderBy !== undefined) {
        filteredParams = { ...filteredParams, orderBy: params.orderBy };
      }
    }

    return this.prisma.user.findMany(params ? params : filteredParams);
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;

    return this.prisma.user.update({
      data,
      where,
    });
  }

  async delete(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }
}

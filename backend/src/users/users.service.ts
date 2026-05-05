import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        roleId: true,
        image: true,

        role: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        roleId: true,
        image: true,

        role: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findOneToLogin(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        password: true, // Needed for bcrypt
        roleId: true,
        image: true,
        role: {
          select: {
            id: true,
            name: true,
            // MUST match the field name in your Role model in schema.prisma
            rolePrivileges: { 
              select: {
                privilege: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.role.findMany({
        select:{
            id:true,
            name:true
          }
    });
  }

  findOne(id: number) {
    return this.prisma.role.findUnique({
      where: { id },
      select:{
        id:true,
        name:true
      }
    });
  }
}

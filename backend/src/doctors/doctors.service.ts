import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.doctor.findMany();
  }

  findOne(id: number) {
    return this.prisma.doctor.findUnique({
      where: { id },
    });
  }

  create(data: { name: string; specialty: string }) {
    return this.prisma.doctor.create({
      data,
    });
  }

  update(id: number, data: { name?: string; specialty?: string }) {
    return this.prisma.doctor.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.doctor.delete({
      where: { id },
    });
  }
}

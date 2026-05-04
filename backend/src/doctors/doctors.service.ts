import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DoctorsService {
  constructor(private prisma: PrismaService) {}

  // Only get doctors where deletedAt is NULL
  findAll() {
    return this.prisma.doctor.findMany({
      where: { deletedAt: null },
      include: { specialty: true },
    });
  }

  // Create with createdById
  async create(data: { name: string; specialtyId: number; createdById: number }) {
    return this.prisma.doctor.create({
      data: {
        name: data.name,
        specialtyId: data.specialtyId,
        createdById: data.createdById, // Audit field
      },
    });
  }

  async update(id: number, data: { name: string; specialtyId: number; updatedById: number }) {
    return this.prisma.doctor.update({
      where: { id },
      data: {
        name: data.name,
        specialtyId: data.specialtyId,
        updatedById: data.updatedById, // Audit field
      },
    });
  }
  
  // Soft Delete: Set deletedAt and deletedById
  async remove(id: number, deletedById: number) {
    return this.prisma.doctor.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedById: deletedById,
      },
    });
  }
}